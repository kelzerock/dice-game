import { GameContext } from "..";
import { STEP } from "../constants/constants";
import { GameState } from "../models/interfaces/game-state";
import { ResetForNewGame } from "./reset-for-new-game";

export class RollDice implements GameState {
  private isUserFirst: boolean = false;
  private result: { firstPlayer: number, secondPlayer: number } = { firstPlayer: 0, secondPlayer: 0 }

  async handle(context: GameContext): Promise<void> {
    console.log("It's time to roll dices!🎲🎲")

    await this.startRoll(context)
    context.changeState(new ResetForNewGame());
    context.request();
  }

  private async startRoll(context: GameContext) {
    this.isUserFirst = context.state.isUserFirst;
    const firstResult = await this.roll(context, 'first');
    const secondResult = await this.roll(context, 'second');
    this.finalResult(context, firstResult, secondResult);
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
    console.log(`It's time for ${player} roll.`);
    console.log(`I selected a random value in the range 0..${maxIndex}`);
    console.log(`My HMAC(${hmac})`);
    const userNumber = await this.askWithDataDices(context, maxIndex);
    const moduleForOperation = maxIndex + STEP;
    const moduleResult = (parseInt(computerNumber) + parseInt(userNumber)) % moduleForOperation;
    const result = dice[moduleResult];
    type === 'first'
      ? this.result.firstPlayer = result
      : this.result.secondPlayer = result;
    console.log(`My number is - ${computerNumber}`);
    console.log(`Key(${key})`);
    console.log(`Your selection is - ${userNumber}`);
    console.log(`The fair number generation result is ${computerNumber} + ${userNumber} = ${moduleResult} (mod ${moduleForOperation}).`);
    console.log(`${player} roll result is ${result}.`);
    return result;
  }

  private async askWithDataDices(context: GameContext, maxIndex: number): Promise<string> {
    const rightAnswer = [...Array.from({ length: maxIndex + 1 }, (_, i) => i.toString()), 'x', '?'];
    const moduleForOperation = maxIndex + STEP;
    let answer = await context.rl.askQuestion(`
Add your number modulo ${moduleForOperation}.:
${rightAnswer.map((dice) => `${dice} - ${dice}\n`).join("")}
X - exit 💨
? - help 🚑
`);
    while (!rightAnswer.includes(answer.toLowerCase())) {
      answer = await context.rl.askQuestion(`
Hey dude 🫵 don't cheating, just select one of the next option👇:
${rightAnswer.map((dice) => `${dice} - [${dice}]\n`).join("")}
X - exit 💨
? - help 🚑
`);
      answer = answer.toLowerCase();
    }

    if (answer === 'x') {
      context.exit();
    } else if (answer === "?") {
      context.helpInfo();
    } else {
      console.log(`You choose the ${answer} number.`);
      return answer;
    }
  }

  private finalResult(context: GameContext, firstResult: number, secondResult: number) {
    if (this.result.firstPlayer === this.result.secondPlayer) {
      console.log(`It is very strange, but we don't have a winner (${firstResult} === ${secondResult})! 🙄`)
    } else {
      if (this.isUserFirst && this.result.firstPlayer > this.result.secondPlayer) {
        console.log(`You win (${firstResult} > ${secondResult})!🥈🏆🥉`)
      } else if (this.isUserFirst && this.result.firstPlayer < this.result.secondPlayer) {
        console.log(`You lose 🥴 (${firstResult} < ${secondResult})! 🥉`)
      } else if (!this.isUserFirst && this.result.firstPlayer > this.result.secondPlayer) {
        console.log(`You lose 🥴 (${firstResult} > ${secondResult})! 🥉`)
      } else {
        console.log(`You win (${firstResult} < ${secondResult})!🥈🏆🥉`)
      }
    }
  }


}