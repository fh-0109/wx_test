import * as API from 'request';

const host = 'https://platform.hackerda.com/platform';
// const host = 'http://localhost:8080/platform';
const STUDENT_INFO_KEY = 'studentInfo'
/**
 * 
 * 
 */
function getStudentTimeTable(data) {

  let timetable = wx.getStorageSync('studentTimeTable');

  if (isEmptyObject(timetable)) {
    return API.GET(
      host + '/course/timetable',
      data
    ).then(
      res => {
        // wx.setStorageSync('studentTimeTable', res.data)
        return res.data
      }
    )
  } else {
    return Promise.resolve(timetable)
  }
}

function getStudentTimeTableV2(data) {
  return API.GET(
    host + '/course/timetableV2',
    data
  ).then(
    res => {
      // wx.setStorageSync('studentTimeTable', res.data)
      return res.data
    }
  )
}

function getTimeTableByStudent(data) {
  return API.GET(
    host + '/timetable/student',
    data
  ).then(
    res => {
      return res.data
    }
  )
}

function getTimeTableByTeacher(data) {
  return API.GET(
    host + '/timetable/teacher',
    data
  ).then(
    res => {
      return res.data
    }
  )
}

function getTimeTableByClassroom(data) {
  return API.GET(
    host + '/timetable/classroom',
    data
  ).then(
    res => {
      return res.data
    }
  )
}

function getTimeTableByCourse(data) {
  return API.GET(
    host + '/timetable/course',
    data
  ).then(
    res => {
      return res.data
    }
  )
}

function getTimeTableByClass(data) {
  return API.GET(
    host + '/timetable/class',
    data
  ).then(
    res => {
      return res.data
    }
  )
}

function searchCourseTimetable(data) {
  return API.GET(
    host + '/timetable/search',
    data
  ).then(
    res => {
      return res.data
    }
  )
}

function getExamTimetable(data) {
  return API.GET(
    host + '/timetable/exam',
    data
  ).then(
    res => {
      return res.data
    }
  )
}

function login(params) {

  return API.POST(
      host + '/bind/wechat',
      params,
    )
    .then(res => {
      wx.setStorageSync(STUDENT_INFO_KEY, res.data)
      return res.data
    })


}

function getgrade(params) {
  return API.POST(
      host + '/nowGrade',
      params,
    )
    .then(res => {
      return res.data
    })

}

function getgradeV2(params) {
  return API.POST(
      host + '/nowGradeV2',
      params,
    )
    .then(res => {
      return res.data
    })

}

function getAllGrade(params) {
  return API.POST(
    host + '/grade',
    params,
  )
    .then(res => {
      return res.data
    })

}


function getEmptyRoom(params) {
  return API.POST(
      host + '/emptyRoomV2',
      params,
    )
    .then(res => {
      return res.data
    })

}

function search(params) {
  return API.GET(
      host + '/course/timetable/search',
      params,
    )
    .then(res => {
      return res.data
    })
}

function subscribe(params) {
  return API.GET(
      host + '/mini/subscribe',
      params,
    )
    .then(res => {
      return res.data
    })
}

/**
 * 获取小程序用户得openid
 * 
 */
function auth(params) {
  return API.GET(
      host + '/mini/auth',
      params,
    )
    .then(res => {
      return res.data
    })
}

/**
 * 获取小程序用户得openid
 * 
 */
function gradeDetail(params) {
  return API.POST(
    host + '/grade/detail',
    params,
  )
    .then(res => {
      return res.data
    })
}


function isEmptyObject(e) {
  var t;
  for (t in e)
    return !1;
  return !0
}

function formatTime(date, t) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  if (t === 'h:m') {
    return [hour, minute].map(formatNumber).join(':');
  } else {
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
  }
}

module.exports = {
  getStudentTimeTable,
  getStudentTimeTableV2,
  getTimeTableByStudent,
  getTimeTableByTeacher,
  getTimeTableByClassroom,
  getTimeTableByCourse,
  getTimeTableByClass,
  login,
  isEmptyObject,
  getgrade,
  formatTime,
  getEmptyRoom,
  search,
  searchCourseTimetable,
  getExamTimetable,
  getgradeV2,
  auth,
  subscribe,
  gradeDetail,
  getAllGrade,
}