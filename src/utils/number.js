export const numberSeparator = (number) => {
  return new Intl.NumberFormat().format(number);
};
  