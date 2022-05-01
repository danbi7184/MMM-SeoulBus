Module.register("MMM-SeoulBus", {
	requiresVersion: "2.12.0",
	default: {
	  sample1: "http://ws.bus.go.kr/api/rest/stationinfo/getStationByName", // 정류소 명칭 검색
	  sample2: "http://ws.bus.go.kr/api/rest/arrive/getLowArrInfoByStId", // 버스 도착 예정 정보 조회
	  key1: "",
	  key2: "",
	  stSrch: "", // 정류소명
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
	  return "<i class='fa fa-fw fa-bus'></i> 지하철 정보";
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
  