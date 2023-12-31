import { useEffect, useRef, useState } from 'react';

export default function useResize(open: boolean) {
  const [modalSize, setModalSize] = useState<'sm' | 'md' | 'lg'>('sm');
  const modalRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (open && modalRef.current) {
      const checkModalHeight = () => {
        if (modalRef.current) {
          const modalHeight = modalRef.current.offsetHeight;

          if (modalHeight <= window.innerHeight * 0.3) {
            setModalSize('sm');
          } else if (modalHeight <= window.innerHeight * 0.5) {
            setModalSize('md');
          } else {
            setModalSize('lg');
          }
        }
      };

      checkModalHeight();
      window.addEventListener('resize', checkModalHeight);

      return () => {
        window.removeEventListener('resize', checkModalHeight);
      };
    }
  }, [open, modalRef]);
  return { modalSize, modalRef };
}
