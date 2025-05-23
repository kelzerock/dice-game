import { GameContext } from "..";
import { GameState } from "../models/interfaces/game-state";
import { DetermineFirstMove } from "./determine-first-move";

export class ResetForNewGame implements GameState {
  async handle(context: GameContext): Promise<void> {
    await this.askToReset(context);
    context.changeState(new DetermineFirstMove());
    context.request();
  }
  private async askToReset(context: GameContext) {
    let answer = await context.rl.askQuestion(`Do you want to play in this game one more time? (n/y)`)
    const rightAnswer = ['y', 'n'];
    while (!rightAnswer.includes(answer.toLowerCase())) {
      answer = await context.rl.askQuestion(`
Hey dude 🫵 don't cheating, just input one of the next option👇:
n - no
y - yes
`);
      answer = answer.toLowerCase();
    }
    if (answer === 'n') {
      console.log('Thanks for the good game! Bye!👋')
      context.exit();
    } else {
      console.log(`Lets try to play one more time 🤠!`)
      context.reset();
    }
  }
}