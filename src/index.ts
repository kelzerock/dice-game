import { CryptoGenerator } from "./Components/cryptoGenerator";

class App {
  private hashCreator: CryptoGenerator;

  constructor() {
    this.hashCreator = new CryptoGenerator();
  }

  start() {
    const data = process.argv.slice(2);

    if (data.length === 0) {
      console.log('Please add dice numbers already to start this program like this "main.js 1,2,3,4,5,6 1,2,3,4,5,6 1,2,3,4,5,6". You can use another numbers')
    }
    console.log(this.hashCreator.getHash(""))
  }
}

const app = new App;
app.start();