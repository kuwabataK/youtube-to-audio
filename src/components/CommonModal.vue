<template>
  <v-container>
    <v-dialog
      :value="state.isOpen"
      persistent
      :width="width"
      max-width="1000px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ state.title }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            {{ state.message }}
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="state.isShowCancel"
            color="blue darken-1"
            text
            @click="() => close('Cancel')"
          >
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="() => close('OK')">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script lang="ts">
import { defineComponent, computed } from "@vue/composition-api";
import StoreUtil from "@/store/StoreUtil";

export default defineComponent({
  name: "CommonModal",
  setup() {
    const { state, close } = StoreUtil.useStore("CommonDialogStore");

    return {
      state,
      close,
      width: computed(() => {
        return `${state.width}px`;
      })
    };
  }
});
</script>
