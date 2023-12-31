'use client';
import AnimalCard from '@/components/shelter-edit/AnimalCard/AnimalCard';
import * as styles from './SpecialCareAnimalTab.css';
import { Body3, H4 } from '@/components/common/Typography';
import useObservationAnimalListAtHome from '@/api/shelter/{shelterId}/useObservationAnimalList';

interface SpecialCareAnimalTabProps {
  shelterId: number;
}
export default function SpecialCareAnimalTab({
  shelterId
}: SpecialCareAnimalTabProps) {
  const { data } = useObservationAnimalListAtHome({ shelterId, page: 0 });

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
          <Body3 color="gray600">특별케어 동물 정보가 없어요😅</Body3>
        )}
      </section>
    </>
  );
}
