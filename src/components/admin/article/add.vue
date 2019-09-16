<template>
  <div>
    <el-row>
      <el-col :span="24">
        <div class="article-form">
          <el-form ref="article" :model="article" label-width="120px">
            <el-form-item label="标签">
              {{article.tagId}}
            </el-form-item>
            <el-form-item label="名称">
              <el-input v-model="article.title"></el-input>
            </el-form-item>
            <el-form-item label="简介">
              <el-input type="textarea" v-model="article.summary"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">保存</el-button>
              <el-button @click="backToList">回到首页</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'AdminArticleAdd',
  data() {
    return {
      article : {
        tagId : -1,
        title : '',
        summary : ''
      }
    };
  },
  created(){
    this.loadEdit();
  },
  methods: {
    loadEdit(){
      var params = this.gardener.getParams();
      var articleId = this.gardener.getParamInt(params['articleId'], -1);
      var tagId = this.gardener.getParamInt(params['tagId'], -1);
      this.article.tagId = tagId;
      if(articleId == -1 && tagId == -1){
        return ;
      }

      this.axios.get(this.gardener.adminBackBaseURL + 'article/v1/detail', {
        params: {
          tagId : tagId,
          articleId : articleId
        }
      }).then((response) => {
        this.article = response.data;
      }).catch((response)=>{
        
      })
    },
    onSubmit() {
      this.axios.post(this.gardener.adminBackBaseURL + 'article/v1/save', this.article)
      .then((response) => {
        if(response.data == 0){
          this.$alert('添加成功', '添加提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.backToList();
            }
          });
        }else{
          this.$message.error('添加文章失败');
        }
      }).catch((response)=>{
        
      })
    },
    backToList(){
      window.location.href = '#/admin/article/list';
    }
  }
}
</script>

<style>
.article-form{
  width: 800px;
}
</style>