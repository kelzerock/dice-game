import { GameContext } from "..";
import { EXIT_WITH_MISTAKE } from "../constants/constants";
import { Dice } from "../models/interfaces/dice";
import { GameState } from "../models/interfaces/game-state";
import { assertionValidAnswer } from "../utils/assertion-valid-answer";
import { customLog } from "../utils/custom-log";
import { isValidAnswer } from "../utils/is-valid-answer";
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
      await customLog(`I choose the [${context.state.computerDice.dice}] dice 👹.`)
    } else {
      await this.computerDetermineDice(context);
      await customLog(`I make the first move and choose the [${context.state.computerDice.dice}] dice 👹.`);
      await this.askWithDataDices(context);
    }
  }

  async askWithDataDices(context: GameContext) {
    const dices = this.filterDices(context.state.computerDice, context.state.dices);
    const rightAnswer = [...Array.from({ length: dices.length }, (_, i) => i.toString()), 'x'] as const;
    await customLog(`Choose your dice:`)
    for (const [ind, dice] of dices.entries()) {
      await customLog(`${ind} - [${dice.dice.join(", ")}]`)
    }
    await customLog([`X - exit`, `? - help`])
    let answer = await context.rl.askQuestion(``);
    while (typeof answer === "string" && !isValidAnswer(answer, rightAnswer)) {
      if (answer === '?') await context.helpInfo();
      await customLog(`Hey dude 🫵 don't cheating, just input one of the next option👇:`)
      for (const [ind, dice] of dices.entries()) {
        await customLog(`${ind} - [${dice.dice.join(", ")}]`)
      }
      await customLog([`X - exit 💨`, `? - help 🚑`])
      answer = await context.rl.askQuestion(``);
      answer = answer.toLowerCase();
    }

    try {
      assertionValidAnswer(answer, rightAnswer);
    } catch (error) {
      context.exit(EXIT_WITH_MISTAKE)
    }

    if (answer === 'x') {
      context.exit();
    } else {
      context.state.userDice = { id: parseInt(answer), dice: dices[parseInt(answer)].dice };
      await customLog(`You choose the [${context.state.userDice.dice}] dice.`);
    }
  }

  private async computerDetermineDice(context: GameContext) {
    const dices = this.filterDices(context.state.userDice, context.state.dices,)
    const maxIndex = dices.length - 1;
    const computerInd = Math.floor(Math.random() * (maxIndex + 1));
    const dice = dices[computerInd].dice;
    context.state.computerDice = { id: computerInd, dice };
  }

  private filterDices(excludeDice: Dice, allDices: Dice[]): Dice[] {
    return allDices.filter(dice => dice.id !== excludeDice?.id);
  }
}