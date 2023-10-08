'use client';

import Filter, { FilterRef } from '@/components/common/Filter/Filter';
import HomeCalendar, {
  CALENDAR_ID
} from '@/components/home/HomeCalendar/HomeCalendar';
import {
  CATEGORY_OPTIONS,
  EVENT_STATUS_FILTER,
  EVENT_STATUS_FILTER_OPTIONS,
  REGION_OPTIONS
} from '@/constants/volunteerEvent';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as styles from './CalendarSection.css';
import ChipInput from '@/components/common/ChipInput/ChipInput';
import { Body3, H3 } from '@/components/common/Typography';
import { useAuthContext } from '@/providers/AuthContext';
import getUserGeolocation from './utils/getUserGeolocation';
import useBooleanState from '@/hooks/useBooleanState';
import { HEADER_HEIGHT } from '@/components/common/Header/Header.css';
import VolunteerEventList from '@/components/volunteer-schedule/VolunteerEventList/VolunteerEventList';
import useHomeEventList from '@/api/volunteer-event/useHomeEventList';
import { HomeEventFilter } from '@/api/volunteer-event';
import { getEndOfMonth, getStartOfMonth } from '@/utils/timeConvert';
import SkeletonList from '@/components/common/Skeleton/SkeletonList';
import clsx from 'clsx';
import { monthlyInfiniteOption } from '@/api/volunteer-event/queryOptions';
import useShelterHomeEventList from '@/api/volunteer-event/useShelterHomeEventList';
import moment from 'moment';
import useLocalStorage from '@/hooks/useLocalStorage';
import { EventStatus } from '@/types/volunteerEvent';
import { STORAGE_KEY_HOME_CALENDAR_FILTER_INPUT } from '@/constants/localStorageKeys';

