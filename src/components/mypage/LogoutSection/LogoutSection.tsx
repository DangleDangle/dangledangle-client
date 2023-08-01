import { Body1, ButtonText2 } from '@/components/common/Typography';
import * as styles from './LogoutSection.css';
import useLogout from '@/api/mypage/useLogout';
import { useRouter } from 'next/navigation';

interface LogoutSectionProps {}

export default function LogoutSection({}: LogoutSectionProps) {
  const { mutate: logout } = useLogout();
  const router = useRouter();
  const handleLogout = async () => logout();
  const moveToUnregister = () => router.push('/unregister');

  return (
    <div className={styles.container}>
      <div className={styles.accountBox}>
        <Body1 color="error" onClick={handleLogout}>
          로그아웃
        </Body1>
      </div>

      <div className={styles.btnWrapper} onClick={moveToUnregister}>
        <ButtonText2 color="gray400" className={styles.btnTxt}>
          회원탈퇴
        </ButtonText2>
      </div>
    </div>
  );
}