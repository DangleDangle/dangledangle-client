'use client';
import { MainLogo } from '@/asset/icons';
import { useRouter } from 'next/navigation';
import { Body3, Body4 } from '../Typography';
import * as styles from './Header.css';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { palette } from '@/styles/color';
import { UserRole } from '@/constants/user';
import { DOM_ID_BANNER } from '@/constants/dom';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuthContext } from '@/providers/AuthContext';
import useSafariBackgroundControll from '@/hooks/useSafariBackgroundControll';

interface MainHeaderProps {
  initRole?: UserRole;
  shelterId?: number;
}

export default function MainHeader({ initRole, shelterId }: MainHeaderProps) {
  const router = useRouter();
  const headerRef = useRef<HTMLElement>(null);
  const [role, setRole] = useState(initRole);
  const { setSafariBackground } = useSafariBackgroundControll();
  const { dangle_role } = useAuthContext();
  const refresh = () => {
    location.reload();
  };

  const handleClick = () => {
    if (role === 'NONE') {
      router.push('/login');
    } else {
      router.push('/admin');
    }
  };

  const content = useMemo(() => {
    let setRole = null;
    if (initRole || !role || initRole === role) {
      setRole = initRole;
    } else {
      setRole = role;
    }
    return setRole === 'VOLUNTEER'
      ? '개인봉사자'
      : role === 'SHELTER'
      ? '보호소 파트너'
      : '로그인/회원가입';
  }, [initRole, role]);

  useEffect(() => {
    if (initRole !== role) {
      setRole(dangle_role);
    }
  }, [initRole, role, dangle_role]);

  const checkIntersect = useCallback(
    (threshold: number) => async () => {
      const header = headerRef.current;
      if (!header) return;
      if (window.scrollY > threshold) {
        header.classList.add(styles.headerColorOn);
        header.classList.remove(styles.headerColorOff);
        setSafariBackground(palette.white);
      } else {
        header.classList.remove(styles.headerColorOn);
        header.classList.add(styles.headerColorOff);
        setSafariBackground(palette.background);
      }
    },
    [setSafariBackground]
  );

  useEffect(() => {
    const banner = document.getElementById(DOM_ID_BANNER);
    if (!banner) return;
    const { height } = banner.getBoundingClientRect();
    window.addEventListener('scroll', checkIntersect(height));
  }, [checkIntersect]);

  return (
    <nav
      ref={headerRef}
      className={styles.container}
      style={assignInlineVars({
        [styles.headerColor]: palette.background
      })}
    >
      <a className={styles.homeIcon} onClick={refresh}>
        <MainLogo />
      </a>

      <div className={styles.rightSide} onClick={handleClick}>
        <Body3 style={{ cursor: 'pointer' }}>{content}</Body3>
        {(role === 'SHELTER' || role === 'VOLUNTEER') && (
          <a className={styles.myPageIcon}>
            <Body4 color="gray600">MY</Body4>
          </a>
        )}
      </div>
    </nav>
  );
}
