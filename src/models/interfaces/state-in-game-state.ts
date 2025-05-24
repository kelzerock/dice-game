import { Dice } from "./dice";

export interface StateInGameState {
  dices: Dice[],
  userDice: Dice | null,
  computerDice: Dice | null,
  isUserFirst: boolean
}

