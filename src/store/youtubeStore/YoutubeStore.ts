import useId from "@/Hooks/useId";
import useYoutube from "@/Hooks/useYoutube";
import { StoreBase, ValueType } from "../StoreBase";

/* eslint-disable class-methods-use-this */
class YootubeStore implements StoreBase {
  createStore() {
    const ids = useId(["youtube"]);
    const yt = useYoutube(ids.youtube);
    return {
      yt,
      get id() {
        return ids.youtube;
      },
    };
  }
}

const value: ValueType<YootubeStore> = {};

export default {
  createStore: new YootubeStore().createStore,
  value,
};
