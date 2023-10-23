'use client';
import { H2, H3 } from '@/components/common/Typography';
import { useCallback, useEffect } from 'react';
import Button from '@/components/common/Button/Button';
import * as styles from './RegisterComplete.css';
import Image from 'next/image';
import useHeader from '@/hooks/useHeader';
import Cookies from 'js-cookie';
import {
  COOKIE_REDIRECT_URL,
  COOKIE_REGISTER_EMAIL_KEY
} from '@/constants/cookieKeys';

export default function RegisterComplete() {
  useHeader({ isHeader: 'hidden' });
  useEffect(() => {
    Cookies.remove(COOKIE_REGISTER_EMAIL_KEY);
  }, []);
  const handleClick = useCallback(async () => {
    Cookies.set(COOKIE_REDIRECT_URL, '/');
    location.href = process.env.NEXT_PUBLIC_KAKAO_LOGIN_URL!;
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.contents}>
          <Image
            width={300}
            height={300}
            src="/images/ParticleWithLogo.png"
            className={styles.image}
            alt="particle"
          />

          <div className={styles.titleGroup}>
            <H2>가입완료!</H2>
            <div>
              <H3>관심 있는 보호소를 발견하고</H3>
              <H3> 같이 세상을 바꿔볼까요?</H3>
            </div>
          </div>

          <Button onClick={handleClick} className={styles.button}>
            홈 살펴보러 가기
          </Button>
        </div>
      </div>
    </>
  );
}
