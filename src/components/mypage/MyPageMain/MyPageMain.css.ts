import { palette } from '@/styles/color';
import { BREAK_POINT, GLOBAL_PADDING_X } from '@/styles/global.css';
import { createVar, style } from '@vanilla-extract/css';

export const space = createVar('space');

export const container = style({
  padding: '20px 20px 32px 20px'
});
export const grid = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: '16px',
  marginLeft: '4px',
  cursor: 'pointer'
});
export const box = style({
  width: `calc(100% - 4 * ${GLOBAL_PADDING_X}px)`,
  marginTop: '20px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '14px 38px 14px 38px',
  backgroundColor: palette.white,
  borderRadius: '8px',
  cursor: 'pointer'
});
export const txtGird = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%'
});
export const stroke = style({
  width: '1px',
  height: '60px',
  backgroundColor: palette.gray200,
  margin: `0 ${space} 0 ${space}`
});

export const settingSection = style({
  display: 'border-box',
  width: `100%`,
  maxWidth: BREAK_POINT,
  backgroundColor: palette.white
});

export const accountTxt = style({
  display: 'flex',
  flexDirection: 'row',
  columnGap: '8px',
  alignItems: 'center'
});
export const accountBox = style({
  padding: '16px 20px 16px 20px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  cursor: 'pointer'
});
export const noti = style({
  display: 'block',
  padding: '4px 20px 16px 20px'
});
export const divider = style({
  width: `calc(100% - 2 * ${GLOBAL_PADDING_X}px)`,
  transform: `translateX(${GLOBAL_PADDING_X}px)`,
  backgroundColor: palette.gray200,
  height: '1px',
  margin: '8 0'
});
export const loginContainer = style({
  backgroundColor: palette.white
});
export const btnTxt = style({
  textAlign: 'center'
});
export const btnWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '66px',
  padding: '12px 6px 12px 6px'
});
