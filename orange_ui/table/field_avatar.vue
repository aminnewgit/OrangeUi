<template>
  <el-avatar :size="field.size || 40" :src="value"/>
</template>

<script>
export default {
  name: "field_avatar",
  props: ['value', 'style', 'className', 'field', 'scope','click'],
}
</script>

<style>

</style>