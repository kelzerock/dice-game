export const customLog = (str: string): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(str);
      resolve();
    }, 200);
  });
};