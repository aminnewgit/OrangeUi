import {ElMessage, ElMessageBox, ElNotification} from "element-plus";


export const msg = {
  success(msg,duration=3000){
    ElMessage({
      type: 'success',
      message:msg,
      duration
    })
  },
  error(msg,duration=3000){
    ElMessage({
      type: 'error',
      message:msg,
      duration
    })
  },
  warning(msg,duration=3000){
    ElMessage({
      type: 'warning',
      message:msg,
      duration
    })
  },
  confirm(props){
    let {
      title = '提示',
      content,
      type='warning',
      ok = ()=>{},
      cancel = ()=>{}
    }=props

    let comProps = {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type,
    }
    ElMessageBox.confirm(content,title,comProps)
      .then(ok)
      .catch(cancel)
  },
  alert(props){
    let {
      title = '提示',
      content,
      type='warning',
      ok = ()=>{},
    }=props

    let comProps = {
      confirmButtonText: '确定',
      type,
    }
    ElMessageBox.confirm(content,title,comProps)
      .then(ok)
  },
  notify:{
    success(title='success',msg, duration=5000) {
      ElNotification({
        title,duration,
        dangerouslyUseHTMLString: true,
        message: msg,
        type: 'success',
      })
    },
    warning(title='warning',msg, duration=5000) {
      ElNotification({
        title,duration,
        dangerouslyUseHTMLString: true,
        message: msg,
        type: 'warning',
      })
    },
    info(title='info',msg, duration=5000) {
      ElNotification({
        title,duration,
        dangerouslyUseHTMLString: true,
        message: msg,
        type: 'info',
      })
    },
    error(title='error',msg, duration=5000) {
      ElNotification({
        dangerouslyUseHTMLString: true,
        title,duration,
        message: msg,
        type: 'error',
      })
    }
  }
}

