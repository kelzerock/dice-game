import * as readline from "node:readline/promises"

import { stdin as input, stdout as output } from "node:process";

process.on("SIGINT", () => {
  console.log("\nProcess interrupted with Ctrl+C");
  // this.rl.close();
  process.exit(0);
});
export class ReadLineHandler {
  private rl = readline.createInterface({ input, output });

  constructor() {
  }

  async askQuestion(question: string) {
    try {
      const answer = await this.rl.question(question);
      return answer;
    } finally {
    }
  }

  close() {
    this.rl.close();
  }
}