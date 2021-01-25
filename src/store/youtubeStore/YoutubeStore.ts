import useId from "@/Hooks/useId";
import useYoutube from "@/Hooks/useYoutube";
import { StoreBase, ValueType } from "../StoreBase";

/* eslint-disable class-methods-use-this */
class YoutubeStore implements StoreBase {
  createStore() {
    const ids = useId(["youtube"]);
    const yt = useYoutube(ids.youtube);
    return {
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
