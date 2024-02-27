<script setup>
import ResourceItem from "./resource-item.vue"

const props = defineProps({
    files: {type: Array, required: true},
    selectedIds: {type: Array, required: true},
    clickResourceCallback: {type: Function, required: true}
})
const emits = defineEmits(["update:selectedIds"])
const ids = ref(props.selectedIds.slice())

watch(ids, (value) => {
    emits("update:selectedIds", value)
})
</script>

<template>
<n-checkbox-group class="window" v-model:value="ids">
    <n-scrollbar>
        <n-flex align="start">
            <resource-item v-for="file in files" :key="file.id"
                           :id="file.id" :is-folder="file.folder" :name="file.name" :selected-ids="selectedIds"
                           @clickResource="clickResourceCallback"/>
        </n-flex>
    </n-scrollbar>
</n-checkbox-group>
</template>

<style scoped lang="scss">
.window {
    width: 100%;
    height: 100%;
}
</style>