import { Transform } from 'class-transformer';

export function TrimDto() {
  return Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string' && value.trim() === '') {
      return undefined;
    }

    return value as string | undefined;
  });
}
