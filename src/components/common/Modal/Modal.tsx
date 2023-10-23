import { Close } from '@/asset/icons';
import React from 'react';
import * as styles from './Modal.css';
import DialogBase, {
  DialogBaseProps
} from '@/components/global/Dialog/DialogBase';

export interface ModalProps extends DialogBaseProps {
  isHeader?: boolean;
}

export default function Modal({
  open = false,
  onClose,
  isHeader = true,
  zIndex,
  children
}: ModalProps) {
  return (
    <DialogBase open={open} onClose={onClose} zIndex={zIndex}>
      {isHeader && (
        <header className={styles.header}>
          <Close className={styles.closeIcon} onClick={onClose} />
        </header>
      )}
      <main className={styles.contents}>
        <div className={styles.childrenWarp}>{children}</div>
      </main>
    </DialogBase>
  );
}
