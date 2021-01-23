import { reactive } from "@vue/composition-api";
import { v4 as uuidv4 } from "uuid";

export default function useId<T extends string>(
  keys: T[]
): { [key in T]: string } {
  const rnd = uuidv4();
  return reactive(
    keys.reduce((acc, cur) => {
      acc[cur] = `a${cur}${rnd}`;
      return acc;
    }, Object.create(null))
  );
}
