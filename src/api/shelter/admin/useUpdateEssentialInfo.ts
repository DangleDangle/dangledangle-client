import {
  UseMutationOptions,
  useQueryClient,
  useMutation
} from '@tanstack/react-query';
import {
  PutResponse,
  ShelterEssentialInfoPayload,
  put
} from './essential-info';
import { shelterKey } from '@/api/queryKey';

export type UpdateEssentialInfoParams = {
  payload: ShelterEssentialInfoPayload;
};
export default function useUpdateEssentialInfo(
  options?: UseMutationOptions<PutResponse, unknown, UpdateEssentialInfoParams>
) {
  const queryClient = useQueryClient();
  return useMutation<PutResponse, unknown, UpdateEssentialInfoParams>(
    ({ payload }) => put(payload),
    {
      onSuccess: (data, variables, context) => {
        console.log('invalidate');
        options?.onSuccess && options.onSuccess(data, variables, context);
        queryClient.invalidateQueries(shelterKey.info());
      },
      ...options
    }
  );
}
