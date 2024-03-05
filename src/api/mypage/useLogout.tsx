import { useAuthContext } from '@/providers/AuthContext';
import { useMutation } from '@tanstack/react-query';
import useToast from '@/hooks/useToast';
import { fe } from '../instance';
import { STORAGE_KEY_HOME_CALENDAR_FILTER_INPUT } from '@/constants/localStorageKeys';

export default function useLogout() {
  const { logout: clientLogout } = useAuthContext();
  const toastOn = useToast();

  const logoutAPI = async () => {
    const response = await fe
      .get('auth/logout')
      .then(res => res.json<string>());
    return response;
  };

  return useMutation<string, Error>(logoutAPI, {
    onSuccess: response => {
      clientLogout();
      location.href = '/login';
      localStorage.removeItem(STORAGE_KEY_HOME_CALENDAR_FILTER_INPUT);
      toastOn('로그아웃이 완료되었습니다.');
    },
    onError: error => {
      console.error('Logout error:', error);
    }
  });
}
