import EmphasizedTitle, {
  Line
} from '@/components/common/EmphasizedTitle/EmphasizedTitle';
import * as style from './style.css';
import TextFieldWithForm from '@/components/common/TextField/TextFieldWithForm';
import { CurrentComponentProps } from './CurrentComponentTypes';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

export default function NickName({ formName }: CurrentComponentProps) {
  const { setFocus } = useFormContext();
  useEffect(() => {
    formName && setFocus(formName);
  }, []);
  return (
    <>
      <div className={style.titleSection}>
        <EmphasizedTitle>
          <Line>안녕하세요!</Line>
          <Line>어떻게 불러드리면 될까요?</Line>
        </EmphasizedTitle>
      </div>
      <div className={style.InputSection}>
        {formName && (
          <TextFieldWithForm
            name={formName}
            helper={'10자 이내 국문/영문/숫자/특수문자 가능 (이모지 불가)'}
            placeholder={'사용하실 닉네임을 입력해주세요'}
            maxLength={10}
          />
        )}
      </div>
    </>
  );
}
