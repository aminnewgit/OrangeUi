// 地图底图获取
import TileLayer from "@arcgis/core/layers/TileLayer";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Basemap from "@arcgis/core/Basemap";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import TileInfo from "@arcgis/core/layers/support/TileInfo";
import WebTileLayer from "@arcgis/core/layers/WebTileLayer";
import {tokenManager} from "@/lib/map/arcgisTokenManager";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer.js";

const format = { places: 0,  digitSeparator: true}
const color = "#ff0000";
const haloColor = "#373837";

export const arcgisGetMap = {
  async slytArcgis() {
    // WebTileLayer  Tile(磁贴） 地图的瓦片图层
    // const webTileLayer = new TileLayer({
    //   url: "https://gis.slof.com/server/rest/services/Hosted/tianditu_cia_4490_202005/MapServer"
    // });

    const vec = new TileLayer({
      url: "https://gis.slof.com/server/rest/services/Hosted/tianditu_vec_4498_202009/MapServer"
    });

    // 管线矢量图层
    let pipeServer = "https://gis.slof.com/server/rest/services/Hosted/data_pipeline/FeatureServer"
    await tokenManager.regServer(pipeServer)
    let pipeLayer = new FeatureLayer(pipeServer, {
      popupTemplate: {
        title: "{NAME}",
        content: [
          { type: "fields",
            fieldInfos: [
              { fieldName: "NAME",  label: "管线名称", format,  },
              { fieldName: "SHAPE__Length ",  label: "管线长度", format,  },
            ]
          }
        ]
      },
      labelingInfo: [
        {
          // fieldInfos:{},
          symbol: {
            type: "text",
            // haloColor,
            // haloSize: "1px",
            color,
            font: {
              family: 'Arial Unicode MS',
              size: "11px"
            },
            // xoffset: "-15px",
            // yoffset: "-15px"
          },
          // labelPosition:'parallel',
          // labelPlacement: "center-right",
          labelExpressionInfo: {
            expression: "$feature.name"
            // value:"{NAME}"
          },
          // where: `capacity_mw > ${clusterLabelThreshold}`
          // maxScale:10000,
          // minScale:288571,
        },
      ]
    })
    pipeLayer.definitionExpression = "symbol_code = '141A'"


    // 海上平台图层
    let offshorePlatformServer = 'https://gis.slof.com/server/rest/services/Hosted/data_offshore_platform/FeatureServer'
    await tokenManager.regServer(offshorePlatformServer)
    let offshorePlatform = new FeatureLayer(offshorePlatformServer, {
      popupTemplate: {
        title: "平台：{NAME}",
        content(event){
          let {x,y} = event.graphic.geometry
          return `<div>坐标</div><div>x: ${x}</div><div>y: ${y}</div>`
        }
      },
      labelingInfo: [
        {
          // fieldInfos:{},
          symbol: {
            type: "text",
            // haloColor,
            // haloSize: "1px",
            color,
            font: {
              family: 'Arial Unicode MS',
              size: "11px"
            },
            // xoffset: "-15px",
            // yoffset: "-15px"
          },
          // labelPosition:'parallel',
          labelPlacement: "center-right",
          labelExpressionInfo: {
            expression: "$feature.name"
            // value:"{NAME}"
          },
          // where: `capacity_mw > ${clusterLabelThreshold}`
          // maxScale:10000,
          minScale:288571,
        },
      ]
    })

    // 站点图层
    let stationServer = "https://gis.slof.com/server/rest/services/Hosted/data_station/FeatureServer"
    await tokenManager.regServer(stationServer)
    let stationLayer = new FeatureLayer(stationServer, {
      labelingInfo: [
        {
          // fieldInfos:{},
          symbol: {
            type: "text",
            // haloColor,
            // haloSize: "1px",
            color,
            font: {
              family: 'Arial Unicode MS',
              size: "11px"
            },
            // xoffset: "-15px",
            // yoffset: "-15px"
          },
          // labelPosition:'parallel',
          labelPlacement: "center-right",
          labelExpressionInfo: {
            expression: "$feature.name"
            // value:"{NAME}"
          },
          // where: `capacity_mw > ${clusterLabelThreshold}`
          // maxScale:10000,
          minScale:288571,
        },
      ]
    })

    return new Basemap({
      baseLayers: [vec, pipeLayer, offshorePlatform, stationLayer],
    });


  },
  async tdu() {
    // 空间参考系
    const spatialReference = SpatialReference.WGS84;

    const tileInfo = new TileInfo({
      dpi: 90.71428571427429,
      lods: [
        {level: 0, levelValue: "1", scale: 295828763.79585470937713011037, resolution: 0.703125,},
        {
          level: 1,
          levelValue: "2",
          scale: 147914381.89792735468856505518,
          resolution: 0.3515625,
        },
        {
          level: 2,
          levelValue: "3",
          scale: 73957190.948963677344282527592,
          resolution: 0.17578125,
        },
        {
          level: 3,
          levelValue: "4",
          scale: 36978595.474481838672141263796,
          resolution: 0.087890625,
        },
        {
          level: 4,
          levelValue: "5",
          scale: 18489297.737240919336070631898,
          resolution: 0.0439453125,
        },
        {
          level: 5,
          levelValue: "6",
          scale: 9244648.868620459668035315949,
          resolution: 0.02197265625,
        },
        {
          level: 6,
          levelValue: "7",
          scale: 4622324.4343102298340176579745,
          resolution: 0.010986328125,
        },
        {
          level: 7,
          levelValue: "8",
          scale: 2311162.2171551149170088289872,
          resolution: 0.0054931640625,
        },
        {
          level: 8,
          levelValue: "9",
          scale: 1155581.1085775574585044144937,
          resolution: 0.00274658203125,
        },
        {
          level: 9,
          levelValue: "10",
          scale: 577790.55428877872925220724681,
          resolution: 0.001373291015625,
        },
        {
          level: 10,
          levelValue: "11",
          scale: 288895.2771443893646261036234,
          resolution: 0.0006866455078125,
        },
        {
          level: 11,
          levelValue: "12",
          scale: 144447.63857219468231305181171,
          resolution: 0.00034332275390625,
        },
        {
          level: 12,
          levelValue: "13",
          scale: 72223.819286097341156525905853,
          resolution: 0.000171661376953125,
        },
        {
          level: 13,
          levelValue: "14",
          scale: 36111.909643048670578262952926,
          resolution: 0.0000858306884765625,
        },
        {
          level: 14,
          levelValue: "15",
          scale: 18055.954821524335289131476463,
          resolution: 0.00004291534423828125,
        },
        {
          level: 15,
          levelValue: "16",
          scale: 9027.977410762167644565738231,
          resolution: 0.000021457672119140625,
        },
        {
          level: 16,
          levelValue: "17",
          scale: 4513.9887053810838222828691158,
          resolution: 0.0000107288360595703125,
        },
        {
          level: 17,
          levelValue: "18",
          scale: 2256.9943526905419111414345579,
          resolution: 0.00000536441802978515625,
        },
        {
          level: 18,
          levelValue: "19",
          scale: 1128.4971763452709555707172788,
          resolution: 0.000002682209014892578125,
        },
      ],
      size: [256, 256],
      origin: {
        x: -180,
        y: 90,
      },
      spatialReference,
    });

    // WebTileLayer  Tile(磁贴） 地图的瓦片图层
    const webTileLayer = new WebTileLayer({
      urlTemplate:
        "http://{subDomain}.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=5568788c97d87cf2f52f01eb0500a19d",
      subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
      tileInfo,
      spatialReference,
      // maxScale: 18000,
    });

    const cvaTileLayer = new WebTileLayer({
      urlTemplate:
        "http://{subDomain}.tianditu.gov.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=5568788c97d87cf2f52f01eb0500a19d",
      subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
      tileInfo,
      spatialReference,
      // maxScale: 18000,
    });


    // const pipeLayer = new FeatureLayer({
    //   url: 'http://192.168.1.99:6080/arcgis/rest/services/管线2/MapServer/0',
    //   mode: FeatureLayer.MODE_SNAPSHOT,     // 一次性加载
    //   popupTemplate: {
    //     title: "{NAME}",
    //     content: [
    //       { type: "fields",
    //         fieldInfos: [
    //           { fieldName: "NAME",  label: "管线名称", format,  },
    //           { fieldName: "SHAPE__Length ",  label: "管线长度", format,  },
    //         ]
    //       }
    //     ]
    //   },
    //   labelingInfo: [
    //     {
    //       // fieldInfos:{},
    //       symbol: {
    //         type: "text",
    //         // haloColor,
    //         // haloSize: "1px",
    //         verticalAlignment: 'bottom',
    //         horizontalAlignment: 'left',
    //         rightToLeft: false,
    //         color:'#000000',
    //         font: {
    //           family: 'Arial Unicode MS',
    //           size: "11px"
    //         },
    //         // xoffset: "-15px",
    //         // yoffset: "-15px"
    //       },
    //       // labelPosition:'parallel',
    //       labelPlacement: "above-along",
    //       labelExpressionInfo: {
    //         expression: "$feature.name"
    //         // value:"{NAME}"
    //       },
    //       // where: `capacity_mw > ${clusterLabelThreshold}`
    //     },
    //   ],
    //   renderer: {
    //     type: "simple",  // autocasts as new SimpleRenderer()
    //     symbol: {
    //       type: "simple-line",  // autocasts as new SimpleMarkerSymbol()
    //       color: "#d88383",
    //       width: 2,
    //     }
    //   }
    // })

    return new Basemap({
      baseLayers: [webTileLayer, cvaTileLayer],
    });
  },
}