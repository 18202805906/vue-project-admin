import { formatTime as formatTimeFn } from '@/utils';
import { SEX, APISTATUS, READ, APISTATE } from '@/config/dictionary';
export function sex(value) {
  return SEX[value] || '未知';
}
export function formatTime(time, type) {
  return formatTimeFn(time,type);
}
export function toFixed(val, dig = 2) {
  return Number(val).toFixed(dig);
}

export function apiStatus(value) {
  return APISTATUS[value] || '未知';
}

export function read(value) {
  return READ[value] || '未知';
}
export function apiStae(value) {
  return APISTATE[value] || '未知';
}