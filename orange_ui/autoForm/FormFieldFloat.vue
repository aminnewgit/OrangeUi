<template>
  <el-form-item :label="define.label" :prop="define.key">
    <el-input-number
        :model-value="formData[define.key]"
        @update:modelValue="valueChange"
        :precision="2"
        :step="0.01"
        :max="define.max"
        :min="define.min"/>
  </el-form-item>
</template>

<script>
export default {
  name: "FormFieldFloat",
  props: ['define','edit','formData'],
  setup(props){
    let {formData,define} = props


    function valueChange(e){
      formData[define.key] = e
    }
    return {
      valueChange
    }
  }
}
</script>

<style scoped>

</style>