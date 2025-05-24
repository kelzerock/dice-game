import { DELAY_MESSAGE } from "../constants/constants";

const log = (str: string): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(str);
      resolve();
    }, DELAY_MESSAGE);
  });
}
export const customLog = async (data: string | string[]): Promise<void> => {
  if (Array.isArray(data)) {
    for (const str of data) {
      await log(str);
    }
  } else {
    await log(data);
  }
};
