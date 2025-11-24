<template>
  <div class="p-6">
    <el-card>
      <template #header>
        <span class="text-lg font-semibold">数据导入</span>
      </template>
      <el-upload class="upload-demo" drag action="#" multiple>
        <SvgIcon icon="ri:upload-cloud-line" size="64" class="text-gray-400" />
        <div class="el-upload__text mt-4">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">支持 xlsx, xls, csv 格式文件，单个文件不超过 10MB</div>
        </template>
      </el-upload>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'DataImportPage'
})
</script>
