import VolunteerEventList from '@/components/volunteer-schedule/VolunteerEventList/VolunteerEventList';
import * as styles from './ScheduleTab.css';
import DangleCalendar from '@/components/common/Calendar/DangleCalendar';
import { useCallback, useMemo, useState } from 'react';
import moment from 'moment';
import useVolunteerEventList, {
  monthlyInfiniteOption
} from '@/api/shelter/volunteer-event/useVolunteerEventList';
import { getStartOfMonth, getEndOfMonth } from '@/utils/timeConvert';
import { HEADER_HEIGHT } from '@/components/common/Header/Header.css';
import SkeletonList from '@/components/common/Skeleton/SkeletonList';
import FloatingButton from '../FloatingButton/FloatingButton';
import { useAuthContext } from '@/providers/AuthContext';
import { useRouter } from 'next/navigation';

interface ScheduleTabProps {
  shelterId: number;
}

export const CALENDAR_ID = 'schedule-tab-calendar';
const ScheduleTab: React.FC<ScheduleTabProps> = ({ shelterId }) => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { dangle_id } = useAuthContext();

  const query = useVolunteerEventList(
    shelterId,
    getStartOfMonth(new Date()),
    getEndOfMonth(new Date()),
    { ...monthlyInfiniteOption }
  );

  const volunteerEvents = useMemo(() => {
    const pages = query.data?.pages;
    return pages?.flatMap(page => page.events);
  }, [query.data?.pages]);

  const eventDates = useMemo(
    () => volunteerEvents?.map(e => moment(e.startAt).format('YYYY-MM-DD')),
    [volunteerEvents]
  );

  const handleClickDate = (value: Date) => {
    scrollToEventList();
    setSelectedDate(value);
  };

  const scrollToEventList = () => {
    const calendarEl = document.getElementById(CALENDAR_ID);
    if (!calendarEl) return;

    const calendarTop = calendarEl?.getBoundingClientRect().top;
    const eventListTop = calendarTop - HEADER_HEIGHT - 32;

    if (eventListTop > window.scrollY) {
      window.scrollTo({ top: eventListTop, behavior: 'smooth' });
    }
  };

  const scrollToTarget = (eventCardEl: HTMLElement) => {
    const calendarEl = document.getElementById(CALENDAR_ID);
    if (!calendarEl) return;

    const calendarBottom = calendarEl.getBoundingClientRect().bottom;
    const eventCardTop = eventCardEl.getBoundingClientRect().top;
    const scrollTo = window.scrollY + eventCardTop - calendarBottom;

    window.scrollTo({ top: scrollTo, behavior: 'smooth' });
  };

  const handleChangeMonth = useCallback(
    // month 변경 시 해당 월에 해당하는 데이터 패치
    async (value: Date) => {
      const newDate = getEndOfMonth(value);
      const prevDate = getEndOfMonth(selectedDate);

      if (newDate.isAfter(prevDate)) {
        await query.fetchNextPage();
        console.log('fetch next month');
      } else if (newDate.isBefore(prevDate)) {
        await query.fetchPreviousPage();
        console.log('fetch prev month');
      }
    },
    [query, selectedDate]
  );

  const fetchNextEvents = useCallback(async () => {
    const result = await query.fetchNextPage();
    return { hasNext: Boolean(result.hasNextPage) };
  }, [query]);

  return (
    <div>
      <DangleCalendar
        id={CALENDAR_ID}
        className={styles.calendar}
        mark={eventDates}
        onChange={handleClickDate}
        onChangeMonth={handleChangeMonth}
      />
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
      {dangle_id === shelterId && (
        <FloatingButton
          onClick={() => router.push('/admin/shelter/event/edit')}
        >
          일정 만들기
        </FloatingButton>
      )}
    </div>
  );
};

export default ScheduleTab;
