<template>
  <div>
    <CreateVoiceModal
      v-if="state.isOpenCreateModal"
      @close="state.isOpenCreateModal = false"
      :editDataId="state.editDataId"
    />
    <v-container>
      <v-col cols="12">
        <link-label
          v-for="data in dataSetOnlyUser"
          :key="data.id"
          :videoId="data.videoId"
          :color="data.color"
          :start="data.start"
          :end="data.end"
          :title="data.title"
          :showEditButton="true"
          @openEdit="openEdit(data.id)"
        />
      </v-col>
      <v-col cols="12">
        <v-btn
          color="primary"
          class="mt-10"
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
    </v-container>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, computed } from "@vue/composition-api";
import CreateVoiceModal from "@/components/CreateVoiceModal.vue";
import LinkLabel from "@/components/LinkLabel.vue";
import StoreUtil from "@/store/StoreUtil";

export default defineComponent({
  name: "CreateVoicePage",
  components: {
    CreateVoiceModal,
    LinkLabel
  },
  setup() {
    const { dataSetOnlyUser } = StoreUtil.useStore("DataStore");
    const state = reactive({
      isOpenCreateModal: false,
      editDataId: null as string | null
    });
    const openEdit = (id: string) => {
      state.editDataId = id;
      state.isOpenCreateModal = true;
    };
    const editedData = computed(() => {
      return dataSetOnlyUser.value.find(d => d.id === state.editDataId);
    });
    return {
      state,
      dataSetOnlyUser,
      openEdit,
      editedData
    };
  }
});
</script>
