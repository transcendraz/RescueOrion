export function pad(n: number): string {
  let digits = 0;
  let copy = n;
  while (copy > 0) {
    copy = Math.floor(copy / 10);
    ++digits;
  }
  if (digits < 2) {
    return `0${n}`;
  } else {
    return `${n}`;
  }
}

export function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${pad(minutes)}:${pad(seconds)}`;
}

export function localeTimeString(timeMS: number) {
  const date = new Date(timeMS);
  return date.toLocaleString();
}