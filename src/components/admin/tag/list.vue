<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-divider content-position="left">查询</el-divider>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="标签名">
            <el-input v-model="searchForm.name" placeholder="标签名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-divider content-position="left">标签列表</el-divider>
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
            @current-change="handleCurrentChange" style="width: 100%;cursor:pointer;" border>
            <el-table-column prop="name" label="标签名">
            </el-table-column>
            <el-table-column prop="tagType" :formatter="formatterTagType" label="标签类型" width="260">
            </el-table-column>
          </el-table>
        </div>
        <el-button type="success" size="small" @click="loadTags" style="width: 100%">{{loadMoreMessage}}</el-button>
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
      tagList : [],
      currentRow : null,
      loadMoreMessage : "加载更多",
      hasMore : true, 
      pageSize : 20
    };
  },
  created(){
    this.loadTags();
  },
  methods: {
    loadTags(){
      if(!this.hasMore){
        return ;
      }
      this.axios.post(this.gardener.adminBackBaseURL + 'tag/v1/list', this.searchForm
      ).then((response) => {
        if(response.data.length < this.pageSize){
          this.loadMoreMessage = '没有更多了';
          this.hasMore = false;
        }
        if(this.searchForm.lastId === 0){
          this.tagList = response.data;
        }else{
          this.tagList = this.tagList.concat(response.data);
        }
        this.searchForm.lastId = this.tagList[this.tagList.length - 1].id;
      }).catch((response)=>{
        
      })
    },
    onSubmit(){
      this.hasMore = true;
      this.searchForm.lastId = 0;
      this.loadMoreMessage = '加载更多';
      this.loadTags();
    },
    formatterTagType(row, column){
      return this.gardener.tagType.get(row.tagType);
    },
    handleCurrentChange(val){
      this.currentRow = val;
    },
    viewTag(){
      if(this.currentRow === null){
        this.checkRow();
      }else{
        window.location.href = '#/admin/tag/detail?tagId=' + this.currentRow.id;
      }
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
        this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.get(this.gardener.adminBackBaseURL + 'tag/v1/delete?tagId=' + this.currentRow.id
          ).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.hasMore = true;
            this.tagList = [];
            this.loadTags();
          }).catch((response)=>{
            
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
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