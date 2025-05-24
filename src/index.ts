import { CryptoGenerator } from "./components/crypto-generator";
import { NumberGenerator } from "./components/number-generator";
import { ProbabilityCalculator } from "./components/probability-dice";
import { ReadLineHandler } from "./components/read-line-handler";
import { GameState } from "./models/interfaces/game-state";
import { StateInGameState } from "./models/interfaces/state-in-game-state";
import { InitialGameCondition } from "./state/initial-game-condition";
import Table from "cli-table3"
import { customLog } from "./utils/custom-log";

export class GameContext {
  private currentState: GameState;
  public hashCreator: CryptoGenerator;
  public rl: ReadLineHandler;
  public randomNum: NumberGenerator;
  private probabilityCalculator: ProbabilityCalculator;
  public state: StateInGameState = { dices: [], computerDice: null, userDice: null, isUserFirst: false }

  constructor(
    initialState: GameState,
    hashCreator: CryptoGenerator,
    rl: ReadLineHandler,
    randomNum: NumberGenerator,
    probabilityCalculator: ProbabilityCalculator,
  ) {
    this.currentState = initialState;
    this.hashCreator = hashCreator;
    this.rl = rl;
    this.randomNum = randomNum;
    this.probabilityCalculator = probabilityCalculator;
  }

  public changeState(newState: GameState): void {
    this.currentState = newState;
  }

  public async request(): Promise<void> {
    await this.currentState.handle(this);
  }

  public async exit(exitCode: number = 0): Promise<void> {
    await this.rl.close(exitCode);
  }

  public async helpInfo() {
    const dices = structuredClone(this.state.dices);
    await customLog(`Well, let's look at your chances of success 🎰 in rolling the dice! 🥸`)
    const header = dices.map(dice => dice.dice.toString())
    const table = new Table({ head: ['User dice v', ...header] });
    dices.forEach(dice => {
      const leftHeader = dice.dice.toString();
      const row: string[] = [];
      dices.forEach(el => row.push(this.probabilityCalculator.calculationProbability(dice.dice, el.dice)))
      table.push(
        { [leftHeader]: row }
      )
    })
    await customLog(table.toString())
    await customLog(`Do you want to continuo playing in this game? (n/y)`);
    let answer = await this.rl.askQuestion(``)
    const rightAnswer = ['y', 'n'];
    while (typeof answer === "string" && !rightAnswer.includes(answer.toLowerCase())) {
      await customLog(`Hey dude 🫵 don't cheating, just input one of the next option👇:`);
      await customLog(`n - no`);
      await customLog(`y - yes`);
      answer = await this.rl.askQuestion(``);
      answer = answer.toLowerCase();
    }
    if (answer === 'n') {
      await customLog('Thanks for the good game! Bye!👋')
      this.exit();
    } else {
      await customLog(`Well, lets go further ...`)
    }
  }

  public reset() {
    this.state = { ...this.state, computerDice: null, userDice: null, isUserFirst: false };
  }
}

const cryptoGenerator = new CryptoGenerator();
const rlHandler = new ReadLineHandler();
const randomNum = new NumberGenerator();
const initialGameCondition = new InitialGameCondition();
const probabilityCalculator = new ProbabilityCalculator();

const app = new GameContext(
  initialGameCondition,
  cryptoGenerator,
  rlHandler,
  randomNum,
  probabilityCalculator
);

app.request();