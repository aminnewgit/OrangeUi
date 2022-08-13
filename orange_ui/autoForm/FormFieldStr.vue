<template>
  <el-form-item :label="define.label" :prop="define.key">
    <el-input  :model-value="formData[define.key]"
               @update:modelValue="valueChange"
               :placeholder="define.desc" />
  </el-form-item>
</template>

<script>
export default {
  name: "FormFieldFloat",
  props: ['define','edit','formData','rules'],
  setup(props){
    let {formData,define,rules} = props
    let {require,key,label} = define
    if (require){
      rules[key] = [
        {required: true, message: `请输入${label}`, trigger: ['blur','change']},
      ]
    }
    function valueChange(e){
      formData[key] = e
    }
    return {
      valueChange
    }
  }
}
</script>

<style scoped>

</style>