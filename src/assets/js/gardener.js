var Gardener = function() {};

Gardener.adminBackBaseURL = 'http://localhost:38080/';
Gardener.viewBackBaseURL = 'http://localhost:38080/';

Gardener.getParams = function(){
  var url = window.location.href;
  var obj = {};
  var reg = /[?&][^?&]+=[^?&]+/g;
  var arr = url.match(reg);
  if (arr === null) return obj;
  arr.forEach(function (item) {
    var tempArr = item.substring(1).split('=');
    var key = decodeURIComponent(tempArr[0]);
    var val = decodeURIComponent(tempArr[1]);
    obj[key] = val;
  });
  return obj;
}

Gardener.getParamStr = function(paramVal, defaultVal){
  if(paramVal === undefined || paramVal === ''){
    return defaultVal
  }
  return paramVal
}

Gardener.getParamInt = function(paramVal, defaultVal){
  if(paramVal === undefined || paramVal === ''){
    return defaultVal
  }
  return parseInt(paramVal)
}

Gardener.tagType = new Map([
  [0, ''],
  [1, '主话题'],
  [2, '非主话题']
]);

Gardener.tagRelateType = new Map([
  [0, ''],
  [1, '父标签'],
  [2, '子标签']
]);

export default Gardener;