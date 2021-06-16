//格式化时间
function formatTime(date, t) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  if(t === 'h:m') { return [hour, minute].map(formatNumber).join(':'); }
  else { return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':'); }
}

function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : '0' + n;
}

//判断是否为纯粹对象
function isPlainObject(obj){
    if(!obj || obj.toString() !== "[object Object]" || obj.nodeType || obj.setInterval){
        return false;
    }
    if(obj.constructor && !obj.hasOwnProperty("constructor") && !obj.constructor.prototype.hasOwnProperty("isPrototypeOf")){
        return false;
    }
    for(var key in obj){}
    return key === undefined || obj.hasOwnProperty(key);
}


function cloneObj(obj){
    if(!isPlainObject(obj)){ return false; }
    return JSON.parse(JSON.stringify(obj));
}

//md5&base64
var md5 = require('md5.min.js'), base64 = require('base64.min.js'),
sign = function(data) {
  var _data = cloneObj(data);
  _data['\x74\x6f\x6b\x65\x6e'] = base64.decode(getApp()['\x5f\x74']);
  return md5(JSON.stringify(_data));
},

key = function(data) {
  if(!isPlainObject(data)){ return false; }
  data.timestamp = parseInt(new Date().getTime().toString().substr(0,10));
  data.sign = sign(data);
  return {
    key: base64.encode(JSON.stringify(data))
  };
}

function getCourseOrderName(order){
  if(order === 1){
    return '上午第一节'
  }else if(order === 3){
    return '上午第二节'
  }else if(order === 5){
    return '下午第一节'
  }else if(order === 7){
    return '下午第二节'
  }else if(order === 9){
    return '晚上第一节'
  }

}

function getWeekName(week){
  if(week === 1){
    return '星期一'
  }
  else if (week === 2) {
    return '星期二'
  }
  else if (week === 3) {
    return '星期三'
  }
  else if (week === 4) {
    return '星期四'
  }
  else if (week === 5) {
    return '星期五'
  }
  else if (week === 2) {
    return '星期六'
  }
  else if (week === 7) {
    return '星期日'
  }

}

function formatDate(str) {
  return new Date(str.replace(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}).*$/, '$1Z'))
}

function dateToText(date) {
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minutes = date.getMinutes()

  return year + '年' + month + '月' + day + '日'
}

function fullDateToText(date) {

  let hour = date.getHours()
  let minutes = date.getMinutes()

  return this.dateToText(date) + hour + '时' + minutes + '分'
}

module.exports = {
  formatTime: formatTime,
  md5: md5,
  base64: base64,
  key: key,
  getCourseOrderName:getCourseOrderName,
  getWeekName: getWeekName,
  formatDate: formatDate,
  dateToText: dateToText,
  fullDateToText: fullDateToText,
}