import {h} from "vue";
import FormFieldFloat from "./FormFieldFloat.vue";
import FormFieldStr from "@/lib/autoForm/FormFieldStr.vue";

const fieldComDict = {
  float: {com:FormFieldFloat, verify:false},
  str: {com:FormFieldStr, verify:false}
}

export const AutoForm = {
  name: "AutoForm",
  props:{
    formData: {type: Object},
    fieldList: { type: Object },
    edit: {type: Boolean, default: true},
    exComDict: {type:Object, default: ()=>{}},
    rules:{type:Object},
  },
  setup(props,{expose}){

    let comDict = {
      ...fieldComDict,
      ...props.exComDict,
    }
    const d = {
      verifyList: []
    }
    expose({
      async verify(){
        let list = d.verifyList
        let len = d.verifyList.length
        let pass = true
        for(let i=0;i<len;i++){
          let com = d.verifyList[i]
          // console.log(com)
          let expose = com.component.exposed
          let {verify} = expose
          if(! await verify()){pass=false}
        }
        return pass
      }
    })
    function render(){
      let renderList = []
      let verifyList = []
      let {edit, fieldList, formData, rules} = props
      let len = fieldList.length
      for(let i=0;i<len;i++){
        let field = fieldList[i]
        let {type,define} = field
        let comDefine = comDict[type]
        if(comDefine){
          let {com,verify} = comDefine
          let comInstance = h(com,{define,edit,formData,rules})
          if(verify){verifyList.push(comInstance)}
          renderList.push(comInstance)
        }
        else {
          renderList.push(h('div', {}, `字段类型'${type}'不存在`))
        }
      }
      d.verifyList = verifyList
      return renderList
    }
    return render
  }
}