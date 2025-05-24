import { GameContext } from "..";
import { GameState } from "../models/interfaces/game-state";
import { argv } from 'node:process';
import { stringToNumbers } from "../utils/string-to-numbers";
import { EXIT_WITH_MISTAKE, MIN_NUMBERS_ON_DICE, STEP } from "../constants/constants";
import { DetermineFirstMove } from "./determine-first-move";
import { customLog } from "../utils/custom-log";

export class InitialGameCondition implements GameState {
  private context: GameContext;
  async handle(context: GameContext): Promise<void> {
    this.context = context;
    await customLog(`👋 Hi, this is the dice game! Let's start to game!🚀`)
    const initialGameCondition = argv.slice(2);
    await this.checkInitialData(initialGameCondition)
    context.changeState(new DetermineFirstMove())
    context.request();
  }

  private async checkInitialData(initialGameData: string[]) {
    const errors: string[] = [];
    await this.mainCheckInputData(initialGameData);
    try {
      const dices = initialGameData.map(stringToNumbers);
      const length = dices[0]?.length
      dices.forEach((dice, index) => {
        this.checkSidesOfDice(length, dice, index, errors);
        this.checkMinSidesCount(dice, index, errors);
        this.checkSidesInDiceIsNotNan(dice, index, errors);
      });

      await this.writeMessage(errors);

      this.context.state.dices.push(...dices);
      await customLog('✅ Dice setup is valid!');

    } catch (error: unknown) {
      await this.handleError(error);
    }
  }

  private async mainCheckInputData(initialData: string[]): Promise<void> {
    if (initialData.length < 3) {
      await customLog(`❌ For starting game, you need to pass 3 or more dices with at least ${MIN_NUMBERS_ON_DICE} faces.`);
      await customLog('💡 Example: "node main.js 1,2,3,4,5,6 2,3,4,5,6,7 6,5,4,3,2,1"');
      await customLog('✅ Important: Numbers on dice can be anything, no need to repeat the examples.');
      this.context.exit(EXIT_WITH_MISTAKE);
      return;
    }
  }

  private checkSidesOfDice(normLength: number, dice: number[], index: number, errors: string[]): void {
    if (normLength !== dice.length) {
      errors.push(`❌ Count of faces on a dice must be **equal** for all dices! (Dice ${index + 1} has a different count)`);
    }
  }

  private checkMinSidesCount(dice: number[], index: number, errors: string[]) {
    if (dice.length < MIN_NUMBERS_ON_DICE) {
      errors.push(`❌ Each dice must have **at least ${MIN_NUMBERS_ON_DICE} faces**! (Dice ${index + 1} has only ${dice.length})`);
    }
  }

  private checkSidesInDiceIsNotNan(dice: number[], index: number, errors: string[]) {
    if (dice.some(el => Number.isNaN(el))) {
      errors.push(`❌ Each dice must includes only numbers inside! (Dice ${index + STEP} includes not only numbers!)`)
    }
  }

  private async writeMessage(errors: string[]) {
    if (errors.length > 0) {
      for (const error of errors) {
        await customLog(error);
      }
      this.context.exit(EXIT_WITH_MISTAKE)
    }
  }

  private async handleError(error: unknown) {
    if (error instanceof Error) {
      await customLog('❌ Error during game initialization!');
      await customLog(error.message);
    } else {
      await customLog('❌ Unexpected error during game initialization!');
    }
    this.context.exit(EXIT_WITH_MISTAKE);
    return;
  }
}