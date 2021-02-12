<template>
  <div>
    <CreateVoiceModal
      v-if="state.isOpenCreateModal"
      @close="state.isOpenCreateModal = false"
      :editDataId="state.editDataId"
    />
    <v-container>
      <v-col>
        VTuberのyoutube動画を読み込んで、指定箇所の音声を再生できるボタンを作成 /
        共有できるサイトです。
      </v-col>
      <v-col cols="12">
        <v-btn
          color="primary"
          class="mt-10"
          :disabled="isDisableCreateButton"
          @click="
            () => {
              state.editDataId = null;
              state.isOpenCreateModal = true;
            }
          "
        >
          ボタンをつくる
        </v-btn>
      </v-col>
      <v-col cols="12">
        ※ボタンの追加はPCブラウザでのみ利用できます
      </v-col>
      <div class="filter-button-container">
        <div class="filter-buttons">
          <v-switch
            inset
            v-model="dataStore.state.showOnlyUserData"
            label="自分の作ったボタンのみ表示"
            hide-details
          ></v-switch>
        </div>
      </div>
      <v-col cols="12">
        <link-label
          v-for="data in filteredDataSet"
          :key="data.id"
          :videoId="data.videoId"
          :color="data.color"
          :start="data.start"
          :end="data.end"
          :title="data.title"
          :showEditButton="data.isOwnData && !isDisableCreateButton"
          :volume="data.volume"
          @openEdit="openEdit(data.id)"
        />
      </v-col>
      <v-col cols="12">
        ※youtubeの動画を再生しているので、広告が再生される場合があります
        <p />
        ※生放送終了直後の動画をボタンにするとうまく再生できない場合があります
        <p />
        m(_ _)m
      </v-col>
      <v-col cols="12"> </v-col>
    </v-container>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, computed, onMounted } from "@vue/composition-api";
import CreateVoiceModal from "@/components/CreateVoiceModal.vue";
import LinkLabel from "@/components/LinkLabel.vue";
import StoreUtil from "@/store/StoreUtil";
import { canPlayAudio, isMobile } from "@/Util";

export default defineComponent({
  name: "CreateVoicePage",
  components: {
    CreateVoiceModal,
    LinkLabel,
  },
  setup() {
    const { dataSet, filteredDataSet } = StoreUtil.useStore("DataStore");
    const state = reactive({
      isOpenCreateModal: false,
      editDataId: null as string | null,
    });
    const openEdit = (id: string) => {
      state.editDataId = id;
      state.isOpenCreateModal = true;
    };
    const editedData = computed(() => {
      return dataSet.value.find((d) => d.id === state.editDataId);
    });
    const dataStore = StoreUtil.useStore("DataStore");
    const { yt } = StoreUtil.useStore("YoutubeStore");
    const loginStore = StoreUtil.useStore("LoginStore");
    return {
      get isLogin() {
        return loginStore.isLogin;
      },
      loginStore,
      canPlayAudio: canPlayAudio(),
      yt,
      dataStore,
      filteredDataSet,
      /**
       * Createボタンを非アクティブにするかどうか
       */
      isDisableCreateButton: computed(() => {
        return isMobile();
      }),
      state,
      dataSet,
      openEdit,
      editedData,
    };
  },
});
</script>

<style lang="scss">
.main-player {
  iframe {
    max-width: 100% !important;
  }
}
.filter-button-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  .filter-buttons {
  }
}
</style>
