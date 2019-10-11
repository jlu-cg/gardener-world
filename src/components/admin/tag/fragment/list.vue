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
          <el-form-item label="类型">
            <el-select v-model="searchForm.type" clearable placeholder="请选择">
              <el-option
                v-for="item in gardener.tagType"
                :key="item[0]"
                :label="item[1]"
                :value="item[0]">
              </el-option>
            </el-select>
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
        <el-button type="primary" size="small" @click="addTagFragment" round>添加</el-button>
        <el-button type="primary" size="small" @click="editTagFragment" round>编辑</el-button>
        <el-button type="primary" size="small" @click="delTagFragment" round>删除</el-button>
        <el-button type="primary" size="small" @click="fragmentList" round>查看碎片</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="infinite-list-wrapper" style="overflow:auto">
          <el-table ref="singleTable" :data="tagFragmentList" highlight-current-row 
            @current-change="handleCurrentChange" style="width: 100%;cursor:pointer;" border>
            <el-table-column prop="name" label="标签名">
            </el-table-column>
            <el-table-column prop="type" :formatter="formatterTagType" label="标签类型" width="260">
            </el-table-column>
          </el-table>
        </div>
        <el-button type="success" size="small" @click="loadTagFragments" style="width: 100%">{{loadMoreMessage}}</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'AdminTagFragmentList',
  data() {
    return {
      searchForm : {
        name : '',
        type: '',
        lastId : 0
      },
      tagFragmentList : [],
      currentRow : null,
      loadMoreMessage : "加载更多",
      hasMore : true, 
      pageSize : 20
    };
  },
  created(){
    this.loadTagFragments();
  },
  methods: {
    loadTagFragments(){
      if(!this.hasMore){
        return ;
      }
      this.axios.post(this.gardener.adminBackBaseURL + 'tag/fragment/v1/list', this.searchForm
      ).then((response) => {
        if(response.data === null || response.data.length < this.pageSize){
          this.loadMoreMessage = '没有更多了';
          this.hasMore = false;
        }
        if(this.searchForm.lastId === 0){
          this.tagFragmentList = response.data;
        }else{
          this.tagFragmentList = this.tagFragmentList.concat(response.data);
        }
        this.searchForm.lastId = this.tagFragmentList[this.tagFragmentList.length - 1].id;
      }).catch((response)=>{
        
      })
    },
    onSubmit(){
      this.hasMore = true;
      this.searchForm.lastId = 0;
      this.loadMoreMessage = '加载更多';
      this.tagFragmentList = [];
      this.loadTagFragments();
    },
    formatterTagType(row, column){
      return this.gardener.tagType.get(row.type);
    },
    handleCurrentChange(val){
      this.currentRow = val;
    },
    addTagFragment(){
      window.location.href = '#/admin/tag/fragment/add';
    },
    editTagFragment(){
      if(this.currentRow === null){
        this.checkRow();
      }else{
        window.location.href = '#/admin/tag/fragment/add?tagFragmentId=' + this.currentRow.id;
      }
    },
    delTagFragment(){
      if(this.currentRow === null){
        this.checkRow();
      }else{
        this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.get(this.gardener.adminBackBaseURL + 'tag/fragment/v1/delete?tagFragmentId=' + this.currentRow.id
          ).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.hasMore = true;
            this.searchForm.lastId = 0;
            this.loadMoreMessage = '加载更多';
            this.tagFragmentList = [];
            this.loadTagFragments();
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
    fragmentList(){
      if(this.currentRow === null){
        this.checkRow();
      }else{
        window.location.href = '#/admin/fragment/list?tagFragmentId=' + this.currentRow.id;
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