function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}
	var hour = parseInt(time / 3600)
	time = time % 3600
	var minute = parseInt(time / 60)
	time = time % 60
	var second = time

	return ([hour, minute, second]).map(function(n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}
function formatDate(now) {
	const year = now.getFullYear();
	const month = now.getMonth() + 1;
	const date = now.getDate();
	return year + '-' + month + '-' + date;
}
function getDate(type) {
	const date = new Date();

	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let day = date.getDate();

	if (type === 'start') {
		year = year - 60;
	} else if (type === 'end') {
		year = year + 2;
	}
	month = month > 9 ? month : '0' + month;;
	day = day > 9 ? day : '0' + day;

	return `${year}-${month}-${day}`;
}

function fun_date(aa) {
	var date1 = new Date();
	var	time1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate();
	var date2 = new Date(date1);
	date2.setDate(date1.getDate() + aa);
	var time2 = date2.getFullYear() + "-" + ((date2.getMonth() + 1) <= 9 ? ('0' + (date2.getMonth() + 1)) : (date2.getMonth() + 1)) + "-" + (date2.getDate() <= 9 ? ('0' + date2.getDate()):date2.getDate());
	return time2;
}
function getNowTime() {
	var date1 = new Date();
	var	time1 = date1.getHours() + ":" + date1.getMinutes();
	var date2 = new Date(date1);
	date2.setDate(date1.getDate());
	var time2 = (date2.getHours() <= 9 ? ('0' + date2.getHours()) : date2.getHours()) + ":" + (date2.getMinutes() <= 9 ? ('0' + date2.getMinutes()) : date2.getMinutes());
	return time2;
}

function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}
var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function(milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function(dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function(number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDate()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};

module.exports = {
	formatTime: formatTime,
	formatDate:formatDate,
	getDate: getDate,
	getNowTime: getNowTime,
	fun_date: fun_date,
	formatLocation: formatLocation,
	dateUtils: dateUtils
}
