import * as readline from "node:readline/promises"

import { stdin as input, stdout as output } from "node:process";
import { customLog } from "../utils/custom-log";

export class ReadLineHandler {
  private rl = readline.createInterface({ input, output });

  async askQuestion(question: string) {
    try {
      const answer = await this.rl.question(question);
      return answer;
    } catch (err) {
      if (err.name === "AbortError") {
        await this.close();
      } else {
        await customLog(`Unexpected error 👀: ${err}`);
      }
    }
  }

  public async close(exitCode: number = 0) {
    await customLog("Closing game... 👀");
    this.rl.close();
    process.exit(exitCode);
  }
}