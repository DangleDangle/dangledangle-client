'use client';

import useAdminVolunteerEvent from '@/api/shelter/admin/useAdminVolunteerEvent';
import useUpdateVolunteerEvent from '@/api/shelter/admin/useUpdateVolunteerEvent';
import {
  PutVolunteerEventPayload,
  VolunteerEventPayload
} from '@/api/shelter/admin/volunteer-event';
import Button from '@/components/common/Button/Button';
import ChipInput from '@/components/common/ChipInput/ChipInput';
import FixedFooter from '@/components/common/FixedFooter/FixedFooter';
import TextArea from '@/components/common/TextField/TextArea';
import TextField from '@/components/common/TextField/TextField';
import {
  ButtonText1,
  Caption1,
  Caption2
} from '@/components/common/Typography';
import {
  AGE_LIMIT_OPTIONS,
  AgeLimit,
  CATEGORY_OPTIONS,
  ITERATION_CYCLE_OPTIONS,
  IterationCycle,
  VolunteerEventCategory
} from '@/constants/volunteerEvent';
import useHeader from '@/hooks/useHeader';
import { formatDatetimeForServer, getEndOfMonth } from '@/utils/timeConvert';
import yup from '@/utils/yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { BaseSyntheticEvent, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as styles from './styles.css';
import getIterationNotice from './utils/getIterationNotice';
import { getMaxOfIterationEndAt, getMaxOfDateInput } from './utils/getMaxDate';
import useWriteVolunteerEvent from '@/api/shelter/admin/useWriteVolunteerEvent';
import useRouteGuard from '@/hooks/useRouteGuard';

type ChipValues = {
  category: string;
  iterationCycle: string;
  ageLimit: string;
};

type FormValues = {
  title: string;
  description?: string;
  recruitNum: number;
  startAt: Date | string;
  endAt: Date | string;
  iterationEndAt?: Date;
};

const schema: yup.ObjectSchema<FormValues> = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().max(300).optional(),
  recruitNum: yup.number().min(1, '').required(''),
  startAt: yup
    .date()
    .default(() => new Date())
    .transform((value, originValue) => new Date(originValue))
    .required(),
  endAt: yup
    .date()
    .transform((value, originValue) => new Date(originValue))
    .min(yup.ref('startAt'), '종료 시간은 시작 시간보다 앞에 올 수 없습니다.')
    .required(),
  iterationEndAt: yup
    .date()
    .min(
      yup.ref('endAt'),
      '반복주기 종료일은 종료 시간보다 앞에 올 수 없습니다.'
    )
});

