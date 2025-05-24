export function assertionValidAnswer<const T extends readonly string[]>(input: string, rightAnswer: T): asserts input is T[number] {
  if (!rightAnswer.includes(input)) throw new Error('Answer doesn\'t equal expected data!')
}