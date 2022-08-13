import {msg} from "@/lib/message.js";

export function getQueryStr(params) {
  let queryStr = ''
  if (params) {
    queryStr = []
    Object.entries(params).forEach((item) => {
      let [key, value] = item
      if (value !== undefined && value !== "") {
        queryStr.push(`${key}=${value}`)
      }
    });
    queryStr = '?' + queryStr.join('&')
  }
  return queryStr
}

export function request(props){
  let {
    url, method, data,
    type='json',
    success,
    headers=[],
    fail=()=>{},
    final=()=>{},
  } = props

  if(method === 'get'){
    url += getQueryStr(data)
    data = undefined
  }
  // =====开启xhr=====
  let xhr = new XMLHttpRequest()
  xhr.open(method, url, true)
  headers.forEach(header=>{
    xhr.setRequestHeader(header[0], header[1])
  })

  if(method === 'post'){
    if(type === 'json') {
      xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
      data = JSON.stringify(data)
    }
  }
  xhr.onload = ()=>{
    let resp = xhr.response
    if (xhr.status === 200) {
      success(resp)
      final()
    }
    else {
      fail('请求错误'+xhr.status,xhr)
      final()
    }
  }
  xhr.onerror = ()=>{
    fail('网络连接错误',xhr)
    final()
  }
  xhr.send(data)
}
// token = [tokenName,token]
let token
let needLoginFunc
let noPermissionFunc

export function requestSetToken(_token){
  token = _token
}
export function requestSetNeedLoginFunc(func){
  needLoginFunc = func
}
export function requestSetNoPermissionFunc(func){
  noPermissionFunc = func
}

export function requestRemoveToken(){
  token = undefined
}

export function apiRequest(props){
  let {
    api,data,
    success = ()=>{},
    error = (msg_)=>{msg.alert({content: msg_})},
    fail = (msg_)=>{msg.alert({content: msg_})},
    final = ()=>{},
    headers = [],
  } = props
  let [method, url, type] = api
  if(token){headers.push(token)}
  request({
    url, method, type, data, headers,
    success(res) {
      try{ res = JSON.parse(res) }
      catch (e){fail('返回数据格式错误不是json数据',res);return}
      let {code, data, msg} = res
      if (code === 1) {success(data,res)}
      else if(code===1001){needLoginFunc()}
      else if(code===1002){noPermissionFunc()}
      else {error(msg,res)}
    },
    fail(msg,xhr){
      fail(msg,xhr)
    },
    final,
  })
}

export function apiRequestAsync(api,data,final=()=>{}){
  return new Promise((resolve,reject) => {
    apiRequest({
      api,data,
      success:resolve,
      error(msg_,res){ msg.alert({content: msg_});reject(msg_)},
      fail(msg_,xhr){ msg.alert({content: msg_});reject(msg_)},
      final,
    })
  })
}