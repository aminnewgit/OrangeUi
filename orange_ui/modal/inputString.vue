<template>
<div class="modal-input" v-loading="loading">
  <div class="modal-input-div f-cc">
    <input class="modal-input-input" v-model="text" type="text">
  </div>
  <div class="f ai-c jc-end">
    <el-button type="success" @click="btnOk">确定</el-button>
    <el-button @click="close">取消</el-button>
  </div>
</div>
</template>

<script>
export default {
name: "inputString",
props:['ok','canEmpty'],

data(){return{
  text:'',
  loading:false,
}},
methods:{
  btnOk(){
    let t = this
    let str = this.text.trim()
    // 不能为空空
    if(!this.canEmpty){
      if(str===""){return}
    }
    this.ok({
      str:this.text.trim(),
      close(){t.close()},
      loading:{
        open(){t.loading=true},
        close(){t.loading=false}
      }
    })
  },
  close(){
    this.$emit("close")
  }
}
}
</script>

<style lang="scss">
.modal-input{
  position: relative;
}
.modal-input-div{
  width: 100%;
  margin-top: 10px;
}
.modal-input-input{
  width:100%;
  //border: none;
  border: 2px solid var(--grey-border);
  outline: none;
  margin-bottom: 25px;
  font-size: 20px;
  border-radius: 5px;
}
.modal-input-warp{

}
</style>