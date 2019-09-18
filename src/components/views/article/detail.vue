<template>
  <div>
    <el-container>
      <el-header height="40px">
        <el-row>
          <el-col :span="24">
            {{articleDocument.article.title}}
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-main>
          <el-collapse v-model="activeNames">
            <el-collapse-item v-for="(relation, index) in articleDocument.relations" :key="index" :title="relation.title" :name="relation.position">
              <div v-html="relation.content"></div>
            </el-collapse-item>
          </el-collapse>
        </el-main>
        <el-aside>
          <el-container>
            <el-main>
              <el-row>
                <el-col :span="24">
                  <div class="gardener-title gardener-right-title">依赖组件</div>
                </el-col>
              </el-row>
              <el-row v-for="(dependence, index) in articleDocument.dependences" :key="index">
                <el-col :span="24">
                  <div class="gardener-text gardener-right-text">{{dependence.title}}</div>
                </el-col>
              </el-row>
            </el-main>
          </el-container>
        </el-aside>
      </el-container>
    </el-container>
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
.gardener-right-title{
  border-bottom: 1px #909399 solid;
}
.gardener-right-text{
  margin: 8px 0px 0px 6px;
}
</style>