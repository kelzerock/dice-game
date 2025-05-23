export const stringToNumbers = (string: string): number[] => {
  return string.split(',')
    .filter(element => element !== '')
    .map(element => {
      const number = Math.round(parseFloat(element));
      if (Number.isNaN(number)) {
        throw new Error('Incorrect data inside dice, please take to the dice only numbers');
      } else {
        return number
      }
    })
}