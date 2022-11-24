export function getQueryStr(params) {
  let queryStr = ''
  if (params) {
    queryStr = []
    Object.entries(params).forEach((item) => {
      let [key, value] = item
      if (value !== undefined) {
        queryStr.push(`${key}=${value}`)
      }
    });
    queryStr = '?' + queryStr.join('&')
  }
  return queryStr
}
export function getType(value) {
  let typ = Object.prototype.toString.call(value)
  return typ.replace('[object ', '').replace(']', '')
}
export function sizeStr(bytes) {
  if (bytes === 0) {return '0 B'}
  let k = 1024, // or 1000
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}
// 数组项目上移下移
export function listUp(list,index){
  let item = list[index]
  if (index > 0) {
    list.splice(index, 1)
    index -= 1
    list.splice(index, 0, item)
  }
  return index
}
export function listDown(list,index) {
  let item = list[index]
  if (index < list.length - 1) {
    list.splice(index, 1)
    index += 1
    list.splice(index, 0, item)
  }
  return index
}
export function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj))
}

// 范围随机数
export function randomRange(min, max) {
  return parseInt(Math.random() * (max - min + 1) + min, 10);
}


/**解析 location.search */
export function parseSearchStr(search) {
  if (search === "") {
    return {}
  }
  let query = search.split("?")[1]
  query = query.split("&")
  let r = {}
  query.forEach(item => {
    let l = item.split("=")
    r[l[0]] = l[1]
  })
  return r
}



export function toFixed2(num) {
  return Math.round(num * 100) / 100
}

export function getTimeStr(dateObj) {
  if (dateObj) {
    return dateObj.toLocaleString('chinese', {hour12: false}).replaceAll('/', '-')
  }
}



export function getTimestampS() {
  return parseInt(new Date().getTime() / 1000)
}

export function getTimestamp() {
  return new Date().getTime()
}


export function openFile(ok, accept = "*", multiple = true) {
  let input = document.createElement('input')
  input.setAttribute('type', 'file')
  input.setAttribute('accept', accept)
  input.setAttribute('multiple', multiple)
  input.addEventListener('change', e => {
    ok(e.target.files)
  })
  input.click()
}

export function getFileSuffix(filename) {
  filename = filename.split(".")
  if (filename.length > 1) {
    return filename[filename.length - 1]
  } else {
    return ""
  }
}

let isFullscreenState = false
export function toggleFullscreen() {
  if (!isFullscreenState) {
    let {documentElement} = document
    let requestFullscreen =
      documentElement.requestFullscreen ||
      documentElement.mozRequestFullScreen ||
      documentElement.webkitRequestFullScreen ||
      documentElement.msRequestFullscreen

    requestFullscreen.apply(documentElement)
    isFullscreenState = true
  } else {
    let exitFullscreen =
      document.exitFullscreen ||
      document.mozCancelFullScreen ||
      document.webkitCancelFullScreen ||
      document.msExitFullscreen

    exitFullscreen.apply(document)
    isFullscreenState = false
  }
  return isFullscreenState
}

// 判断是否是全屏
// 按F11时也能判断到，但按F11全屏后不能调用document.exitFullscreen退出全屏
// 既然用户会用F11，那也没必要考虑吧这种情况了吧
window.addEventListener('resize', () => {
  if(window.innerHeight >=
    screen.height - Math.abs(window.innerHeight - window.outerHeight)){
    // ..
  }

})


export function dateToStr(datetime){
  datetime.setDate(datetime.getDate());
  let year = datetime.getFullYear();
  let month = datetime.getMonth()+1;//js从0开始取
  let date = datetime.getDate();
  let hour = datetime.getHours();
  let m = datetime.getMinutes();
  let s = datetime.getSeconds()
  month = month < 10 ?  "0" + month : month ;
  date  = date<10 ?  "0" + date : date;
  hour  = hour <10 ? "0" + hour : hour;
  s  = s <10 ? "0" + s : s;
  return year + "-" + month + "-" + date + ' ' + hour + ':' + m + ':' + s ;
}


export function listToDict(list,keyName){
  let dict = {}
  list.forEach(item=>{
    dict[item[keyName]] = item
  })
  return dict
}



// element 表单验证
export function elFormVerifyAsync(elForm){
  return new Promise(resolve => {
    elForm.validate((valid, fields) => {
      if(valid){resolve(true)}
      else {resolve(false)}
    })
  })
}


// 新数据的属性在老数据中都没有变化
// 所有数据都是基本类型
// 在新数据中字段减少也不做判断
export function ObjDataNotChange(oldData,newData){
  return Object.keys(newData).every(key=>newData[key]=oldData[key])
}
export function objToFormData(obj) {
 const formData = new FormData()
  Object.keys(obj).forEach(key =>{
    if(obj[key] instanceof Array) {
      obj[key].forEach(item => {
        formData.append(key, item);
      })
      return
    }
    formData.append(key,obj[key])
  })
  return formData
}


export function firstLetterUpper(word){
  return word.slice(0, 1).toUpperCase() + word.slice(1)
}


