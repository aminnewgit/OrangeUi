<template>
  <span :class="[className,field.onClick?'table-field-text-click':'']"
        :style="style"
        @click="click()">{{value}}</span>
</template>

<script>
export default {
  name: "field_text",
  props: ['value', 'rawValue', 'style', 'className', 'field', 'scope'],
  setup(props){
    // if(props.field.k === 'status'){
    //   console.log(props)
    // }
    function click(){
      let {field,scope} = props
      let {onClick} = field
      if(onClick){
        onClick(scope)
      }
    }
    return {
      click
    }

  }
}
</script>

<style>
.table-field-text-click:hover{
  cursor: pointer;
  color: #5C8AE4;
}

</style>