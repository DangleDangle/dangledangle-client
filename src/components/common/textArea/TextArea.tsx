'use client';

import useTextFieldStatus, {
  TextFieldStatus
} from '@/components/TextField/hooks/useTextFieldStatus';
import getInitializedRef from '@/components/TextField/utils/getInitializedRef';
import { getStringOfValueLengthPerMax } from '@/components/TextField/utils/getStringOfValueLengthPerMax';
import useForwardRef from '@/utils/useForwardRef';
import React, {
  ChangeEventHandler,
  FocusEventHandler,
  ForwardedRef,
  useEffect,
  useRef
} from 'react';
import { variants } from '../typography/Typography.css';
import * as style from './TextArea.css';
import clsx from 'clsx';
import useValidation from '@/components/TextField/hooks/useValidation';
import { assignInlineVars } from '@vanilla-extract/dynamic';

interface TextAreaProps {
  name: string;
  max: number | string;
  fixHeight?: string;
  type?: 'text' | 'password';
  size?: 'big' | 'small';
  label?: string;
  placeholder?: string;
  message?: string;
  defaultValue?: string;
  status?: TextFieldStatus;
  // eslint-disable-next-line no-unused-vars
  errorCallback?: ({ name }: { name: string }) => void;
  // eslint-disable-next-line no-unused-vars
  onChange?: (e: React.SyntheticEvent) => void;
  // eslint-disable-next-line no-unused-vars
  onBlur?: (e: React.SyntheticEvent) => void;
}
const TextArea = React.forwardRef(function TextArea(
  {
    name,
    size = 'small',
    label,
    max: recievedMax,
    fixHeight,
    placeholder,
    message: receivedMessage = '',
    status: receivedStatus = 'default',
    defaultValue: receivedDefaultValue = '',
    errorCallback = () => {},
    onChange = () => {},
    onBlur = () => {}
  }: TextAreaProps,
  ref: ForwardedRef<HTMLTextAreaElement>
) {
  if (!ref) throw Error(`${name}에 ref를 추가해주세요`);

  /**  */
  const max = Number(recievedMax);

  /** state */
  const { status, message, updateTextFieldState, updateStatusFromInputValue } =
    useTextFieldStatus({ status: receivedStatus, message: receivedMessage });

  const { validate } = useValidation({ max });
  /** ref */
  const lengthCountRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useForwardRef<HTMLTextAreaElement>(ref);

  useEffect(() => {
    const textAreaElem = getInitializedRef(textAreaRef);
    textAreaElem.value = receivedDefaultValue;
    const lengthCountElem = getInitializedRef(lengthCountRef);
    lengthCountElem.innerText = getStringOfValueLengthPerMax(
      receivedDefaultValue,
      max
    );
  }, [receivedDefaultValue]);

  useEffect(() => {
    if (status === 'error') {
      errorCallback({ name });
    }
  }, [status]);

  const handleBlur: FocusEventHandler<HTMLTextAreaElement> = e => {
    const textAreaElem = getInitializedRef(textAreaRef);

    if (textAreaElem.value.length <= 0)
      textAreaElem.placeholder = placeholder || '';

    onBlur(e);
    updateStatusFromInputValue(textAreaElem.value);
  };

  const handleFocus: FocusEventHandler<HTMLTextAreaElement> = () => {
    const textAreaElem = getInitializedRef(textAreaRef);

    if (textAreaElem.value === '') textAreaElem.placeholder = '';

    updateStatusFromInputValue(textAreaElem.value);
  };

  const handleTextChange: ChangeEventHandler<HTMLTextAreaElement> = async e => {
    const textAreaElem = getInitializedRef(textAreaRef);
    const lengthCountElem = getInitializedRef(lengthCountRef);

    lengthCountElem.innerText = getStringOfValueLengthPerMax(
      textAreaElem.value,
      max
    );

    onChange(e);
    const valdationResult = await validate(textAreaElem.value);

    if (valdationResult.result === true) return updateTextFieldState('active');
    if (valdationResult.type === 'max') {
      return updateTextFieldState('error', '글자수를 초과했습니다.');
    }
  };

  return (
    <div
      style={assignInlineVars({ [style.textAreaHeight]: fixHeight || '100%' })}
      className={clsx([style.wrapper({ status })])}
    >
      <label className={clsx([variants.caption1, style.label])}>{label}</label>
      <textarea
        name={name}
        className={clsx(style.textarea({ size }))}
        placeholder={placeholder}
        onChange={handleTextChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        ref={textAreaRef}
        defaultValue={receivedDefaultValue}
      />
      <div className={style.messageCountContainer}>
        <Message status={status} message={message} />
        <Count max={max} ref={lengthCountRef} />
      </div>
    </div>
  );
});

export default TextArea;

/**
 * 글자 수 카운트하는 컴포넌트
 */
const Count = React.forwardRef(function Count(
  { max }: { max?: number | string },
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <>
      <div
        ref={ref}
        className={clsx({
          [variants.body3]: true,
          [style.count]: Boolean(max)
        })}
      >
        {max && `0/${max}`}
      </div>
    </>
  );
});

/**
 * 입력 문구 안내 메시지, loading, 오류 메시지 보여주는 컴포넌트
 */
const Message = ({
  status,
  message
}: {
  status: TextFieldStatus;
  message?: string;
}) => {
  return (
    <>
      <p className={clsx([style.message, variants.caption2])}>
        {status === 'loading' ? 'loading' : `${message}`}
      </p>
    </>
  );
};
