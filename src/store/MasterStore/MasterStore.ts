import { canPlayAudio } from "@/Util";
import { reactive } from "@vue/composition-api";
import { StoreBase, ValueType } from "../StoreBase";

/* eslint-disable class-methods-use-this */
class MasterStore implements StoreBase {
  createStore() {
    const state = reactive({
      isShowVideo: !canPlayAudio()
    });
    return {
      state
    };
  }
}

const value: ValueType<MasterStore> = {};

export default {
  createStore: new MasterStore().createStore,
  value
};
