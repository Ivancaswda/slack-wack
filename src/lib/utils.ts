import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {format, isToday, isYesterday} from "date-fns";
import moment from "moment";
import {ru} from "date-fns/locale";


export const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr)
  if (isToday(date)) return 'Сегодня'
  if (isYesterday(date)) return  'Вчера'
  return format(date, 'EEEE, MMMM d', {locale: ru})
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const getTextFromDelta = (delta: any) => {
  if (!delta?.ops) return '';
  return delta.ops.map((op: any) => op.insert).join('');
};