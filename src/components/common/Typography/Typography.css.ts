import { palette } from '@/styles/color';
import { style } from '@vanilla-extract/css';

export const textButton = style({
  color: palette.primary300,
  cursor: 'pointer',
  textDecoration: 'underline'
});

export const variants = {
  h1: style([
    {
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '36px',
      lineHeight: '46px'
    }
  ]),

  h2: style([
    {
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '24px',
      lineHeight: '34px'
    }
  ]),

  h3: style([
    {
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '18px',
      lineHeight: '26px'
    }
  ]),

  h4: style([
    {
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '22px'
    }
  ]),

  body1: style([
    {
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '24px'
    }
  ]),

  body2: style([
    {
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '24px'
    }
  ]),

  body3: style([
    {
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '22px'
    }
  ]),

  body4: style([
    {
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '14px',
      lineHeight: '22px'
    }
  ]),

  button1: style([
    {
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '14px',
      lineHeight: '20px'
    }
  ]),

  button2: style([
    {
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '20px'
    }
  ]),

  button3: style([
    {
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '12px',
      lineHeight: '14px'
    }
  ]),

  caption1: style([
    {
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '14px',
      lineHeight: '20px'
    }
  ]),

  caption2: style([
    {
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '20px'
    }
  ]),

  caption3: style([
    {
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '12px',
      lineHeight: '18px'
    }
  ])
};

export type Variant = keyof typeof variants;
