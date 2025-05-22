export class NumberGenerator {
  randomNum(max: number): number {
    return Math.floor(Math.random() * max);
  }
}