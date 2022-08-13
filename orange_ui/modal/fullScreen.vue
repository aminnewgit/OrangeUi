<template>
  <div class="full-class" @click="toggle">{{d.isFull?'取消全屏':'全屏'}}</div>
</template>

<script>
import {reactive} from "vue";
import {toggleFullscreen} from "@/lib/utils.js";


export default {
  name: "fullScreen",
  components: {},
  setup(props, {emit}) {
    let d = reactive({})
    function toggle() {
      d.isFull = toggleFullscreen()
    }
    return {
      d,toggle
    }
  }
}
</script>

<style scoped>
.full-class{
  font-size: 14px;
  padding-right: 50px;
  cursor: pointer;
}
</style>