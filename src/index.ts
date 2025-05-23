import { CryptoGenerator } from "./components/crypto-generator";
import { NumberGenerator } from "./components/number-generator";
import { ReadLineHandler } from "./components/read-line-handler";
import { GameState } from "./models/interfaces/game-state";
import { InitialGameCondition } from "./state/initial-game-condition";

export class GameContext {
  private currentState: GameState;
  public hashCreator: CryptoGenerator;
  public rl: ReadLineHandler;
  public randomNum: NumberGenerator;
  public state: { dice: number[] } = { dice: [] }

  constructor(
    initialState: GameState,
    hashCreator: CryptoGenerator,
    rl: ReadLineHandler,
    randomNum: NumberGenerator
  ) {
    this.currentState = initialState;
    this.hashCreator = hashCreator;
    this.rl = rl;
    this.randomNum = randomNum;
  }

  public changeState(newState: GameState): void {
    this.currentState = newState;
  }

  public async request(): Promise<void> {
    await this.currentState.handle(this);
  }

  public exit(exitCode: number = 0): void {
    this.rl.close();
    process.exit(exitCode);
  }
}

const cryptoGenerator = new CryptoGenerator();
const rlHandler = new ReadLineHandler();
const randomNum = new NumberGenerator();
const initialGameCondition = new InitialGameCondition();

const app = new GameContext(
  initialGameCondition,
  cryptoGenerator,
  rlHandler,
  randomNum
);

app.request()