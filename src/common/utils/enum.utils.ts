export function enumKeyOf<T extends Record<string, string>>(enumObject: T, value: T[keyof T]): string {
  const key = Object.keys(enumObject).find((enumKey) => enumObject[enumKey] === value);
  if (!key) {
    throw new Error(`Value "${value}" is not part of the enum.`);
  }
  return key;
}
