<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-page-header @back="backToList" content="修改碎片">
        </el-page-header>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-divider></el-divider>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div>
        <el-form ref="fragment" :model="fragment" label-width="120px">
          <el-form-item label="名称">
            <el-input v-model="fragment.title"></el-input>
          </el-form-item>
          <el-form-item label="内容">
            <quill-editor class="editor"
                        v-model="fragment.content"
                        ref="marketQuillEditor"
                        :options="editorOption">
            </quill-editor>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
          </el-form-item>
        </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'AdminFragmentAdd',
  data() {
    return {
      fragment : {
        id : -1,
        title : "",
        content : ""
      },
      editorOption : {
        modules:{
          toolbar:[
            ['bold', 'italic', 'underline', 'strike'],        //加粗，斜体，下划线，删除线
            ['blockquote', 'code-block'],         //引用，代码块

            [{ 'header': 1 }, { 'header': 2 }],               // 标题，键值对的形式；1、2表示字体大小
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],          //列表
            [{ 'script': 'sub'}, { 'script': 'super' }],      // 上下标
            [{ 'indent': '-1'}, { 'indent': '+1' }],          // 缩进
            [{ 'direction': 'rtl' }],                         // 文本方向

            [{ 'size': ['small', false, 'large', 'huge'] }],  // 字体大小
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],         //几级标题

            [{ 'color': [] }, { 'background': [] }],          // 字体颜色，字体背景颜色
            [{ 'font': [] }],         //字体
            [{ 'align': [] }],        //对齐方式
            
            ['clean'],        //清除字体样式
            ['image', 'video']        //上传图片、上传视频
          ]
        },
        theme : 'snow'
      }
    };
  },
  created(){
    this.loadEdit();
  },
  methods:{
    loadEdit(){
      var params = this.gardener.getParams();
      var fragmentId = this.gardener.getParamInt(params['fragmentId'], -1);
      if(fragmentId == -1){
        return ;
      }

      this.axios.get(this.gardener.adminBackBaseURL + 'fragment/v1/detail', {
        params: {
          fragmentId : fragmentId
        }
      }).then((response) => {
        this.fragment = response.data;
      }).catch((response)=>{
        
      })
    },
    onSubmit() {this.axios.post('http://localhost:38080/fragment/v1/save', this.fragment)
      .then((response) => {
        if(response.data == 0){
          this.$alert('添加成功', '添加提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.backToList();
            }
          });
        }else{
          this.$message.error('添加碎片失败');
        }
      }).catch((response)=>{
        
      })
    },
    backToList(){
      window.location.href = '#/admin/fragment/list';
    }
  }
}
</script>

<style>
.fragment-form{
  width: 800px;
  min-height: 600px;
}
</style>