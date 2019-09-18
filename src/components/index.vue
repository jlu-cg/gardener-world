<template>
  <div>
    <el-container>
      <el-header class="search-header" height="40px">
        <el-row>
          <el-col :span="6"><div>&nbsp;</div></el-col>
          <el-col :span="10">
            <div class="grid-content">
              <el-input placeholder="请输入内容" v-model="searchForm.searchText" clearable>
                <el-button slot="append" icon="el-icon-search">搜索</el-button>
              </el-input>
            </div>
          </el-col>
          <el-col :span="8"><div></div></el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-container>
          <el-main>
            <el-row>
              <el-col :span="24">
                <div class="gardener-tag-title-main">知识标签</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-tag class="gardener-tag" v-for="(tag, index) in tags" :key="index" @click="viewDetail(tag.id)">{{tag.tagName}}</el-tag>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="gardener-tag-title-child"></div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-tag class="gardener-tag" type="success" v-for="(childTag, index) in childTags" :key="index">
                  {{childTag.tagName}}
                </el-tag>
              </el-col>
            </el-row>
            <el-row class="gardener-content">
              <el-col :span="24">
                <el-row class="gardener-content-data" v-for="(article, index) in articles" :key="index">
                  <el-col :span="24">
                    <el-card shadow="hover">
                      <div class="gardener-small-title">
                        <el-link type="primary" :href="'#/article/detail?articleId=' + article.id" target="_blank">{{article.title}}</el-link>
                      </div>
                      <div class="gardener-samll-text">{{article.content}}</div>
                    </el-card>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-main>
          <el-aside>
            <el-container>
              <el-main>
                <el-row>
                  <el-col :span="24">
                    <div class="gardener-title">热点知识</div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <div></div>
                  </el-col>
                </el-row>
              </el-main>
            </el-container>
          </el-aside>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data(){
    return {
      searchForm : {
        searchText : '',
        lastId : 0
      },
      tags : [{"tagName":"中间件", "id":"33"},{"tagName":"数据库", "id":"22"}],
      childTags : [{"tagName":"mysql", "id":"33"},{"tagName":"postgresql", "id":"22"}],
      articles : [{"id":2,"title":"安装", "content":"安装步骤"}]
    }
  },
  created () {
  },
  methods: {
    viewDetail(id) {
      //this.axios.g
    }
  }
}
</script>

<style>
.search-header{
  text-align: center;
  line-height: 60px;
}
.gardener-tag{
  margin-left: 10px;
}
.gardener-tag-title-main{
  color: #409EFF;
  border-bottom: 1px #409EFF solid;
  margin-bottom: 12px;
  margin-top: 8px;
}
.gardener-tag-title-child{
  color: #67C23A;
  border-bottom: 1px #67C23A solid;
  margin-bottom: 12px;
  margin-top: 12px;
}
.gardener-content{
  border-top: 1px #909399 solid;
  margin-top: 12px;
}
.gardener-content-data{
  margin-top: 12px;
}
</style>