import Button from '@/components/common/Button/Button';
import EmphasizedTitle, {
  Line
} from '@/components/common/EmphasizedTitle/EmphasizedTitle';
import Message from '@/components/common/TextField/Message/Message';
import TextField from '@/components/common/TextField/TextField';
import { useFormContext } from 'react-hook-form';
import { OnNextProps } from '../page';
import * as styles from './../styles.css';

export default function SpecificAddress({ onNext }: OnNextProps) {
  const {
    register,
    formState: { errors },
    watch
  } = useFormContext();
  const addressValue = watch('address[addressDetail]');

  return (
    <>
      <div className={styles.titleWrapper} style={{ marginBottom: '109px' }}>
        <EmphasizedTitle>
          <Line>상세 주소를 입력해주세요.</Line>
        </EmphasizedTitle>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', rowGap: '20px' }}>
        <TextField
          placeholder="우편번호를 입력해주세요."
          {...register('address[postalCode]')}
        />
        <TextField
          placeholder="보호소 주소을 입력해주세요."
          {...register('address[address]')}
        />
        <div>
          <TextField
            placeholder="상세 주소를 입력하세요"
            {...register('address[addressDetail]')}
          />
          <Message
            status="error"
            message={(errors.address as any)?.addressDetail?.message}
          />
        </div>
      </div>

      {/* longitude x축 경도 latitude y축 위도 */}
      <input style={{ display: 'none' }} {...register('address[longitude]')} />
      <input style={{ display: 'none' }} {...register('address[latitude]')} />

      <Button
        disabled={
          Boolean((errors.address as any)?.addressDetail) ||
          !addressValue?.trim()
        }
        onClick={onNext}
        style={{ marginTop: '40px' }}
      >
        다음
      </Button>
    </>
  );
}
