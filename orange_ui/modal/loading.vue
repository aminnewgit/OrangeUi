<template>
  <div class="loading f ai-c">
    <div class="loadDh">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="msg" v-html="msg"></div>
  </div>
</template>

<script>
  export default {
    name: "loading",
    props:{
      'msg':{default:'加载中...'},
    },
    methods:{
      close(){
        this.$emit("close")
      }
    }
  }
</script>

<style lang="scss">
.jun-loading{
  .c-modal-body {
    min-width: 1rem !important;
  }
}
.loading{
  /*padding: 2rem;*/
  background-color: #fff;
  border-radius: .5rem;
  font-size: 2rem;
  position: relative;
  transform: scale(1);
}
.loading .msg{
  margin-left: 6.5rem;
}

.loadDh{
  position:relative;
  height: .8rem;
}
.loadDh span{
  display: block;
  bottom: 0;
  width: .9rem;
  height: .5rem;
  background:#9b59b6;
  position:absolute;
  animation: preloader_1 1.5s  infinite ease-in-out;
}
.loadDh span:nth-child(2){
    left:1.1rem;
    animation-delay: .2s;
}
.loadDh span:nth-child(3){
    left:2.2rem;
    animation-delay: .4s;
}
.loadDh span:nth-child(4){
    left:3.3rem;
    animation-delay: .6s;
}
.loadDh span:nth-child(5){
    left:4.4rem;
    animation-delay: .8s;
}
@keyframes preloader_1 {
    0% {height:.5rem;transform:translateY(0);background:#9b59b6;}
    25% {height:3rem;transform:translateY(1.25rem);background:#3498db;}
    50% {height:.5rem;transform:translateY(0);background:#9b59b6;}
    100% {height:.5rem;transform:translateY(0);background:#9b59b6;}
}

</style>