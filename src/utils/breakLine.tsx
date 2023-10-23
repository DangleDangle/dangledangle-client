import { Fragment } from 'react';

/**
 *
 * @param str
 * @returns str에 \n을 <br/> 태그로 대치하여 렌더링한다.
 */
export default function breakLine(str: string) {
  const sentences = str.trim().split('\n');

  return (
    <>
      {sentences.map((value, idx) => {
        return (
          <Fragment key={idx}>
            {value}
            {idx !== sentences.length - 1 && <br />}
          </Fragment>
        );
      })}
    </>
  );
}
