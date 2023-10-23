import { formatDatetimeForServer } from '@/utils/timeConvert';
import moment from 'moment';

export function getMaxOfIterationEndAt() {
  return formatDatetimeForServer(moment().add(6, 'M').endOf('month'), 'DATE');
}

export function getMaxOfDateInput() {
  return formatDatetimeForServer(
    moment().add(6, 'M').set({ minute: 0, second: 0 }),
    'DATETIME'
  );
}
