'use client';
import { pwdChange } from '@/api/shelter/auth/login';
import { passwordChangeValidatgion } from '@/app/shelter/utils/shelterValidaion';
import Button from '@/components/common/Button/Button';
import FormProvider from '@/components/common/FormProvider/FormProvider';
import TextField from '@/components/common/TextField/TextField';
import useHeader from '@/hooks/useHeader';
import useToast from '@/hooks/useToast';
import { yupResolver } from '@hookform/resolvers/yup';
import { isEmpty } from 'lodash';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import * as styles from './style.css';
import { useRouter } from 'next/navigation';
import useLogout from '@/api/mypage/useLogout';

interface PasswordChangePageProps {}

interface PassChangeFormValue {
  password: string;
  passwordConfirm: string;
}

export default function PasswordChangePage({}: PasswordChangePageProps) {
  useHeader({ title: '비밀번호 변경' });
  const router = useRouter();
  const toastOn = useToast();

  const methods = useForm<PassChangeFormValue>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(passwordChangeValidatgion)
  });
  const {
    register,
    formState: { errors },
    getValues,
    handleSubmit
  } = methods;

  const areInputsFilled =
    Boolean(getValues('password')?.trim()) &&
    Boolean(getValues('passwordConfirm')?.trim());

  const { mutate: logout } = useLogout();

  const handlePasswordChange = useCallback(
    async (data: PassChangeFormValue) => {
      const newData = {
        password: data.password
      };

      try {
        await pwdChange(newData);
        logout();
        toastOn('비밀번호가 변경되었습니다. 로그인 화면으로 이동합니다.');
        router.push('/login');
      } catch (error) {
        toastOn('알 수 없는 오류가 발생했습니다. 다시 시도해주세요.');
      }
    },
    []
  );

  return (
    <div className={styles.container}>
      <FormProvider
        methods={methods}
        onSubmit={handleSubmit(handlePasswordChange)}
        style={{ display: 'flex', flexDirection: 'column', rowGap: '20px' }}
      >
        <TextField
          label="새 비밀번호"
          placeholder="영문, 숫자, 특수문자 2가지 조합 8~15자"
          {...register('password')}
          type="password"
          error={errors.password}
          autoFocus
        />
        <TextField
          label="새 비밀번호 확인"
          placeholder="새 비밀번호를 한번 더 입력해주세요."
          {...register('passwordConfirm')}
          type="password"
          error={errors.passwordConfirm}
        />
        <Button
          style={{ marginTop: '47px' }}
          disabled={!isEmpty(errors) || !areInputsFilled}
          type="submit"
        >
          변경하기
        </Button>
      </FormProvider>
    </div>
  );
}
