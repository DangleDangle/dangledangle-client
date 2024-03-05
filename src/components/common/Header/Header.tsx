'use client';
import { ArrowLeft } from '@/asset/icons';
import { headerState } from '@/store/header';
import { usePathname, useRouter } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { Body2, H4 } from '../Typography';
import * as styles from './Header.css';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { palette } from '@/styles/color';
import { useLayoutEffect, useMemo } from 'react';
import MainHeader from './MainHeader';
import { UserRole } from '@/constants/user';
import useSafariBackgroundControll from '@/hooks/useSafariBackgroundControll';
import { DOM_ID_BACKGROUND_THEME } from '@/constants/dom';

interface HeaderComponentProps {
  initColor: string;
  initTitle?: string;
  initRole?: UserRole;
  shelterId?: number | null;
}

export default function Header({
  initColor,
  initTitle,
  initRole,
  shelterId
}: HeaderComponentProps) {
  const headerValue = useRecoilValue(headerState);
  const {
    color,
    isHeader,
    isBackArrow,
    title,
    RightSideComponent,
    thisPage,
    entirePage
  } = headerValue;
  const router = useRouter();
  const pathName = usePathname();
  const navigate = () => {
    // 웹페이지 처음 방문 했을 시 window.history.length === 1
    history.length === 1 ? router.push('/') : router.back();
  };
  const { setSafariBackground } = useSafariBackgroundControll();

  const headerColor = useMemo(() => {
    if (!color || initColor === color) {
      return initColor === 'default' ? palette.background : initColor;
    } else {
      return color;
    }
  }, [color, initColor]);

  const headerTitle = useMemo(() => {
    if (!title || initTitle === title) {
      return initTitle;
    } else {
      return title;
    }
  }, [title, initTitle]);

  useLayoutEffect(() => {
    setSafariBackground(headerColor);
  }, [setSafariBackground, headerColor]);

  if (pathName === '/') {
    return <MainHeader initRole={initRole} shelterId={shelterId!} />;
  }

  return (
    <>
      {isHeader === 'visible' ? (
        <nav
          className={styles.container}
          style={assignInlineVars({
            [styles.headerColor]: headerColor
          })}
        >
          <a className={styles.homeIcon} onClick={navigate}>
            {isBackArrow === 'visible' ? <ArrowLeft /> : null}
          </a>
          <H4 className={styles.title}>{headerTitle}</H4>
          <div className={styles.rightSide}>
            {<PageNumbering thisPage={thisPage} entirePage={entirePage} />}
            {RightSideComponent && <RightSideComponent />}
          </div>
        </nav>
      ) : null}
    </>
  );
}

const PageNumbering = ({
  thisPage,
  entirePage
}: {
  thisPage?: number | null;
  entirePage?: number | null;
}) => {
  return (
    <Body2>
      {thisPage}
      {entirePage ? '/' : null}
      {entirePage}
    </Body2>
  );
};
