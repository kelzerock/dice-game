import { GameContext } from "..";
import { GameState } from "../models/interfaces/game-state";

export class RollDice implements GameState {
  private isUserFirst: boolean = false

  async handle(context: GameContext): Promise<void> {
    console.log("It's time to roll dices!🎲🎲")

    this.startRoll(context)
  }

  private startRoll(context: GameContext) {
    this.isUserFirst = context.state.isUserFirst;
  }


}