<template>
  <template v-for="(item,index) in d.list" :key="index">
    <el-button :type="item.type"
               :plain="item.plain"
               :size="item.size"
               :style="item.style"
               :class="item.class"
               v-loading="item.loading"
               @click="btnClick(item,scope)">{{ item.t }}
    </el-button>
  </template>
</template>

<script>
import {computed, reactive, watchEffect} from "vue";

export default {
  name: "field_operation",
  props: ['value', 'style', 'className', 'field', 'scope','click'],
  setup(props){
    const d = reactive({
      list:[]
    })
    watchEffect(()=>{
      let scope = props.scope
      let list = []
      props.field.child.forEach(btn=>{
        if(btn.if_?btn.if_(scope.row):true){
          list.push({
            btn,
            t: btn.t,
            type: btn.type ? btn.type : 'text',
            plain: btn.plain,
            size: btn.size ? btn.size : 'mini',
            style: btn.style ? btn.style : '',
            class: btn.class ? btn.class : '',
            loading: false
          })
        }
      })
      d.list = list
    })

    function btnClick(item,scope){
      item.btn.onClick(scope.row,item,scope)
    }

    return {
      d,
      btnClick
    }
  }
}
</script>

<style>

</style>