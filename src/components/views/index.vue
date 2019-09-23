<template>
  <div>
    <el-card shadow="hover">
      <el-row>
        <el-col :span="6">
          <div>&nbsp;</div>
        </el-col>
        <el-col :span="12">
          <el-input placeholder="请输入内容" v-model="searchForm.searchText" class="input-with-select">
            <el-select v-model="searchForm.searchType" slot="prepend" >
              <el-option label="标签" value="1"></el-option>
              <el-option label="文章" value="2"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search">搜索</el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <div>&nbsp;</div>
        </el-col>
      </el-row>
    </el-card>
    <el-row>
      <el-col :span="24">
        <div class="gardener-height-8"></div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="18">
        <el-card shadow="hover">
          <el-row>
            <el-col :span="24">
              <el-divider content-position="left">知识标签</el-divider>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-tag class="gardener-tag" v-for="(tag, index) in tag.tags" :key="index" @click="viewDetail(index)">{{tag.name}}</el-tag>
            </el-col>
          </el-row>
        </el-card>
        <el-row>
          <el-col :span="24">
            <div class="gardener-height-8"></div>
          </el-col>
        </el-row>
        <el-card shadow="never">
          <el-row v-for="(article, index) in article.articles" :key="index">
            <el-col :span="24">
              <el-card shadow="hover">
                <div class="gardener-small-title">
                  <el-link type="primary" :href="'#/article/detail?articleId=' + article.articleId" target="_blank">{{article.title}}</el-link>
                </div>
              </el-card>
              <div class="gardener-height-6"></div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-button type="success" size="small" @click="loadArticles" style="width: 100%">{{article.loadMoreMessage}}</el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <el-row>
            <el-col :span="24">
              <el-divider content-position="left">热点知识</el-divider>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data(){
    return {
      searchForm : {
        searchText : '',
        searchType : '1'
      },
      tag : {
        searchForm : {
          name : '',
          tagType : '1'
        },
        tags : []
      },
      article : {
        searchForm : {
          title : '',
          tagId : 0,
          lastId : 0
        },
        articles : [],
        loadMoreMessage :"加载更多",
        hasMore : true,
        pageSize : 20
      }
    }
  },
  created () {
    this.loadTags();
  },
  methods: {
    viewDetail(index) {
      this.article.hasMore = true;
      this.article.searchForm.tagId = this.tag.tags[index].id;
      this.article.articles = [];
      this.loadArticles();
    },
    loadTags(){
      this.axios.post(this.gardener.adminBackBaseURL + 'tag/v1/list', this.tag.searchForm
      ).then((response) => {
        this.tag.tags = response.data;
      }).catch((response)=>{
        
      })
    },
    loadArticles(){
      if(!this.article.hasMore){
        return ;
      }
      this.axios.post(this.gardener.adminBackBaseURL + 'article/tag/relation/v1/list', this.article.searchForm
      ).then((response) => {
        if(response.data.length < this.article.pageSize){
          this.article.loadMoreMessage = '没有更多了';
          this.article.hasMore = false;
        }
        if(this.article.searchForm.lastId === 0){
          this.article.articles = response.data;
        }else{
          this.article.articles = this.article.articles.concat(response.data);
        }
        this.article.searchForm.lastId = this.article.articles[this.article.articles.length - 1].id;
      }).catch((response)=>{
        
      })
    }
  }
}
</script>

<style>
.gardener-tag{
  margin-left: 10px;
}
.gardener-tag-title-main{
  color: #409EFF;
  border-bottom: 1px #409EFF solid;
  margin-bottom: 12px;
  margin-top: 8px;
}
.gardener-content{
  border-top: 1px #909399 solid;
  margin-top: 12px;
}

.el-select .el-input {
  width: 80px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>