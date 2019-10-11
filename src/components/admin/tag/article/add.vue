<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-page-header @back="backToList" :content="title">
        </el-page-header>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-divider></el-divider>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form ref="tagArticle" :model="tagArticle" label-width="160px">
          <el-form-item label="标签名">
            <el-input v-model="tagArticle.name"></el-input>
          </el-form-item>
          <el-form-item label="标签分类">
            <el-radio v-model="tagArticle.type" :label="1">精华</el-radio>
            <el-radio v-model="tagArticle.type" :label="2">普通</el-radio>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'AdminTagArticleAdd',
  data() {
    return {
      tagArticle : {
        id : -1,
        name : '',
        type : 2
      },
      title : ''
    };
  },
  created(){
    this.loadEdit();
  },
  methods: {
    loadEdit(){
      var params = this.gardener.getParams();
      var tagArticleId = this.gardener.getParamInt(params['tagArticleId'], -1);
      if(tagArticleId == -1){
        this.title = '添加文章标签';
        return ;
      }

      this.title = '修改文章标签';
      this.axios.get(this.gardener.adminBackBaseURL + 'tag/article/v1/detail', {
        params: {
          tagArticleId : tagArticleId
        }
      }).then((response) => {
        this.tag = response.data;
      }).catch((response)=>{
        
      })
    },
    onSubmit() {
      this.axios.post(this.gardener.adminBackBaseURL + 'tag/article/v1/save', this.tagArticle)
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
      window.location.href = '#/admin/tag/article/list';
    }
  }
}
</script>

<style>
.tag-form{
    width: 540px;
}
</style>