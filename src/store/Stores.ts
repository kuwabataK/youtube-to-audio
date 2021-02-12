import YoutubeStore from "@/store/youtubeStore/YoutubeStore";
import DataStore from "@/store/DataStore/DataStore";
import LoginStore from "@/store/LoginStore/LoginStore";

/**
 * このプロジェクトで利用するStoreのMapリスト
 */
export const StoreIndex = {
  YoutubeStore,
  DataStore,
  LoginStore,
};

export type StoresType = typeof StoreIndex;

/**
 * StoreIndexからStoreの実体のみを抽出したMapを返す
 */
const GeneratedStores = () => {
  // eslint-disable @typescript-eslint/no-explicit-any
  const result: { [key: string]: any } = {};
  Object.entries(StoreIndex).forEach(([key, val]) => {
    result[key] = val.value;
  });
  return result as Partial<{ [K in keyof StoresType]: StoresType[K]["value"] }>;
};

export default GeneratedStores;
