import { X_HEADER_TITLE } from '@/constants/customHttpHeaderKeys';
import { DOM_ID_BACKGROUND_THEME } from '@/constants/dom';
import { palette } from '@/styles/color';
import { base64ToUtf8 } from '@/utils/base64ToUtf8';
import { headers } from 'next/headers';

function SafariBackGround() {
  const headerTitleProps = headers().get(X_HEADER_TITLE) ?? '';
  const prop = JSON.parse(base64ToUtf8(headerTitleProps) || '{}');

  return (
    <meta
      id={DOM_ID_BACKGROUND_THEME}
      name="theme-color"
      content={prop.backgroundColor || palette.background}
    ></meta>
  );
}

export default SafariBackGround;
