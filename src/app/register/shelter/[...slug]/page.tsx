'use client';

import { ShelterRegisterPayload } from '@/api/shelter/auth/sign-up';
import useShelterRegister from '@/api/shelter/auth/useShelterRegister';
import FormProvider from '@/components/common/FormProvider/FormProvider';
import useFunnel, { StepsProps } from '@/hooks/useFunnel';
import useToast from '@/hooks/useToast';
import { removeDash } from '@/utils/formatInputs';
import { yupResolver } from '@hookform/resolvers/yup';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Account from './Account';
import Additional from './Additional';
import Address from './Address';
import Description from './Description';
import Hp from './Hp';
import Name from './Name';
import RegisterComplete from './RegisterComplete';
import RequireComplete from './RequireComplete';
import SpecificAddress from './SpecificAddress';
import { registerValidation } from '@/app/shelter/utils/shelterValidaion';
import useHeader from '@/hooks/useHeader';
import useShelterLogin from '@/api/shelter/auth/useShelterLogin';
import Cookies from 'js-cookie';

export interface OnNextProps {
  onNext: VoidFunction;
  onSubmit: SubmitHandler<SignUpFormValue>;
  onLogin: (
    loginData: Pick<SignUpFormValue, 'email' | 'password'>
  ) => Promise<void>;
}

export interface SignUpFormValue extends ShelterRegisterPayload {
  passwordConfirm: string;
}

const Steps: StepsProps<OnNextProps>[] = [
  {
    component: Account,
    path: '1'
  },
  {
    component: Name,
    path: '2'
  },
  {
    component: Hp,
    path: '3'
  },
  {
    component: Address,
    path: '4'
  },
  {
    component: SpecificAddress,
    path: '5'
  },
  {
    component: Description,
    path: '6'
  },
  {
    component: RequireComplete,
    path: '7'
  },
  {
    component: Additional,
    path: '8'
  },
  {
    component: RegisterComplete,
    path: '9'
  }
];

export default function ShelterRegister() {
  const toastOn = useToast();
  useHeader({ title: '보호소 파트너 계정 가입' });
  const pathname = usePathname();

  // 새로고침시 url step으로 초기화
  useEffect(() => {
    if (Cookies.get('step') === 'processing') {
      Cookies.remove('step');
      const initialUrl = `${window.location.origin}/register/shelter`;
      location.replace(initialUrl);
    }
  }, []);

  const { goToNextStep, currentStepIndex } = useFunnel<OnNextProps>(
    Steps,
    pathname
  );
  const CurrentComponent = Steps[currentStepIndex].component;

  const methods = useForm<SignUpFormValue>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(registerValidation)
  });

  const { mutateAsync: registerMutateAsync } = useShelterRegister();
  const { mutateAsync: loginMutateAsync } = useShelterLogin();

  const { handleSubmit } = methods;

  const onSubmit = useCallback(
    async (data: SignUpFormValue) => {
      const newData: ShelterRegisterPayload = {
        ...data,
        name: data.name.trim(),
        phoneNumber: removeDash(data.phoneNumber)
      };

      try {
        await registerMutateAsync(newData);
        goToNextStep();
        toastOn('회원가입에 성공했습니다.');
      } catch (error) {
        toastOn('회원가입에 실패했습니다.');
      }
    },
    [goToNextStep, toastOn, registerMutateAsync]
  );

  const onLogin = useCallback(
    async (loginData: Pick<SignUpFormValue, 'email' | 'password'>) => {
      try {
        await loginMutateAsync(loginData);
        goToNextStep();
        toastOn('로그인에 성공했습니다.');
      } catch (error) {
        toastOn('로그인에 실패했습니다.');
      }
    },
    [goToNextStep, toastOn, loginMutateAsync]
  );
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <CurrentComponent
        onNext={goToNextStep}
        onSubmit={onSubmit}
        onLogin={onLogin}
      />
    </FormProvider>
  );
}
