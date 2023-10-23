import {
  UseMutationOptions,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import { PutResponse, PutVolunteerEventPayload, put } from './volunteer-event';

export interface PutEventPayload extends PutVolunteerEventPayload {
  eventId: number;
}

export default function useUpdateVolunteerEvent(
  options?: UseMutationOptions<PutResponse, unknown, PutEventPayload>
) {
  const queryClient = useQueryClient();
  return useMutation<PutResponse, unknown, PutEventPayload>(
    ({ eventId, ...payload }) => put(eventId, payload),
    {
      onSuccess: (data, variables, context) => {
        options?.onSuccess && options.onSuccess(data, variables, context);
        return queryClient.invalidateQueries();
      },
      ...options
    }
  );
}
