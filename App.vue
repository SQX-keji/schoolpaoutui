<script>
	import Vue from 'vue';
	export default {
		methods: {
		
			
		},
		onLaunch: function() {
			let that = this;
			//获取全局邀请码
			that.$Request.getT('/common/type/88').then(res => {
				if (res.code == 0) {
					if (res.data && res.data.value) {
						this.$queue.setData('publicRelation', res.data.value);
					}
				}
			});
			//获取淘宝APPID
			that.$Request.getT('/common/type/6').then(res => {
				if (res.code == 0) {
					if (res.data && res.data.value) {
						this.$queue.setData('taobaoAppid', res.data.value);
					}
				}
			});

			//获取淘宝秘钥
			that.$Request.getT('/common/type/7').then(res => {
				if (res.code == 0) {
					if (res.data && res.data.value) {
						this.$queue.setData('taobaoSecret', res.data.value);
					}
				}
			});

			//获取淘宝pid
			that.$Request.getT('/common/type/9').then(res => {
				if (res.code == 0) {
					if (res.data && res.data.value) {
						this.$queue.setData('taobaoPid', res.data.value);
					}
				}
			});
			//获取好单库key
			that.$Request.getT('/common/type/10').then(res => {
				if (res.code == 0) {
					if (res.data && res.data.value) {
						this.$queue.setData('haodankuKey', res.data.value);
					}
				}
			});
			//获取淘宝名字
			that.$Request.getT('/common/type/11').then(res => {
				if (res.code == 0) {
					if (res.data && res.data.value) {
						this.$queue.setData('taobaoName', res.data.value);
					}
				}
			});

			//获取APP下载地址
			that.$Request.getT('/common/type/25').then(res => {
				if (res.code == 0) {
					if (res.data && res.data.value) {
						this.$queue.setData('appurl', res.data.value);
					}
				}
			});
			//关键字过滤
			that.$Request.getT('/common/type/67').then(res => {
				if (res.code == 0) {
					if (res.data && res.data.value) {
						this.$queue.setData('searchKeys', res.data.value);
					}
				}
			});
			//#ifdef H5
			let width = window.screen.width;
			if (window.location.href.indexOf('?invitation=') !== -1 || window.location.href.indexOf('&invitation=') !== -1) {
				if (window.location.href.indexOf('?invitation=') !== -1) {
					this.$queue.setData('relation', window.location.href.split('?invitation=')[1].split('&')[0]);
				} else {
					this.$queue.setData('relation', window.location.href.split('&invitation=')[1].split('&')[0]);
				}
			}
			//#endif
			//#ifdef APP-PLUS
			// APP检测更新 具体可以参考：https://ask.dcloud.net.cn/article/35667
			plus.screen.lockOrientation('portrait-primary'); //竖屏正方向锁定

			const updated = uni.getStorageSync('updated'); // 尝试读取storage

			if (updated.completed === true) {
				// 如果上次刚更新过
				// 删除安装包及安装记录
				console.log('安装记录被删除，更新成功');
				uni.removeSavedFile({
					filePath: updated.packgePath,
					success: res => {
						uni.removeStorageSync('updated');
					}
				});
			} else if (updated.completed === false) {
				uni.removeStorageSync('updated');
				plus.runtime.install(updated.packgePath, {
					force: true
				});
				uni.setStorage({
					key: 'updated',
					data: {
						completed: true,
						packgePath: updated.packgePath
					},
					success: res => {
						console.log('成功安装上次的更新，应用需要重启才能继续完成');
					}
				});
				uni.showModal({
					title: '提示',
					content: '应用将重启以完成更新',
					showCancel: false,
					complete: () => {
						plus.runtime.restart();
					}
				});
			} else {
				plus.runtime.getProperty(plus.runtime.appid, widgetInfo => {
					this.$Request.getT('/appinfo/').then(res => {
						console.log(JSON.stringify(res));
						res = res.data[0];
						if (res.wgtUrl && widgetInfo.version < res.version) {
							let downloadLink = '';
							let androidLink = res.androidWgtUrl;
							let iosLink = res.iosWgtUrl;
							let ready = false;
							if (res.wgtUrl.match(RegExp(/.wgt/))) {
								// 判断系统类型
								if (plus.os.name.toLowerCase() === 'android') {
									console.log('安卓系统');
									if (androidLink && androidLink !== '#') {
										// 我这里默认#也是没有地址，请根据业务自行修改
										console.log('发现下载地址');
										// 安卓：创建下载任务
										if (androidLink.match(RegExp(/.wgt/))) {
											console.log('确认wgt热更新包');
											downloadLink = androidLink;
											ready = true;
										} else {
											console.log('安卓推荐.wgt强制更新，.apk的强制更新请您自行修改程序');
										}
									} else {
										console.log('下载地址是空的，无法继续');
									}
								} else {
									console.log('苹果系统');
									if (iosLink && iosLink !== '#') {
										// 我这里默认#也是没有地址，请根据业务自行修改
										console.log('发现下载地址');
										// 苹果(A)：进行热更新（如果iosLink是wgt更新包的下载地址）判断文件名中是否含有.wgt
										if (iosLink.match(RegExp(/.wgt/))) {
											console.log('确认wgt热更新包');
											downloadLink = iosLink;
											ready = true;
										} else {
											console.log('苹果只支持.wgt强制更新');
										}
									} else {
										console.log('下载地址是空的，无法继续');
									}
								}
								if (ready) {
									console.log('任务开始');
									let downloadTask = uni.downloadFile({
										url: downloadLink,
										success: res => {
											if (res.statusCode === 200) {
												// 保存下载的安装包
												console.log('保存安装包');
												uni.saveFile({
													tempFilePath: res.tempFilePath,
													success: res => {
														const packgePath = res.savedFilePath;
														// 保存更新记录到stroage，下次启动app时安装更新
														uni.setStorage({
															key: 'updated',
															data: {
																completed: false,
																packgePath: packgePath
															},
															success: () => {
																console.log('成功保存记录');
															}
														});
														// 任务完成，关闭下载任务
														console.log('任务完成，关闭下载任务，下一次启动应用时将安装更新');
														downloadTask.abort();
														downloadTask = null;
													}
												});
											}
										}
									});
								} else {
									console.log('下载地址未准备，无法开启下载任务');
								}
							} else {
								if (res.method == 'true') {
									uni.showModal({
										showCancel: false,
										confirmText: '立即更新',
										title: '发现新版本',
										content: res.des,
										success: res => {
											if (res.confirm) {
												this.$queue.showLoading('下载中...');
												if (uni.getSystemInfoSync().platform == 'android') {
													uni.downloadFile({
														url: androidLink,
														success: downloadResult => {
															if (downloadResult.statusCode === 200) {
																plus.runtime.install(
																	downloadResult.tempFilePath, {
																		force: false
																	},
																	d => {
																		console.log('install success...');
																		plus.runtime.restart();
																	},
																	e => {
																		console.error('install fail...');
																	}
																);
															}
														}
													});
												}
												if (uni.getSystemInfoSync().platform == 'ios') {
													plus.runtime.openURL(iosLink, function(res) {});
												}
											} else if (res.cancel) {
												console.log('取消');
											}
										}
									});
								} else {
									uni.showModal({
										title: '发现新版本',
										confirmText: '立即更新',
										cancelText: '下次更新',
										content: res.des,
										success: res => {
											if (res.confirm) {
												this.$queue.showLoading('下载中...');
												if (uni.getSystemInfoSync().platform == 'android') {
													uni.downloadFile({
														url: androidLink,
														success: downloadResult => {
															if (downloadResult.statusCode === 200) {
																plus.runtime.install(
																	downloadResult.tempFilePath, {
																		force: false
																	},
																	d => {
																		console.log('install success...');
																		plus.runtime.restart();
																	},
																	e => {
																		console.error('install fail...');
																	}
																);
															}
														}
													});
												}
												if (uni.getSystemInfoSync().platform == 'ios') {
													plus.runtime.openURL(iosLink, function(res) {});
												}
											} else if (res.cancel) {
												console.log('取消');
											}
										}
									});
								}
							}
						}
					});
				});
			}

			//#endif
			//#ifdef H5
			let relation = this.$queue.getInvitation();
			if (window.location.href.indexOf('?invitation=') !== -1 || window.location.href.indexOf('&invitation=') !== -1) {
				if (window.location.href.indexOf('?invitation=') !== -1) {
					relation = window.location.href.split('?invitation=')[1].split('&')[0];
					this.$queue.setData('relation', window.location.href.split('?invitation=')[1].split('&')[0]);
				} else {
					relation = window.location.href.split('&invitation=')[1].split('&')[0];
					this.$queue.setData('relation', window.location.href.split('&invitation=')[1].split('&')[0]);
				}
			}
			let ua = navigator.userAgent.toLowerCase();

			if (ua.indexOf('micromessenger') !== -1) {
				let openid = this.$queue.getData('openid');
				let userId = this.$queue.getData('userId');
				let that = this;
				if (userId) {
					if (!openid) {
						if (window.location.href.indexOf('?code=') !== -1 || window.location.href.indexOf('&code=') !== -1) {
							let code;
							if (window.location.href.indexOf('?code=') !== -1) {
								code = window.location.href.split('?code=')[1].split('&')[0];
							} else {
								code = window.location.href.split('&code=')[1].split('&')[0];
							}
							if (userId) {
								that.$Request.getT('/user/openId/' + code + '/' + userId).then(res => {
									that.$queue.setData('openid', res.data);
								});
							}
						} else {
							// window.location.href =
							// 	'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
							// 	that.$queue.getWxAppid() +
							// 	'&redirect_uri=' +
							// 	window.location.href.split('#')[0] +
							// 	'&response_type=code&scope=snsapi_userinfo#wechat_redirect';
						}
					}
				}
			}
			//#endif
		},

		onShow: function() {
			// #ifdef APP-PLUS
			if (uni.getSystemInfoSync().platform == 'android') {
				let clientid = plus.push.getClientInfo().clientid;
				console.error(clientid);
				let userId = this.$queue.getData('userId');
				if (userId) {
					this.$Request.postT('/appLogin/updateClientId?clientId=' + clientid + '&userId=' + userId).then(res => {});
				}
			}

			//#endif
			let userId = this.$queue.getData('userId');
			let that = this;
			if (userId) {
				//获取是否开启自动签到
				that.$Request.getT('/common/type/111').then(res => {
					if (res.code == 0) {
						if (res.data && res.data.value) {
							if(res.data.value === '是'){
								that.$Request.getT('/integral/signIn?userId=' + userId).then(res => {
									if (res.code === 0) {
										console.error('签到成功')
									}
								});
							}
						}
					}
				});
			}else {
				that.yu.request('/helpCampus/selectCampusList', 'GET').then(res => {
					if (res.code === 0) {
						if(res.data.length !== 0) {
							this.yu.setCache("campus", res.data[0].campusId);
							this.yu.setCache("campusName", res.data[0].campusName);
						}
					}
				});
			}
		},
		onHide: function() {}
	};
</script>

<style lang="scss">
	@import '@/static/css/colorui-main.css';
	@import '@/static/css/colorui-icon.css';
	@import '@/static/css/iconfont.css';
</style>
