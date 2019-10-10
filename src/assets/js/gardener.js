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

Gardener.relationTableRowClassName = function({row, rowIndex}) {
  row.index = rowIndex;
  if (row.addType === 1) {
    return 'success-row';
  }
  return '';
};

//----------------------------------- 码表相关 ------------------------------------------------

Gardener.tagType = new Map([
  [0, ''],
  [1, '文章精华'],
  [2, '文章'],
  [3, '碎片']
]);

Gardener.tagRelateType = new Map([
  [0, ''],
  [1, '父标签'],
  [2, '子标签']
]);

Gardener.articleStatus = new Map([
  [0, ''],
  [1, '已发布'],
  [2, '未发布']
]);

Gardener.solutionType = new Map([
  [0, ''],
  [1, '重要答案'],
  [2, '可能答案']
]);

Gardener.userInfoStatus = new Map([
  [0, ''],
  [1, '有效'],
  [2, '无效']
]);

Gardener.userRoleStatus = new Map([
  [0, ''],
  [1, '有效'],
  [2, '无效']
]);

Gardener.userPrivilegeStatus = new Map([
  [0, ''],
  [1, '有效'],
  [2, '无效']
]);

export default Gardener;