'use client';
import AnimalCard from '@/components/shelter-edit/AnimalCard/AnimalCard';
import * as styles from './SpecialCareAnimalPanel.css';
import { Body2, H4 } from '@/components/common/Typography';
import useObservationAnimalListAtHome from '@/api/shelter/{shelterId}/useObservationAnimaluseObservationAnimalListAtHome';

interface SpecialCareAnimalPanel {
  shelterId: number;
}
export default function SpecialCareAnimalPanel({
  shelterId
}: SpecialCareAnimalPanel) {
  const { data } = useObservationAnimalListAtHome({ shelterId, page: 1 });

  return (
    <>
      <section className={styles.panelWrapper}>
        <H4>특별 케어 동물 정보</H4>

        {data?.content.length ? (
          data?.content.map(animal => (
            <div key={animal.id}>
              <AnimalCard data={animal} />
            </div>
          ))
        ) : (
          <Body2>특별케어 동물 정보가 없어요😅</Body2>
        )}
      </section>
    </>
  );
}
