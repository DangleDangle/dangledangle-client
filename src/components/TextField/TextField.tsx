'use client';
import React, {
  ForwardedRef,
  ChangeEventHandler,
  MouseEventHandler,
  useRef,
  FocusEventHandler,
  useMemo,
  useEffect
} from 'react';
import * as style from './TextField.css';
import useValidation, { ValidationArgs } from './hooks/useValidation';
import { variants } from '../common/typography/Typography.css';
import clsx from 'clsx';
import useTextFieldStatus, {
  TextFieldStatus
} from './hooks/useTextFieldStatus';
import getInitializedRef from './utils/getInitializedRef';
import { getStringOfValueLengthPerMax } from './utils/getStringOfValueLengthPerMax';
import { TextFieldRemoveIcon } from '@/asset/icons';
import useForwardRef from '@/utils/useForwardRef';

/**
 * props 타입, status 타입 정의
 */
interface TextFieldProps {
  name: string;
  type?: 'text' | 'password';
  size?: 'big' | 'small';
  label?: string;
  placeholder?: string;
  validation?: ValidationArgs;
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

/**
 * TextField 컴포넌트
 */
const TextField = React.forwardRef(function TextField(
  {
    name,
    type = 'text',
    size = 'small',
    label,
    placeholder,
    validation,
    message: receivedMessage = '',
    status: receivedStatus = 'default',
    defaultValue: receivedDefaultValue = '',
    errorCallback = () => {},
    onChange = () => {},
    onBlur = () => {}
  }: TextFieldProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  //forwardRef로 받는 경우, ref 전달 여부를 체크를 해주지 않아서 throw 하도록 추가,
  if (!ref) throw Error(`${name}에 ref를 추가해주세요`);

  /** state */
  const { status, message, updateTextFieldState, updateStatusFromInputValue } =
    useTextFieldStatus({ status: receivedStatus, message: receivedMessage });

  /** hook */
  const { validate } = useValidation(validation);

  useEffect(() => {
    if (status === 'error') {
      errorCallback({ name });
    }
  }, [status]);

  useEffect(() => {
    const inputElem = getInitializedRef(inputRef);
    inputElem.value = receivedDefaultValue;
    const lengthCountElem = getInitializedRef(lengthCountRef);
    lengthCountElem.innerText = getStringOfValueLengthPerMax(
      receivedDefaultValue,
      max
    );
  }, [receivedDefaultValue]);

  /** ref */
  const lengthCountRef = useRef<HTMLDivElement>(null);
  const inputRef = useMemo<{ current: HTMLInputElement | null }>(
    (current = null) => ({ current }),
    []
  );

  /** rename variable */
  const max = validation?.max;

  /** event handler */
  const handleRemoveClick: MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();
    e.stopPropagation();

    const inputElem = getInitializedRef(inputRef);
    const lengthCountElem = getInitializedRef(lengthCountRef);

    inputElem.placeholder = placeholder || '';
    inputElem.value = '';
    lengthCountElem.innerText = getStringOfValueLengthPerMax('', max);
    onChange(e);
    updateTextFieldState('default');
  };

  const handleBlur: FocusEventHandler<HTMLInputElement> = e => {
    const inputElem = getInitializedRef(inputRef);

    if (inputElem.value.length <= 0) inputElem.placeholder = placeholder || '';

    onBlur(e);
    updateStatusFromInputValue(inputElem.value);
  };

  const handleFocus: FocusEventHandler<HTMLInputElement> = () => {
    const inputElem = getInitializedRef(inputRef);

    if (inputElem.value === '') inputElem.placeholder = '';

    updateStatusFromInputValue(inputElem.value);
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = async e => {
    const inputElem = getInitializedRef(inputRef);
    const lengthCountElem = getInitializedRef(lengthCountRef);

    lengthCountElem.innerText = getStringOfValueLengthPerMax(
      inputElem.value,
      max
    );

    onChange(e);
    const valdationResult = await validate(inputElem.value);

    if (valdationResult.result === true) return updateTextFieldState('active');
    if (valdationResult.type === 'max')
      return updateTextFieldState('error', '글자수를 초과했습니다.');
    if (valdationResult.type === 'email')
      return updateTextFieldState('error', '이메일 형식이 아닙니다.');
  };

  return (
    <div
      className={clsx([style.inputTypeRecipe({ status }), style.wrapper])}
      arial-lable="text"
    >
      <label className={clsx([style.label, variants.caption1])}>{label}</label>
      <div className={style.inputContainer}>
        <input
          name={name}
          type={type}
          className={style.input({ size })}
          placeholder={placeholder}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          ref={node => {
            inputRef.current = node; // TextField 내부의 inputRef 사용
            if (typeof ref === 'function') ref(node); // RefCallback이 오는 경우 적용
          }}
        />
        <RemoveButton
          onClick={handleRemoveClick}
          inputRef={inputRef}
          status={status}
        />
        <Count max={max} ref={lengthCountRef} />
        <div className={style.underbar} />
      </div>
      <Message status={status} message={message} />
    </div>
  );
});
export default TextField;

/**
 *
 */
const RemoveButton = ({
  onClick,
  inputRef
}: {
  onClick: MouseEventHandler<HTMLButtonElement>;
  inputRef: { current: HTMLInputElement | null };
  status: TextFieldStatus;
}) => {
  const checkIsOnOff = () =>
    inputRef.current && inputRef.current.value.length && status !== 'default'
      ? 'on'
      : 'off';

  return (
    <button onClick={onClick}>
      <TextFieldRemoveIcon
        className={clsx([style.icon({ status: checkIsOnOff() })])}
      />
    </button>
  );
};

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
        className={`${max && clsx([style.count, variants.body3])}`}
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
      {status === 'loading' ? (
        <p>loading</p>
      ) : (
        <p className={clsx([style.message, variants.caption2])}>{message}</p>
      )}
    </>
  );
};
