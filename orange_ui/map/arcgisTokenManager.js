import IdentityManager from "@arcgis/core/identity/IdentityManager.js";

function objToFormData(obj){
  let data = new FormData()
  Object.entries(obj).forEach(([key,val])=>{
    data.set(key,val+'')
  })
  return data
}

export class ArcgisTokenManager{
  constructor(props={}) {
    let {
      username = 'app_hswrjxj',
      password = '5Gr%hsVJ8Z',
      expiration = 60,
      getTokenUrl = 'https://gis.slof.com/portal/sharing/rest/generateToken'
    } = props
    this.tokenCache = ''
    this.tokenExpire = 0
    this.tokenExpireLeadTime = 1000*60*20 // 过期提前量20 分钟

    this.username = username
    this.password = password
    this.expiration = expiration
    this.getTokenUrl = getTokenUrl
    this.referer = window.location.origin + '/'
  }

  async _getTokenRemote(){
    let data = {
      username: this.username,
      password: this.password,
      client: 'referer',
      referer: this.referer,
      f: 'json',
      expiration:this.expiration
    }
    data = objToFormData(data)
    const props = {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-c
      // headers: {
      //   // 'Content-Type': 'application/json'
      //   // 'Content-Type': 'application/x-www-form-urlencoded',
      // },
      body: data
    }
    let r = await fetch(this.getTokenUrl,props)
    return r.json();
  }


  async getToken() {
    let now = Date.now()
    if(this.tokenCache && this.tokenExpire>now){
      return this.tokenCache
    }
    let r = await this._getTokenRemote()
    let {token, expires} = r
    this.tokenCache = token
    this.tokenExpire = expires - this.tokenExpireLeadTime

    return this.tokenCache
    // 1665374732951
    // 1665371172608
  }

  async regServer(server){
    let token = await this.getToken()
    IdentityManager.registerToken({server,token});
  }
}

export const tokenManager = new ArcgisTokenManager()