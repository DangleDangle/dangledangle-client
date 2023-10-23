import {
  UseMutationOptions,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import { PostResponse, VolunteerEventPayload, post } from './volunteer-event';

export default function useWriteVolunteerEvent(
  options?: UseMutationOptions<PostResponse, unknown, VolunteerEventPayload>
) {
  const queryClient = useQueryClient();
  return useMutation<PostResponse, unknown, VolunteerEventPayload>(
    payload => post(payload),
    {
      onSuccess: (data, variables, context) => {
        options?.onSuccess && options.onSuccess(data, variables, context);
        return queryClient.invalidateQueries();
      },
      ...options
    }
  );
}
