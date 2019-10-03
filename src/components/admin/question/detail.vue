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
          <el-divider content-position="left">问题详情</el-divider>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form ref="question" :model="question" label-width="120px">
            <el-form-item label="简介">
              {{question.summary}}
            </el-form-item>
            <el-form-item label="内容">
              <div v-html="question.detail" />
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
          <el-divider content-position="left">关联解决方案</el-divider>
        </el-col>
      </el-row>
      <el-row class="gardener-title-nav">
        <el-col :span="24">
          <el-button type="primary" size="small" @click="addQuestionSolutionRelation" round>添加</el-button>
          <el-button type="primary" size="small" @click="moveOn" round>上移</el-button>
          <el-button type="primary" size="small" @click="moveDown" round>下移</el-button>
          <el-button type="primary" size="small" @click="saveOrder" round>保存顺序</el-button>
          <el-button type="primary" size="small" @click="delQuestionSolutionRelation" round>删除</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table ref="singleSolutionTable" :data="questionSolutionRelation.questionSolutionRelations" highlight-current-row
              @current-change="handleSolutionCurrentChange" style="width: 100%;cursor:pointer;" :row-class-name="tableRowClassName" border>
            <el-table-column prop="summary" label="简介">
            </el-table-column>
            <el-table-column prop="SolutionType" :formatter="formatterSolutionType" label="解决类型" width="260">
            </el-table-column>
            <el-table-column prop="position" label="位置" width="260">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-dialog title="添加问题关联答案" :visible.sync="questionSolutionRelation.addQuestionSolutionRelationListVisible">
        <el-form :inline="true" :model="questionSolutionRelation.searchSolutionForm" class="demo-form-inline">
          <el-form-item label="简介">
            <el-input v-model="questionSolutionRelation.searchSolutionForm.name" placeholder="简介"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearchSolutionSubmit">查询</el-button>
          </el-form-item>
        </el-form>

        <el-table ref="singleSolutionSelectTable" :data="questionSolutionRelation.selectSolutionList" highlight-current-row 
            @current-change="handleSolutionSelectCurrentChange" style="width: 100%;cursor:pointer;" :row-class-name="gardener.relationTableRowClassName" border>
          <el-table-column prop="summary" label="答案简介">
          </el-table-column>
        </el-table>

        <div slot="footer" class="dialog-footer">
          <el-button @click="questionSolutionRelation.addQuestionSolutionRelationListVisible = false">取 消</el-button>
          <el-button type="primary" @click="selectPossibleSolution">可能答案</el-button>
          <el-button type="primary" @click="selectImportantSolution">重要答案</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'AdminQuestionDetail',
  data() {
    return {
      question : {
        id : -1,
        summary : "",
        detail : ""
      },
      questionSolutionRelation : {
        questionSolutionRelationList : {
          questionId : -1
        },
        questionSolutionRelationForm : {
          questionId : -1,
          solutionId : -1,
          solutionType : -1,
          position : 0
        },
        questionSolutionRelations : [],
        searchSolutionForm : {
          summary : ''
        },
        addQuestionSolutionRelationListVisible : false,
        selectSolutionList : [],
        currentRow : null,
        currentSelectRow : null
      }
    };
  },
  created(){
    this.loadData();
    this.loadQuestionSolutionRelations();
  },
  methods:{
    loadData(){
      var params = this.gardener.getParams();
      var questionId = this.gardener.getParamInt(params['questionId'], -1);
      if(questionId == -1){
        this.$alert('获取问题ID异常', '参数异常', {
          confirmButtonText: '确定',
          callback: action => {

          }
        });
        return ;
      }
      this.questionSolutionRelation.questionSolutionRelationList.questionId = questionId;
      this.questionSolutionRelation.questionSolutionRelationForm.questionId = questionId;
      this.axios.get(this.gardener.adminBackBaseURL + 'question/v1/detail', {
        params: {
          questionId : questionId
        }
      }).then((response) => {
        this.question = response.data;
      }).catch((response)=>{
        
      })
    },
    loadQuestionSolutionRelations(){
      this.axios.post(this.gardener.adminBackBaseURL + 'question/solution/relation/v1/list', this.questionSolutionRelation.questionSolutionRelationList
      ).then((response) => {
        this.questionSolutionRelation.questionSolutionRelations = response.data;
      }).catch((response)=>{
        
      })
    },
    handleSolutionCurrentChange(val){
      this.questionSolutionRelation.currentRow = val;
    },
    handleSolutionSelectCurrentChange(val){
      this.questionSolutionRelation.currentSelectRow = val;
    },
    formatterSolutionType(row, column){
      return this.gardener.solutionType.get(row.solutionType);
    },
    tableRowClassName ({row, rowIndex}) {
      row.index = rowIndex;
    },
    moveOn(){
      if(this.questionSolutionRelation.currentRow === null){
        this.checkRow();
      }else if(this.questionSolutionRelation.currentRow.index === 0){
        this.$message({
          message: '已经到达最上位置',
          type: 'warning'
        });
      }else{
        this.$set(this.questionSolutionRelation.questionSolutionRelations, this.questionSolutionRelation.currentRow.index, this.questionSolutionRelation.questionSolutionRelations[this.articleFragmentRelation.currentRow.index - 1]);
        this.$set(this.questionSolutionRelation.questionSolutionRelations, this.questionSolutionRelation.currentRow.index - 1, this.questionSolutionRelation.currentRow);
        this.$refs.singleSolutionTable.setCurrentRow(this.questionSolutionRelation.currentRow);
      }
    },
    moveDown(){
      if(this.questionSolutionRelation.currentRow === null){
        this.checkRow();
      }else if(this.questionSolutionRelation.currentRow.index === this.questionSolutionRelation.questionSolutionRelations.length - 1){
        this.$message({
          message: '已经到达最下位置',
          type: 'warning'
        });
      }else{
        this.$set(this.questionSolutionRelation.questionSolutionRelations, this.questionSolutionRelation.currentRow.index, this.questionSolutionRelation.questionSolutionRelations[this.questionSolutionRelation.currentRow.index + 1]);
        this.$set(this.questionSolutionRelation.questionSolutionRelations, this.questionSolutionRelation.currentRow.index + 1, this.questionSolutionRelation.currentRow);
        this.$refs.singleSolutionTable.setCurrentRow(this.questionSolutionRelation.currentRow);
      }
    },
    saveOrder(){
      for ( var i = 0; i < this.questionSolutionRelation.questionSolutionRelations.length; i++){
        this.questionSolutionRelation.questionSolutionRelations[i].position = i;
      }
      this.axios.post(this.gardener.adminBackBaseURL + 'question/solution/relation/v1/saveOrder', this.questionSolutionRelation.questionSolutionRelations
      ).then((response) => {
        this.$message({
          message: '修改关联顺序成功',
          type: 'success'
        });
        this.loadQuestionSolutionRelations();
      }).catch((response)=>{
        
      })
    },
    selectPossibleSolution(){
      this.selectSolution(2);
    },
    selectImportantSolution(){
      this.selectSolution(1);
    },
    selectSolution(solutionType){
      if(this.questionSolutionRelation.currentSelectRow === null){
        this.checkRow();
        return ;
      }
      this.questionSolutionRelation.questionSolutionRelationForm.solutionType = solutionType;
      this.questionSolutionRelation.questionSolutionRelationForm.solutionId = this.questionSolutionRelation.currentSelectRow.id;
      this.questionSolutionRelation.questionSolutionRelationForm.position = this.questionSolutionRelation.questionSolutionRelations.length;
      this.axios.post(this.gardener.adminBackBaseURL + 'question/solution/relation/v1/save', this.questionSolutionRelation.questionSolutionRelationForm
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
          this.loadQuestionSolutionRelations();
        }
      }).catch((response)=>{
        
      })
      this.questionSolutionRelation.addQuestionSolutionRelationListVisible = false;
    },
    onSearchSolutionSubmit(){
      this.axios.post(this.gardener.adminBackBaseURL + 'question/solution/v1/list', this.questionSolutionRelation.searchSolutionForm
      ).then((response) => {
        this.questionSolutionRelation.selectSolutionList = response.data;
      }).catch((response)=>{
        
      })
    },
    addQuestionSolutionRelation(){
      this.questionSolutionRelation.addQuestionSolutionRelationListVisible = true;
    },
    delQuestionSolutionRelation(){
      if(this.questionSolutionRelation.currentRow === null){
        this.checkRow();
      }else{
        this.$confirm('此操作将永久删除该关联, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.get(this.gardener.adminBackBaseURL + 'question/solution/relation/v1/delete?questionSolutionRelationId=' + this.questionSolutionRelation.currentRow.id
          ).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.loadQuestionSolutionRelations();
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
      window.location.href = '#/admin/question/list';
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