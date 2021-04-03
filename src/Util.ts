/**
 * キャンセル可能なsleepメソッド
 * @param msec Sleepする時間（msec）
 */
export function sleep(msec: number) {
  let clearTimeoutId = null as null | NodeJS.Timeout;
  let resolver = null as null | ((arg?: unknown) => void);
  /**
   * await awaiter() を実行することで一定時間実行を停止する
   */
  const awaiter = new Promise(resolve => {
    clearTimeoutId = setTimeout(resolve, msec);
    resolver = resolve;
  });
  /**
   * このSleep関数の実行をキャンセルする
   * @returns
   */
  const cancel = () => {
    if (!clearTimeoutId || !resolver) return;
    clearTimeout(clearTimeoutId);
    resolver();
  };
  return {
    awaiter,
    cancel
  };
}

export function parseToSec(str: string) {
  const times = str.split(":");
  if (times.length === 3) {
    return (
      parseInt(times[0]) * 3600 + parseInt(times[1]) * 60 + parseFloat(times[2])
    );
  } else if (times.length === 2) {
    return parseInt(times[0]) * 60 + parseFloat(times[1]);
  }
  return parseFloat(times[0]);
}

export function parseToSecStr(sec: number) {
  if (sec < 60) {
    return sec.toString();
  }
  if (sec < 60 * 60) {
    return `${Math.floor(sec / 60)}:${sec % 60}`;
  }
  return `${Math.floor(sec / 3600)}:${Math.floor((sec % 3600) / 60)}:${sec %
    60}`;
}

/**
 * URLからvideoIdを取得する
 * @param url
 */
export function getVideoIdFromUrl(url: string) {
  if (new URL(url).hostname.indexOf("youtu.be") !== -1) {
    return new URL(url).pathname.replace("/", "");
  }
  return new URL(url).searchParams.get("v") as string;
}
/**
 * videoIdからURLを取得する
 * @param videoId
 * @param startTime
 */
export function getUrlFromId(videoId: string, startTime = 0) {
  return `https://www.youtube.com/watch?v=${videoId}&t=${Math.floor(
    startTime || 1
  ) - 1}`;
}

export function isMobile() {
  const userAgent = window.navigator.userAgent.toLowerCase();
  if (userAgent.indexOf("iphone") !== -1) {
    return true;
  }
  if (userAgent.indexOf("ipad") !== -1) {
    return true;
  }
  if (userAgent.indexOf("android") !== -1) {
    return true;
  }
  return false;
}

export function canPlayAudio() {
  const userAgent = window.navigator.userAgent.toLowerCase();
  if (userAgent.indexOf("iphone") !== -1) {
    return false;
  }
  if (userAgent.indexOf("ipad") !== -1) {
    return false;
  }
  if (userAgent.indexOf("android") !== -1) {
    return false;
  }
  if (userAgent.indexOf("chrome") !== -1) {
    return true;
  }
  if (userAgent.indexOf("safari") !== -1) {
    return true;
  }
  if (userAgent.indexOf("firefox") !== -1) {
    return true;
  }
  return false;
}

/**
 * 配列をランダムに並び替える
 */
export function shuffle<T>([...array]: T[]): T[] {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
