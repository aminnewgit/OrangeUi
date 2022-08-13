<template>
  <span :class="className"
        :style="style"
        @click="click()">{{value}}</span>
</template>

<script>
export default {
  name: "field_text",
  props: ['value', 'style', 'className', 'field', 'scope','click'],
}
</script>

<style>

</style>