import { BasicDialogProps } from '@/components/common/CofirmDialog/BasicDialog';
import { atom } from 'recoil';

export type DialogState = Omit<BasicDialogProps, 'onClose'>;
export const initialState: DialogState = {
  open: false,
  message: ''
};

export const state = atom({
  key: 'dialog',
  default: initialState
});
