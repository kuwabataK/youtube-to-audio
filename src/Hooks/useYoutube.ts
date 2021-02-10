import { sleep } from "@/Util";
import { reactive, watch } from "@vue/composition-api";

type loadVideoType = {
  videoId: string;
  startSeconds: number;
  endSeconds: number;
  suggestedQuality?: string;
};
export type Player = {
  getCurrentTime: () => number;
  /**
   * 1のとき再生中
   * 2で一時停止
   */
  getPlayerState: () => number;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setPlaybackQuality: (suggestedQuality: string) => void;
  destroy: () => void;
  loadVideoById: (args: loadVideoType) => void;
};

export type PlayerVars = {
  start?: number;
  end?: number;
  autoPlay?: 0 | 1;
  cc_lang_pref?: string;
  cc_load_policy?: 0 | 1;
  color?: "red" | "white";
  controls?: 0 | 1;
  origin?: string;
};

export type LoadVideoOptions = {
  height?: number;
  width?: number;
  playerVars?: PlayerVars;
};

/**
 * youtube apiを使用するための準備を行う
 */
export const loadYoutubeApi = () => {
  // youtube apiをloadする
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";

  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
};

/**
 * youtubeを操作する関数を提供する
 * @param id Domのid
 */
export default function useYoutube(id: string) {
  const state = reactive({
    /**
     * Videoの読み込みが完了しているかどうか
     */
    isReady: false,
    /**
     * playerインスタンス
     */
    player: null as null | Player,
    /**
     * currentTimeを更新するためのsetInnervalIdを保存する場所
     */
    currentTimeWatcherId: null as null | NodeJS.Timeout,
    /**
     * 動画の現在時刻(秒)
     */
    currentTime: null as null | number,
    /**
     * 動画の開始時刻（秒）
     */
    startTime: undefined as undefined | number,
    /**
     * 動画の終了時刻（秒）
     */
    endTime: undefined as number | undefined,
    /**
     * ループ再生するかどうか
     */
    isLoop: false,
    width: 480,
    height: 480 * (9 / 16),
    /**
     * 動画のVolume
     */
    volume: 50,
  });

  /**
   * youtube操作用のAPIの読み込みが完了しているかどうか
   */
  const isPreparedYoutube = () => {
    return !!((window as any).YT && (window as any).YT.Player);
  };

  /**
   * currentTimeを更新するためのListener
   */
  const addTimeListener = () => {
    if (state.currentTimeWatcherId) return;
    state.currentTimeWatcherId = setInterval(() => {
      if (state.player) {
        const time = state.player.getCurrentTime();
        state.currentTime = time;
      }
    }, 50);
  };

  const removeTimeListener = () => {
    if (state.currentTimeWatcherId) {
      clearInterval(state.currentTimeWatcherId);
    }
  };

  watch(
    () => state.currentTime,
    () => {
      // endTimeを超えたときの処理
      if (state.endTime != null && state.currentTime != null && state.currentTime > state.endTime) {
        if (state.isLoop) {
          state.player?.seekTo(state.startTime || 0, true);
          state.player?.playVideo();
        } else {
          state.player?.pauseVideo();
          state.player?.seekTo(state.endTime || 0, true);
        }
      }
    }
  );

  watch(
    () => state.startTime,
    () => {
      // startTimeがendTimeを超えないようにしておく
      if (state.startTime == null || state.endTime == null) return;
      if (state.startTime >= state.endTime) {
        state.endTime = state.startTime + 1;
      }
    }
  );

  /**
   * ビデオをロードする
   * @param videoId ロードするVideoId
   */
  const loadVideo = async (videoId: string, options: LoadVideoOptions = {}): Promise<Player> => {
    if (!isPreparedYoutube()) {
      await sleep(300);
      return loadVideo(videoId);
    }
    if (state.player) {
      state.player.destroy();
    }
    return new Promise((resolve) => {
      // the Player object is created uniquely based on the id in props

      state.player = new (window as any).YT.Player(id, {
        width: state.width,
        height: state.height,
        ...options,
        playerVars: {
          ...(options.playerVars || {}),
          start: undefined,
          end: undefined,
        },
        videoId,
        events: {
          onReady: () => {
            state.isReady = true;
            addTimeListener();
            if (options.playerVars?.start != null) {
              state.player?.seekTo(options.playerVars.start, true);
            }
            state.player?.setVolume(state.volume);
            state.startTime = options.playerVars?.start;
            state.endTime = options.playerVars?.end;
            resolve(state.player as Player);
          },
        },
      });
    });
  };

  /**
   * volumeの変更をplayerに反映する
   */
  watch(
    () => state.volume,
    () => {
      if (state.player) {
        state.player.setVolume(state.volume);
      }
    }
  );

  const destroy = () => {
    state.player?.destroy();
    removeTimeListener();
  };

  return {
    /**
     * Videoの読み込みが完了しているかどうか
     */
    get isReady() {
      return state.isReady;
    },
    loadVideo,
    get player() {
      return state.player;
    },
    /**
     * ループ再生するかどうか
     */
    get isLoop() {
      return state.isLoop;
    },
    /**
     * ループ再生するかどうか
     */
    set isLoop(val: boolean) {
      state.isLoop = val;
    },
    /**
     * プレイヤー削除時に実行するメソッド
     */
    destroy,
    /**
     * 動画の現在時刻を返す
     */
    get currentTime() {
      return state.currentTime;
    },
    get startTime() {
      return state.startTime;
    },
    get endTime() {
      return state.endTime;
    },
    /**
     * 音量
     */
    get volume() {
      return state.volume;
    },
    /**
     * 音量
     */
    set volume(volume: number) {
      state.volume = volume;
    },
  };
}
