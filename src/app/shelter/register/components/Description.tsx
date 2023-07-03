import Button from '@/components/common/Button/Button';
import EmphasizedTitle, {
  Line
} from '@/components/common/EmphasizedTitle/EmphasizedTitle';
import TextArea from '@/components/common/TextField/TextArea';
import useHeader from '@/hooks/useHeader';
import { FieldValues, SubmitHandler, useFormContext } from 'react-hook-form';
import { OnNextProps } from '../page';
import * as styles from './../styles.css';

export default function Description({ onSubmit }: OnNextProps) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch
  } = useFormContext();
  const descriptionValue = watch('description');

  const setHeader = useHeader({
    thisPage: 4,
    entirePage: 4
  });

  return (
    <>
      <div className={styles.titleWrapper} style={{ marginBottom: '64px' }}>
        <EmphasizedTitle>
          <Line>거의 다 됐어요!</Line>
          <Line>보호소를 소개해주세요 🙌</Line>
        </EmphasizedTitle>
      </div>

      <TextArea
        maxLength={300}
        height={'128px'}
        placeholder="보호소 소개 문구를 300자 내로 작성해주세요."
        {...register('description')}
        error={errors.description}
      />

      <Button
        disabled={Boolean(errors.description) || !descriptionValue?.trim()}
        onClick={handleSubmit(onSubmit as SubmitHandler<FieldValues>)}
        style={{ marginTop: '40px' }}
      >
        저장하기
      </Button>
    </>
  );
}
