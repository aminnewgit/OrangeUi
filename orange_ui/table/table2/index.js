import "./myTable.scss"
import {h} from 'vue'

// 获取单位量
function getUnitQuantity(q){
  if(typeof(q)==='number'){q=q+"px"}
  return q
}

function setCellStyle(row,field,rowIndex,fieldIndex,com){

  let {align,setCellStyle:scs,w} = field
  let style = {
    textAlign:align?align:com.align
  }
  if(w){style.width = getUnitQuantity(w)}
  if(scs){Object.assign(style,scs(row,field,rowIndex,fieldIndex))}
  return style
}
function setCellClass(row,field,rowIndex,fieldIndex){
  let classList = ['mt-row-td',`mt-row-${field.type?field.type:"text"}`]
  let {setCellClass:scc,className} = field
  if(scc){
    let cc = scc(row,field,rowIndex,fieldIndex)
    classList.push(cc)
  }
  if(className){
    classList.push(className)
  }
  return classList.join(" ")
}
function setTitleStyle(field,index){
  let style = {}
  let {align,setTitleStyle:sts,w} = field
  if(align){style.textAlign=align}
  if(w){style.width = getUnitQuantity(w)}
  if(sts){Object.assign(style,sts(field,index))}
  return style
}
function setTitleClass(field,index){
  let classList = ['mt-header-th']
  let {setTitleClass:stc,titleClassName} = field
  if(stc){
    let cc = stc(field,index)
    classList.push(cc)
  }
  if(titleClassName){
    classList.push(titleClassName)
  }
  return classList.join(" ")
}


// 在字段超长时会显示省略号, 鼠标移动到上方会显示气泡全部内容
function mouseMoveTd(e){
  // if(!props.ellipsisShow){return}
  let target = e.target
  // console.dir(target)
  let cell = target
  let td = target
  if(target.tagName==="TD"){
    cell = target.children[0]
  }
  else {
    td = target.parentElement
  }
  if(cell.scrollWidth>cell.offsetWidth){
    if(!td.title){ td.title = cell.innerText}
  }
  else {
    if(td.title){ td.title = undefined}
  }

}

function getTd(row,field,rowIndex,fieldIndex,cell,com){
  return h('td',{
    className:setCellClass(row,field,rowIndex,fieldIndex,com),
    style:setCellStyle(row,field,rowIndex,fieldIndex,com),
    key:row.id
  },[cell])
}

const fieldRenderDict =   {
  text(row,field,rowIndex,fieldIndex,com){
    let classList = ["mt-row-cell","ellipsis"]
    let props = {onMousemove:mouseMoveTd,}
    if(field.onClick){
      classList.push("cursor-pointer")
      props.onClick = (e)=>{
        field.onClick({value:row[field.k],row,field,rowIndex,fieldIndex,e,com})
      }
    }
    let value = row[field.k]
    if(field.filter){value = field.filter(value,row)}
    props.className = classList.join(" ")
    return getTd(row,field,rowIndex,fieldIndex,
      h('div',props,value),com)
  },
  operation(row,field,rowIndex,fieldIndex,com){
    let btnList = []
      for(let btn of field.buttons){
        let{if_,style,onClick,t} = btn
        if(!(if_?if_(row):true)){continue}
        let props = {
          className:`mt-operation-btn ${btn.className}`,
          onClick:(e)=>{onClick({row,rowIndex,btn,e,com})}
        }
        if(style){props.style=style}
        btnList.push(h("div",props,t))
    }
    return getTd(row,field,rowIndex,fieldIndex,
      h("div",{className:"mt-row-cell"},btnList),com)
  },
  check(row,field,rowIndex,fieldIndex,com){
    let props = {
      type:"checkbox",
      checked:row.checked,
      onChange(e){
        let val = e.target.checked
        let {checkedList} = field
        // console.log(checkedList)
        if(val){
          row.checked = true
          if(!field.multiple){
            let preS =  checkedList.pop()
            if(preS){ preS.checked = false}
          }
          checkedList.push(row)
        }
        else {
          row.checked = false
          let index = checkedList.findIndex(item=>{
            return item.id === row.id
          })
          checkedList.splice(index,1)
        }
      }
    }
    let {canCheck} = field
    if(canCheck){
      props.disabled = !canCheck(row,rowIndex)
    }
    field.align = 'center'
    return getTd(row,field,rowIndex,fieldIndex,
      h("input",props),com)
  },
  num(row,field,rowIndex,fieldIndex,com){
    if(!field.align){field.align="center"}
    return getTd(row,field,rowIndex,fieldIndex,
      h('div',{className:"mt-row-cell ellipsis"},rowIndex+1),com)
  }
}

