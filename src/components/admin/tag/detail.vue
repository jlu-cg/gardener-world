<template>
  <div class="tag-form">
    <el-form ref="tag" :model="tag" label-width="160px">
      <el-form-item label="名称">
        {{tag.name}}
      </el-form-item>
      <el-form-item label="标签分类">
        <el-radio disabled v-model="tag.tagType" :label="1">主话题</el-radio>
        <el-radio disabled v-model="tag.tagType" :label="2">非主话题</el-radio>
      </el-form-item>
      <el-form-item>
        <el-button @click="backToList">回到列表页</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'AdminTagDetail',
  data() {
    return {
      tag : {
        id : "3",
        name : "",
        tagType : 2
      }
    };
  },
  methods: {
    backToList(){
      window.location.href = '#/admin/tag/list';
    }
  }
}
</script>

<style>
.tag-form{
    width: 540px;
}
</style>