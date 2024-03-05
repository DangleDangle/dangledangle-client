'use client';
import AnimalCard from '@/components/shelter-edit/AnimalCard/AnimalCard';
import * as styles from './SpecialCareAnimalTab.css';
import { Body3, H4 } from '@/components/common/Typography';
import useObservationAnimalListAtHome from '@/api/shelter/{shelterId}/useObservationAnimalList';
import { useEffect, useMemo } from 'react';
import { ObservationAnimal } from '@/types/shelter';
import { useScroll } from '@/hooks/useScroll';

interface SpecialCareAnimalTabProps {
  shelterId: number;
}
export default function SpecialCareAnimalTab({
  shelterId
}: SpecialCareAnimalTabProps) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useObservationAnimalListAtHome(
      { shelterId },
      {
        enabled: Boolean(shelterId)
      }
    );
  const animalLists = useMemo(() => {
    return data?.pages.reduce((acc: ObservationAnimal[], page) => {
      return [...acc, ...page.content];
    }, []);
  }, [data?.pages]);

  const isNearBottom = useScroll(100, isFetchingNextPage);

  useEffect(() => {
    if (isNearBottom && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isNearBottom, fetchNextPage]);

  return (
    <>
      <section className={styles.panelWrapper}>
        <H4>특별 케어 동물 정보</H4>

        {animalLists && animalLists.length ? (
          animalLists.map(animal => (
            <div key={animal.id}>
              <AnimalCard data={animal} />
            </div>
          ))
        ) : (
          <Body3 color="gray600">특별케어 동물 정보가 없어요😅</Body3>
        )}
      </section>
    </>
  );
}
