<template>
  <div class="c-alert-body f ai-c jc-start">
    <div v-if="icon"
        :class="['c-alert-icon',icon.cls]"
         :style="{color:icon.color}"></div>
    <div class="c-alert-msg-box" v-html="msg"></div>
  </div>
  <div class="w100 f ai-c, jc-end">
    <div class="c-alert-footer"></div>
    <el-button v-if="cancel"
               v-loading="showLoading"
               @click="_cancel">取消</el-button>
<!--    <button v-if="cancel"-->
<!--            class="c-alert-cancel c-msg-btn"-->
<!--            :disabled="showLoading"-->
<!--            @click="_cancel">取消</button>-->
    <el-button v-loading="showLoading"
               type="primary"
               @click="_ok">确定</el-button>
<!--    <button class="c-alert-ok c-btn-blue"-->
<!--            -->
<!--            :disabled="showLoading"-->
<!--            @click="_ok">-->
<!--      <span v-if="showLoading"-->
<!--            class="el-icon-loading c-msg-btn"-->
<!--            style="margin-right: 5px"></span>-->
<!--      <span>确定</span>-->
<!--</button>-->
  </div>

</template>

<script>
export default {
  name: "test",
  props:['msg','ok','cancel','icon','loading'],
  modalProps:{
    className:'c-alert',
    z:8000,
  },
  data(){return{
    showLoading:false
  }},
  methods:{
    _ok(){
      if(this.showLoading){return}
      let t = this
      if(this.loading){
        this.showLoading = true
        this.ok(()=>{
          t.showLoading = false
          t.$emit('close',false)
        })
      }
      else{
        this.ok()
        this.$emit('close',false)
      }

    },
    _cancel(){
      if(this.showLoading){return}
      this.$emit('close')
    },
  },
  mounted() {
    if(this.cancel){
      this.$emit('regCloseCb',this.cancel)
    }
    else{
      this.$emit('regCloseCb',this.ok)
    }
  }
}
</script>

<style lang="scss">


.c-alert{
  .c-modal-header{
    margin-bottom: 1rem;
  }
  .c-modal-title::after{
    content: "";
    width: 0 ;
    height: 0 ;
  }
  .c-modal-body{
    padding: 10px 15px;
    min-width: 22rem;
  }
}
.c-alert-body{
  min-height: 20px;
  font-size: 18px;
  //max-width: 450px;
  margin-bottom: 1rem;
}
.c-alert-ok{
  padding: 9px 15px 7px 15px;
}
.c-alert-cancel {
  border: 1px solid #dcdfe6;
  margin-right: 20px;
  line-height: 1;
  padding: 9px 15px 7px 15px;
  background-color: #fff;
  border-radius: 3px;
  transition: .1s;
}
.c-alert-icon:before{
  font-size: 46px;
}
.c-alert-icon{
  margin-right: 10px;
}
.c-alert-cancel:hover{
  background-color: #d7f0ff;
  color: #409eff;
}
.c-alert-cancel:active{
  border: 1px solid dodgerblue;
}
.c-alert-msg-box{
  max-height: 500px;
  max-width: 800px;
  overflow: auto;
  white-space: pre-line;
  word-break: keep-all;
}
</style>
