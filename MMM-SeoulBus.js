Module.register("MMM-SeoulBus", {
	requiresVersion: "2.12.0",
	default: {
	  sample1: "http://ws.bus.go.kr/api/rest/stationinfo/getStationByName", // 정류소 명칭 검색
	  sample2: "http://ws.bus.go.kr/api/rest/arrive/getLowArrInfoByStId", // 버스 도착 예정 정보 조회
	  key1: "",
	  key2: "",
	  stSrch: "", // 정류소명
		stId: "", // 정류소 ID
	  header: "버스 도착 정보",
	  updateInterval: 60000,
	},

	getStyles: function () {
	  return ["MMM-SeoulBus.css"];
	},

	getHeader: function () {
	  if (this.busInfo) {
		return "<i class='fa fa-fw fa-bus'></i> " + this.config.header;
	  }
	  return "<i class='fa fa-fw fa-bus'></i> 버스 정보";
	},

	start: function () {
	  Log.info("Starting module: " + this.name);
	  this.busInfo = [];
	  var self = this;
	  this.loaded = false;
	},

	getDom: function () {
	  var wrapper = document.createElement("div");
	  if (!this.loaded) {
		return wrapper;
	  }
	  var busTable = document.createElement("table");
	  busTable.className = "small";
	  var bus = this.busInfo;

		var RowArr = new Array();
    var rtNmArr = new Array();
    var arrmsg1Arr = new Array();
    var arrmsg2Arr = new Array();
		var reride_Num1Arr = new Array();
		var reride_Num2Arr = new Array();

		for(var i=0; i<bus.length; i++) {
			if(!bus[i].arrmsg1._text.includes("운행종료") && !bus[i].arrmsg1._text.includes("출발대기")
			&& !bus[i].arrmsg1._text.includes("회차대기")) {
				RowArr[i] = 'row' + i;
				rtNmArr[i] = 'rtNm' + i;
				arrmsg1Arr[i] = 'arrmsg1' + i;

				RowArr[i] = document.createElement("tr");
				RowArr[i].className = "title bright";
        busTable.appendChild(RowArr[i]);

				rtNmArr[i] = document.createElement("td");
				rtNmArr[i].innerHTML = bus[i].rtNm._text;
        RowArr[i].appendChild(rtNmArr[i]);

				arrmsg1Arr[i] = document.createElement("td");
				arrmsg1Arr[i].innerHTML = bus[i].arrmsg1._text;
        RowArr[i].appendChild(arrmsg1Arr[i]);

				if(bus[i].arrmsg1._text == "곧 도착") {
				  arrmsg1Arr[i].innerHTML = bus[i].arrmsg1._text;
				  RowArr[i].appendChild(arrmsg1Arr[i]);
				}
			}
		}

	  wrapper.appendChild(busTable);
	  return wrapper;
	},

	getBusInfo: function () {
	  Log.info("Requesting bus info");
	  this.sendSocketNotification("GET_BUS_DATA", {
		config: this.config,
		identifier: this.identifier,
	  });
	},

	notificationReceived: function (notification, payload, sender) {
	  switch (notification) {
		case "DOM_OBJECTS_CREATED":
		  this.getBusInfo();
		  var timer = setInterval(() => {
			this.getBusInfo();
		  }, this.config.updateInterval);
		  break;
	  }
	},

	socketNotificationReceived: function (notification, payload) {
	  switch (notification) {
		case "BUS_DATA":
		  this.loaded = true;
		  console.log("NotificationReceived:" + notification);
		  this.busInfo = payload;
		  this.updateDom();
		  break;
		case "BUS_DATA_ERROR":
		  this.updateDom();
		  break;
	  }
	},
  });
