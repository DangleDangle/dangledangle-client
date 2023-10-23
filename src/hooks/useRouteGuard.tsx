import { useCallback, useEffect } from 'react';
import useDialog from './useDialog';

const GUARD_STATE = 'Route guard init';

const onBeforeunload = (event: BeforeUnloadEvent) => {
  // 브라우저 새로고침, 닫기 방지
  event.preventDefault();
  event.returnValue = '';
};

/**
 * 유저의 의도치않은 페이지 이탈을 방지
 * @param callback 브라우저 뒤로가기 동작 대신 수행할 함수
 * @returns setRoutable로 온오프 가능
 * @example ```js
 *  const onSubmit = () => {
 *      setRoutable(true);
 *      router.back();
 *  }
 * ```
 */
export default function useRouteGuard(callback?: () => unknown) {
  const { dialogOn, dialogOff } = useDialog();

  const defaultCallback = useCallback(() => {
    dialogOn({
      message: '앗! 이대로 나가면 입력하신 정보가 모두 사라져요!',
      confirm: {
        text: '나가기',
        variant: 'filled',
        onClick: () => {
          setRoutable(true);
          history.back();
          dialogOff();
        }
      },
      close: {
        onClick: () => {
          setRoutable(false);
          dialogOff();
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPopstate = (e: PopStateEvent) => {
    // 브라우저 뒤로가기 방지
    e.preventDefault();
    callback ? callback() : defaultCallback();
    return;
  };

  const setRoutable = useCallback(
    (routable: boolean) => {
      if (!routable) {
        history.pushState(GUARD_STATE, '');
        window.onbeforeunload = onBeforeunload;
        window.onpopstate = onPopstate;
      } else {
        window.onbeforeunload = null;
        window.onpopstate = null;
        if (history.state === GUARD_STATE) history.back(); // GUARD_STATE state 제거
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callback]
  );

  useEffect(() => {
    setRoutable(false);
    return () => {
      window.onpopstate = null;
      window.onbeforeunload = null;
    };
  }, [setRoutable]);

  return { setRoutable };
}
