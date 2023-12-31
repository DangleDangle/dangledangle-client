'use client';

import Link from 'next/link';
import * as styles from './KakaoLoginButton.css';
import { H4 } from '@/components/common/Typography';
import useHeader from '@/hooks/useHeader';
import { KakaoLogo } from '@/asset/icons';

export default function KakaoLoginButton() {
  useHeader({ title: '개인봉사자로 시작하기' });
  return (
    <>
      <Link href={process.env.NEXT_PUBLIC_KAKAO_LOGIN_URL!}>
        <button className={styles.KakaoLoginButton}>
          <KakaoLogo />
          <H4>카카오로 시작하기</H4>
        </button>
      </Link>
    </>
  );
}
