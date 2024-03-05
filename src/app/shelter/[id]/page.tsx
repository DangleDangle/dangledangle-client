import ContainerWithStickyHeader from '@/components/common/ContainerWithStickyHeader/ContainerWithStickyHeader';
import { get } from '@/api/shelter/{shelterId}';
import ShelterProfile from '@/components/shelter/ShelterProfile/ShelterProfile';
import Description from '@/components/shelter/ShelterProfile/Description/Description';
import ShelterHomeTabs from '@/components/shelter/tab/ShelterHomeTabs/ShelterHomeTabs';
import { QueryClient } from '@tanstack/query-core';
import { shelterKey } from '@/api/queryKey';

export default async function ShelterMainPage({
  params
}: {
  params: { id: string };
}) {
  const shelterId = Number(params.id);
  if (typeof shelterId !== 'number') {
    throw Error('잘못된 접근, 에러페이지로 이동');
  }

  const shelterHomeInfo = await get(shelterId);
  const queryClient = new QueryClient();
  queryClient.setQueryData(shelterKey.homeInfo(), shelterHomeInfo);

  return (
    <>
      <ContainerWithStickyHeader headerProps={{ title: shelterHomeInfo.name }}>
        <ShelterProfile
          shelterId={shelterId}
          name={shelterHomeInfo.name}
          profileImageUrl={shelterHomeInfo.profileImageUrl}
          bookMarked={shelterHomeInfo.bookMarked}
        />
        <Description
          shelterId={shelterId}
          description={shelterHomeInfo.description}
        />
      </ContainerWithStickyHeader>

      <ShelterHomeTabs shelterId={shelterId} />
    </>
  );
}
