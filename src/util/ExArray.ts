export type ExArray<T> = Array<T> & {
  safeSort: (func: (a: T, b: T) => number) => ExArray<T>;
  get: (id: number) => T;
  value: Array<T>;
};

/**
 * 非破壊なメソッドを列挙する
 * ここにないメソッドが実行された場合、配列が破壊されている可能性があるので、valueMapをnullに戻す
 */
const safeMethods = ["find", "map", "forEach", "filter", "include", "some", "every"];

export default class ExtendArrayCreator {
  static handler = <K extends any[]>(): ProxyHandler<K> => {
    let valueMap = null as null | Record<string, K>;

    return {
      get(target, prop) {
        if (prop in target) {
          const _prop = prop as number;
          if (target[_prop] instanceof Function) {
            // 既知のメソッド以外の場合は配列が破壊される可能性があるので、valueMapを削除する
            if (!safeMethods.includes((_prop as unknown) as string)) {
              valueMap = null;
            }

            return (...arg: any) => {
              const res = target[_prop](...arg);
              if ("isExArray" in target) {
                return res;
              }
              return Array.isArray(res) ? new Proxy(res, ExtendArrayCreator.handler<K>()) : res;
            };
          }
          return target[_prop];
        }
        // ExArrayかどうかを判定するフラグ
        if (prop === "isExArray") {
          return true;
        }
        // もとの配列を変更しないsort
        if (prop === "safeSort") {
          return new Proxy([...target] as any, ExtendArrayCreator.handler<K>()).sort;
        }
        // idを指定することで計算量を抑えて対象のObjectを探すことのできるget関数
        if (prop === "get") {
          if (target.length === 0) {
            return () => null;
          }
          if (!("id" in target[0])) {
            return () => null;
          }
          // valueMapがまだ作られていない場合は作成する
          if (!valueMap) {
            console.log("valueMapが作られたよ");
            valueMap = {};
            target.forEach((item) => {
              (valueMap as any)[item.id] = item;
            });
          }
          return (id: string) => {
            return (valueMap as any)[id];
          };
        }
        // もとの配列を取得する
        if (prop === "value") {
          return target;
        }
      },
      set(target, key, value) {
        // 配列が変更されたらvalueMapを削除する
        valueMap = null;
        target[key as number] = value;
        return true;
      },
    };
  };

  static generate<T>(targetArray: T[]) {
    return new Proxy(targetArray, ExtendArrayCreator.handler<T[]>()) as ExArray<T>;
  }
}
