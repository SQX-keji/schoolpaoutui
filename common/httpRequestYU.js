/**
 * 常用方法封装
 * @author 言棠 
 **/
// import { pathToBase64, base64ToPath } from '@/common/image-tools.js'
const yu = {
	//接口地址
	interface: function() {
		return "https://paotui.xianmxkj.com/sqx_fast" //开发
		// return "http://192.168.1.17:8891/sqx_fast" //开发
	},
	toast: function(text, success, duration, callback) {
		uni.showToast({
			title: text || "出错啦~",
			icon: success ? 'success' : 'none',
			duration: duration || 2000,
			success(res) {
				callback && callback(res)
			}
		})
	},
	modal: function(title, content, showCancel, callback, confirmColor, confirmText) {
		uni.showModal({
			title: title || '提示',
			content: content,
			showCancel: showCancel,
			cancelColor: "#555",
			confirmColor: confirmColor || "#5677fc",
			confirmText: confirmText || "确定",
			success(res) {
				if (res.confirm) {
					callback && callback(true)
				} else {
					callback && callback(false)
				}
			}
		})
	},
	isAndroid: function() {
		const res = uni.getSystemInfoSync();
		return res.platform.toLocaleLowerCase() == "android"
	},
	isPhoneX: function() {
		const res = uni.getSystemInfoSync();
		let iphonex = false;
		let models = ['iphonex', 'iphonexr', 'iphonexsmax', 'iphone11', 'iphone11pro', 'iphone11promax']
		const model = res.model.replace(/\s/g, "").toLowerCase()
		if (models.includes(model)) {
			iphonex = true;
		}
		return iphonex;
	},
	delayed: null,
	/**
	 * 请求数据处理
	 * @param string url 请求地址
	 * @param string method 请求方式
	 *  GET or POST
	 * @param {*} postData 请求参数(get方式传入此参数会直接用作params)
	 * @param {*} getParams get请求参数
	 * postData, getParams同时存在是，postData为POST方式传递参数，getParams则作为GET的形式在地址栏后拼接传递
	 */
	request: function(url, method, postData, getParams, isForm) {
		return new Promise((resolve, reject) => {
			uni.request({
				url: getParams ? (yu.interface() + url + "?" + yu.turnGetParams(getParams)) : (yu.interface() + url),
				data: postData,
				header: {
					'content-type': isForm ? 'application/x-www-form-urlencoded' : 'application/json',
					'Authorization': yu.getToken() ? yu.getToken() : 0,
					"token": yu.getToken() ? yu.getToken() : '',
				},
				method: method, //'GET','POST','PUT','DELETE'
				dataType: 'json',
				success: (res) => {
					resolve(res.data)
				},
				fail: (res) => {
					// yu.toast("网络不给力，请稍后再试~")
					reject(res)
				}
			})
		})
	},
	// 将json对象转换为url格式
	turnGetParams: function(json) {
		let getParams = Object.keys(json).map(function(key) {
			return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
		}).join("&");
		return getParams
	},
	//设置用户信息
	setUserInfo: function(userInfo, token) {
		uni.setStorageSync("userInfo", userInfo)
		uni.setStorageSync("token", token)
	},
	//获取token
	getToken() {
		return uni.getStorageSync("token")
	},
	//判断是否登录
	isLogin: function() {
		return uni.getStorageSync("token") ? true : false
	},
	// 设置缓存
	setCache: function(dataKey, val) {
		try {
			uni.setStorageSync(dataKey, val);
		} catch (e) {

		}
		return true;
	},
	// 获取缓存
	getCache: function(dataKey) {
		let data
		try {
			data = uni.getStorageSync(dataKey)
		} catch (e) {
			// console.log(e)
		}
		return data
	},
	// 清除单条缓存
	removeCache: function(dataKey) {
		try {
			uni.removeStorageSync(dataKey);
		} catch (e) {
			// error
		}
	},
	logout() {
		yu.removeCache("openid");
		yu.removeCache("token");
		yu.removeCache("userId");
		yu.removeCache("avatar");
		yu.removeCache("nickName");
		yu.removeCache("mobile");
		yu.removeCache("invitationCode");
		yu.removeCache("nickName");
		yu.removeCache("relation");
		yu.removeCache("relation_id");
	},
	// //将选择的图片转化为base64
	// chooseImageToBase64: function(count,callback) {
	// 	uni.chooseImage({
	// 		count: count,
	// 		sizeType: ['original', 'compressed'],
	// 		sourceType: ['album'],
	// 		success: function(res) {
	// 			for (let i = 0; i < res.tempFilePaths.length; i++) {
	// 				pathToBase64(res.tempFilePaths[i]).then(paths => {
	// 					callback && callback(res.tempFilePaths,paths)
	// 				}).catch(error => {
	// 					callback && callback(error)
	// 				})
	// 			}
	// 		}
	// 	});
	// },
	// 文字换行
	drawtext: function(text, maxWidth) {
		let textArr = text.split("");
		let len = textArr.length;
		// 上个节点
		let previousNode = 0;
		// 记录节点宽度
		let nodeWidth = 0;
		// 文本换行数组
		let rowText = [];
		// 如果是字母，侧保存长度
		let letterWidth = 0;
		// 汉字宽度
		let chineseWidth = 21;
		// otherFont宽度
		let otherWidth = 10.5;
		for (let i = 0; i < len; i++) {
			if (/[\u4e00-\u9fa5]|[\uFE30-\uFFA0]/g.test(textArr[i])) {
				if (letterWidth > 0) {
					if (nodeWidth + chineseWidth + letterWidth * otherWidth > maxWidth) {
						rowText.push({
							type: "text",
							content: text.substring(previousNode, i)
						});
						previousNode = i;
						nodeWidth = chineseWidth;
						letterWidth = 0;
					} else {
						nodeWidth += chineseWidth + letterWidth * otherWidth;
						letterWidth = 0;
					}
				} else {
					if (nodeWidth + chineseWidth > maxWidth) {
						rowText.push({
							type: "text",
							content: text.substring(previousNode, i)
						});
						previousNode = i;
						nodeWidth = chineseWidth;
					} else {
						nodeWidth += chineseWidth;
					}
				}
			} else {
				if (/\n/g.test(textArr[i])) {
					rowText.push({
						type: "break",
						content: text.substring(previousNode, i)
					});
					previousNode = i + 1;
					nodeWidth = 0;
					letterWidth = 0;
				} else if (textArr[i] == "\\" && textArr[i + 1] == "n") {
					rowText.push({
						type: "break",
						content: text.substring(previousNode, i)
					});
					previousNode = i + 2;
					nodeWidth = 0;
					letterWidth = 0;
				} else if (/[a-zA-Z0-9]/g.test(textArr[i])) {
					letterWidth += 1;
					if (nodeWidth + letterWidth * otherWidth > maxWidth) {
						rowText.push({
							type: "text",
							content: text.substring(previousNode, i + 1 - letterWidth)
						});
						previousNode = i + 1 - letterWidth;
						nodeWidth = letterWidth * otherWidth;
						letterWidth = 0;
					}
				} else {
					if (nodeWidth + otherWidth > maxWidth) {
						rowText.push({
							type: "text",
							content: text.substring(previousNode, i)
						});
						previousNode = i;
						nodeWidth = otherWidth;
					} else {
						nodeWidth += otherWidth;
					}
				}
			}
		}
		if (previousNode < len) {
			rowText.push({
				type: "text",
				content: text.substring(previousNode, len)
			});
		}
		return rowText;
	},
	base64src: function(base64data) {
		const fsm = wx.getFileSystemManager();
		const FILE_BASE_NAME = 'tmp_base64src';
		return new Promise((resolve, reject) => {
			const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || [];
			if (!format) {
				reject(new Error('ERROR_BASE64SRC_PARSE'));
			}
			const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`;
			const buffer = wx.base64ToArrayBuffer(bodyData);
			fsm.writeFile({
				filePath,
				data: buffer,
				encoding: 'binary',
				success() {
					resolve(filePath);
				},
				fail() {
					reject(new Error('ERROR_BASE64SRC_WRITE'));
				},
			});
		});
	},
	isDeBug: function() {
		return true;
	},
}

export default yu
