export function normalize(stringToNormalize: string) {
  return stringToNormalize
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}
