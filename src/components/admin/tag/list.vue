<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="标签名">
            <el-input v-model="searchForm.name" placeholder="标签名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="loadTags">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row class="gardener-title-nav">
      <el-col :span="24">
        <el-button type="primary" size="small" @click="viewTag" round>查看</el-button>
        <el-button type="primary" size="small" @click="addTag" round>添加</el-button>
        <el-button type="primary" size="small" @click="editTag" round>编辑</el-button>
        <el-button type="primary" size="small" @click="delTag" round>删除</el-button>
        <el-button type="primary" size="small" @click="articleList" round>查看文章</el-button>
        <el-button type="primary" size="small" @click="fragmentList" round>查看碎片</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="infinite-list-wrapper" style="overflow:auto">
          <el-table ref="singleTable" :data="tagList" highlight-current-row 
            @current-change="handleCurrentChange" style="width: 100%" border>
            <el-table-column prop="name" label="标签名">
            </el-table-column>
            <el-table-column prop="tagType" :formatter="formatterTagType" label="标签类型" width="260">
            </el-table-column>
          </el-table>
          <p v-if="loading">加载中...</p>
          <p v-if="noMore">没有更多了</p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'AdminTagList',
  data() {
    return {
      searchForm : {
        name : '',
        tagType: 0,
        lastId : 0
      },
      tagList : [
        {
          "id" : 1, 
          "name" : "数据库",
          "tagType" : 0
        }
      ],
      currentRow : null,
      loading: false,
      count : -1
    };
  },
  created(){
    this.loadTags();
  },
  computed:{
    noMore(){
      return this.count === 0;
    },
    disabled () {
      return this.loading || this.noMore
    }
  },
  methods: {
    loadTags(){
      this.axios.post(this.gardener.adminBackBaseURL + 'tag/v1/list', this.searchForm
      ).then((response) => {
        this.tagList = response.data;
        this.count = this.tagList.length;
      }).catch((response)=>{
        
      })
    },
    load () {
      if(this.count === 0){
        return ;
      }
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 2000)
    },
    formatterTagType(row, column){
      return this.gardener.tagType.get(row.tagType);
    },
    handleCurrentChange(val){
      this.currentRow = val;
    },
    viewTag(){
      window.location.href = '#/admin/tag/detail?tagId=' + this.currentRow.id;
    },
    addTag(){
      window.location.href = '#/admin/tag/add';
    },
    editTag(){
      if(this.currentRow === null){
        this.checkRow();
      }else{
        window.location.href = '#/admin/tag/add?tagId=' + this.currentRow.id;
      }
    },
    delTag(){
      if(this.currentRow === null){
        this.checkRow();
      }else{
        alert(this.currentRow.id)
      }
    },
    articleList(){
      if(this.currentRow === null){
        this.checkRow();
      }else{
        window.location.href = '#/admin/article/list?tagId=' + this.currentRow.id;
      }
    },
    fragmentList(){
      if(this.currentRow === null){
        this.checkRow();
      }else{
        window.location.href = '#/admin/fragment/list?tagId=' + this.currentRow.id;
      }
    },
    checkRow(){
      this.$message({
        message: '请选择数据后进行操作',
        type: 'warning'
      });
    }
  }
}
</script>

<style>
</style>