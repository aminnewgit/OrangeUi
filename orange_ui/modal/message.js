import {ElMessage, ElMessageBox} from "element-plus";

export const msg = {
  success(msg){ElMessage.success(msg)},
  error(msg){ElMessage.error(msg)},
  warning(msg){ElMessage.warning(msg)},

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
  }
}

// const confirmProps =  {
//   confirmButtonText: '确定',
//   cancelButtonText: '取消',
//   type: 'warning',
// }
// ElMessageBox.confirm('确定要删除选定的项吗?','提示',confirmProps)
//   .then(() => {})
//   .catch()

export const msgBox = {

}