
import SpatialReference from "@arcgis/core/geometry/SpatialReference.js";
import {Point} from "@arcgis/core/geometry.js";
import * as projection from "@arcgis/core/geometry/projection.js";
import Graphic from "@arcgis/core/Graphic.js";
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import Fullscreen from "@arcgis/core/widgets/Fullscreen.js";
import Zoom from "@arcgis/core/widgets/Zoom.js";
import {h} from "vue";
import {mapType} from "@/config_local.js";
import {arcgisGetMap} from "@/lib/map/createMap";

const symbolFuncDict = {
  pictureMarker(iconProps){
    let {url,width=32,height=32} = iconProps
    return  {
      type: "picture-marker",
      url,
      width: width+'px',
      height: height+'px',
      yoffset: (height/2) + 'px'
    }
  },

  // simpleMarker(symbolProps){
  //   let symbol = {
  //     type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
  //     style: "square",
  //     color: "blue",
  //     size: "8px",  // pixels
  //     outline: {  // autocasts as new SimpleLineSymbol()
  //       color: [ 255, 255, 0 ],
  //       width: 3  // points
  //     }
  //   }
}

function getSymbol(symbolProps){

  let {type = 'pictureMarker'} = symbolProps
  let getSymbolFunc = symbolFuncDict[type]
  if(getSymbolFunc){
    symbolProps = getSymbolFunc(symbolProps)
  }
  return symbolProps
}

// wkid 地理坐标系和投影坐标系
// 4326 GCS_WGS_1984 （经纬度）
// 4490 GCS_China_Geodetic_Coordinate_System_2000 (投影坐标）
// 44984498 CGCS2000_GK_Zone_20

const srDict = {}
projection.load()
function getSr(wkid){
  let sr = srDict[wkid]
  if(!sr){
    sr = new SpatialReference({wkid})
    srDict[wkid] = sr
  }
  return sr
}

export function convertPointSr(xLong,yLat,inWkid,outWkid){
  let inSr = getSr(inWkid)
  let outSr = getSr(outWkid)
  let point = new Point(xLong,yLat,inSr)
  return projection.project(point, outSr)
}

export function convert4498to4326(pos){
  let {x,y} = pos
  let out = convertPointSr(x,y,4498,4326)
  let {longitude, latitude} = out
  return {longitude, latitude}
}

export function getMapClickPos(e){
  let {mapPoint} = e
  let {spatialReference} = mapPoint
  let {wkid} = spatialReference
  if(wkid !== 4326){
    mapPoint = projection.project(mapPoint, getSr(4326))
  }
  let {longitude,latitude} = mapPoint
  return {longitude,latitude}
}

let createVue

export function arcMapSetCreateVue(createFunc){
  createVue = createFunc
}

function getPosXy(props,defaultPos={x:118.69779907,y:37.8000000}){
  let { x, y, longitude, latitude, pos} = props
  if(pos){
    let _pos = getPosXy(pos)
    x = _pos.x
    y = _pos.y
  }
  else if (longitude){x=longitude;y=latitude}
  if(!x){
    x = defaultPos.x
    y = defaultPos.y
  }
  x = parseFloat(x)
  y = parseFloat(y)
  return {x, y}
}

export class ArcIconPoint {

  constructor(props,map) {
    let {data,icon,onClick} = props
    this.icon = this._createIconGraphic(data,icon)
    this.uid = this.icon.uid
    this.map = map
    this.data = data
    this.onClick = onClick
  }

  setGraphicToList(list){
    list.push(this.icon)
  }

  _createIconGraphic(data,symbolProps){
    let t = this
    let {x,y} = getPosXy(data)
    t.x = x
    t.y = y

    symbolProps = getSymbol(symbolProps)

    return new Graphic({
      //绘制点
      geometry: {type:'point', x, y},
      symbol: symbolProps,
      attributes: {},
      // popupTemplate: template
    })
  }


  setPos(pos){
    let {x,y} = getPosXy(pos)
    this.x = x; this.y = y
    this.icon.set('geometry',{type:'point', x, y})
  }
  setIcon(symbolProps){
    symbolProps = getSymbol(symbolProps)
    this.icon.set('symbol',symbolProps)
  }
  hide(){
    this.icon.set('visible',false)
  }
  show(){
    this.icon.set('visible',true)
  }

