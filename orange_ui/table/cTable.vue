<template>
  <div v-if="searchLine" class="f ai-c jc-between c-table-top-btn-line">
    <div>
     <slot name="btnLine"></slot>
    </div>
    <el-button-group class="c-table-top-right-btn">
      <el-button v-if="rightBtn"
                 :type="rightBtn.type"
                 @click="rightBtn.onClick">{{ rightBtn.title }}</el-button>
      <!-- 字段筛选     -->
      <el-button type="default" v-if="true" style="padding: 0">
        <el-dropdown trigger="click" :hide-on-click="false">
          <span class="el-dropdown-link" style="padding: 8px 15px">
            <i class="fa fa-list"></i>
            <span class="caret"></span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <template v-for="(item,index) in fields" :key="index">
                <el-dropdown-item>
                  <el-checkbox :model-value="item.show !== false"
                               :key="item.k" :label="item.t"
                               :disabled="item.show === 'fixed'"
                               @change="changeFieldShow(item)"/>
                </el-dropdown-item>
              </template>

            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-button>
    </el-button-group>
  </div>
  <slot name="secondLine"></slot>
  <el-table v-loading="loading"
            element-loading-text="数据加载中"
            element-loading-spinner="el-icon-loading"
            style="width: 100%"
            :data="data"
            :border="border"
            :header-cell-style="thStyle"
            :height="height"
            @selection-change="selectChange">
    <el-table-column v-if="selectChange"
                     type="selection"
                     align="center"
                     width="55">
    </el-table-column>
    <template v-for="(field,index) in fields">

      <el-table-column v-if="field.show !== false" v-bind="getColumProps(field,index)">
        <template #default="scope">
          <table-field-com v-bind="getCellProps(field, scope)" />
        </template>
      </el-table-column>

    </template>

  </el-table>

  <el-pagination class="page-class f jc-end"
                 v-if="page"
                 @current-change="toPage"
                 :current-page="page.cur"
                 :page-size="page.size"
                 layout="total, prev, pager, next, jumper"
                 :total="page.total">
  </el-pagination>
</template>

<script>

import {h} from "vue";
import field_text from "@/lib/table/field_text.vue";
import field_avatar from "@/lib/table/field_avatar.vue";
import field_operation from "@/lib/table/field_operation.vue";

const fieldComDict = {
  text: field_text,
  avatar: field_avatar,
  operation: field_operation,
}

// table 动态组件渲染
const tableFieldCom = {
  name: 'treeGroup',
  props: ['value', 'style', 'className', 'field', 'scope',"exComDict","click"],
  setup(props){
    let {exComDict={}} = props
    let comDict = {
      ...fieldComDict,
      ...exComDict,
    }
    function render(){
      let {field, scope, style, className, value,click} = props
      let {type = 'text'} = field
      let com = comDict[type]
      if(com){
        return h(com, {value,field, scope, style, className,click})
      }
      else{
        return h('div', {}, `字段类型'${type}'不存在`)
      }
    }
    return render
  }
}

export default {
  name: "cTable",
  props: {
    loading: Boolean,
    data: Array,
    fields: Array,
    // todo 没行的key 对应row 的值

    // 分页
    page: {type: Object},
    changePage: {type: Function,default:()=>{}},

    // 选择
    selectChange: Function,

    // 组件
    searchLine:{type:Boolean,default:true},
    rightBtn: Object,

    //样式
    border: {type: Boolean, default: true},
    thStyle: {type:Object, default:{background:'#eff7f7',color:'#1f2d3d'}},
    align: String,
    height: Number,
  },
  emits: ['operate','select',],
  components:{tableFieldCom},
  setup (props) {

    // 单元格格值
    function _getCellValue (field, row) {
      let key = field.k
      if(!key){return}
      let value
      if (!key.includes('.')){
        value = row[key]
      }
      else {
        // 获取多级key值
        let keyList = key.split('.')
        let length = keyList.length
        value = row
        for(let i=0;i<length;i++){
          let key = keyList[i]
          value = value[key]
          if(!value){break}
        }
      }
      return (value === '' || value === undefined || value === null) ? '--' : value
    }
    function getCellProps(field, scope){
      let {row} = scope
      let {filter,styleFilter,classFilter} = field
      let value = _getCellValue(field, row)
      value = filter ? filter(value, row, scope, field) : value
      return {
        value,
        style: styleFilter ? styleFilter(value, row, scope, field) : undefined,
        className: classFilter ? classFilter(value, row, scope, field) : undefined,
        field,
        scope,
        click(){
          if(field.onClick){
            field.onClick(row,scope,field)
          }
        }
      }
    }
    function getColumProps(field, index){

      let {
        k,t,
        fixed = false,
        w = 'auto',
        mw = 90,
        align = 'left',
        tooltip = true
      } = field

      return {
        prop: k,
        label: t,
        showOverflowTooltip: tooltip , // 内容过长时 胜利显示并在鼠标悬浮时,气泡显示全部值
        key: index,
        fixed,
        width: w,
        minWidth: mw,
        align,
      }

    }
    function toPage(index) {
      props.changePage(index)
    }
    // 字段筛选
    function changeFieldShow(field){
      console.log(field)
      if(field.show === 'fixed'){}
      else if(field.show === false){
        field.show = true
      }
      else {
        field.show = false
      }
    }

    return {
      getCellProps,getColumProps,
      toPage,
      changeFieldShow,
    }
  },

  // todo 整理样式
  // todo 表格显示本地缓存
}
</script>

<style lang="scss">
.page-class{
  margin-top: 15px;
}

.caret {
  display: inline-block;
  width: 0;
  height: 0;
  margin-left: 2px;
  vertical-align: middle;
  border-top: 4px dashed;
  border-top: 4px solid \9;
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;
}

.c-table-top-btn-line{
  padding-bottom: 10px;
}
.c-table-top-right-btn{
  min-width: 116px;
  margin-left: 20px;
  display: flex !important;
  justify-content: flex-end;
}
.c-table-column-show-fixed{
  .el-checkbox__label{
    color: #909399 !important;
  }

}
</style>
