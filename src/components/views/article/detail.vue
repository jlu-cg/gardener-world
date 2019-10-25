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
            <el-collapse-item v-for="(relation, index) in articleDocument.relations" :key="index" :title="(index+1) + '、' + relation.title" :name="relation.position">
              <div v-if="relation.detailIntroductionId > 0">
                <el-link type="primary" herf="javascript:void(0);" @click="viewDetailIntroduction(relation.detailIntroductionId);">详细介绍</el-link>
              </div>
              <div class="gardener-line-height-6"></div>
              <div v-html="relation.content"></div>
            </el-collapse-item>
          </el-collapse>
          <el-drawer title="详细介绍" :visible.sync="drawer" size="400px" direction="ttb">
                <div style="margin-left:20px;height:320px;overflow:auto">
                  <div v-html="introduction"></div>
                </div>
          </el-drawer>
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
      activeNames : [],
      drawer : false,
      introduction : ''
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
        
      });
    },
    viewDetailIntroduction(detailIntroductionId){
      this.axios.get(this.gardener.viewBackBaseURL + 'detail/introduction/v1/detail?detailIntroductionId=' + detailIntroductionId
      ).then((response) => {
        this.introduction = response.data.content;
      }).catch((response)=>{
        
      });
      this.drawer = true;
    }
  }
}
</script>