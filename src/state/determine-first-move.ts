import { GameContext } from "..";
import { GameState } from "../models/interfaces/game-state";
import { ValidAnswer } from "../models/types/valid-answer";
import { customLog } from "../utils/custom-log";
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
      return ["0", "1", "x"].includes(input);
    }

    function assertionValidAnswer(input: string): asserts input is ValidAnswer {
      if (!["0", "1", "x"].includes(input)) throw new Error('Answer doesn\'t equal expected data!')
    }

    await customLog(`Hi, let's determine in a simple way ⚔️ who will go first!`)
    await customLog(`I selected a random value in the range 0..1!`)
    await customLog(`(HMAC=${hmac}).`)
    await customLog(`Try to guess my selection.`)
    await customLog(`0 - 0`)
    await customLog(`1 - 1`)
    await customLog(`X - exit 💨`)
    await customLog(`? - help 🚑`)
    let answer = await context.rl.askQuestion(``);

    while (typeof answer === "string" && !isValidAnswer(answer.toLowerCase())) {
      if (answer === '?') await context.helpInfo();
      await customLog(`Hey dude 🫵 don't cheating, just input one of the next option👇:`)
      await customLog(`0 - 0`)
      await customLog(`1 - 1`)
      await customLog(`X - exit 💨`)
      await customLog(`? - help 🚑`)
      answer = await context.rl.askQuestion(``);
      answer = answer.toLowerCase();
    }
    assertionValidAnswer(answer)
    return answer;
  }

  private async handleAnswer(answer: ValidAnswer, key: string, computerNum: string, context: GameContext) {
    if (answer === "0" || answer === "1") {
      context.state.isUserFirst = answer === computerNum;
      await customLog(`My selection: ${computerNum} (KEY=${key}).`);
      await customLog(`Your selection: ${answer} ${answer === computerNum ? '😎' : '🤯'}`);
    } else if (answer === "x") {
      context.exit();
    } else if (answer === "?") {
      await context.helpInfo();
    } else {
      const _exhaustiveCheck: never = answer;
    }
  }
}