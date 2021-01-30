<template>
  <v-dialog value="true" persistent min-width="800px" max-width="1000px">
    <v-card>
      <v-card-title>
        <span class="headline">ボタンを作成</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="10">
              <v-text-field
                label="Url"
                required
                v-model="state.url"
                hint="動画のURLを貼り付けてください 例 https://www.youtube.com/watch?v=76ykVW5fiK8"
              ></v-text-field>
            </v-col>
            <v-col cols="2" class="mt-4">
              <v-btn small color="primary" @click="setVideoId">読み込み</v-btn>
            </v-col>
            <v-col cols="12">
              <Player
                :videoId="state.videoId"
                @updateCurrentTime="
                  (time) => {
                    state.currentTime = time;
                  }
                "
              />
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="state.startStr"
                type="text"
                label="start"
                hint="動画の開始時刻を指定してください"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="mt-4">
              <v-btn small color="primary" @click="setTimeToStart">今の動画時間をセット</v-btn>
            </v-col>
            <v-col cols="2">
              <v-text-field
                type="text"
                v-model="state.endStr"
                label="end"
                hint="動画の終了時刻を指定してください"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="mt-4">
              <v-btn small color="primary" @click="setTimeToEnd">今の動画時間をセット</v-btn>
            </v-col>
            <v-col cols="2" class="mt-4">
              <v-btn small color="primary" @click="testPlayVideo" :disabled="disableTestPlay"
                >Test Play</v-btn
              >
            </v-col>
            <v-col cols="12">
              <v-text-field label="title" v-model="state.title" type="text" required></v-text-field>
            </v-col>
            <v-col cols="8">
              <v-text-field
                label="tag"
                v-model="state.tag"
                hint="複数指定する場合はカンマ区切りで指定してください"
                type="text"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="4"
              ><v-color-picker
                v-model="state.color"
                mode="hexa"
                dot-size="25"
                hide-canvas
                hide-inputs
                hide-sliders
                show-swatches
                swatches-max-height="75"
              ></v-color-picker>
            </v-col>
            <v-col cols="6">
              <v-switch
                cols="6"
                :value="isPublic"
                @change="setIsPublic"
                :disabled="disabledShare"
                hide-details
                :label="shareLabel"
              ></v-switch>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text @click="deleteData" v-if="state.id">
          Delete
        </v-btn>
        <v-btn color="blue darken-1" text @click="closeDialog">
          Close
        </v-btn>
        <v-btn color="blue darken-1" text @click="saveData" :disabled="disableSave">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { defineComponent, reactive, computed, onMounted, watch } from "@vue/composition-api";
import Player from "./Player.vue";
import { getVideoIdFromUrl, parseToSecStr, parseToSec, getUrlFromId } from "@/Util";
import StoreUtil from "@/store/StoreUtil";
import { v4 as uuidv4 } from "uuid";

export default defineComponent({
  name: "CreateVoiceModal",
  components: { Player },
  props: {
    editDataId: String as () => string | undefined,
  },
  setup(props, context) {
    const state = reactive({
      id: "",
      url: "",
      videoId: "",
      startStr: "0",
      endStr: "0",
      currentTime: 0,
      title: "",
      tag: "",
      color: "",
      access: "private" as "public" | "private",
    });
    const { yt } = StoreUtil.useStore("YoutubeStore");
    const { addData, editData, dataSetOnlyUser, deleteData } = StoreUtil.useStore("DataStore");
    const loginStore = StoreUtil.useStore("LoginStore");
    const { editDataId } = props;
    onMounted(() => {
      if (editDataId) {
        const editData = dataSetOnlyUser.value.find((d) => d.id === editDataId);
        if (!editData) return;
        state.url = getUrlFromId(editData.videoId);
        state.videoId = editData.videoId;
        state.startStr = parseToSecStr(editData.start);
        state.endStr = parseToSecStr(editData.end);
        state.title = editData.title;
        state.tag = editData.tag.join(",");
        state.color = editData.color || "";
        state.id = editData.id;
        state.access = editData.access;
      }
    });
    const startTime = computed(() => {
      return parseToSec(state.startStr);
    });
    const endTime = computed(() => {
      return parseToSec(state.endStr);
    });
    watch(startTime, () => {
      if (startTime.value == null || endTime.value == null) return;
      if (startTime.value >= endTime.value) {
        state.endStr = parseToSecStr(startTime.value + 5);
      }
    });
    /**
     * ダイアログを閉じる
     */
    const closeDialog = () => {
      context.emit("close");
    };
    /**
     * videoIdをセットして、動画をロードする
     */
    const setVideoId = () => {
      if (!state.url) return;
      state.videoId = getVideoIdFromUrl(state.url);
    };
    const setTimeToStart = () => {
      state.startStr = parseToSecStr(state.currentTime);
    };
    const setTimeToEnd = () => {
      state.endStr = parseToSecStr(state.currentTime);
    };
    const testPlayVideo = async () => {
      if (yt.player?.getPlayerState() === 1) {
        yt.player.pauseVideo();
        return;
      }

      yt.player?.loadVideoById({
        videoId: state.videoId,
        startSeconds: parseToSec(state.startStr),
        endSeconds: parseToSec(state.endStr),
      });
      yt.player?.unMute();
      yt.player?.playVideo();
    };
    const disableTestPlay = computed(() => {
      return !state.videoId || !state.startStr || !state.endStr;
    });
    const isPublic = computed(() => {
      return state.access === "public";
    });
    const setIsPublic = (status: boolean) => {
      if (status) {
        state.access = "public";
      } else {
        state.access = "private";
      }
    };
    const disableSave = computed(() => {
      return !state.title || !state.videoId || !state.startStr || !state.endStr;
    });
    const disabledShare = computed(() => {
      return !loginStore.isLogin.value;
    });
    const shareLabel = computed(() => {
      return disabledShare.value ? "ボタンを公開する（ログインが必要です）" : "ボタンを公開する";
    });
    return {
      state,
      props,
      closeDialog,
      setVideoId,
      setTimeToStart,
      setTimeToEnd,
      testPlayVideo,
      disableTestPlay,
      disableSave,
      isPublic,
      setIsPublic,
      disabledShare,
      shareLabel,
      /**
       * データを保存する
       */
      async saveData() {
        if (state.id) {
          const editedData = dataSetOnlyUser.value.find((d) => d.id === editDataId);
          await editData({
            id: state.id,
            title: state.title,
            videoId: state.videoId,
            start: parseToSec(state.startStr),
            end: parseToSec(state.endStr),
            tag: state.tag.split(","),
            color: state.color,
            access: state.access,
            createBy: loginStore.state.user?.uid || "localUser",
            isOwnData: true,
            createdDate: editedData?.createdDate,
            updatedDate: new Date().getTime(),
            isLocalData: !loginStore.isLogin.value,
          });
        } else {
          await addData({
            id: uuidv4(),
            title: state.title,
            videoId: state.videoId,
            start: parseToSec(state.startStr),
            end: parseToSec(state.endStr),
            tag: state.tag.split(","),
            color: state.color,
            access: state.access,
            createBy: loginStore.state.user?.uid || "localUser",
            isOwnData: true,
            createdDate: new Date().getTime(),
            updatedDate: new Date().getTime(),
            isLocalData: !loginStore.isLogin.value,
          });
        }
        closeDialog();
      },
      async deleteData() {
        if (!state.id) return;
        await deleteData(state.id);
        closeDialog();
      },
    };
  },
});
</script>
