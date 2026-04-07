const ONE_MIN_MS = 1000 * 60;

export function divMod(value: number, divisor: number) {
  return [Math.floor(value / divisor), Math.floor(value % divisor)] as const;
}

export function range(start: number, stop: number) {
  const res = [];

  for (let i = start; i <= stop; ++i) {
    res.push(i);
  }

  return res;
}

export function splitTensAndOnes(value: number) {
  return divMod(value, 10);
}

export function getTimeZoneOffsetMins(timeZoneId: string) {
  const date = new Date();

  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timeZoneId }));

  return (tzDate.getTime() - utcDate.getTime()) / ONE_MIN_MS;
}

export function getTimeZoneOffsetString(timeZoneId: string) {
  const timeZoneOffsetMinutes = getTimeZoneOffsetMins(timeZoneId);

  const sign = timeZoneOffsetMinutes < 0 ? '-' : '+';
  const absoluteOffset = Math.abs(timeZoneOffsetMinutes);

  const [hours, minutes] = divMod(absoluteOffset, 60);
  const [hoursString, minutesString] = [`${hours}`, `${minutes}`];

  return `UTC${sign}${hoursString.padStart(2, '0')}:${minutesString.padStart(2, '0')}`;
}
