<template>
  <div class="tag-form">
    <el-form ref="tag" :model="tag" label-width="160px">
      <el-form-item label="父标签">
        {{parentTag.name}}
      </el-form-item>
      <el-form-item label="父标签路径">
        {{parentTag.namePath}}
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="tag.name"></el-input>
      </el-form-item>
      <el-form-item label="简介">
        <el-input type="textarea" v-model="tag.summary"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">修改</el-button>
        <el-button @click="backToList">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'AdminTagAdd',
  data() {
    return {
      parentTag : {
        id : -1,
        name : "",
        namePath : "",
        path : ""
      },
      tag : {
        id : -1,
        name : "",
        path : "",
        summary : "",
        parentId : -1,
        namePath : ""
      }
    };
  },
  created(){
    this.loadEdit();
  },
  methods: {
    loadEdit(){
      var params = this.gardener.getParams();
      var parentTagId = this.gardener.getParamInt(params['parentTagId'], -1);
      var tagId = this.gardener.getParamInt(params['tagId'], -1);
      if(parentTagId == -1 && tagId == -1){
        this.parentTag.id = 0;
        return ;
      }

      this.axios.get(this.gardener.adminBackBaseURL + 'tag/v1/detail', {
        params: {
          tagId : tagId,
          parentTagId : parentTagId
        }
      }).then((response) => {
        if(tagId != -1){
          this.parentTag = response.data;
        }else{
          this.tag = response.data;
        }
      }).catch((response)=>{
        
      })
    },
    onSubmit() {
      if(this.parentTag.id >= 0){
        this.tag.parentId = this.parentTag.id;
        if(this.parentTag.path === ''){
          if(this.parentTag.id > 0){
            this.tag.path = this.parentTag.id;
          }
        }else{
          this.tag.path = this.parentTag.path + '/' + this.parentTag.id;
        }
        if(this.parentTag.id == 0){
          this.tag.namePath = this.tag.name;
        }else{
          this.tag.namePath = this.parentTag.namePath + '/' + this.tag.name;
        }
      }
      this.axios.post(this.gardener.adminBackBaseURL + 'tag/v1/save', this.tag)
      .then((response) => {
        if(response.data == 0){
          this.$alert('添加成功', '添加提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.backToList();
            }
          });
        }else{
          this.$message.error('添加标签失败');
        }
      }).catch((response)=>{
        
      })
    },
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