import { GameContext } from "..";
import { STEP } from "../constants/constants";
import { Roll } from "../models/enums/roll";
import { GameState } from "../models/interfaces/game-state";
import { customLog } from "../utils/custom-log";
import { ResetForNewGame } from "./reset-for-new-game";

export class RollDice implements GameState {
  private isUserFirst: boolean = false;
  private result: { userResult: number, computerResult: number } = { userResult: 0, computerResult: 0 }

  async handle(context: GameContext): Promise<void> {
    await customLog("It's time to roll dices!🎲🎲")

    await this.startRoll(context)
    context.changeState(new ResetForNewGame());
    context.request();
  }

  private async startRoll(context: GameContext) {
    this.isUserFirst = context.state.isUserFirst;
    await this.roll(context, Roll.first);
    await this.roll(context, Roll.second);
    await this.finalResult();
  }

  private computerChoose(context: GameContext, maxIndex: number): { computerNumber: string, key: string, hmac: string } {
    const computerNumber = context.randomNum.randomNumAsStr(maxIndex);
    const { key, hmac } = context.hashCreator.getHmac(computerNumber);
    return { computerNumber, key, hmac }
  }

  private async roll(context: GameContext, type: Roll): Promise<void> {
    const maxIndex = context.state.computerDice.dice.length - STEP;
    const { computerNumber, key, hmac } = this.computerChoose(context, maxIndex)
    const { player, dice } = this.getPlayerData(context, type);
    await customLog([
      `It's time for ${player} roll.`,
      `I selected a random value in the range 0..${maxIndex}`,
      `My HMAC(${hmac})`]);
    const userNumber = await this.askWithDataDices(context);
    const moduleForOperation = maxIndex + STEP;
    const moduleResult = (parseInt(computerNumber) + parseInt(userNumber)) % moduleForOperation;
    const result = dice.dice[moduleResult];
    this.setResult(type, result);
    await customLog([
      `My number is - ${computerNumber}`,
      `Key(${key})`,
      `Your selection is - ${userNumber}`,
      `The fair number generation result is ${computerNumber} + ${userNumber} = ${moduleResult} (mod ${moduleForOperation}).`,
      `${player} roll result is ${result}.`]);
  }

  private async askWithDataDices(context: GameContext): Promise<string> {
    const maxIndex = context.state.userDice.dice.length;
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
      await customLog([`X - exit 💨`, `? - help 🚑`])
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

  private async finalResult() {
    const { userResult, computerResult } = this.result;

    const message =
      userResult === computerResult
        ? `It is very strange, but we don't have a winner (${computerResult} === ${userResult})! 🙄`
        : userResult > computerResult
          ? `You win (${userResult} > ${computerResult})!🥈🏆🥉`
          : `You lose 🥴 (${userResult} < ${computerResult})! 🥉`;

    await customLog(message);
  }


  private getPlayerData(context: GameContext, type: Roll) {
    const isUserRolling = (type === Roll.first) === this.isUserFirst;
    return {
      player: isUserRolling ? "your" : "my",
      dice: isUserRolling ? context.state.userDice : context.state.computerDice
    };
  }

  private setResult(type: Roll, result: number) {
    const isUserRolling = (type === Roll.first) === this.isUserFirst;
    if (isUserRolling) {
      this.result.userResult = result;
    } else {
      this.result.computerResult = result;
    }
  }

}