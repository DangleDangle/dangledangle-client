import { palette } from '@/styles/color';
import { BREAK_POINT } from '@/styles/global.css';
import { style } from '@vanilla-extract/css';

export const bottomSheet = style({
  height: '70vh',
  maxWidth: `${BREAK_POINT}px`,
  width: 'calc(100% - 40px)',
  borderBottomLeftRadius: '0',
  borderBottomRightRadius: '0'
});

export const wrapper = style({
  position: 'relative',
  width: '100%',
  height: '100%',
  padding: '40px 20px',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column'
});

export const allAcceptChecBoxContainer = style({
  display: 'flex',
  margin: '32px 0px',
  width: '100%'
});

export const hr = style({
  width: '100%',
  height: '0px',
  border: `1px solid ${palette.gray300}`
});

export const checkBoxContainer = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  margin: '32px 0px 32px 0px',
  rowGap: '20px'
});
export const checkBox = style({
  flex: 0,
  display: 'flex',
  justifyContent: 'space-between'
});

export const bottomButton = style({
  marginTop: 'auto'
});
