import { palette } from '@/styles/color';
import { GLOBAL_PADDING_X } from '@/styles/global.css';
import { style } from '@vanilla-extract/css';

export const fullWidth = style({
  transform: `translateX(-${GLOBAL_PADDING_X}px)`,
  width: '100%',
  paddingLeft: GLOBAL_PADDING_X + 'px',
  paddingRight: GLOBAL_PADDING_X + 'px'
});

export const calendar = style({
  transition: 'height 0.8s ease',
  overflowY: 'hidden'
});

export const hidden = style({
  height: '0 !important'
});

export const calendarFooter = style([
  {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
]);

export const fakeHeader = style([
  fullWidth,
  {
    height: '56px',
    backgroundColor: palette.white,
    position: 'absolute',
    top: 0
  }
]);
export const foldedHeader = style([
  fullWidth,
  {
    transition: 'opacity 1s ease',
    position: 'absolute',
    top: 0,
    padding: `20px ${GLOBAL_PADDING_X}px 14px`,
    textAlign: 'center',
    opacity: 1
  }
]);

export const hiddenFoldedHeader = style({
  opacity: 0
});

export const toggleItem = style({
  display: 'flex',
  columnGap: 4,
  alignItems: 'center',
  cursor: 'pointer'
});

export const headerFoldToggle = style({
  position: 'absolute',
  top: 20,
  right: GLOBAL_PADDING_X
});
