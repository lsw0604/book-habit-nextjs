export function isValidHour(value: string): boolean {
  return /^(0[0-9]|1[0-9]|2[0-3])$/.test(value);
}

export function isValidMinuteOrSecond(value: string): boolean {
  return /^[0-5][0-9]$/.test(value);
}
