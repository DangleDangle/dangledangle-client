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
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { passWordFindValidation } from '../../../shelter/utils/shelterValidaion';
import * as styles from './styles.css';
import FormProvider from '@/components/common/FormProvider/FormProvider';
import { handlePhoneNumberChange, removeDash } from '@/utils/formatInputs';
import { fowardPwdLink } from '@/api/shelter/auth/login';
import { ApiErrorResponse } from '@/types/apiTypes';

const helperMessage = `등록한 파트너 계정의 이메일을 입력해주세요.
비밀번호를 재설정할 수 있는 링크를 보내드립니다.`;

interface FindPassFormValue {
  email: string;
  phoneNumber: string;
}

export default function ShelterPassword() {
  const methods = useForm<FindPassFormValue>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(passWordFindValidation)
  });
  const {
    register,
    formState: { errors },
    setError,
    watch,
    handleSubmit
  } = methods;

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

  const handleSendPassLink = useCallback(
    async (data: FindPassFormValue) => {
      const newData = {
        ...data,
        phoneNumber: removeDash(data.phoneNumber)
      };

      try {
        await fowardPwdLink(newData);
        toastOn('비밀번호 재설정 링크가 발송되었습니다.');
      } catch (e) {
        if ((e as ApiErrorResponse).exceptionCode === 'STORAGE-001') {
          toastOn('등록하신 핸드폰 번호를 다시 확인해주세요.');
        } else {
          toastOn('알 수 없는 오류가 발생했습니다. 다시 시도해주세요.');
        }
      }
    },
    [toastOn]
  );

  return (
    <>
      <div className={styles.titleWrapper}>
        <EmphasizedTitle>
          <Line>비밀번호를 잊으셨나요?</Line>
          <Line>등록하신 이메일을 입력해주세요</Line>
        </EmphasizedTitle>
      </div>

      <FormProvider
        methods={methods}
        onSubmit={handleSubmit(handleSendPassLink)}
        style={{ display: 'flex', flexDirection: 'column', rowGap: '20px' }}
      >
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
        <TextField
          placeholder="등록하신 핸드폰 번호를 입력해주세요. (-제외)"
          {...register('phoneNumber', { onChange: handlePhoneNumberChange })}
          error={errors.phoneNumber}
        />
        <Button
          style={{ marginTop: '47px' }}
          disabled={!isEmpty(errors)}
          type="submit"
        >
          비밀번호 재설정 링크 보내기
        </Button>
      </FormProvider>
    </>
  );
}
