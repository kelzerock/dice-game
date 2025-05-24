import { GameContext } from "..";
import { EXIT_WITH_MISTAKE } from "../constants/constants";
import { GameState } from "../models/interfaces/game-state";
import { ValidAnswer } from "../models/types/valid-answer";
import { assertionValidAnswer } from "../utils/assertion-valid-answer";
import { customLog } from "../utils/custom-log";
import { isValidAnswer } from "../utils/is-valid-answer";
import { DetermineDice } from "./determine-dice";

export class DetermineFirstMove implements GameState {
  private rightAnswer = ["0", "1", "x"] as const;
  async handle(context: GameContext): Promise<void> {
    const computerNum = context.randomNum.randomNumAsStr(1);

    const { key, hmac } = context.hashCreator.getHmac(computerNum);

    const answer = await this.answer(context, hmac)
    this.handleAnswer(answer, key, computerNum, context);
    context.changeState(new DetermineDice);
    context.request();
  }

  private async answer(context: GameContext, hmac: string) {

    await customLog([
      `Hi, let's determine in a simple way ⚔️ who will go first!`,
      `I selected a random value in the range 0..1!`,
      `(HMAC=${hmac}).`,
      `Try to guess my selection.`,
      `0 - 0`,
      `1 - 1`,
      `X - exit 💨`,
      `? - help 🚑`
    ])
    let answer = await context.rl.askQuestion(``);
    while (typeof answer === "string" && !isValidAnswer(answer.toLowerCase(), this.rightAnswer)) {
      if (answer === '?') await context.helpInfo();
      await customLog([
        `Hey dude 🫵 don't cheating, just input one of the next option👇:`, `0 - 0`, `1 - 1`, `X - exit 💨`, `? - help 🚑`
      ])
      answer = await context.rl.askQuestion(``);
      answer = answer.toLowerCase();
    }
    try {
      assertionValidAnswer(answer, this.rightAnswer)
      return answer;
    } catch (error) {
      context.exit(EXIT_WITH_MISTAKE);
    }
  }

  private async handleAnswer(answer: ValidAnswer, key: string, computerNum: string, context: GameContext) {
    if (answer === "0" || answer === "1") {
      context.state.isUserFirst = answer === computerNum;
      await customLog([`My selection: ${computerNum} (KEY=${key}).`, `Your selection: ${answer} ${answer === computerNum ? '😎' : '🤯'}`]);
    } else if (answer === "x") {
      context.exit();
    } else {
      const _exhaustiveCheck: never = answer;
    }
  }
}