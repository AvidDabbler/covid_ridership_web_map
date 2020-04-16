import { loadModules } from "https://unpkg.com/esri-loader/dist/esm/esri-loader.js";
import { agol as agol } from './ignore/private.js';

// BUILD LIST OF ROUTES AND RIDERSHIPS FROM LIST OF ROUTES
const ridershipPopup = (feature) => {

  let routes =  feature.graphic.attributes.RouteList;
  let list = routes.split(', ');

  let filterList = [];
  let obj = '';
  for(let i in list){
    if(!filterList.includes(list[i])){
      filterList.push(list[i]);
    }
  }
  for(let i in filterList){
    obj += '<b>Route: ' + filterList[i] + '</b><br>' + `Total Ridership: {R_${filterList[i]}}` + '<br>' + `Average Board: {R_${filterList[i]}_BRD}` + '<br>' + `Average Alight: {R_${filterList[i]}_ALT}` + '<br><br>';
  };
  return obj
};




const main = async () => {
  // More info on esri-loader's loadModules function:
  // https://github.com/Esri/esri-loader#loading-modules-from-the-arcgis-api-for-javascript
  const [Map, MapView, FeatureLayer, PieChartMediaInfo, ChartMediaInfoValue, MediaContent] = await loadModules(
    ["esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/PopupTemplate", "esri/popup/content/PieChartMediaInfo", "esri/popup/content/support/ChartMediaInfoValue", "esri/popup/content/MediaContent"],
    { css: true }
  );
  


  // MEDIA TEMPLATE
  let pieChartValue = new ChartMediaInfoValue({
    fields: ["AVG_BRD", "AVG_ALT"],
    normalizeField: null,
  });
  
  // Create the PieChartMediaInfo media type
  let pieChart = new PieChartMediaInfo({
    title: "<b>Average Ridership Breakdown</b>",
    value: pieChartValue
  });
  
  // Create the MediaContent
  let mediaElement = new MediaContent({
    mediaInfos: [pieChart]
  });



  
  // STOPS RIDERSHIP LAYER
  const stops = new FeatureLayer({
    url: agol().ridership,
    popupTemplate: {
      title: 'Stop ID: {stop_id}',
      content: ridershipPopup,
      mediaInfos: pieChart,
    },
    outFields: ['*'],
  });

  // RIDERSHIP HEATMAP LAYER
  const heatmap = new FeatureLayer({
    url: agol().heatmap,
  });



  // Map configuration
  const map = new Map({
    basemap: "streets",
    layers: [heatmap, stops,]
  });
  const viewOptions = {
    container: "viewDiv",
    map: map,
    center: [-90.3, 38.6],
    zoom: 12
  };
  
  let view = new MapView(viewOptions);

  
};
main();


