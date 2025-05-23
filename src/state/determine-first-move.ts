import { GameContext } from "..";
import { GameState } from "../models/interfaces/game-state";

export class DetermineFirstMove implements GameState {
  async handle(context: GameContext): Promise<void> {
  }
}