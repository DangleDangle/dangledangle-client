import { palette } from '@/styles/color';
import { createVar, style } from '@vanilla-extract/css';

export const headerColor = createVar('headerColor');

export const HEADER_HEIGHT = 56;
export const container = style({
  position: 'sticky',
  zIndex: 1,
  top: 0,
  width: '100%',
  display: 'flex',
  padding: '16px 20px',
  boxSizing: 'border-box',
  height: '56px',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: headerColor
});

export const homeIcon = style({
  cursor: 'pointer',
  zIndex: 1
});

export const title = style({
  flex: 1,
  textAlign: 'center'
});

export const rightSide = style({
  position: 'absolute',
  right: 20,
  display: 'flex',
  columnGap: 4,
  alignItems: 'center'
});

export const myPageIcon = style({
  display: 'flex',
  padding: '5px',
  boxSizing: 'border-box',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '100%',
  border: `1px solid ${palette.gray200}`,
  background: palette.gray50,
  cursor: 'pointer'
});

export const headerColorOn = style({
  backgroundColor: palette.white,
  transition: '0.2s ease-in-out'
});
export const headerColorOff = style({
  backgroundColor: palette.background
});
