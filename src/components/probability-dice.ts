export class ProbabilityCalculator {
  calculationProbability(firstDice: number[], secondDice: number[]): string {
    let wins = 0;

    for (const a of firstDice) {
      for (const b of secondDice) {
        if (a > b) wins++;
      }
    }

    const totalRolls = firstDice.length * secondDice.length;
    return (wins / totalRolls).toFixed(3)
  }
}