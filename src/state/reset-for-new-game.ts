import { GameContext } from "..";
import { GameState } from "../models/interfaces/game-state";
import { customLog } from "../utils/custom-log";
import { DetermineFirstMove } from "./determine-first-move";

export class ResetForNewGame implements GameState {
  async handle(context: GameContext): Promise<void> {
    await this.askToReset(context);
    context.changeState(new DetermineFirstMove());
    context.request();
  }
  private async askToReset(context: GameContext) {
    await customLog(`Do you want to play in this game one more time? (n/y)`);
    let answer = await context.rl.askQuestion(``)
    const rightAnswer = ['y', 'n'];
    while (typeof answer === "string" && !rightAnswer.includes(answer.toLowerCase())) {
      await customLog(`Hey dude 🫵 don't cheating, just input one of the next option👇:`);
      await customLog(`n - no`);
      await customLog(`y - yes`);
      answer = await context.rl.askQuestion(``);
      answer = answer.toLowerCase();
    }
    if (answer === 'n') {
      context.exit();
    } else {
      await customLog(`Lets try to play one more time 🤠!`)
      context.reset();
    }
  }
}