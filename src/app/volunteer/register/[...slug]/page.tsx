'use client';
import FormProvider from '@/components/common/FormProvider/FormProvider';
import useFunnel from '@/hooks/useFunnel';
import { useForm } from 'react-hook-form';
import NickName from './NickName';
import Button from '@/components/common/Button/Button';
import * as style from './style.css';
import { useSetRecoilState } from 'recoil';
import { headerState } from '@/store/header';
import { useEffect, useMemo } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ContactNumber from './ContactNumber';
import RegisterComplete from './RegisterComplete';
import {
  VolunteerRegisterPayload,
  postVolunteerRegister
} from '@/api/auth/register';
import { NickNamePayload, fetchCheckNickname } from '@/api/user/nickname';

const pathname = `/volunteer/register`;

type VolunteerRegisterFormValues = {
  nickName: string;
  contactNumber: string;
  complete: string;
};

const validation: Yup.ObjectSchema<Partial<VolunteerRegisterFormValues>> =
  Yup.object().shape({
    nickName: Yup.string()
      .max(10)
      .required('닉네임을 한글자 이상 입력해주세요.')
      .test(
        'no-emoji',
        '이모티콘은 사용할 수 없습니다',
        (value = '') =>
          !/(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu.test(value)
      ),
    contactNumber: Yup.string()
      .required('전화번호를 입력해주세요.')
      .matches(
        /^(01[0-9]{1}|(02|0[3-9]{2}))[0-9]{3,4}[0-9]{4}$/,
        '전화번호 형식이 아닙니다'
      ),
    complete: Yup.string()
  });

const Steps: {
  component: () => JSX.Element;
  path: keyof VolunteerRegisterFormValues;
  asyncCheck?: Function;
  responseResult?: any;
}[] = [
  {
    component: NickName,
    path: 'nickName',
    asyncCheck: async (query: NickNamePayload) => {
      fetchCheckNickname(query);
    }
  },
  {
    component: ContactNumber,
    path: 'contactNumber',
    asyncCheck: async (payload: VolunteerRegisterPayload) => {
      postVolunteerRegister(payload);
    }
  },
  {
    component: RegisterComplete,
    path: 'complete'
  }
];

export default function RegisterPage({ params }: { params: { slug: string } }) {
  const { goToNextStep, currentStepIndex } = useFunnel(Steps, pathname);

  const setHeader = useSetRecoilState(headerState);

  useEffect(() => {
    if (params) window.history.replaceState(null, '', `${pathname}/nickName`);
    setHeader({ title: '기본 설정', thisPage: null, entirePage: null });
  });

  const methods = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(validation)
  });

  const {
    handleSubmit,
    getValues,
    setError,
    formState: { errors }
  } = methods;

  const stepsFunction = useMemo(
    () => [
      {
        asyncCheck: async () => {
          const query = getValues('nickName');
          const check = await fetchCheckNickname(query || '');

          if (check === true) throw new Error('이미 존재하는 닉네임입니다.');
        }
      },
      {
        asyncCheck: async () => {
          const payload: VolunteerRegisterPayload = {
            nickname: getValues('nickName') || '',
            phone: getValues('contactNumber') || '',
            email: 'sangjun@naver.com' as string
          };
          return await postVolunteerRegister(payload);
        }
      },
      {
        asyncCheck: async () => {
          return true;
        }
      }
    ],
    []
  );

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const handleClick = async () => {
    methods.control._updateValid();
    const stepOnclickFunction = stepsFunction[currentStepIndex].asyncCheck;

    try {
      await stepOnclickFunction();
      return goToNextStep();
    } catch (e) {
      const error = e as Error;
      setError(
        Steps[currentStepIndex].path,
        { type: 'focus', message: error.message },
        { shouldFocus: true }
      );
    }
  };

  const CurrentComponent = Steps[currentStepIndex].component;
  const currentError = errors[Steps[currentStepIndex].path];

  return (
    <div>
      <section className={style.wrapper}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <CurrentComponent />
        </FormProvider>
      </section>
      <Button onClick={handleClick} disabled={Boolean(currentError)}>
        다음
      </Button>
    </div>
  );
}
