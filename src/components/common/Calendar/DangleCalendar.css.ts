import { palette } from '@/styles/color';
import { GLOBAL_PADDING_X, expandGlobalPadding } from '@/styles/global.css';
import { globalStyle, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const container = style([
  expandGlobalPadding,
  {
    backgroundColor: palette.white,
    overflowX: 'hidden'
  }
]);
export const calendar = style({
  width: '100%',
  transform: `translateX(${-GLOBAL_PADDING_X}px)`,
  padding: `${GLOBAL_PADDING_X}px`
});

export const footer = style({
  transform: 'translateY(-20px)'
});

export const dotWrapper = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute'
});

export const dot = recipe({
  base: {
    height: '4px',
    width: '4px',
    borderRadius: '4px',
    display: 'flex',
    marginTop: '28px'
  },
  variants: {
    date: {
      today: {
        backgroundColor: palette.white
      },
      other: {
        backgroundColor: palette.gray600
      }
    }
  }
});

globalStyle(`${calendar} *`, {
  MozBoxSizing: 'border-box',
  WebkitBoxSizing: 'border-box',
  boxSizing: 'border-box'
});

globalStyle(`${calendar} &::after`, {
  MozBoxSizing: 'border-box',
  WebkitBoxSizing: 'border-box',
  boxSizing: 'border-box'
});

globalStyle(`${calendar} &::before`, {
  MozBoxSizing: 'border-box',
  WebkitBoxSizing: 'border-box',
  boxSizing: 'border-box'
});

globalStyle(`${calendar} button`, {
  textAlign: 'center'
});

globalStyle(`${calendar} button:enabled:hover`, {
  cursor: 'pointer'
});

globalStyle(`${calendar} .react-calendar__viewContainer`, {});
// 캘린더 인디케이터
globalStyle(`${calendar} .react-calendar__navigation`, {
  display: 'flex',
  margin: '0 auto',
  width: 'fit-content',
  columnGap: 16,
  alignItems: 'center'
});

globalStyle(`${calendar} .react-calendar__navigation > *`, {
  height: 24
});

globalStyle(`${calendar} .react-calendar__navigation__label`, {
  fontSize: '16px',
  fontWeight: 600
});

globalStyle(`${calendar} .react-calendar__month-view`, {
  padding: `12px`
});
// 요일 column
globalStyle(`${calendar} .react-calendar__month-view__weekdays`, {
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: '14px',
  color: palette.gray600,
  textAlign: 'center',
  padding: '3px 0',
  marginBottom: '4px'
});

// 날짜 container
globalStyle(
  `${calendar} .react-calendar__month-view__weekdays__weekday--weekend`,
  {
    color: palette.primary300
  }
);

globalStyle(`${calendar} .react-calendar__tile`, {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',

  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '20px',
  color: palette.gray900,

  position: 'relative',
  height: '32px'
});

globalStyle(`${calendar} .react-calendar__tile::before`, {
  content: '',
  position: 'absolute',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  zIndex: -100
});

globalStyle(`${calendar} .react-calendar__month-view__days`, {
  rowGap: 4
});

globalStyle(`${calendar} .react-calendar__month-view__days__day--weekend`, {
  color: palette.primary300
});

globalStyle(
  `${calendar} .react-calendar__month-view__days__day--neighboringMonth`,
  {
    opacity: 0.3
  }
);

// 오늘 날짜
globalStyle(`${calendar} .react-calendar__tile--now `, {
  color: `${palette.white} !important`
});
globalStyle(`${calendar} .react-calendar__tile--now::before`, {
  background: `${palette.gray900} !important`
});

// 날짜 호버됐을 시
globalStyle(`${calendar} .react-calendar__tile:enabled:hover`, {
  color: palette.gray900
});
globalStyle(`${calendar} .react-calendar__tile:enabled:hover::before`, {
  background: palette.gray200
});

// 선택한 날짜
globalStyle(`${calendar} .react-calendar__tile--rangeBothEnds:enabled`, {
  color: palette.gray900
});
globalStyle(
  `${calendar} .react-calendar__tile--rangeBothEnds:enabled::before`,
  {
    background: palette.gray200
  }
);
