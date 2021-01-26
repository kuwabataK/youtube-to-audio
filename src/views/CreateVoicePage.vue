<template>
  <div>
    <CreateVoiceModal
      v-if="state.isOpenCreateModal"
      @close="state.isOpenCreateModal = false"
      :editDataId="state.editDataId"
    />
    <v-container>
      <v-col cols="12" v-show="masterStore.state.isShowVideo">
        <div class="main-player">
          <div :id="playerDivId" />
        </div>
      </v-col>
      <v-row style="justify-content: center;">
        <v-col cols="6">
          <v-switch
            cols="6"
            v-model="masterStore.state.isShowVideo"
            hide-details
            :disabled="!canPlayAudio"
            label="動画プレイヤーを表示"
          ></v-switch>
          <v-switch
            cols="6"
            v-model="dataStore.state.showOnlyUserData"
            label="自分のボタンのみ表示"
            hide-details
          ></v-switch>
        </v-col>
      </v-row>
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
          Create Button
        </v-btn>
      </v-col>
      <v-col cols="12">
        <link-label
          v-for="data in filteredDataSet"
          :key="data.id"
          :videoId="data.videoId"
          :color="data.color"
          :start="data.start"
          :end="data.end"
          :title="data.title"
          :showEditButton="data.isOwnData"
          @openEdit="openEdit(data.id)"
        />
      </v-col>
      <v-col cols="12">
        ※PC版Chrome以外の環境では動画プレイヤーを非表示にできません。ご了承ください・・・m(_
        _)m
        <p />
        ※ボタンの追加はPC版でのみ利用できます
        <p />
        ※youtubeの動画を再生しているので、広告が再生される場合があります
        <p />
        *生放送終了直後の動画をボタンにするとうまく再生できない場合があります
      </v-col>
      <v-col cols="12"> </v-col>
    </v-container>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  computed,
  onMounted
} from "@vue/composition-api";
import CreateVoiceModal from "@/components/CreateVoiceModal.vue";
import LinkLabel from "@/components/LinkLabel.vue";
import StoreUtil from "@/store/StoreUtil";
import { isMobile, sleep, canPlayAudio } from "@/Util";

const firstVideoSourceId = "mZ0sJQC8qkE";

export default defineComponent({
  name: "CreateVoicePage",
  components: {
    CreateVoiceModal,
    LinkLabel
  },
  setup() {
    const { dataSet, filteredDataSet } = StoreUtil.useStore("DataStore");
    const state = reactive({
      isOpenCreateModal: false,
      editDataId: null as string | null
    });
    const openEdit = (id: string) => {
      state.editDataId = id;
      state.isOpenCreateModal = true;
    };
    const editedData = computed(() => {
      return dataSet.value.find(d => d.id === state.editDataId);
    });
    const masterStore = StoreUtil.useStore("MasterStore");
    const dataStore = StoreUtil.useStore("DataStore");
    const { yt, id: playerDivId } = StoreUtil.useStore("YoutubeStore");
    onMounted(async () => {
      // ロード完了から1秒待ってplayerを準備する
      await sleep(1000);
      yt.loadVideo(firstVideoSourceId);
    });
    return {
      canPlayAudio: canPlayAudio(),
      playerDivId,
      yt,
      dataStore,
      filteredDataSet,
      masterStore,
      get isDisableCreateButton() {
        return isMobile();
      },
      state,
      dataSet,
      openEdit,
      editedData
    };
  }
});
</script>

<style lang="scss">
.main-player {
  iframe {
    max-width: 100% !important;
  }
}
</style>
