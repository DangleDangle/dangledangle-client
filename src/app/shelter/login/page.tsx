'use client';

import { LoginPayload } from '@/api/shelter/auth/login';
import useShelterLogin from '@/api/shelter/auth/useShelterLogin';
import { Daenggle } from '@/asset/icons';
import Button from '@/components/common/Button/Button';
import FormProvider from '@/components/common/FormProvider/FormProvider';
import TextField from '@/components/common/TextField/TextField';
import { Body3, ButtonText1 } from '@/components/common/Typography';
import { headerState } from '@/store/header';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useCallback, useLayoutEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';
import { loginValidation } from '../utils/shelterValidaion';
import useToast from '@/hooks/useToast';

export default function ShelterLogin() {
  const methods = useForm<LoginPayload>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(loginValidation)
  });
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = methods;

  const router = useRouter();
  const toastOn = useToast();
  const setHeader = useSetRecoilState(headerState);

  useLayoutEffect(() => {
    setHeader(prev => ({
      ...prev,
      title: '보호소 파트너로 시작하기'
    }));
  }, [setHeader]);

  const { mutateAsync } = useShelterLogin();

  const handleLogin = useCallback(
    async (data: LoginPayload) => {
      try {
        await mutateAsync(data);
        router.push('/event');
      } catch (e) {
        toastOn('로그인에 실패했습니다.');
        setError(
          'email',
          {
            type: 'focus',
            message: '이메일 주소 또는 비밀번호를 다시 확인해주세요.'
          },
          { shouldFocus: true }
        );
        setError('password', {
          type: 'focus',
          message: '이메일 주소 또는 비밀번호를 다시 확인해주세요.'
        });
      }
    },
    [router, mutateAsync, setError, toastOn]
  );

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ margin: '80px auto' }}>
        <Daenggle
          style={{
            margin: 'auto',
            display: 'block'
          }}
        />
      </div>
      <FormProvider methods={methods} onSubmit={handleSubmit(handleLogin)}>
        <TextField
          label="이메일"
          placeholder="이메일을 입력해주세요."
          {...register('email')}
          error={errors.email}
        />
        <TextField
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요."
          type="password"
          {...register('password')}
          error={errors.password}
        />
      </FormProvider>
      <Button onClick={handleSubmit(handleLogin)} style={{ marginTop: '40px' }}>
        로그인
      </Button>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <ButtonText1
          onClick={() => router.push('/shelter/password')}
          color="gray400"
          style={{
            margin: '16px 0 0 auto',
            cursor: 'pointer'
          }}
        >
          비밀번호 찾기
        </ButtonText1>
      </div>
      <div
        style={{
          display: 'flex',
          columnGap: '10px',
          justifyContent: 'center',
          marginTop: '34px'
        }}
      >
        <Body3>아직 daenggle 회원이 아니신가요?</Body3>
        <ButtonText1
          style={{ cursor: 'pointer' }}
          onClick={() => router.push('/shelter/register')}
        >
          회원가입
        </ButtonText1>
      </div>
    </div>
  );
}
