<template>

  <el-button :type="btnProps.type"
             :plain="btnProps.plain"
             :size="btnProps.size"
             :style="btnProps.style"
             :class="btnProps.class"
             :disabled="btnProps.disable"
             v-loading="btnProps.loading"
             @click="btnClick">{{value}}
  </el-button>
</template>

<script>
import {computed} from "vue";

export default {
  name: "field_text",
  props: ['value', 'rawValue', 'style', 'className', 'field', 'scope','click'],
  setup(props){

    const defaultProps = {
      type:'success',
      plain: false,
      size: 'small',
      style:{},
      class:'',
      loading:false,
      disable:false

    }

    const btnProps = computed(()=>{
      let {field,value,scope} = props
      let {btnStyleFilter} = field
      if(btnStyleFilter){
        let style = btnStyleFilter(value,scope)
        return Object.assign(defaultProps,style)
      }
      else {
        return defaultProps
      }

    })

    function btnClick(){
      let {value,field,scope} = props
      if(field.onClick){
        field.onClick(value,scope,field)
      }
    }
    return {
      btnProps,btnClick
    }
  }
}
</script>

<style>

</style>