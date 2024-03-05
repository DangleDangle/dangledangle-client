'use client';
import { Question, Warning } from '@/asset/icons';
import Button from '@/components/common/Button/Button';
import CheckBox from '@/components/common/CheckBox/CheckBox';
import EmphasizedTitle, {
  E,
  Line
} from '@/components/common/EmphasizedTitle/EmphasizedTitle';
import { Body3, Body4, H4 } from '@/components/common/Typography';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import * as styles from './styles.css';
import useKeyboardActive from '@/hooks/useKeyboardActive';

export default function Sure() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const keyboardActive = useKeyboardActive();

  const handleClick = useCallback(() => {
    keyboardActive();
    router.push('/register/shelter/step');
  }, []);

  return (
    <>
      <div
        className={styles.titleWrapper}
        style={assignInlineVars({
          [styles.titleMarginBottom]: '63px'
        })}
      >
        <EmphasizedTitle>
          <Line>
            <E>보호소 파트너</E>로
          </Line>
          <Line>가입하시는 것이 맞는지</Line>
          <Line>꼭 확인해주세요.</Line>
        </EmphasizedTitle>
      </div>

      <div className={styles.subWrapper}>
        <Question />
        <H4>보호소 파트너란?</H4>
      </div>

      <div className={styles.content}>
        <div style={{ padding: '16px' }}>
          <Body3>시보호소 또는 민간보호소를 운영하는</Body3>
          <div style={{ display: 'flex' }}>
            <Body4>운영자, 관계자분들을 대상</Body4>
            <Body3>으로해요.</Body3>
          </div>
        </div>
      </div>

      <div className={styles.subWrapper} style={{ marginTop: '33px' }}>
        <Warning />
        <H4>주의해주세요.</H4>
      </div>

      <div className={styles.content} style={{ marginBottom: '98px' }}>
        <div style={{ padding: '16px' }}>
          <Body3>운영자가 확인했을 때 시보호소/민간 보호소</Body3>
          <Body3>관계자가 아닌, 개인 구조자, 분양 홍보자 등일 경우</Body3>
          <div style={{ display: 'flex' }}>
            <Body3>임의로 해당&nbsp;</Body3>
            <Body4>계정을 사용 중지 처리할 수 있어요.</Body4>
          </div>
        </div>
      </div>

      <div className={styles.check}>
        <CheckBox
          value={checked}
          onClick={setChecked}
          label="위 내용을 모두 확인했으며, 동의해요."
        />
      </div>
      <Button
        onClick={handleClick}
        disabled={!checked}
        style={{ marginTop: '22px', marginBottom: '32px' }}
      >
        다음
      </Button>
    </>
  );
}