  addToMap(){
    let map = this.map
    map.addGraphic(this.icon)
    map.addGraphicMouseEvent(this.uid,this)
  }
  removeFromMap(){
    let map = this.map
    map.removeGraphic(this.icon)
    map.removeGraphicMouseEvent(this.uid)
  }
  reDraw(){
    let map = this.map
    map.removeGraphic(this.icon)
    map.addGraphic(this.icon)
  }
}

let mapIdCount = 0

export class ArcMap {

  constructor() {}

  async init(props={}) {
    let {
      containerId='arcMpaView',
      centerPos={x:118.69779907,y:37.8000000},
      zoom = 9,

    } =props
    this.view = undefined
    this.mouseEventDict = {}
    this.comDict = {}
    this.id = mapIdCount++
    this.comIdCount = 0
    this.onClickFunc = undefined

    let basemap = await arcgisGetMap[mapType]()
    let map = new Map({basemap})
    this.map = map

    let {x,y} = getPosXy(centerPos)

    let view = new MapView({
      map,
      container: containerId,
      center: [x, y],
      zoom,
      constraints: {
        maxZoom: 16,
        minZoom: 7,
      }
    });
    this.view = view

    // 移除底部 Powered byEsri
    view.ui.remove('attribution')
    // 绑定点击时间
    view.on('click', e=>this._onMapClick(e))

    // 清空左上角组件
    view.ui.empty("top-left");

  }

  // ===== 鼠标事件 =====
  _onMapClick(e) {
    // console.log(this.view.scale)
    this.view.hitTest(e).then(res => {
      let {results} = res
      let topResult = results[0]
      if(topResult){
        let uid = topResult.graphic.uid
        let graphic = this.mouseEventDict[uid]
        if(graphic){
          if(graphic.onClick){
            graphic.onClick(graphic.data)
          }
        }
      }
      else if(this.onClickFunc){
        let pos = getMapClickPos(e)
        this.onClickFunc(pos,e)
      }

    })
  }

  addGraphicMouseEvent(uid,data,onClick){
    this.mouseEventDict[uid] = {data,onClick}
  }

  removeGraphicMouseEvent(uid){
    delete this.mouseEventDict[uid]
  }

  setOnClick(OnClickFunc){
    this.onClickFunc = OnClickFunc
  }

  removeOnClick(){
    this.onClickFunc = undefined
  }

  // ===== 设置中心点 =====
  setCenter(centerPos,zoom){
    let {x,y} = getPosXy(centerPos)
    let props = {center:[x,y]}
    if(zoom){props.zoom = zoom}
    this.view.goTo(props)
  }

  // ===== 设置图形 =====
  addGraphic(graphic){
    this.view.graphics.add(graphic)
  }

  removeGraphic(graphic){
    this.view.graphics.remove(graphic)
  }

  removeAll(){
    this.view.graphics.removeAll()
    this.mouseEventDict = {}
  }

  setGraphicToTop(){

  }

  // ===== 设置点 =====

  addIconPoint(data,icon,onClick){
    let point = new ArcIconPoint({data,icon,onClick},this)
    point.addToMap()
    return point
  }

  addIconPointList(props){
    let {list,key,icon,onClick} = props
    let pointDict = {}
    let gList = []
    list.forEach(data=>{
      let point = new ArcIconPoint({data,icon,onClick},this)
      pointDict[data[key]] = point
      point.setGraphicToList(gList)
      this.addGraphicMouseEvent(point.uid,data,onClick)
    })
    this.view.graphics.addMany(gList)
    return pointDict
  }

  // ===== 挂在组件 =====
  addVueCom(com,props,pos='top-right',z=6000){
    let comId = `map-com-${this.id}-${this.comIdCount++}`
    let comInstance
    const container = document.createElement('div')
    container.id = comId
    this.view.ui.add(container, pos)
    let appDefine = {
      setup(){return ()=>{
        comInstance = h(com,props,)
        return comInstance
      }}
    }
    let a = createVue(appDefine,z)
    a.mount(container)
    this.comDict[comId] = a
    let t = this

    return {
      com: comInstance.component.proxy,
      close(){
        a.unmount(comId)
        t.view.ui.remove(container)
      }
    }

  }
  unload(){
    Object.entries(this.comDict).forEach(([key,value])=>{
      value.unmount(key)
    })
  }

  // ===== 添加arcgis组件 =====
  addZoomCom(pos='bottom-left'){
    let view = this.view
    view.ui.add(new Zoom({view}), pos)
  }
  addFullScreenCom(pos='top-right'){
    let view = this.view
    view.ui.add(new Fullscreen({view}), pos)
  }


}


