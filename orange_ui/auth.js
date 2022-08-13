
import {page, toPage} from "@/router.js";
import {
  apiRequest,
  requestRemoveToken,
  requestSetNeedLoginFunc, requestSetNoPermissionFunc,
  requestSetToken
} from "@/lib/request.js";
import {reactive} from "vue";
import {api} from "@/api";
import {clearWs} from "@/wsService";


const storageKey = 'tokenData'

const authData = reactive({

})

export function loginSuccess(info){
  let {token,tokenName,sd} = info
  let tokenData = [tokenName,token]
  requestSetToken(tokenData)
  localStorage.setItem(storageKey,JSON.stringify(tokenData))
  authData.sd = sd
  toPage(page.index)
}

function needLogin(){
  requestRemoveToken()
  localStorage.removeItem(storageKey)
  authData.sd = undefined
  clearWs()
  toPage(page.login)
}

export function isLoggedIn(){
  return !!authData.sd
}

function noPermissionFunc(){
  toPage(page.noPermission)
}

export function authLogin(cb){
  requestSetNeedLoginFunc(needLogin)
  requestSetNoPermissionFunc(noPermissionFunc)

  if(authData.sd){cb(authData.sd);return}
  let tokenData = localStorage.getItem(storageKey)
  if(!tokenData){toPage(page.login);return}
  tokenData = JSON.parse(tokenData)
  requestSetToken(tokenData)
  let props = {
    api:api.user.checkToken,
    success(_sd){
      console.log('check toke success',_sd)
      authData.sd = _sd;
      cb(authData.sd)
    }
  }
  return apiRequest(props)
}

export function getSessionData(){
  return authData.sd
}


export function getPermission(){
  return authData.sd.acm
}

export function logout(){
  apiRequest({api:api.user.logout})
  needLogin()
}