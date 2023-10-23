import { useMutation, useQueryClient } from '@tanstack/react-query';
import useShelterHomeInfo from './useShelterHomeInfo';
import { post } from './bookmark';
import { useRouter } from 'next/navigation';

export default function useBookMarkMutation(
  shelterId: number,
  onSuccessCallback: (bookMarkState: boolean) => void
) {
  const queryClient = useQueryClient();

  const { refetch } = useShelterHomeInfo(shelterId);
  const router = useRouter();
  const mutate = useMutation(post, {
    onSuccess: data => {
      refetch();
      onSuccessCallback(data.bookMarked!);
      return queryClient.invalidateQueries();
    },
    onError: () => {
      router.replace('/login/volunteer');
    }
  });

  return mutate;
}
