import { GameContext } from "..";
import { GameState } from "../models/interfaces/game-state";
import { customLog } from "../utils/custom-log";
import { RollDice } from "./roll-dice";

export class DetermineDice implements GameState {
  async handle(context: GameContext): Promise<void> {
    await this.startDetermine(context);
    context.changeState(new RollDice);
    context.request();
  }

  async startDetermine(context: GameContext) {
    if (context.state.isUserFirst) {
      await this.askWithDataDices(context);
      await this.computerDetermineDice(context);
      await customLog(`I choose the [${context.state.computerDice}] dice 👹.`)
    } else {
      await this.computerDetermineDice(context);
      await customLog(`I make the first move and choose the [${context.state.computerDice}] dice 👹.`);
      await this.askWithDataDices(context);
    }
  }

  async askWithDataDices(context: GameContext) {
    const dices = this.filterDices(context.state.computerDice, context.state.dices);
    const rightAnswer = [...Array.from({ length: dices.length + 1 }, (_, i) => i.toString()), 'x', '?'];
    await customLog(`Choose your dice:`)
    for (const [ind, dice] of dices.entries()) {
      await customLog(`${ind} - [${dice.join(", ")}]`)
    }
    await customLog(`X - exit`)
    await customLog(`? - help`)
    let answer = await context.rl.askQuestion(``);
    while (!rightAnswer.includes(answer.toLowerCase())) {
      await customLog(`Hey dude 🫵 don't cheating, just input one of the next option👇:`)
      for (const [ind, dice] of dices.entries()) {
        await customLog(`${ind} - [${dice.join(", ")}]`)
      }
      await customLog(`X - exit 💨`)
      await customLog(`? - help 🚑`)
      answer = await context.rl.askQuestion(`
`);
      answer = answer.toLowerCase();
    }

    if (answer === 'x') {
      context.exit();
    } else if (answer === "?") {
      context.helpInfo();
    } else {
      context.state.userDice.push(...dices[parseInt(answer)]);
      await customLog(`You choose the [${context.state.userDice}] dice.`);
    }
  }

  private async computerDetermineDice(context: GameContext) {
    const dices = this.filterDices(context.state.userDice, context.state.dices,)
    const maxIndex = dices.length - 1;
    const computerInd = Math.floor(Math.random() * (maxIndex + 1));
    const computerDice = dices[computerInd];
    context.state.computerDice.push(...computerDice);
    return computerDice;
  }

  private filterDices(excludeDice: number[], allDices: number[][]): number[][] {
    return allDices.filter(dice => dice.toString() !== excludeDice.toString());
  }
}