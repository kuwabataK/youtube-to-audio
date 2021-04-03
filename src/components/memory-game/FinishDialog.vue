<template>
  <div class="finish-dialog">
    <v-dialog :value="isShow" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          クリア!!
        </v-card-title>
        <v-card-text class="descriptions">
          🎉クリアおめでとう🎉
          <br />
          あなたのスバ友力は
          <br />
          <span class="score"> {{ score }}万 </span>
          <br />
          です
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="onClickOk">
            閉じる
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from "@vue/composition-api";

export default defineComponent({
  name: "FinishDialog",
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    totalCardNumber: {
      type: Number,
      required: true
    },
    totalClickNumber: {
      type: Number,
      required: true
    }
  },
  emits: ["clickOk"],
  setup(props, context) {
    const score = computed(() => {
      return props.totalCardNumber * 4 - props.totalClickNumber;
    });

    /**
     * 閉じるを押したときの処理
     */
    const onClickOk = () => {
      context.emit("clickOk");
    };
    return {
      onClickOk,
      score
    };
  }
});
</script>

<style lang="scss" scoped>
.descriptions {
  font-size: 20px;
  .score {
    font-size: 40px;
    font-weight: bold;
    min-height: 40px;
  }
}
</style>
