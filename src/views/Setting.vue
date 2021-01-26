<template>
  <!-- メインの中身  -->
  <div></div>
</template>
<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import StoreUtil from "@/store/StoreUtil";

export default defineComponent({
  name: "Setting",
  setup() {
    const masterStore = StoreUtil.useStore("MasterStore");
    return {};
  },
});
</script>