export default function CalendarSection() {
  const { dangle_role } = useAuthContext();
  const filterInputStorage = useLocalStorage<HomeEventFilter>(
    STORAGE_KEY_HOME_CALENDAR_FILTER_INPUT
  );
  const [filterInput, setFilterInput] = useState<HomeEventFilter>({
    address: '내 주변',
    category: 'all',
    status: dangle_role === 'SHELTER' ? 'IN_PROGRESS' : 'all',
    isFavorite: false
  });
  const [loading, loadingOn, loadingOff] = useBooleanState(true);
  const [geolocation, setGeolocation] = useState<GeolocationPosition>();
  const filterRef = useRef<FilterRef>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [isFolded, setIsFolded] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const filterForQuery = useMemo<HomeEventFilter>(() => {
    if (
      dangle_role !== 'SHELTER' &&
      filterInput.address === '내 주변' &&
      geolocation
    ) {
      return {
        ...filterInput,
        longitude: geolocation.coords.longitude,
        latitude: geolocation.coords.latitude,
        address: undefined
      };
    }
    return { ...filterInput, longitude: undefined, latitude: undefined };
  }, [dangle_role, filterInput, geolocation]);

  const query = useHomeEventList(
    filterForQuery,
    getStartOfMonth(new Date()),
    getEndOfMonth(new Date()),
    { ...monthlyInfiniteOption, enabled: !loading && dangle_role !== 'SHELTER' }
  );

  const shelterQuery = useShelterHomeEventList(
    filterForQuery,
    getStartOfMonth(new Date()),
    getEndOfMonth(new Date()),
    { ...monthlyInfiniteOption, enabled: dangle_role === 'SHELTER' }
  );

  const volunteerEvents = useMemo(() => {
    const pages = query.data?.pages || shelterQuery.data?.pages;
    return pages?.flatMap(page => page.events);
  }, [query.data, shelterQuery.data]);

  const handleChangeFilter = useCallback(
    (name: string, value: string | boolean) => {
      setFilterInput(prev => ({
        ...prev,
        [name]: value
      }));

      // 로컬 스토리지를 filterInput과 동기화시킨다
      filterInputStorage.update({ [name]: value });
    },
    [filterInputStorage]
  );

  useEffect(() => {
    if (dangle_role !== 'SHELTER' && filterInput.address === '내 주변') {
      // 사용자 위치 정보 받아오기
      loadingOn();
      getUserGeolocation()
        .then(setGeolocation)
        .catch(() => {
          filterRef.current?.setPickOption(REGION_OPTIONS[0]);
          setFilterInput(prev => ({ ...prev, address: REGION_OPTIONS[0] }));
        })
        .finally(loadingOff);
    } else {
      loadingOff();
    }
  }, [
    dangle_role,
    filterInput.address,
    handleChangeFilter,
    loadingOff,
    loadingOn
  ]);

  useEffect(() => {
    function autoFoldCalendar() {
      if (!stickyRef.current) return;
      const stickyTop = stickyRef.current.getBoundingClientRect().top;
      if (stickyTop <= HEADER_HEIGHT) {
        setIsFolded(true);
        window.removeEventListener('scroll', autoFoldCalendar);
      }
    }

    window.addEventListener('scroll', autoFoldCalendar);
    return () => {
      window.removeEventListener('scroll', autoFoldCalendar);
    };
  }, []);

  const scrollToTarget = (eventCardEl: HTMLElement) => {
    const calendarEl = document.getElementById(CALENDAR_ID)?.parentElement;
    if (!calendarEl) return;

    const calendarBottom = calendarEl.getBoundingClientRect().bottom;
    const eventCardTop = eventCardEl.getBoundingClientRect().top;
    const scrollTo = window.scrollY + eventCardTop - calendarBottom;

    window.scrollTo({ top: scrollTo, behavior: 'smooth' });
  };

  const eventDates = useMemo(
    () => volunteerEvents?.map(e => moment(e.startAt).format('YYYY-MM-DD')),
    [volunteerEvents]
  );

  const fetchNextEvents = useCallback(async () => {
    let result;
    if (dangle_role === 'SHELTER') result = await shelterQuery.fetchNextPage();
    else result = await query.fetchNextPage();
    return { hasNext: Boolean(result.hasNextPage) };
  }, [dangle_role, query, shelterQuery]);

  useEffect(() => {
    // 로컬 스토리지에 저장된 filterInput으로 초기화
    const savedFilter = filterInputStorage.get();
    if (!savedFilter) return;
    setFilterInput(savedFilter);

    // 모집 상태 또는 지역 Filter의 pickOption 값 초기화
    if (filterRef.current?.name === 'address') {
      filterRef.current.setPickOption(savedFilter.address || '내 주변');
    } else if (filterRef.current?.name === 'status') {
      const pickOption =
        EVENT_STATUS_FILTER[
          (savedFilter.status as Exclude<EventStatus, 'CANCELED'>) || 'all'
        ];
      filterRef.current.setPickOption(pickOption);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className={styles.title}>
        <H3>
          {dangle_role === 'SHELTER'
            ? '우리 보호소 봉사 일정이에요'
            : '봉사 일정을 둘러봐요'}
          &nbsp;🙌
        </H3>
      </div>
      <div ref={stickyRef} className={clsx(styles.sticky, 'sticky')}>
        <div className={styles.filterContainer}>
          {(dangle_role === 'SHELTER' && (
            <Filter
              ref={filterRef}
              label="모집 상태"
              name="status"
              options={EVENT_STATUS_FILTER_OPTIONS}
              onChange={handleChangeFilter}
            />
          )) || (
            <Filter
              ref={filterRef}
              label="지역"
              name="address"
              options={['내 주변', ...REGION_OPTIONS]}
              onChange={handleChangeFilter}
            />
          )}
          <ChipInput
            style={{
              flexWrap: 'nowrap'
            }}
            name="category"
            value={filterInput.category || 'all'}
            options={[{ label: '전체', value: 'all' }, ...CATEGORY_OPTIONS]}
            onChange={handleChangeFilter}
          />
        </div>
        <HomeCalendar
          isFolded={isFolded}
          setIsFolded={setIsFolded}
          date={selectedDate}
          mark={eventDates}
          onClickDate={setSelectedDate}
          bookmark={filterInput.isFavorite || false}
          onChangeBookmark={() =>
            handleChangeFilter('isFavorite', !filterInput.isFavorite)
          }
        />
      </div>
      {dangle_role === 'NONE' && filterInput.isFavorite ? (
        <div className={styles.empty}>
          <Body3 color="gray400">
            보호소 즐겨찾기 기능을 사용하려면 <br />
            로그인이 필요합니다
          </Body3>
        </div>
      ) : (
        <div style={{ marginTop: '16px' }}>
          {!volunteerEvents && <SkeletonList />}
          {volunteerEvents && (
            <VolunteerEventList
              selectedDate={selectedDate}
              events={volunteerEvents}
              scrollTo={scrollToTarget}
              fetchNextEvents={fetchNextEvents}
            />
          )}
        </div>
      )}
    </div>
  );
}
