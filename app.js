import { loadModules } from "https://unpkg.com/esri-loader/dist/esm/esri-loader.js";
import { agol as agol } from './agol.js';

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
  const [MapView, WebMap, FeatureLayer, Search] = await loadModules(
    ["esri/views/MapView", "esri/WebMap", "esri/layers/FeatureLayer", "esri/widgets/Search"],
    { css: true }
  );

  var webmap = new WebMap({
    portalItem: {
      // autocasts as new PortalItem()
      id: agol().mapid,
    }
  });
  
  
  
  // STOPS RIDERSHIP LAYER
  const stops = new FeatureLayer({
    url: agol().ridership,
    popupTemplate: {
      title: 'Stop ID: {stop_id}',
      content: ridershipPopup,
    },
    outFields: ['*'],
  });
  
  const viewOptions = {
    container: "viewDiv",
    map: webmap,
    center: [-90.3, 38.6],
    zoom: 12
  };
  webmap.add(stops);
  
  var view = new MapView({
    map: webmap,
    container: "viewDiv"
  });
  
    const search = new Search({
      view: view,
    });
  
  view.ui.add(search, "top-right");
};
main();


