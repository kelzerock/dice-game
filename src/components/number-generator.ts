export class NumberGenerator {
  randomNumAsStr(max: number): string {
    return Math.floor(Math.random() * (max + 1)).toString();
  }

  randomNum(max: number): number {
    return Math.floor(Math.random() * (max + 1));
  }
}