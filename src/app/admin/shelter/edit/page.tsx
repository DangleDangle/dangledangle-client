'use client';
import ImageUploader from '@/components/common/ImageUploader/ImageUploader';
import { useCallback, useEffect, useMemo, useState } from 'react';
import EditMenu from '@/components/shelter-edit/EditMenu/EditMenu';
import Badge from '@/components/common/Badge/Badge';
import Divider from '@/components/common/Divider/Divider';
import { H4 } from '@/components/common/Typography';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button/Button';
import AnimalCard from '@/components/shelter-edit/AnimalCard/AnimalCard';
import * as styles from './styles.css';
import AnimalFormDialog from '@/components/shelter-edit/AnimalFormDialog/AnimalFormDialog';
import useBooleanState from '@/hooks/useBooleanState';
import useDialog from '@/hooks/useDialog';
import useToast from '@/hooks/useToast';
import useDeleteObservationAnimal from '@/api/shelter/admin/useDeleteObservationAnimal';
import useShelterInfo from '@/api/shelter/admin/useShelterInfo';
import { OUT_LINK_TYPE } from '@/constants/shelter';
import useImageUploader from '@/hooks/useImageUploader';
import useUpdateImage from '@/api/shelter/admin/useUpdateImage';
import useHeader from '@/hooks/useHeader';
import { ObservationAnimal, ShelterInfo } from '@/types/shelter';
import FixedFooter from '@/components/common/FixedFooter/FixedFooter';
import RegisterComplete from '@/app/register/shelter/[...slug]/RegisterComplete';
import useObservationAnimalListAtHome from '@/api/shelter/{shelterId}/useObservationAnimalList';

export default function ShelterEditPage() {
  useHeader({ title: '보호소 정보' });
  const { onChangeImage, isUploading, uploadError } = useImageUploader();
  const [postError, setPostError] = useState<boolean>(false);
  const router = useRouter();

  const [isOpened, openDialog, closeDialog] = useBooleanState(false);
  const { dialogOn, dialogOff, setDialogLoading } = useDialog();
  const toastOn = useToast();
  const [targetAnimal, setTargetAnimal] = useState<ObservationAnimal>();
  const [registerCompleted, setRegisterCompleted] = useState<Boolean>(false);

  const shelterQuery = useShelterInfo();
  const { data, fetchNextPage, hasNextPage, isSuccess } =
    useObservationAnimalListAtHome(
      { shelterId: shelterQuery.data?.id || -1 },
      { enabled: Boolean(shelterQuery.data?.id) }
    );
  const animalLists = useMemo(() => {
    return data?.pages.reduce((acc: ObservationAnimal[], page) => {
      return [...acc, ...page.content];
    }, []);
  }, [data?.pages]);

  useEffect(() => {
    if (hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage]);

  const { mutateAsync: deleteAnimal } = useDeleteObservationAnimal();
  const { mutateAsync: updateImage } = useUpdateImage();

  const handleChangeImage = (fileData?: File) => {
    onChangeImage(fileData, async url => {
      try {
        if (!url) throw Error();
        await updateImage(url);
      } catch {
        setPostError(true);
        shelterQuery.refetch();
      }
    });
  };

  const handleClickDeleteAnimal = (observationAnimalId: number) => {
    dialogOn({
      message: '등록하신 동물 정보를<br/>정말 삭제하시겠습니까?',
      close: {},
      confirm: {
        text: '삭제',
        onClick: () => {
          setDialogLoading(true);
          deleteAnimal({ observationAnimalId }).then(() => {
            dialogOff();
            toastOn('동물 정보가 삭제되었습니다.');
          });
        }
      }
    });
  };

  const handleClickEdit = (idx: number) => {
    if (animalLists) {
      setTargetAnimal(animalLists[idx]);
      openDialog();
    }
  };

  const handleClickCreate = () => {
    setTargetAnimal(undefined);
    openDialog();
  };

  const getAdditionalInfoStatus = (info: ShelterInfo) => {
    const isOutlinkCompleted =
      info.outLinks.length === Object.keys(OUT_LINK_TYPE).length;
    const isCompleted =
      info.parkingInfo && info.bankAccount && info.notice && isOutlinkCompleted;
    const isInProgress =
      info.parkingInfo ||
      info.bankAccount ||
      info.notice ||
      info.outLinks.length > 0;

    return isCompleted
      ? 'completed'
      : isInProgress
      ? 'in_progress'
      : 'not_entered';
  };

  const handleClickCompleteRegister = () => {
    setRegisterCompleted(true);
  };

  const MenuBadge = useCallback(
    (status: ReturnType<typeof getAdditionalInfoStatus>) => (
      <Badge type={status === 'completed' ? 'success' : 'gray'}>
        {status === 'completed'
          ? '입력 완료'
          : status === 'in_progress'
          ? '입력중'
          : '미입력'}
      </Badge>
    ),
    []
  );

  if (registerCompleted) {
    return <RegisterComplete />;
  }

  return (
    <div className="page">
      <section className={styles.imageSection}>
        <ImageUploader
          name="image"
          imagePath={shelterQuery?.data?.profileImageUrl}
          shape="circle"
          defaultImage="shelter"
          size="96"
          loading={isUploading}
          error={uploadError || postError}
          onChangeCallback={handleChangeImage}
        />
      </section>
      <section>
        <EditMenu
          title="비밀번호 변경"
          caption=""
          onClick={() => router.push(location.pathname + '/password')}
        />
        <Divider spacing={18} />

        <EditMenu
          title="필수 정보"
          caption="보호소 이름 / 연락처 / 주소 / 소개문구"
          titleSuffix={MenuBadge('completed')}
          onClick={() => router.push(location.pathname + '/required')}
        />
        <Divider spacing={18} />
        <EditMenu
          title="추가 정보"
          caption="SNS계정 / 후원 계좌 정보 / 주차 정보 / 사전 안내사항"
          titleSuffix={MenuBadge(
            shelterQuery.isSuccess
              ? getAdditionalInfoStatus(shelterQuery.data)
              : 'not_entered'
          )}
          onClick={() => router.push(location.pathname + '/extra')}
        />
        <Divider spacing={18} />
      </section>
      <section>
        <EditMenu
          title="특별 케어 동물"
          caption="돌발행동이나 건강상태 등을 미리 유의해야하는 동물 친구가 있다면 봉사자에게 미리 알려주세요."
          titleSuffix={
            <H4
              color={
                animalLists && animalLists.length > 0 ? 'primary300' : 'gray400'
              }
            >
              {animalLists?.length || 0}
            </H4>
          }
        />
        <Button
          style={{ marginTop: '12px' }}
          variant="line"
          prefixIcon="plus"
          onClick={handleClickCreate}
        >
          동물 추가하기
        </Button>
        {isSuccess && animalLists && (
          <div className={styles.animalList}>
            {animalLists.map((animal, idx) => (
              <AnimalCard
                key={animal.id}
                data={animal}
                mode="edit"
                onClickEdit={() => handleClickEdit(idx)}
                onClickDelete={() => handleClickDeleteAnimal(animal.id)}
              />
            ))}
          </div>
        )}
        {typeof window !== 'undefined' &&
          window.location.hash === '#register' && (
            <FixedFooter>
              <Button onClick={handleClickCompleteRegister}>
                가입 완료하기
              </Button>
            </FixedFooter>
          )}
        <AnimalFormDialog
          initialData={targetAnimal}
          open={isOpened}
          onClose={closeDialog}
        />
      </section>
    </div>
  );
}
