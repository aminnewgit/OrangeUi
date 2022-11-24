<template>
  <el-image
      :class="[field.onClick?'hover-point':'']"
      :style="{width: (field.w || 100)+'px'}"
      :src="value"
      :initial-index="0"
      @click="imageClick"
      fit="scale-down"/>

</template>

<script>
import {ElImageViewer} from 'element-plus'
import {mountedCom} from "@/lib/modal";
export default {
  name: "field_avatar",
  props: ['value', 'style', 'className', 'field', 'scope'],
  setup(props){
    let imageShowCom
    function imageClick(){
      let {field,scope} = props
      let{onClick} = field
      if(onClick){onClick(scope)}
      else {showImage()}
    }
    function showImage(){
      let {getImageListFunc} = props.field
      let urlList = getImageListFunc ? getImageListFunc(props.value,props.scope):[props.value]
      let comProps = {
        urlList,
        onClose(){imageShowCom.close()}
      }
      imageShowCom = mountedCom(ElImageViewer,comProps,8000)
    }
    return {imageClick}
  }
}
</script>

<style>

</style>