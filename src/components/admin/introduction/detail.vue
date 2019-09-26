<template>
  <div>
    <el-card shadow="never">
    <el-row>
      <el-col :span="24">
        <el-page-header @back="backToList" content="详情页面">
        </el-page-header>
      </el-col>
    </el-row>
    </el-card>

    <el-row>
      <el-col :span="24">
        <div class="gardener-height-6"></div>
      </el-col>
    </el-row>

    <el-card shadow="hover">
      <el-row>
        <el-col :span="24">
          <el-divider content-position="left">详细介绍详情</el-divider>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form ref="detailIntroduction" :model="detailIntroduction" label-width="120px">
            <el-form-item label="简介">
              {{detailIntroduction.summary}}
            </el-form-item>
            <el-form-item label="内容">
              <div v-html="detailIntroduction.content" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>

    <el-row>
      <el-col :span="24">
        <div class="gardener-height-6"></div>
      </el-col>
    </el-row>

    <el-card shadow="hover">
      <el-row>
        <el-col :span="24">
          <el-divider content-position="left">关联环境</el-divider>
        </el-col>
      </el-row>
      <el-row class="gardener-title-nav">
        <el-col :span="24">
          <el-button type="primary" size="small" @click="addIntroductionEnvironmentRelation" round>添加</el-button>
          <el-button type="primary" size="small" @click="delIntroductionEnvironmentRelation" round>删除</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table ref="singleEnvironmentLabelTable" :data="introductionEnvironmentRelation.introductionEnvironmentRelations" highlight-current-row
              @current-change="handleDetailIntroductionCurrentChange" style="width: 100%;cursor:pointer;" border>
            <el-table-column prop="name" label="环境">
            </el-table-column>
            <el-table-column prop="version" label="版本号" width="360">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-dialog title="添加详细介绍关联环境标签" :visible.sync="introductionEnvironmentRelation.addintroductionEnvironmentRelationListVisible">
        <el-form :inline="true" :model="introductionEnvironmentRelation.searchEnvironmentLabelForm" class="demo-form-inline">
          <el-form-item label="环境">
            <el-input v-model="introductionEnvironmentRelation.searchEnvironmentLabelForm.name" placeholder="环境"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearchEnvironmentLabelSubmit">查询</el-button>
          </el-form-item>
        </el-form>

        <el-table ref="singleEnvironmentLabelSelectTable" :data="introductionEnvironmentRelation.selectEnvironmentLabelList" highlight-current-row 
            @current-change="handleEnvironmentLabelSelectCurrentChange" style="width: 100%;cursor:pointer;" :row-class-name="gardener.relationTableRowClassName" border>
          <el-table-column prop="name" label="环境">
          </el-table-column>
          <el-table-column prop="version" label="版本号" width="360">
          </el-table-column>
        </el-table>

        <div slot="footer" class="dialog-footer">
          <el-button @click="introductionEnvironmentRelation.addintroductionEnvironmentRelationListVisible = false">取 消</el-button>
          <el-button type="primary" @click="selectEnvironmentLabel">确定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'AdminDetailIntroductionDetail',
  data() {
    return {
      detailIntroduction : {
        id : -1,
        summary : "",
        content : ""
      },
      introductionEnvironmentRelation : {
        introductionEnvironmentRelationList : {
          detailIntroductionId : -1
        },
        introductionEnvironmentRelationForm : {
          detailIntroductionId : -1,
          environmentLabelId : -1
        },
        introductionEnvironmentRelations : [],
        searchEnvironmentLabelForm : {
          name : ''
        },
        addIntroductionEnvironmentRelationListVisible : false,
        selectEnvironmentLabelList : [],
        currentRow : null,
        currentSelectRow : null
      }
    };
  },
  created(){
    this.loadData();
    this.loadIntroductionEnvironmentRelations();
  },
  methods:{
    loadData(){
      var params = this.gardener.getParams();
      var detailIntroductionId = this.gardener.getParamInt(params['detailIntroductionId'], -1);
      if(detailIntroductionId == -1){
        this.$alert('获取详细介绍ID异常', '参数异常', {
          confirmButtonText: '确定',
          callback: action => {

          }
        });
        return ;
      }
      this.introductionEnvironmentRelation.introductionEnvironmentRelationList.detailIntroductionId = detailIntroductionId;
      this.introductionEnvironmentRelation.introductionEnvironmentRelationForm.detailIntroductionId = detailIntroductionId;
      this.axios.get(this.gardener.adminBackBaseURL + 'detail/introduction/v1/detail', {
        params: {
          detailIntroductionId : detailIntroductionId
        }
      }).then((response) => {
        this.detailIntroduction = response.data;
      }).catch((response)=>{
        
      })
    },
    loadIntroductionEnvironmentRelations(){
      this.axios.post(this.gardener.adminBackBaseURL + 'introduction/environment/relation/v1/list', this.introductionEnvironmentRelation.introductionEnvironmentRelationList
      ).then((response) => {
        this.introductionEnvironmentRelation.introductionEnvironmentRelations = response.data;
      }).catch((response)=>{
        
      })
    },
    handleDetailIntroductionCurrentChange(val){
      this.introductionEnvironmentRelation.currentRow = val;
    },
    handleEnvironmentLabelSelectCurrentChange(val){
      this.introductionEnvironmentRelation.currentSelectRow = val;
    },
    selectEnvironmentLabel(){
      if(this.introductionEnvironmentRelation.currentSelectRow === null){
        this.checkRow();
        return ;
      }
      this.introductionEnvironmentRelation.introductionEnvironmentRelationForm.environmentLabelId = this.introductionEnvironmentRelation.currentSelectRow.id;
      this.axios.post(this.gardener.adminBackBaseURL + 'introduction/environment/relation/v1/save', this.introductionEnvironmentRelation.introductionEnvironmentRelationForm
      ).then((response) => {
        if(response.data === -1){
            this.$message({
            message: '添加关联标签失败',
            type: 'error'
          });
        }else{
          this.$message({
            message: '添加关联标签成功',
            type: 'success'
          });
          this.loadIntroductionEnvironmentRelations();
        }
      }).catch((response)=>{
        
      })
      this.introductionEnvironmentRelation.addIntroductionEnvironmentRelationListVisible = false;
    },
    onSearchTagSubmit(){
      this.axios.post(this.gardener.adminBackBaseURL + 'environment/label/v1/list', this.introductionEnvironmentRelation.searchEnvironmentLabelForm
      ).then((response) => {
        this.introductionEnvironmentRelation.selectEnvironmentLabelList = response.data;
      }).catch((response)=>{
        
      })
    },
    addIntroductionEnvironmentRelation(){
      this.introductionEnvironmentRelation.addIntroductionEnvironmentRelationListVisible = true;
    },
    delIntroductionEnvironmentRelation(){
      if(this.introductionEnvironmentRelation.currentRow === null){
        this.checkRow();
      }else{
        this.$confirm('此操作将永久删除该关联, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.get(this.gardener.adminBackBaseURL + 'introduction/environment/relation/v1/delete?introductionEnvironmentRelationId=' + this.introductionEnvironmentRelation.currentRow.id
          ).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.loadIntroductionEnvironmentRelations();
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
    backToList(){
      window.location.href = '#/admin/detail/introduction/list';
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