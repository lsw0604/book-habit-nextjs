import { isValidHour, isValidMinuteOrSecond } from './validator';

function getValidNumber(value: string, max: number): string {
  let numericValue: number = parseInt(value, 10);

  if (!Number.isNaN(numericValue)) {
    if (numericValue > max) numericValue = 0;
    if (numericValue < 0) numericValue = max;

    return numericValue.toString().padStart(2, '0');
  }

  return '00';
}

export function getValidHour(value: string): string {
  if (isValidHour(value)) return value;
  return getValidNumber(value, 23);
}

export function getValidMinuteOrSecond(value: string): string {
  if (isValidMinuteOrSecond(value)) return value;
  return getValidNumber(value, 59);
}
