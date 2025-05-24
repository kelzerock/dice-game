export function isValidAnswer<const T extends readonly string[]>(input: string, rightAnswer: T): input is T[number] {
  return rightAnswer.includes(input);
}