const thRenderDict = {
  check(field,fieldIndex,com){
    if(field.multiple){
      return h('input',{type:"checkbox",onChange(e){
        let val = e.target.checked
        if(val){
          let list = com.list
          let {checkedList} = field
          if(!checkedList){throw new Error("选择字段没有定义 checkedList")}
          list.forEach(item=>{
            if(!item.checked){
              item.checked = true
              checkedList.push(item)
            }
          })
        }
        else {
          let {checkedList} = field
          checkedList.forEach(item=>{item.checked=false})
          checkedList.length = 0
        }
      }})
    }
    else {
      return h("div",{className:"mt-header-cell"},field.t?field.t:" ")
    }
  }
}

export const myTable = {
  name:"rTable",
  props: {
    loading: Boolean,
    list: {type:Array,default:()=>[]},
    fields: Array,
    className:String,
    styleObject:Object,
    setRowStyle:{type:Function,default:()=>{}},
    height:{default:300},
    align:{type:String,default:"left"},
    emptyMsg:{type:String,default:"没有内容哦!"}
  },
  data(){return{
    tableStyle:{},
    rowWarpHeight:'10px',
    scroll:false,
  }},
  mounted(){
    let {thRef:th} = this
    let thHeight = th.offsetHeight
    let rwh = this.height - thHeight
    this.rowWarpHeight = rwh + 'px'

  },
  updated(){
    if(this.tbodyRef){
      this.scroll = this.tbodyRef.offsetHeight >= parseInt(this.rowWarpHeight)
    }
    else {
      this.scroll = false
    }
  },
  methods:{
    getWarpProps(){
      let {
        className = "",
        height,
      } = this
      return {
        className:`my-table ${className}`,
        style:{height:height+'px'},
      }
    },
    getTableHeader(){
      // tableHeader
      // console.log('render table header')
      let t = this
      let thList = this.fields.map((field,index)=>{
        let thProps = {
          className:setTitleClass(field,index),
          style:setTitleStyle(field,index),
        }
        let thRender = thRenderDict[field.type]
        let thContent
        if(thRender){
          thContent = thRender(field,index,this)
        }
        else {
          thContent =  h("div",{className:"mt-header-cell"},field.t)
        }
        return h("th",thProps,[thContent])
      })
      return h("tr",{className:"mt-header-tr",ref:(th)=>{this.thRef=th}},thList)

    },
    getTableBody(){
      let t = this
      let{fields,list} = this
      let rowList = list.map((row,index)=>{
        let content = this.getRowTdList(fields,row,index)
        return h("tr",{
          style:t.setRowStyle(row,index),
          className:'mt-row'
        },content)
      })

      return h("tbody",{},[rowList])
    },
    getRowTdList(fields,row,rowIndex){
      return fields.map((field,index)=>{
        let type = field.type || "text"
        let fieldHandler = fieldRenderDict[type]
        let cell
        if(fieldHandler){
          cell = fieldHandler(row,field,rowIndex,index,this)
        }
        else {
          let slotCom = this.$slots[type]
          if(slotCom){
            let slot = slotCom({
              value:row[field.k],
              row,rowIndex,
              field,fieldIndex:index,
              tableCom:this})
            cell = getTd(row,field,rowIndex,index,slot,this)
          }
          else {
            throw new Error(`field type "${type} not define"`)
          }
        }
        return cell
      })
    },
  },
  render(){
    let t = this
    // console.log('render')
    // if(!this.thCache){this.thCache = this.getTableHeader()}
    let thHeader = this.getTableHeader()

    let tableHeaderProps = {
      className:"mt-header",
      style:{
        width: t.scroll?"calc(100% - 17px)":"100%"
      }
    }
    let tableHeader = h("table",tableHeaderProps,[thHeader])
    let tableHeaderWarp = h("div",{className:"mt-header-warp"},[tableHeader])

    let warpChildren = [tableHeaderWarp]
    if(this.list.length === 0){
      warpChildren.push(h("div",{
        style:{height:this.rowWarpHeight},
        className:"mt-empty"
      },this.emptyMsg))
    }
    else {
      let warpProps ={
        className:"mt-body-warp",
        style:{maxHeight:this.rowWarpHeight}
      }
      let tableBodyProps = {className:"mt-body",ref:(el)=>{this.tbodyRef=el}}
      let tableBody =  h("table",tableBodyProps,[t.getTableBody()])
      let tableBodyWarp = h("div",warpProps,[tableBody])
      warpChildren.push(tableBodyWarp)
    }
    return h("div",this.getWarpProps(),warpChildren)
  }
}

