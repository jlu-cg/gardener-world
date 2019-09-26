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
          <el-form-item label="环境名">
            <el-input v-model="searchForm.name" placeholder="环境名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-divider content-position="left">环境列表</el-divider>
      </el-col>
    </el-row>
    <el-row class="gardener-title-nav">
      <el-col :span="24">
        <el-button type="primary" size="small" @click="addEnvironmentLabel" round>添加</el-button>
        <el-button type="primary" size="small" @click="editEnvironmentLabel" round>编辑</el-button>
        <el-button type="primary" size="small" @click="delEnvironmentLabel" round>删除</el-button>
        <el-button type="primary" size="small" @click="environmentLabelRelate" round>关联</el-button>
        <el-button type="primary" size="small" @click="cancelSelect" round>取消选择</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div style="overflow:auto">
          <el-table ref="singleTable" :data="environmentLabelList" highlight-current-row 
            @current-change="handleCurrentChange" style="width: 100%;cursor:pointer;" border>
            <el-table-column prop="name" label="环境名">
            </el-table-column>
            <el-table-column prop="version" label="版本号" width="360">
            </el-table-column>
          </el-table>
        </div>
        <el-button type="success" size="small" @click="loadEnvironmentLabels" style="width: 100%">{{loadMoreMessage}}</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'AdminEnvironmentLabelList',
  data() {
    return {
      searchForm : {
        name : '',
        lastId : 0
      },
      environmentLabelList : [],
      currentRow : null,
      loadMoreMessage : "加载更多",
      hasMore : true, 
      pageSize : 20
    };
  },
  created(){
    this.loadEnvironmentLabels();
  },
  methods:{
    cancelSelect(row){
      if(this.currentRow === null){
        this.checkRow();
      }else{
        this.$refs.singleTable.setCurrentRow(row);
      }
    },
    loadEnvironmentLabels(){
      if(!this.hasMore){
        return ;
      }
      this.axios.post(this.gardener.adminBackBaseURL + 'environment/label/v1/list', this.searchForm
      ).then((response) => {
        if(response.data === null || response.data.length < this.pageSize){
          this.loadMoreMessage = '没有更多了';
          this.hasMore = false;
        }
        if(this.searchForm.lastId === 0){
          this.environmentLabelList = response.data;
        }else{
          this.environmentLabelList = this.environmentLabelList.concat(response.data);
        }
        this.searchForm.lastId = this.environmentLabelList[this.environmentLabelList.length - 1].id;
      }).catch((response)=>{
        
      })
    },
    handleCurrentChange(val){
      this.currentRow = val;
    },
    onSubmit(){
      this.hasMore = true;
      this.searchForm.lastId = 0;
      this.loadMoreMessage = '加载更多';
      this.environmentLabelList = [];
      this.loadEnvironmentLabels();
    },
    addEnvironmentLabel(){
      window.location.href = '#/admin/environment/label/add';
    },
    editEnvironmentLabel(){
      if(this.currentRow === null){
        this.checkRow();
      }else{
        window.location.href = '#/admin/environment/label/add?environmentLabelId=' + this.currentRow.id;
      }
    },
    delEnvironmentLabel(){
      if(this.currentRow === null){
        this.checkRow();
      }else{
        this.$confirm('此操作将永久删除该环境, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.get(this.gardener.adminBackBaseURL + 'environment/label/v1/delete?environmentLabelId=' + this.currentRow.id
          ).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.hasMore = true;
            this.searchForm.lastId = 0;
            this.loadMoreMessage = '加载更多';
            this.environmentLabelList = [];
            this.loadEnvironmentLabels();
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
    environmentLabelRelate(){
      if(this.currentRow === null){
        this.checkRow();
      }else{
        window.location.href = '#/admin/environment/label/detail?environmentLabelId=' + this.currentRow.id;
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