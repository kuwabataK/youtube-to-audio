<template>
  <!-- メインの中身  -->
  <div>
    <link-label
      v-for="data in dataSet"
      :key="data.id"
      :videoId="data.videoId"
      :color="data.color"
      :start="data.start"
      :end="data.end"
      :title="data.title"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from "@vue/composition-api";
import LinkLabel from "@/components/LinkLabel.vue";
import StoreUtil from "@/store/StoreUtil";

export default defineComponent({
  name: "Home",
  components: {
    LinkLabel,
  },
  setup() {
    const { dataSet } = StoreUtil.useStore("DataStore");
    return {
      dataSet,
    };
  },
});
</script>
