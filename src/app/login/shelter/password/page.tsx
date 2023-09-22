'use client';

import Button from '@/components/common/Button/Button';
import EmphasizedTitle, {
  Line
} from '@/components/common/EmphasizedTitle/EmphasizedTitle';
import TextField from '@/components/common/TextField/TextField';
import useDebounceValidator from '@/hooks/useDebounceValidator';
import useHeader from '@/hooks/useHeader';
import useToast from '@/hooks/useToast';
import { yupResolver } from '@hookform/resolvers/yup';
import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { passWordFindValidation } from '../../../shelter/utils/shelterValidaion';
import * as styles from './styles.css';

const helperMessage = `등록한 파트너 계정의 이메일을 입력해주세요.
비밀번호를 재설정할 수 있는 링크를 보내드립니다.`;

interface FindPassFormValue {
  email: string;
}

export default function ShelterPassword() {
  const {
    register,
    formState: { errors },
    setError,
    watch
  } = useForm<FindPassFormValue>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(passWordFindValidation)
  });

  useHeader({ title: '비밀번호 찾기' });
  const toastOn = useToast();

  useEffect(() => {
    setError('email', {
      type: 'focus',
      message: '필수항목 입니다.'
    });
  }, [setError]);

  const debouncedValidator = useDebounceValidator({
    boolVal: false,
    fieldName: 'email',
    setError: setError,
    message: '입력하신 이메일 계정이 없습니다. 다시 한번 확인해주세요.'
  });

  const emailValue = watch('email');
  useEffect(() => {
    if (emailValue?.length > 0) {
      debouncedValidator(emailValue, 'EMAIL');
    }
  }, [emailValue, debouncedValidator]);

  const handleSendPassLink = async () => {
    try {
      toastOn('비밀번호 재설정 링크가 발송되었습니다.');
    } catch (error) {
      toastOn('알 수 없는 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <>
      <div className={styles.titleWrapper}>
        <EmphasizedTitle>
          <Line>비밀번호를 잊으셨나요?</Line>
          <Line>등록하신 이메일을 입력해주세요</Line>
        </EmphasizedTitle>
      </div>
      <TextField
        helper={helperMessage}
        placeholder="등록하신 이메일을 입력해주세요."
        {...register('email')}
        onBlur={() => {
          if (emailValue?.length > 0) {
            debouncedValidator(emailValue, 'EMAIL');
          }
        }}
        error={errors.email}
        autoFocus
      />
      <Button
        style={{ marginTop: '47px' }}
        disabled={!isEmpty(errors)}
        onClick={handleSendPassLink}
      >
        비밀번호 재설정 링크 보내기
      </Button>
    </>
  );
}
