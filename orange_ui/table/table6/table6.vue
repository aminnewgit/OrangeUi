<template>
<div class="table6">
  <table class="table6-table">
    <thead class="table6-thead">
      <tr class="table6-tr table6-thead">
        <th v-for="field in fields"
            class="table6-th">{{field.t}}</th>
      </tr>
    </thead>
    <tbody class="table6-tbody">
      <tr v-for="(row,rowIndex) in dataList"
          :class="`table6-tr ${rowIndex===d.selectIndex?'s':''}`"
          @click="colClick(rowIndex)"
          :key="row[vKey]">
        <td v-for="(field,colIndex) in fields"
            class="table6-td">
          <span v-if="field.type === undefined">{{row[field.k]}}</span>
          <span v-else-if="field.type === 'op'">
            <template v-for="btn in field.btnList" :key="btn.t">
               <span v-if="opBtnShow(btn,row,rowIndex,fields,colIndex)"
                 @click="opBtnClick(btn,row,rowIndex,fields,colIndex)"
                 :class="`table6-op-btn ${btn.cls?btn.cls:''}`">{{btn.t}}</span>
            </template>

          </span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
</template>

<script>
export default {name:'table6'}
</script>
<script setup>
  import {reactive} from "vue";

  const props = defineProps({
    fields:{type:Array,required:true},
    dataList:{type:Array,required:true},
    vKey:{type:String,default:'id'},
    event:{type:Object,default:{}},
    bodyHeight:{type:Number,default:300}
  })

  const d = reactive({
    selectIndex:undefined
  })

  function colClick(index){
    if(props.event.onSelect){
      d.selectIndex = index
      props.event.onSelect(index)
    }
  }

  function opBtnClick(btn,row,rowIndex,fields,colIndex){
    if(btn.click){btn.click({btn,row,rowIndex,fields,colIndex})}
  }
  function opBtnShow(btn,row,rowIndex,fields,colIndex){
    if(btn.show){return btn.show({btn,row,rowIndex,fields,colIndex})}
    return true
  }

</script>
<!--todo 使用fixed 布局 分两个表格,用colgroup标签 管理宽度 element做法-->
<style >


  .table6-table{
    border-collapse: collapse;
    /*table-layout:fixed;*/
    width: 100%;
    text-align: center;
  }
  .table6-thead{
    width: 100%;
    /*display: table;*/
  }
  .table6-tbody{
    /*display: table;*/
    /*width: calc(100% + 8px); !*这里的8px是滚动条的宽度*!*/
    width: 100%;
    max-height: 260px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .table6-tr{
    /*height: 30px;*/
    width: 100%;
    /*table-layout: fixed;*/
  }
  .table6-tr.s{
    background-color: #3498db;
  }

  .table6-th{
    padding: 5px 10px;
  }
  .table6-td{
    padding: 5px 10px;
  }
  .table6 td,th{
    padding: 2px 10px;
  }

  .table6-op-btn{
    margin-right: 10px;
    cursor: pointer;
  }
  .table6-op-btn:nth-last-child(1){
    margin-right: 0;
  }







</style>