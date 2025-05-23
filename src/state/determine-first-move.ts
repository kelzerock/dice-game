import { GameContext } from "..";
import { GameState } from "../models/interfaces/game-state";
import { ValidAnswer } from "../models/types/valid-answer";
import { DetermineDice } from "./determine-dice";

export class DetermineFirstMove implements GameState {
  async handle(context: GameContext): Promise<void> {
    const computerNum = context.randomNum.randomNumAsStr(1);

    const { key, hmac } = context.hashCreator.getHmac(computerNum);

    const answer = await this.answer(context, hmac)
    this.handleAnswer(answer, key, computerNum, context);
    context.changeState(new DetermineDice);
    context.request();
  }

  private async answer(context: GameContext, hmac: string): Promise<ValidAnswer> {

    function isValidAnswer(input: string): input is ValidAnswer {
      return ["0", "1", "x", "?"].includes(input);
    }

    function assertionValidAnswer(input: string): asserts input is ValidAnswer {
      if (!["0", "1", "x", "?"].includes(input)) throw new Error('Answer doesn\'t equal expected data!')
    }

    let answer = await context.rl.askQuestion(`
I selected a random value in the range 0..1
(HMAC=${hmac}).
Try to guess my selection.
0 - 0
1 - 1
X - exit 💨
? - help 🚑
`);

    while (!isValidAnswer(answer.toLowerCase())) {
      answer = await context.rl.askQuestion(`
Hey dude 🫵 don't cheating, just input one of the next option👇:
0 - 0
1 - 1
X - exit 💨
? - help 🚑
`);
      answer = answer.toLowerCase();
    }
    assertionValidAnswer(answer)
    return answer;
  }

  private handleAnswer(answer: ValidAnswer, key: string, computerNum: string, context: GameContext) {
    if (answer === "0" || answer === "1") {
      context.state.isUserFirst = answer === computerNum;
      console.log(`My selection: ${computerNum} (KEY=${key}).`);
      console.log(`Your selection: ${answer} ${answer === computerNum ? '😎' : '🤯'}`);
    } else if (answer === "x") {
      context.exit();
    } else if (answer === "?") {
      context.helpInfo();
    } else {
      const _exhaustiveCheck: never = answer;
    }
  }
}