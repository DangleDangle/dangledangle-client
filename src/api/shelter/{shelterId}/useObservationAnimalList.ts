import {
  UseInfiniteQueryOptions,
  useInfiniteQuery
} from '@tanstack/react-query';
import { ObservationAnimalInfo, get } from './observation-animal';
import { shelterKey } from '../../queryKey';

export default function useObservationAnimalListAtHome(
  {
    shelterId
  }: {
    shelterId: number;
  },
  options?: UseInfiniteQueryOptions<ObservationAnimalInfo>
) {
  return useInfiniteQuery<ObservationAnimalInfo>(
    shelterKey.animalList(shelterId),
    ({ pageParam = 0 }) => get({ shelterId, page: pageParam }),
    {
      getNextPageParam: lastPage => {
        if (lastPage.content.length === 0) {
          return false;
        }
        return lastPage.pageNumber + 1;
      },
      ...options
    }
  );
}
