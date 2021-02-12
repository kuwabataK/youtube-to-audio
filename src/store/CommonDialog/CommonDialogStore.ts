import { computed, reactive, watch } from "@vue/composition-api";
import { StoreBase, ValueType } from "../StoreBase";
import { fireBaseUtil } from "@/main";
import LoginStore from "../LoginStore/LoginStore";
import { stringify } from "uuid";

type openArg = {
  title: string;
  message: string;
  isShowCancel?: boolean;
  width?: number;
};

/**
 * 表示するタグを管理するためのStore
 */
/* eslint-disable class-methods-use-this */
class CommonDialogStore implements StoreBase {
  createStore() {
    const state = reactive({
      isOpen: false,
      resolver: null as null | ((val: "OK" | "Cancel") => void),
      title: "",
      message: "",
      isShowCancel: true,
      width: 600,
    });
    /**
     * ダイアログを表示する
     * @param param0
     */
    const open = ({
      title,
      message,
      isShowCancel = true,
      width = 600,
    }: openArg): Promise<"OK" | "Cancel"> => {
      return new Promise((resolve) => {
        state.resolver = resolve;
        state.isOpen = true;
        state.title = title;
        state.message = message;
        state.width = width;
        state.isShowCancel = isShowCancel;
      });
    };
    /**
     * ダイアログを閉じる
     * @param button
     */
    const close = (button: "OK" | "Cancel") => {
      if (state.resolver) {
        state.resolver(button);
        state.isOpen = false;
        state.resolver = null;
      }
    };
    return {
      state,
      open,
      close,
    };
  }
}

const value: ValueType<CommonDialogStore> = {};

export default {
  createStore: new CommonDialogStore().createStore,
  value,
};
