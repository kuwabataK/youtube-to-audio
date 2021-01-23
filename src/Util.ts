export function sleep(msec: number) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, msec);
  });
}
