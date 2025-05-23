import { GameContext } from "..";
import { GameState } from "../models/interfaces/game-state";
import { argv } from 'node:process';
import { stringToNumbers } from "../utils/string-to-numbers";
import { EXIT_WITH_MISTAKE, MIN_NUMBERS_ON_DICE } from "../constants/constants";
import { DetermineFirstMove } from "./determine-first-move";

export class InitialGameCondition implements GameState {
  async handle(context: GameContext): Promise<void> {
    console.log(`👋 Hi, this is the dice game! Let's start to game!🚀`)
    const initialGameCondition = argv.slice(2);
    this.checkInitialData(initialGameCondition, context)
    context.changeState(new DetermineFirstMove())
  }

  checkInitialData(initialGameData: string[], context: GameContext) {
    let errors: string[] = [];

    if (initialGameData.length < 3) {
      errors.push(`❌ For starting game, you need to pass 3 or more dices with at least ${MIN_NUMBERS_ON_DICE} faces.`);
      errors.push('💡 Example: "node main.js 1,2,3,4,5,6 2,3,4,5,6,7 6,5,4,3,2,1"');
      errors.push('✅ Important: Numbers on dice can be anything, no need to repeat the examples.');
      errors.forEach(error => console.log(error));
      context.exit(EXIT_WITH_MISTAKE);
    }

    try {
      const dices = initialGameData.map(stringToNumbers);
      const length = dices[0]?.length

      dices.forEach((element, index) => {
        if (length !== element.length) {
          errors.push(`❌ Count of faces on a dice must be **equal** for all dices! (Dice ${index + 1} has a different count)`);
        }

        if (element.length < MIN_NUMBERS_ON_DICE) {
          errors.push(`❌ Each dice must have **at least ${MIN_NUMBERS_ON_DICE} faces**! (Dice ${index + 1} has only ${element.length})`);
        }
      });

      if (errors.length > 0) {
        errors.forEach(error => console.log(error));
        context.exit(EXIT_WITH_MISTAKE)
      }

      console.log('✅ Dice setup is valid!');

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log('❌ Unexpected error during game initialization!');
      }
    }
  }
}