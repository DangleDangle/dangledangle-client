'use client';
import React, { useMemo } from 'react';
import * as styles from './Description.css';
import { Body3 } from '@/components/common/Typography';
import useBooleanState from '@/hooks/useBooleanState';
import useShelterHomeInfo from '@/api/shelter/{shelterId}/useShelterHomeInfo';
import breakLine from '@/utils/breakLine';

interface DescriptionProps {
  shelterId: number;
  description: string;
  summaryLength?: number;
}

const SUMMARY_LENGTH_DEFAULT = 50;
const SUMMARY_LINES_DEFAULT = 2;

export default function Description({
  shelterId,
  description,
  summaryLength = SUMMARY_LENGTH_DEFAULT
}: DescriptionProps) {
  const [isExpanded, , , toggleExpaneded] = useBooleanState(false);
  const query = useShelterHomeInfo(shelterId);

  const freshDescription = useMemo(
    () => query.data?.description || description,
    [description, query.data?.description]
  );

  const isLongDescription = useMemo(
    () =>
      freshDescription.length > summaryLength ||
      freshDescription.split('\n').length > SUMMARY_LINES_DEFAULT,
    [freshDescription, summaryLength]
  );

  const handleClick = () => {
    toggleExpaneded();
  };

  return (
    <>
      <div className={styles.wrapper}>
        <Body3 className={styles.description({ expanded: isExpanded })}>
          {isLongDescription && !isExpanded
            ? `${freshDescription.slice(0, 50)}...`
            : breakLine(freshDescription)}
        </Body3>
        {isLongDescription && (
          <Body3 className={styles.moreButton} onClick={handleClick}>
            {isExpanded ? '접기' : '더보기'}
          </Body3>
        )}
      </div>
    </>
  );
}
