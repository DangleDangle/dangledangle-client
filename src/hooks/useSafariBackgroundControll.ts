'use client';

import { DOM_ID_BACKGROUND_THEME } from '@/constants/dom';
import { palette } from '@/styles/color';
import { useCallback, useEffect, useState } from 'react';

function useSafariBackgroundControll() {
  const [themeElem, setThemeElem] = useState<HTMLMetaElement | null>(null);

  const setSafariBackground = useCallback(
    (theme: string) => {
      if (!themeElem) return;
      themeElem.setAttribute('content', theme);
    },
    [themeElem]
  );

  useEffect(() => {
    let themeElem = document.getElementById(
      DOM_ID_BACKGROUND_THEME
    ) as HTMLMetaElement;
    if (!themeElem) {
      themeElem = document.createElement('meta');
      document.head.append(
        Object.assign(themeElem, {
          id: DOM_ID_BACKGROUND_THEME,
          name: 'theme-color',
          content: palette.background
        })
      );
    }
    setThemeElem(themeElem);
  }, []);

  return { setSafariBackground };
}

export default useSafariBackgroundControll;
