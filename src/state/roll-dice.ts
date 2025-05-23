import { GameContext } from "..";
import { STEP } from "../constants/constants";
import { GameState } from "../models/interfaces/game-state";
import { customLog } from "../utils/custom-log";
import { ResetForNewGame } from "./reset-for-new-game";

export class RollDice implements GameState {
  private isUserFirst: boolean = false;
  private result: { firstPlayer: number, secondPlayer: number } = { firstPlayer: 0, secondPlayer: 0 }

  async handle(context: GameContext): Promise<void> {
    await customLog("It's time to roll dices!🎲🎲")

    await this.startRoll(context)
    context.changeState(new ResetForNewGame());
    context.request();
  }

  private async startRoll(context: GameContext) {
    this.isUserFirst = context.state.isUserFirst;
    const firstResult = await this.roll(context, 'first');
    const secondResult = await this.roll(context, 'second');
    await this.finalResult(firstResult, secondResult);
  }

  private computerChoose(context: GameContext, maxIndex: number): { computerNumber: string, key: string, hmac: string } {
    const computerNumber = context.randomNum.randomNumAsStr(maxIndex);
    const { key, hmac } = context.hashCreator.getHmac(computerNumber);
    return { computerNumber, key, hmac }
  }

  private async roll(context: GameContext, type: "first" | "second"): Promise<number> {
    const maxIndex = context.state.computerDice.length - STEP;
    const dice = this.isUserFirst ? context.state.userDice : context.state.computerDice;
    const { computerNumber, key, hmac } = this.computerChoose(context, maxIndex)
    let player: string;
    if (type === 'first') {
      player = this.isUserFirst ? 'your' : 'my'
    } else {
      player = this.isUserFirst ? 'my' : 'your'
    }
    await customLog(`It's time for ${player} roll.`);
    await customLog(`I selected a random value in the range 0..${maxIndex}`);
    await customLog(`My HMAC(${hmac})`);
    const userNumber = await this.askWithDataDices(context);
    const moduleForOperation = maxIndex + STEP;
    const moduleResult = (parseInt(computerNumber) + parseInt(userNumber)) % moduleForOperation;
    const result = dice[moduleResult];
    type === 'first'
      ? this.result.firstPlayer = result
      : this.result.secondPlayer = result;
    await customLog(`My number is - ${computerNumber}`);
    await customLog(`Key(${key})`);
    await customLog(`Your selection is - ${userNumber}`);
    await customLog(`The fair number generation result is ${computerNumber} + ${userNumber} = ${moduleResult} (mod ${moduleForOperation}).`);
    await customLog(`${player} roll result is ${result}.`);
    return result;
  }

  private async askWithDataDices(context: GameContext): Promise<string> {
    const maxIndex = context.state.userDice.length;
    const rightAnswer = [...Array.from({ length: maxIndex }, (_, i) => i.toString()), 'x'];
    const moduleForOperation = maxIndex;
    await customLog(`Add your number modulo ${moduleForOperation}.:`)
    for (const num of rightAnswer) {
      await customLog(`${num} - ${num}`)
    }
    await customLog(`? - help 🚑`)
    let answer = await context.rl.askQuestion(``);
    while (typeof answer === "string" && !rightAnswer.includes(answer.toLowerCase())) {
      if (answer === '?') await context.helpInfo();
      await customLog(`Hey dude 🫵 don't cheating, just select one of the next option👇:`)
      for (const num of rightAnswer) {
        await customLog(`${num} - ${num}`)
      }
      await customLog(`X - exit 💨`)
      await customLog(`? - help 🚑`)
      answer = await context.rl.askQuestion(``);
    }
    answer = answer.toLowerCase();
    if (answer === 'x') {
      context.exit();
    } else {
      await customLog(`You choose the ${answer} number.`);
      return answer;
    }
  }

  private async finalResult(firstResult: number, secondResult: number) {
    if (this.result.firstPlayer === this.result.secondPlayer) {
      await customLog(`It is very strange, but we don't have a winner (${firstResult} === ${secondResult})! 🙄`)
    } else {
      if (this.isUserFirst && this.result.firstPlayer > this.result.secondPlayer) {
        await customLog(`You win (${firstResult} > ${secondResult})!🥈🏆🥉`)
      } else if (this.isUserFirst && this.result.firstPlayer < this.result.secondPlayer) {
        await customLog(`You lose 🥴 (${firstResult} < ${secondResult})! 🥉`)
      } else if (!this.isUserFirst && this.result.firstPlayer > this.result.secondPlayer) {
        await customLog(`You lose 🥴 (${firstResult} > ${secondResult})! 🥉`)
      } else {
        await customLog(`You win (${firstResult} < ${secondResult})!🥈🏆🥉`)
      }
    }
  }


}