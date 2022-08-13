/*
* vue3 的两种 动态组件挂载方式
* 1. 新建app
*    优点: 可以挂载全局组件,可以在devtools里面显示,
*    缺点: 性能开销大
*    适用: modal window 一类要加载许多不同组件的命令式调用
* 2. render  createVNode 方法 挂载虚拟节点
*    优点: 开销小,
*    缺点: 过于简单,
*    试用: toast message loading notify 一类调用频繁,解构简单的命令是弹出
*
* */

import { h,ref} from 'vue'


import msgBox from "./msgBox.vue";
import loading from "./loading.vue";
import modal from "./modal.vue";
import {getType} from "@/lib/utils.js";
import inputString from "./inputString.vue";


let createApp
export function setupModal(createVue){
  createApp = createVue
}

let seed = 1
const modalDict = {}

function onClose(id,container,destroyDelay){
  setTimeout(()=>{
    let app = modalDict[id]
    let sid = '#'+id
    app.unmount(sid)
    document.body.removeChild(container)
    delete modalDict[id]
  },destroyDelay)

}



// todo 增加show和hide的支持 增加复用性

/**
 * com.modalProps 等同参数中的 modalProps, 参数中的优先级更高
 * com.destroyDelay 摧毁延迟,用于等待关闭动画延迟,默认250ms
 *
 * com 事件
 * close      事件  关闭modal  关闭是同时摧毁modal实例
 * regCloseCb 事件  注册一个在modal关闭时的钩子函数
 * setTitle   事件  设置modal标题
 *
 *
 * */

export function openModal(com,props={},modalProps={}){
  modalProps = Object.assign({z:5500},modalProps)
  createModal(com,props,modalProps)
}

export function createModal(com,props,modalProps){
  let {z} = modalProps

  let container = document.createElement('div')
  let id = 'c-modal-' + seed++

  container.className = `c-modal-base-warp`
  container.id = id

  com.mixins = [{emits:['close','regCloseCb','setTitle']}]

  let{
    modalProps:_modalProps,
    destroyDelay=250
  } = com

  if(_modalProps){
    modalProps = Object.assign(_modalProps,modalProps)
  }
  let comInstance
  let appDefine = {
    name:id,

    data(){return{
      container,id,
      show:false,
      props,
      modalProps,
      closeCb:undefined,
    }},
    methods:{
      close(execCb=true){
        this.show = false
        onClose(this.id,this.container,destroyDelay)

        if(this.closeCb){
          if(execCb===true){
            this.closeCb()
          }
        }
      },
      open(){
        this.show = true
      }
    },
    render(){
      comInstance =  h(com,{
        ...this.props,
        onClose:(execCb)=>{this.close(execCb)},
        onRegCloseCb:(cb)=>{this.closeCb = cb},
        onSetTitle:(title)=>{this.modalProps.title = title}
      })

      return h(modal,
        {
          show:this.show,
          ...this.modalProps,
          'onUpdate:show':()=>{this.close()}
        },
        {default: () => comInstance}
      )
    },
    mounted() {
      this.show = true
    }
  }
  let a = createApp(appDefine,z)
  a.mount(container)
  modalDict[id] = a

  document.body.appendChild(container)


  return {
    getCom(){
      return comInstance.component.proxy
    },
    // show(){
    //   // a._instance.proxy.show = true
    // },
    // hide(){
    //   // a._instance.proxy.show = false
    // },
    destroy(){
      onClose(id,container,destroyDelay)
    }
  }

}

/**右侧弹出modal*/
export function openRightPopup(com,props={},modalProps={}){
  modalProps.className = 'right-popup-box'
  // modalProps.bodyTransition = 'modalRightPopup'
  openModal(com,props,modalProps)
}


const iconDict = {
  success:{cls:'el-icon-success',color:'green'},
  error:{cls:'el-icon-error',color:'red'},
  question:{cls:'el-icon-question',color:'#f4c425'},
  info:{cls:'el-icon-info',color:'#f4c425'},
  warning:{cls:'el-icon-warning',color:'#f4c425'}
}

const messageBoxTypeList = ['success','error','question','info','warning']

function getIcon(icon){
  let type = getType(icon)
  if(type === "Object"){return icon}
  else if(type ==="String"){return iconDict[icon]}
}

export function alert(props){
  let {
    msg,icon,
    ok=()=>{},
    title='提示',
  } = props
  icon = getIcon(icon)
  openModal(msgBox,{msg,ok,icon},{title,z:6500})
}
export function confirm(props){
  let {
    title='提示',
    msg, icon,
    ok=()=>{},
    cancel=()=>{},
    loading=false,
  } = props
  icon = getIcon(icon)
  openModal(msgBox,{msg,ok,cancel,icon,loading},{title})
}

messageBoxTypeList.forEach(name=>{
  alert[name] = (msg,ok=()=>{})=>{
    let props = {msg,ok,icon:name}
    alert(props)
  }

  confirm[name] = (msg,ok,cancel=()=>{})=>{
    let props = {msg,ok,cancel,icon:name}
    confirm(props)
  }
})

export function openLoading(msg){
  let modalProps = {
    showTitle:false,
    className:'jun-loading',
  }
  let r = openModal(loading,{msg},modalProps)

  return {
    close(){
      let com = r.getCom()
      com.close()
    }
  }
}

export function inputStringModal(title,ok,z=5000){
  let comProps={ok}
  let modalPops={title,z}
  openModal(inputString,comProps,modalPops)
}










