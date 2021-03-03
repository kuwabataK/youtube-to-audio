<template>
  <div class="about">
    <h1>About</h1>
    このサイトは非公式サイトです。再生できる動画 / 音声の公開元企業/団体/個人とは関係はありません
    <p />
    要望 / 不具合等ありましたらこちらまで →
    <a href="https://twitter.com/CocoaCurumi">Twitter</a>
    <p />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "@vue/composition-api";
import ExArray from "@/util/ExArray";

export default defineComponent({
  name: "About",
  setup() {
    const test = () => {
      const arr = ExArray.generate([{ id: 5 }, { id: 1 }, { id: 3 }, { id: 2 }, { id: 4 }]);
      const b = arr.safeSort((a, b) => {
        return a.id - b.id;
      });
      console.log("ソート前だよ" + arr.map((a) => a.id));
      console.log("ソート後だよ" + b.map((a) => a.id));
      console.log(arr[0]);
      console.log(b[0]);
      console.log("get" + arr.get(3).id);
      console.log("get" + arr.get(3).id);
      console.log("get" + arr.get(3).id);
      console.log("get" + arr.get(3).id);
      console.log("get" + arr.get(3).id);
      console.log("get" + arr.get(3).id);
      console.log("value");
      console.log(arr.value);

      const c = arr.map(() => "マップだよ").map(() => "２重に変換したよ") as any;
      console.log(c.isExArray);
      console.log(
        c.safeSort((a: any, b: any) => {
          return a - b;
        })
      );
      console.log(c.value.isExArray);
    };
    onMounted(() => {
      test();
    });
  },
});
</script>
