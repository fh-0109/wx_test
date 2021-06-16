let interstitialAd = null

Page({

  onLoad: function () {
// 在页面中定义插屏广告

    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-7a9628fb30f52fcf'
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {})
      interstitialAd.onClose(() => {})
    }


  },


  onShow: function () {
    // 在适合的场景显示插屏广告
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }
  },

  data: {
    list: [
    { "phones": ["88036021", "88036870", "88036070", "88036456", "88036898", "88036766", "88036096", "88036645", "88036656", "88036026", "88036027", "88036977", "88036022", "88036025"], "open": false, "id": 1, "name": "学校办公室", "subName": ["主任室", "副主任室（行政）", "党委秘书室", "副主任室（接待）", "行政秘书室", "副主任室（党群）", "文书室", "机要与保密室", "车队队长室", "档案馆", "车队办公室", "接待室", "印信与统计室", "传真"] },
    { "phones": ["88036012", "88036072", "88036071"], "open": false, "id": 17, "name": "组织部", "subName": ["部长室", "组织员办", "办公室"] },
    { "phones": ["88036013", "88036377", "88036073", "88036080", "88036081"], "open": false, "id": 21, "name": "宣传部（统战部）", "subName": ["部长室", "副部长室", "办公室", "校报编辑部", "电视站"] },
    { "phones": ["88036015", "88036015", "88036776", "88036075", "88036453"], "open": false, "id": 27, "name": "纪检委监察处", "subName": ["纪委副书记室", "监察处处长室", "副处长室", "办公室", "信访室"] },
    { "phones": ["88036020", "88036139", "0467-2385019", "0467-2385020"], "open": false, "id": 33, "name": "机关党委（离退办）", "subName": ["书记室", "办公室（哈）", "办公室（鸡）", "活动室（鸡）"] },
    { "phones": ["88036017", "88036077", "88036849"], "open": false, "id": 38, "name": "工会", "subName": ["副主席室", "办公室", "教工活动室"] },
    { "phones": ["88036016", "88036506", "88036076", "88036046", "88036508", "88036853"], "open": false, "id": 42, "name": "团委", "subName": ["书记室", "副书记室", "办公室", "大学生俱乐部", "校学生会", "爱心捐物热线"] },
    { "phones": ["88036713", "88036846", "88036019", "88036846"], "open": false, "id": 49, "name": "发展规划与社会服务处", "subName": ["处长室", "副处长室", "办公室", "校友办公室"] },
    { "phones": ["88036033", "88036093", "88036430", "88036057", "88036065", "88036062", "88036062", "88036059", "88036053", "88036063", "88036501", "88036061", "88036083", "88036085", "88036715", "88036462"], "open": false, "id": 54, "name": "教务处", "subName": ["处长室", "副处长室", "副处长室", "教务科", "考试科", "学籍科", "教育技术科", "实践教学科", "教学建设科", "综合与质量监督科", "教材库", "督导专家办公室", "主楼东楼教师休息室", "主楼西楼教师休息室", "科技大厦二楼休息室", "科技大厦四楼休息室"] },
    { "phones": ["88036650", "88036649", "88036452", "88036548"], "open": false, "id": 71, "name": "评估中心（高等教育研究中心）", "subName": ["主任室", "副主任室", "办公室", "评估专家室"] },
    { "phones": ["88036036", "88036050", "88036587", "88036038"], "open": false, "id": 76, "name": "学生处", "subName": ["处长室", "副处长室", "副处长室", "教育科"] },
    {
      "phones": ["88036037", "88036810", "88036041", "88036845", "88036589", "88036640", "88036040", "88036775", "88036783"],
      "open": false,
      "id": 83,
      "name": "学生处（学工部、武装部)", "subName": ["管理科1", "管理科2", "大学生心理健康中心", "德育研究与实践中心", "国防教育科", "大学生服务中心1", "大学生服务中心2", "大学生服务中心3", "大学生服务中心4"]
    },
    { "phones": ["88036588", "88036788", "88036988、88033311"], "open": false, "id": 91, "name": "招就处", "subName": ["处长室", "副处长室", "办公室"] },
    { "phones": ["88036055", "88036773", "88036760", "88036056", "88036771"], "open": false, "id": 96, "name": "科技处（学科办 园区办）", "subName": ["处长室", "副处长室（学科）", "副处长室", "综合办公室", "项目管理办公室"] },
    { "phones": ["88036032", "88036078"], "open": false, "id": 102, "name": "学报", "subName": ["学报主任室", "学报编辑部"] },
    { "phones": ["88036028", "88036097", "88036082", "88036657", "88036429", "88036736"], "open": false, "id": 105, "name": "人事处", "subName": ["处长室", "副处长室", "人力资源科", "劳资科", "师资科", "人事档案室"] },
    { "phones": ["88036029", "88036796", "88036831", "88036091", "88036552", "88036553", "88036658", "88036559", "88036030", "88036318"], "open": false, "id": 112, "name": "财务处", "subName": ["总会计师室", "处长室", "副处长室", "综合办公室", "财务管理科", "会计核算科（1）", "会计核算科（2）", "收费中心", "核算科出纳", "饮食财务科"] }, { "phones": ["88036828", "88036827", "88036778", "88036826"], "open": false, "id": 123, "name": "审计处", "subName": ["处长室", "副处长室", "综合办公室", "调研员室"] }, { "phones": ["88036023", "88036067", "88036066"], "open": false, "id": 128, "name": "国际合作处", "subName": ["处长室", "副处长室", "办公室"] },
    { "phones": ["88036668", "88036661", "88036031"], "open": false, "id": 132, "name": "资产处", "subName": ["处长室", "副处长室", "办公室"] },
	{"name": "矿业工程学院", "phones": ["88036101", "88036102", "88036142", "88036109", "88036106", "88036832", "88036105", "88036833", "88036109", "88036107", "88036108", "88036818", "88036423", "88036806", "88036805", "88036803", "88036807", "88036923", "88036539", "88036832", "88036116", "88036117", "88036652", "88036850", "88036145", "88036146", "88036560", "88036557", "88036389", "88036752", "88036390", "88036388"], "open": false, "id": 2, "subName": ["书记室", "院长室", "副书记室", "副院长（科研）", "副院长（教学）", "调研员", "综合办公室", "综合办公室（教学）", "综合办公室（科研）", "学生工作办公室", "学生工作办公室（团委）", "洁净煤中心主任室", "洁煤中心办公室", "深部开采重点实验室主任室", "物理参数实验室", "岩石三轴压力实验室", "瓦斯含量测定实验室", "城规教研室", "城乡规划管理实验室", "采矿工程研究所", "采矿工程教研室", "矿物加工教研室", "地质教研室", "测量教研室", "地质实验室", "测量实验室", "矿压实验室", "矿物加工实验室", "采矿重点学科实验室", "采矿重点实验室办公室", "矿加重点学科实验室", "矿加重点学科"]},
	{"open": false, "phones": ["88036835", "88036836", "88036837", "88036838", "88036840", "88036840", "88036839", "88036808", "88036112", "88036113", "88036115", "88036757", "88036422", "88036143"], "id": 3, "name": "环境与化工学", "subName": ["书记室", "院长室", "副院长（教学）", "副院长（科研）", "综合办公室", "综合办公室（科研）", "综合办公室（教学）", "学生工作办公室", "应化教研室", "化工教研室", "环境教研室", "现代分析测试研究中心主任室", "现代分析测试研究中心接待室", "化学实验室"]},
  { "phones": ["88036121", "88036122", "88036123", "88036409", "88036467", "88036125", "88036125", "88036129", "88036128", "88036459", "88036496", "88036245", "88036245", "88036246", "88036246", "88036152", "88036243", "88036798", "88036342", "88036148", "88036431"], "open": false, "subName": ["书记室", "院长室", "副书记室", "副院长室", "调研员室", "综合办公室", "综合办公室（教学）", "综合办公室（科研）", "学生工作办公室（团委）", "学生工作办公室1", "学生工作办公室2", "工业自动化教研室", "工业控制教研室", "电力系统教研室", "电力电子教研室", "测控教研室", "基础部", "实验中心", "智能检测与控制研究所", "电力自动化研究所", "测试与控制研究所"], "id": 4, "name": "电气与控制工程学院" },
  { "phones": ["88036821", "88036822", "88036780", "88036781", "88036823", "88036825", "88036127"], "open": false, "name": "电子与信息工程学院", "subName": ["书记室", "院长室", "副院长室（科研）", "副院长室（教学）", "综合办公室", "综合办公室（教学）", "学生工作办公室"], "id": 5 },
  { "id": 6, "open": false, "subName": ["书记室", "院长室", "副书记室", "副院长室（科研）", "副院长室（教学）", "综合办公室", "综合办公室（教学）", "学生工作办公室", "学生工作办公室（团委）", "机械设计教研室", "机械工程教研室", "机械电子教研室", "机械基础部", "工业工程教研室", "工业设计教研室", "机床实验室", "机械制图仪器室", "机械基础实验室", "工业工程实验室", "机械CAD工作站", "模具实验室"], "name": "机械工程学院", "phones": ["88036131", "88036132", "88036133", "88036266", "88036267", "88036135", "88036136", "88036137", "88036138", "88036252", "88036253", "88036258", "88036257", "88036256", "88036953", "88036943", "88036263", "88036945", "88036685", "88036503", "88036261"] },
  { "id": 7, "name": "材料科学与工程学院", "subName": ["书记室", "院长室", "副院长室", "综合办公室", "综合办公室（科研）", "综合办公室（教学）", "学生工作办公室", "材料系、材料加工系", "金属材料教研室", "材料成型教研室", "无机非金属材料教研室", "金相实验室", "热处理实验室", "扫描电镜室", "材料性能实验室", "无机非金属实验室", "焊接实验室"], "phones": ["88036216", "88036218", "88036521", "88036219", "88036525", "88036229", "88036531", "88036523", "88036159", "88036495", "88036690", "88036490", "88036491", "88036255", "88036691", "88036692", "88036695"], "open": false },
  { "open": false, "subName": ["书记室", "院长室", "副书记室", "副院长室（教学）", "副院长室（科研）", "综合办公室（办公室、科研）", "综合办公室（教学）", "学生工作办公室", "学生工作办公室（就业）", "学生工作办公室（团委）", "建筑工程教研室", "交通土建工程教研室", "工程管理教研室", "建筑学教研室", "风景园林教研室", "城乡规划教研室", "土木工程结构实验室", "土木工程材料实验室", "土力学实验室", "建筑学实验室Ⅰ", "建筑学实验室Ⅱ", "计算机综合实验室", "建筑设计研究所", "土地规划研究所", "城乡规划设计研究所"], "name": "建筑工程学院", "id": 8, "phones": ["88036166", "88036166", "88036163", "88036432", "88036432", "88036165", "88036280", "88036787", "88036167", "88036168", "88036920", "88036670", "88036921", "88036931", "88036785", "88036160", "88036925", "88036930", "88036277", "88036931", "88036932", "88036935", "88036413", "88036276", "88036761"] },
      { "subName": ["书记室", "院长室", "副书记室", "副院长室", "综合办公室", "综合办公室（教学）", "综合办公室（科研）", "学生工作办公室", "学生工作办公室（团委）", "计算机应用研究所", "计算与控制研究所", "软件工程主任室", "软件工程教研室", "计算机科学与技术教研室", "网络工程教研室", "信息与计算科学主任室", "信息与计算科学教研室", "物联网工程教研室", "基础学科部主任室", "基础学科部", "主楼实验室"], "phones": ["88036181", "88036182", "88036183", "88036189", "88036185", "88036186", "88036180", "88036947", "88036187", "88036517", "88036566", "88036290", "88036401", "88036398", "88036207", "88036402", "88036197", "88036919", "88036759", "88036405", "88036291"], "id": 9, "name": "计算机与信息工程学院（软件学院）", "open": false },
      { "open": false, "id": 10, "subName": ["书记室", "院长室", "副书记室", "副院长室（科研）", "副院长室（教学）", "副院长室（MBA）", "调研员室", "企业管理系", "会计系", "管理科学与工程系", "财务管理系", "公共管理系", "市场营销系", "管理学院实训基地", "综合办公室", "综合办公室（教学）", "综合办公室（科研）", "学生工作办公室", "学生工作办公室（团委）", "学生工作办公室（就业）", "MBA教育中心", "资料室", "省高校人文社会科学重点研究基地", "黑龙江省煤炭经济管理学会"], "phones": ["88036151", "88036617", "88036395", "88036396", "88036393", "88036791", "88036437", "88036270", "88036273", "88036271", "88036275", "88036249", "88036679", "88036542", "88036155", "88036156", "88036269", "88036438", "88036497", "88036457", "88036436", "88036397", "88036701", "88036707"], "name": "管理学院" },
      { "phones": ["88036811", "88036812", "88036813", "88036817", "88036819", "88036820", "88036815", "88036816", "88036157", "88036272", "88036709", "88036250"], "subName": ["书记室", "院长室", "副书记室", "副院长室（教学）", "副院长室（科研）", "龙江学者办公室", "综合办公室", "综合办公室（教学）", "学生工作办公室", "经济系", "金融系", "国际贸易系"], "open": false, "name": "经济学院", "id": 11 },
      { "subName": ["书记室", "院长室", "副院长室", "综合办公室", "学生工作办公室", "微机室", "社会工作实践基地", "思想政治教育系", "社会工作系", "社会学教研室", "中文系", "应用心理学教研室"], "id": 12, "name": "人文社会科学学院", "open": false, "phones": ["88036175", "88036172", "88036175", "88036176", "88036178", "88036288", "88036535", "88036580", "88036578", "88036748", "88036469", "88036581"] },
      { "name": "马克思主义学院", "phones": ["88036756", "88036171", "88036770", "88036829", "88036729", "88036586", "88036287", "88036583", "88036615", "88036615", "88036582", "88036585"], "subName": ["书记室", "院长室", "副院长室", "调研员室", "综合办公室", "综合办公室（教学）", "资料室", "思修与法律基础教研室", "毛泽东思想与中国特色社会主义理论概论教研室", "形势与政策教研室", "马克思主义基本原理教研室", "近代史纲要教研室"], "id": 13, "open": false },
      { "subName": ["书记室", "院长室", "常务副院长室", "副院长室", "综合办公室", "学生工作办公室", "英语教研室", "俄语教研室"], "phones": ["88036212", "88036211", "88036842", "88036213", "88036215", "88036419", "88036843", "88036841"], "id": 13, "name": "国际教育学院", "open": false },
      { "id": 14, "subName": ["书记室", "院长室", "副院长室", "综合办公室", "综合办公室（教学）", "综合办公室（科研）", "学生工作办公室", "光波技术研究所", "物理演示实验室", "数学实验室", "工程力学实验室", "应用物理学专业实验室", "物理系", "数学系", "力学系1", "力学系2", "基础数学部1", "基础数学部2"], "name": "理学院学院", "phones": ["88036201", "88036202", "88036203", "88036205", "88036206", "88036206", "88036208", "88036451", "88036301", "88036303", "88036680", "88036906", "88036306", "88036307", "88036308", "88036546", "88036590", "88036591"], "open": false },
      { "phones": ["88036878", "88036045", "88036728", "88036726", "88036048", "88036418", "88036786", "88036786", "88036726", "88036353"], "subName": ["书记室", "院长室", "副院长室", "综合办公室", "学生工作办公室", "招生办公室", "培养办公室", "学位学籍办公室", "博士项目办公室", "保密室"], "name": "研究生学院", "id": 15, "open": false },
      { "phones": ["88036371", "88036372", "88036373", "88036374", "88036375", "88036376", "88036378", "88036379", "88036380", "88036381", "88036382", "88036383", "88036384", "88036385", "88036614", "88036386", "88036474", "88036484"], "name": "学生公寓门卫", "subName": ["第一公寓", "第二公寓", "第三公寓", "第四公寓", "第五公寓", "第六公寓", "第八公寓", "第九公寓", "第十公寓", "第十一公寓", "第十二公寓", "第十三公寓", "第十四公寓", "第十五公寓（男）", "第十五公寓（女）", "第十六公寓", "第十七公寓", "第十八公寓"], "id": 16, "open": false }

	]
  },
  widgetsToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open;
      } else {
        list[i].open = false;
      }
    }
    this.setData({
      list: list
    });
  },

  callPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.phone
    })
  },

  onShareAppMessage: function () {
    return {
      title: '科大电话本',
      desc: '全学校最方便得电话本',
      path: '/pages/core/yellow_page/yellow_page'
    };
  },
});
