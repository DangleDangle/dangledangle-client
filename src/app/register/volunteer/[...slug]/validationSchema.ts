import * as Yup from 'yup';
import {
  FORM_CONTACT_NUMBER,
  FORM_NICKNAME,
  RegisterFormValues
} from './CurrentComponentTypes';
import { phoneRegex, removeDash } from '@/utils/formatInputs';
import yup from '@/utils/yup';

export const validation: Yup.ObjectSchema<{
  [K in RegisterFormValues]: any;
}> = yup.object().shape({
  [FORM_NICKNAME]: yup
    .string()
    .max(10)
    .required('닉네임을 한글자 이상 입력해주세요.')
    .test(
      'no-emoji',
      '이모티콘은 사용할 수 없습니다',
      (value = '') =>
        !/(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu.test(value)
    ),
  [FORM_CONTACT_NUMBER]: yup
    .string()
    .required()
    .matches(phoneRegex, '숫자만 입력해주세요')
    .test(
      'phone-format-validation',
      '전화번호 형식이 올바르지 않습니다',
      value => {
        let val = removeDash(value || '');
        if (!val || (val && val.length <= 3)) {
          return true;
        }

        const result = val.slice(0, 2);
        const phone = val.slice(2);

        if (result === '02' && (phone.length === 7 || phone.length <= 8)) {
          return true;
        } else if (
          phone.length === 7 ||
          phone.length === 8 ||
          phone.length === 9
        ) {
          return true;
        } else {
          return false;
        }
      }
    )
});
