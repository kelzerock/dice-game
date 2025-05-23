import { GameContext } from "../..";

export interface GameState {
  handle(context: GameContext): Promise<void>;
}