import useId from "@/Hooks/useId";
import useYoutube from "@/Hooks/useYoutube";
import { canPlayAudio } from "@/Util";
import { reactive } from "@vue/composition-api";
import { StoreBase, ValueType } from "../StoreBase";

/* eslint-disable class-methods-use-this */
class YoutubeStore implements StoreBase {
  createStore() {
    const ids = useId(["youtube"]);
    const yt = useYoutube(ids.youtube);
    const state = reactive({
      isShowVideo: !canPlayAudio()
    });
    return {
      state,
      yt,
      get id() {
        return ids.youtube;
      }
    };
  }
}

const value: ValueType<YoutubeStore> = {};

export default {
  createStore: new YoutubeStore().createStore,
  value
};
