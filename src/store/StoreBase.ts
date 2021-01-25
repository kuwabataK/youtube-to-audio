export interface StoreBase {
  /**
   * このストアで利用するComposition apiを定義する
   */
  createStore: () => object;
}

/**
 * このストアのcreateStoreの返り値を返す
 */
export type ValueType<T extends StoreBase> = Partial<
  ReturnType<T["createStore"]>
>;
