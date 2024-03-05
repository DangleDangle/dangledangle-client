import EmphasizedTitle, {
  Line
} from '@/components/common/EmphasizedTitle/EmphasizedTitle';
import { formatPhone } from '@/utils/formatInputs';
import { useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { CurrentComponentProps } from './CurrentComponentTypes';
import * as style from './style.css';
import TextFieldWithForm from '@/components/common/TextField/TextFieldWithForm';

export default function ContactNumber({ formName }: CurrentComponentProps) {
  const { setFocus } = useFormContext();
  useEffect(() => {
    formName && setFocus(formName);
  }, [formName, setFocus]);

  const handlePhoneNumberChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      event.target.value = formatPhone(value);
    },
    []
  );

  return (
    <>
      <div className={style.titleSection}>
        <EmphasizedTitle>
          <Line>연락처를 입력해주세요.</Line>
        </EmphasizedTitle>
      </div>
      <div className={style.InputSection}>
        {formName && (
          <TextFieldWithForm
            name={formName}
            placeholder="연락처를 입력하세요 (- 제외)"
            registerOptions={{ onChange: handlePhoneNumberChange }}
          />
        )}
      </div>
    </>
  );
}
