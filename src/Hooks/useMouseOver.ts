import { computed, reactive } from "@vue/composition-api";
import { stat } from "fs";

export default function useMouseOver() {
  const state = reactive({
    isMouseOver: false,
  });
  const onMouseOver = () => {
    state.isMouseOver = true;
  };
  const onMouseLeave = () => {
    state.isMouseOver = false;
  };
  return {
    isMouseOver: computed(() => {
      return state.isMouseOver;
    }),
    onMouseOver,
    onMouseLeave,
  };
}
