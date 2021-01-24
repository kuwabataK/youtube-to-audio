import Stores, { StoreIndex } from './Stores'

export default class StoreUtil {
  /**
   * 引数で指定したストアを利用する
   * @param storeName 利用するStoreの名前
   */
  static useStore<T extends keyof typeof StoreIndex>(storeName: T) {
    const store = Stores()[storeName as keyof ReturnType<typeof Stores>]
    if (!store) {
      throw new Error(`${storeName} is not provided`)
    }
    return store as NonNullable<Required<ReturnType<typeof Stores>[T]>>
  }

  /**
   * ストアを作成する
   * VueCompositionAPIを使用している関係上、
   * Vue.use(VueCompositionAPI)実行後にこの関数を実行し、
   * Storeのインスタンスを作成するようにする
   */
  static generateStore() {
    Object.entries(StoreIndex).forEach(([key, store]) => {
      StoreIndex[key as keyof typeof StoreIndex].value = store.createStore()
    })
  }
}
