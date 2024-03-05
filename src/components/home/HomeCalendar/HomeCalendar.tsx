'use client';
import CheckBox from '@/components/common/CheckBox/CheckBox.tsx';
import * as styles from './HomeCalendar.css.ts';
import DangleCalendar from '@/components/common/Calendar/DangleCalendar';
import { Caption3, H4 } from '@/components/common/Typography/index.ts';
import { ArrowFold, ArrowUnfold } from '@/asset/icons/index.ts';
import moment from 'moment';
import clsx from 'clsx';
import { useAuthContext } from '@/providers/AuthContext.tsx';
import { useEffect, useState } from 'react';

interface FoldToggleProps {
  isFolded: boolean;
  onClick: () => void;
  className?: string;
}
const FoldToggle: React.FC<FoldToggleProps> = ({
  isFolded,
  onClick,
  className
}) => {
  return (
    <div className={clsx(styles.toggleItem, className)} onClick={onClick}>
      <Caption3 color="gray600">달력 {isFolded ? '펼치기' : '접기'}</Caption3>
      {isFolded ? <ArrowFold /> : <ArrowUnfold />}
    </div>
  );
};

export const CALENDAR_ID = 'home-calendar';

const calculateCalendarHeight = () => {
  // 캘린더 height transition을 위해 height 속성값이 필요

  const calEl = document.getElementById(CALENDAR_ID);
  const rc = calEl?.querySelector('.react-calendar');

  if (!calEl || !rc) return;
  setTimeout(() => {
    calEl.style.height = rc.scrollHeight + 18 + 'px';
  }, 0);
};
interface HomeCalendarProps {
  isFolded: boolean;
  setIsFolded: (isFolded: boolean) => void;
  bookmark: boolean;
  date: Date;
  mark?: (string | Date)[];
  onClickDate: (value: Date) => void;
  onChangeBookmark: () => void;
}
const HomeCalendar: React.FC<HomeCalendarProps> = ({
  isFolded,
  setIsFolded,
  bookmark,
  date,
  mark,
  onClickDate,
  onChangeBookmark
}) => {
  const { dangle_role } = useAuthContext();
  const [hasFolded, setHasFolded] = useState(false);

  useEffect(() => {
    if (isFolded && !hasFolded) {
      setHasFolded(true);
    }
  }, [hasFolded, isFolded]);

  const handleChange = (value: Date) => {
    calculateCalendarHeight();
    onClickDate(value);
  };

  useEffect(() => {
    calculateCalendarHeight();
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <div className={styles.fakeHeader} />
      <div
        className={clsx(styles.foldedHeader, {
          [styles.hiddenFoldedHeader]: !isFolded
        })}
      >
        <H4>{moment(date).format('YYYY.MM')}</H4>
        <FoldToggle
          className={styles.headerFoldToggle}
          isFolded={true}
          onClick={() => setIsFolded(false)}
        />
      </div>
      <DangleCalendar
        id={CALENDAR_ID}
        className={clsx(styles.calendar, { [styles.hidden]: isFolded })}
        value={date}
        mark={mark}
        onChange={handleChange}
        onChangeMonth={handleChange}
        footer={
          <div
            className={clsx(styles.calendarFooter, {
              [styles.hidden]: isFolded
            })}
          >
            <div className={styles.toggleItem} onClick={onChangeBookmark}>
              {dangle_role !== 'SHELTER' && (
                <>
                  <CheckBox value={bookmark} onClick={() => null} />
                  <Caption3>즐겨찾기한 보호소만 보기</Caption3>
                </>
              )}
            </div>
            {/* 최소 한 번 접힌 적이 있을 때만 렌더링 */}
            {hasFolded && (
              <FoldToggle isFolded={false} onClick={() => setIsFolded(true)} />
            )}
          </div>
        }
      />
    </div>
  );
};

export default HomeCalendar;
