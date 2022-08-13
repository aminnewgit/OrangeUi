export function wsSetUp(props){
  let {
    url,
    onMessage = (msg)=>{console.log("ws on message: ",msg)},
    onClose = ()=>{
      console.log("ws close")
      heartCheck.start()
    },
    onConnected = ()=>{console.log("ws connected")},
    onError = (e)=>{ console.log('ws error',e);}
  } = props

  let wsData ={}

  let ws = new WebSocket(url);
  ws.onopen = onConnected
  ws.onmessage = (e)=>{
    onMessage(JSON.parse(e.data))
  }
  ws.onclose = onClose
  ws.onerror = onError

  let heartCheck = {
    timeout: 5000, //重连时间
    timeoutObj: null,
    start: function(){
      console.log('ws自动重连中...')
      this.timeoutObj = setTimeout(function(){
        wsSetUp(props) //这里重新创建 websocket 对象并赋值
      }, this.timeout)
    }
  }

  wsData.socket = ws

  return wsData
}