<script setup>
import {shareApi} from "@/apis/index.js"

const props = defineProps({
    selectedIds: {type: Array, required: true}
})
const panelShow = ref(false)     // 是否显示模态框
const timeout = ref(7)           // 用户选中的有效期
const name = ref("")             // 用户输入的名称
const password = ref("")         // 用户输入的提取码
const autoPassword = ref(true)   // 是否随机生成提取码
const contentType = ref("选项")   // 模态框里内容的类型，值为“选项”或“分享”
const link = ref("")             // 分享链接

async function handleClickShare() {
    link.value = await shareApi.create(name.value, password.value, timeout.value, props.selectedIds.join(","))
    contentType.value = "分享"
}

watch(panelShow, (value) => {
    // 模态框关闭时恢复属性的默认值
    if (!value) {
        timeout.value = 7
        name.value = ""
        password.value = ""
        autoPassword.value = true
        contentType.value = "选项"
    }
})

function setShowPanel(value) {
    panelShow.value = value
}

defineExpose({
    setShowPanel
})
</script>

<template>
<n-modal class="panel" v-model:show="panelShow">
    <n-card title="分享文件" closable @close="panelShow = false">
        <n-flex v-if="contentType === '选项'" class="option" vertical>
            <n-flex class="name" align="center">
                <span>名称：</span>
                <div>
                    <n-input v-model:value="name" type="text" placeholder="请输入分享名称"/>
                </div>
            </n-flex>
            <n-flex class="timeout" align="center">
                <span>有效期：</span>
                <n-radio-group v-model:value="timeout" name="timeout">
                    <n-radio :value="1">1天</n-radio>
                    <n-radio :value="7">7天</n-radio>
                    <n-radio :value="30">30天</n-radio>
                    <n-radio :value="0">永久有效</n-radio>
                </n-radio-group>
            </n-flex>
            <n-flex class="password">
                <span>提取码：</span>
                <n-radio-group v-model:value="autoPassword" name="password" :default-value="true">
                    <n-radio name="password" :value="true">系统随机生成提取码</n-radio>
                    <n-flex align="center">
                        <n-radio name="password" :value="false"/>
                        <div>
                            <n-input :disabled="autoPassword" v-model:value="password" :maxlength="4"
                                     :allow-input="value => /^[0-9a-z]{0,4}$/.test(value)"
                                     type="text" placeholder="请输入4位提取码"/>
                        </div>
                        <span>仅支持数字及英文字母</span>
                    </n-flex>
                </n-radio-group>
            </n-flex>
            <n-button type="info" round @click="handleClickShare">创建链接</n-button>
        </n-flex>
        <n-flex v-else-if="contentType === '分享'" class="share" vertical>
            {{link}}
        </n-flex>
    </n-card>
</n-modal>
</template>

<style scoped lang="scss">

</style>