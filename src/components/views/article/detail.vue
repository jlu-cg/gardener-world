<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card shadow="hover">
        {{articleDocument.article.title}}
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="gardener-height-8"></div>
      </el-col>
    </el-row>
    <el-row :gutter="16">
      <el-col :span="18">
        <el-card shadow="hover">
          <el-collapse v-model="activeNames">
            <el-collapse-item v-for="(relation, index) in articleDocument.relations" :key="index" :title="relation.title" :name="relation.position">
              <div><el-link type="primary">详细说明</el-link></div>
              <div class="gardener-line-height-6"></div>
              <div v-html="relation.content"></div>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <el-row>
            <el-col :span="24">
              <el-divider content-position="left">依赖组件</el-divider>
            </el-col>
          </el-row>
          <el-row v-for="(dependence, index) in articleDocument.dependences" :key="index">
            <el-col :span="24">
              <div class="gardener-text gardener-right-text">{{dependence.title}}</div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'ViewArticleDetail',
  data(){
    return {
      articleId : -1,
      articleDocument:{
        article:{
          title : ''
        }
      },
      activeNames : []
    }
  },
  created () {
    var params = this.gardener.getParams();
    this.articleId = params['articleId'];
    this.loadArticleDocument();
  },
  methods: {
    loadArticleDocument(){
      this.axios.get(this.gardener.viewBackBaseURL + 'article/v1/document/detail?articleId=' + this.articleId
      ).then((response) => {
        this.articleDocument = response.data;
      }).catch((response)=>{
        
      })
    }
  }
}
</script>

<style>
</style>