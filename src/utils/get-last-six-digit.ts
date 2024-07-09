export const getLastSixDigit = (word?: string) => {
  return word?.toString().slice(-6);
}