export default function ShelterEventEditPage({
  searchParams
}: {
  searchParams: { id: string };
}) {
  const router = useRouter();
  const { setRoutable } = useRouteGuard();

  const eventId = useMemo(
    () =>
      isNaN(Number(searchParams.id)) ? -1 : Number(Number(searchParams.id)),
    [searchParams.id]
  );

  const setHeader = useHeader({});

  const { data: initialData, isFetching } = useAdminVolunteerEvent(eventId, {
    enabled: eventId !== -1
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    resetField,
    setValue,
    formState: { errors, isDirty }
  } = useForm<FormValues>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema)
  });
  const startAt = watch('startAt');
  const endAt = watch('endAt');
  const [chipInput, setChipInput] = useState<ChipValues>({
    category: CATEGORY_OPTIONS[0].value,
    iterationCycle: ITERATION_CYCLE_OPTIONS[0].value,
    ageLimit: AGE_LIMIT_OPTIONS[0].value
  });

  useEffect(() => {
    if (!initialData) {
      setHeader(prev => ({ ...prev, title: '봉사 일정 만들기' }));
      return;
    }
    setHeader(prev => ({ ...prev, title: '봉사 일정 수정하기' }));
    const initialForm: FormValues = {
      title: initialData.title,
      description: initialData.description,
      recruitNum: initialData.recruitNum,
      startAt: initialData.startAt,
      endAt: initialData.endAt,
      iterationEndAt: undefined
    };

    const initalChipInputs: ChipValues = {
      ageLimit: initialData.ageLimit,
      category: initialData.category,
      iterationCycle: ITERATION_CYCLE_OPTIONS[0].value
    };

    reset(initialForm);
    setChipInput(initalChipInputs);
  }, [initialData, reset, setHeader]);

  const minStartAt = useMemo(
    () =>
      formatDatetimeForServer(
        moment().set({ minutes: 0, second: 0 }),
        'DATETIME'
      ),
    []
  );
  const minEndAt = useMemo(
    () =>
      formatDatetimeForServer(
        moment(startAt).set({ minutes: 0, second: 0 }),
        'DATETIME'
      ),
    [startAt]
  );
  const minIterationEndAt = useMemo(
    () => formatDatetimeForServer(moment(endAt).add(1, 'day'), 'DATE'),
    [endAt]
  );

  const handleChangeDate = (e: BaseSyntheticEvent) => {
    if (e.target.name === 'startAt') {
      const startAt = moment(e.target.value);
      setValue(
        'endAt',
        formatDatetimeForServer(startAt.add(1, 'hour').toDate(), 'DATETIME')
      );
    }

    trigger(['startAt', 'endAt']);
  };

  useEffect(() => {
    let iterationEndAt = getEndOfMonth(endAt);
    if (!iterationEndAt) return;
    if (moment(endAt).date() === iterationEndAt.date()) {
      iterationEndAt = getEndOfMonth(iterationEndAt.add(1, 'd'));
    }
    setValue(
      'iterationEndAt',
      formatDatetimeForServer(iterationEndAt.toDate(), 'DATE') as any
    );
    trigger(['iterationEndAt']);
  }, [endAt, setValue, trigger]);

  const handleChipInput = (name: string, value: string) => {
    setChipInput({ ...chipInput, [name]: value });
  };

  const iterationNotice = useMemo(() => {
    if (!startAt) return '';
    return getIterationNotice(
      new Date(startAt),
      chipInput.iterationCycle as IterationCycle
    );
  }, [startAt, chipInput.iterationCycle]);

  useEffect(() => {
    if (chipInput.iterationCycle) {
      trigger('iterationEndAt');
    }
  }, [chipInput.iterationCycle, resetField, trigger]);

  const getPostPayload = (values: FormValues) => {
    const iteration =
      chipInput.iterationCycle && values.iterationEndAt
        ? {
            iterationEndAt: formatDatetimeForServer(
              values.iterationEndAt,
              'DATE'
            ),
            iterationCycle: chipInput.iterationCycle as IterationCycle
          }
        : null;

    const payload: VolunteerEventPayload = {
      title: values.title,
      description: values.description || '',
      category: chipInput.category as VolunteerEventCategory,
      startAt: formatDatetimeForServer(values.startAt, 'DATETIME'),
      endAt: formatDatetimeForServer(values.endAt, 'DATETIME'),
      recruitNum: values.recruitNum,
      ageLimit: chipInput.ageLimit as AgeLimit,
      iteration
    };
    return payload;
  };
  const getPutPayload = (values: FormValues) => {
    if (!initialData) throw Error(`initialData is ${initialData}`);

    const payload: PutVolunteerEventPayload = {
      ...getPostPayload(values),
      status: initialData.eventStatus
    };

    return payload;
  };

  const { mutateAsync: putEvent } = useUpdateVolunteerEvent();
  const { mutateAsync: postEvent } = useWriteVolunteerEvent();

  const onSubmit = async (values: FormValues) => {
    setRoutable(true);
    if (initialData) {
      const payload = getPutPayload(values);
      await putEvent({ eventId, ...payload });
    } else {
      const payload = getPostPayload(values);
      await postEvent(payload);
    }
    router.back();
  };

  if (isFetching) return <div></div>;
  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Caption1
          className={styles.label}
          element={'label'}
          htmlFor="cateogry"
          color="gray600"
        >
          카테고리
        </Caption1>
        <ChipInput
          name="category"
          value={chipInput.category}
          options={CATEGORY_OPTIONS}
          onChange={handleChipInput}
        />
      </div>
      <TextField
        label="일정 제목"
        placeholder="일정 제목을 입력해주세요"
        required
        {...register('title')}
        error={errors.title}
      />
      <TextArea
        label="일정 소개"
        placeholder="봉사 일정에 대한 설명을 작성해주세요."
        {...register('description')}
        error={errors.description}
        defaultValue={watch('description')}
        height="128px"
        maxLength={300}
      />
      <TextField
        label="시작 날짜와 시간"
        type="datetime-local"
        required
        min={minStartAt}
        max={getMaxOfDateInput()}
        {...register('startAt', {
          valueAsDate: true,
          onChange: handleChangeDate
        })}
        error={errors.startAt}
      />
      <TextField
        label="종료 날짜와 시간"
        type="datetime-local"
        required
        min={minEndAt}
        max={getMaxOfDateInput()}
        {...register('endAt', {
          valueAsDate: true,
          onChange: handleChangeDate
        })}
        error={errors.endAt}
      />
      <div>
        <Caption1
          className={styles.label}
          element={'label'}
          htmlFor="iterationCycle"
          color="gray600"
        >
          반복주기
        </Caption1>
        {iterationNotice && (
          <Caption2 className={styles.iterationNotice} color="primary300">
            {iterationNotice}
          </Caption2>
        )}
        <ChipInput
          name="iterationCycle"
          value={chipInput.iterationCycle}
          options={ITERATION_CYCLE_OPTIONS}
          onChange={handleChipInput}
        />
      </div>
      {chipInput.iterationCycle && (
        <TextField
          label="반복 주기 종료일"
          type="date"
          min={minIterationEndAt}
          max={getMaxOfIterationEndAt()}
          {...register('iterationEndAt', { onChange: handleChangeDate })}
          error={errors.iterationEndAt}
        />
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <TextField
          label="참가 정원"
          type="number"
          placeholder="ex) 10"
          pattern="[0-9]+"
          min={0}
          width="60px"
          required
          useClearButton={false}
          {...register('recruitNum', {
            setValueAs: value => Number(value),
            min: 0
          })}
          error={errors.recruitNum}
        />
        <ButtonText1 style={{ marginTop: 20 }}>명</ButtonText1>
      </div>

      <div>
        <Caption1
          className={styles.label}
          element={'label'}
          htmlFor="ageLimit"
          color="gray600"
        >
          연령 조건
        </Caption1>
        <ChipInput
          name="ageLimit"
          value={chipInput.ageLimit}
          options={AGE_LIMIT_OPTIONS}
          onChange={handleChipInput}
        />
      </div>

      <FixedFooter>
        <Button
          disabled={(!initialData && !isDirty) || !isEmpty(errors)}
          itemType="submit"
        >
          {initialData ? '일정 수정하기' : '일정 만들기'}
        </Button>
      </FixedFooter>
    </form>
  );
}
