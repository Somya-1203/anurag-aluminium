export const FRACTIONS = [
  { label: '0', value: 0 },
  { label: '1/16', value: 1/16 },
  { label: '1/8', value: 1/8 },
  { label: '3/16', value: 3/16 },
  { label: '1/4', value: 1/4 },
  { label: '5/16', value: 5/16 },
  { label: '3/8', value: 3/8 },
  { label: '7/16', value: 7/16 },
  { label: '1/2', value: 1/2 },
  { label: '9/16', value: 9/16 },
  { label: '5/8', value: 5/8 },
  { label: '11/16', value: 11/16 },
  { label: '3/4', value: 3/4 },
  { label: '13/16', value: 13/16 },
  { label: '7/8', value: 7/8 },
  { label: '15/16', value: 15/16 },
];

export const convertToInches = (whole: number, fraction: number): number => {
  return whole + fraction;
};

export const convertToDecimal = (inches: number): string => {
  return inches.toFixed(2);
};