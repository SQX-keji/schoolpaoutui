<template>
	<view class="container">
		<view class="header">
			<view class="nav">
				<view class="navLeft" @tap="goSelectCity">
					<image src="../../static/img/home/1.png"></image>
					<view class="localName">{{ localCampus }}</view>
					<text class="cuIcon-right"></text>
				</view>
				<view class="navRight" @tap="goMessage">
					<image src="../../static/img/home/info.png"></image>
				</view>
			</view>
			<view class="search-box">
				<view class="search-wrap" @tap="goSearch">
					<image class="search-icon" src="../../static/img/home/search.png"></image>
					<input class="search-input" type="text" value="输入关键字搜索任务" disabled />
				</view>
			</view>
		</view>
		<view class="main">
			<view class="home-bgi">
				<swiper class="swiper" autoplay="1500" :indicator-dots="true" :circular='true'
					indicator-active-color="#ffffff" indicator-color="#cccccc">
					<swiper-item class="swiper-wrap" v-for="(item,index) in banners" :key='index'>
						<image :src="item.imageUrl"></image>
					</swiper-item>
				</swiper>
			</view>
			<view class="menu-box">
				<view class="category">
					<swiper class="swiper" duration="300" :style="{ height: categoryHeight }">
						<swiper-item v-for="(nav, index) in navlist" :key="index">
							<view class="category-list">
								<view class="icon-box" v-for="(item,ind) in nav" :key="ind" @tap="toNavList(item, ind)">
									<image class="icon" :src="item.classifyIcon" style="height: 100rpx;width: 100rpx">
									</image>
									<view class="text">{{ item.classifyName }}</view>
								</view>
							</view>
						</swiper-item>
					</swiper>
					<view class="dots">
						<view v-for="(page, pageindex) in navlist" :key="pageindex"
							:class="{ active: pageindex == currentPageindex }"></view>
					</view>
				</view>
			</view>
			<view class="demand-release">
				<view class="title">发布需求</view>
				<view class="search-wrap">
					<text>我需要</text>
					<input class="search-input" type="text" v-model="content" placeholder="请填写需求"
						placeholder-class="placeholder-search-input" />
				</view>
				<view class="search-wrap">
					<text>手机号</text>
					<input class="search-input" type="text" v-model="phone" placeholder="请填写手机号" :disabled="!isDisable"
						maxlength="11" placeholder-class="placeholder-search-input" />
					<view class="edit" @tap='edit()'>修改</view>
				</view>
				<view class="btn" @tap='sendDemand()'>马上发布需求</view>
			</view>
			<view class="card-box">
				<view class="title" v-if="goodsHomeList.length > 0">最新任务</view>
				<task-home-list splitLine @click="clickItem" :list="goodsHomeList"></task-home-list>
				<!-- 暂无数据展示 -->
				<!-- <empty v-if="goodsHomeList.length === 0" des="暂无最新订单" show="false"></empty> -->
			</view>
			<!-- 加载更多提示 -->
			<view v-if="goodsHomeList.length > 0">
				<load-more :loadingType="loadingType" :contentText="contentText"></load-more>
			</view>
		</view>
	</view>
</template>

<script>
	import taskHomeList from "@/components/mask/task-home-list.vue"
	export default {
		components: {
			taskHomeList
		},
		data() {
			return {
				localCampus: '陕西师范大学',
				banners: [],
				categoryHeight: '320rpx', //菜单默认高度
				currentPageindex: 0, //菜单滚动小点
				navlist: [{
						url: '../../static/img/home/2.png',
						title: '找人代买'
					},
					{
						url: '../../static/img/home/3.png',
						title: '外卖代拿'
					},
					{
						url: '../../static/img/home/4.png',
						title: '找人陪跑'
					},
					{
						url: '../../static/img/home/5.png',
						title: '找人代办'
					},
					{
						url: '../../static/img/home/6.png',
						title: '快递代拿'
					}
				],
				content: "",
				phone: "",
				isDisable: false,
				goodsHomeList: [],
				page: 1,
				limit: 10,
				loadingType: 0,
				contentText: {
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				},
				arr: [],
				showModal: true
			}
		},
		onLoad() {
			let isLogin = this.yu.isLogin();
			let userId = this.yu.getCache('userId');
			if (isLogin) {
				this.getUserInfo(userId);
			} else {
				this.initCampusList();
			}
			this.localCampus = this.yu.getCache('campusName') ? this.yu.getCache('campusName') : this.localCampus;
			// console.log('this.localCampus',this.localCampus)
			
			this.$Request.getT('/common/type/121').then(res => { //报名成功通知
				if (res.code == 0) {
					if (res.data && res.data.value) {
						// that.orderStart = res.data;
						this.arr.push(res.data.value)
					}
				}
			})
			this.$Request.getT('/common/type/122').then(res => { //活动即将开始提醒
				if (res.code == 0) {
					if (res.data && res.data.value) {
						// that.orderStart = res.data;
						this.arr.push(res.data.value)
					}
				}
			})
		},
		onShow() {
			let isLogin = this.yu.isLogin();
			let phone = this.yu.getCache('mobile');
			let userId = this.yu.getCache('userId');
			this.getSelectBanner(1);
			this.getMenuList();
			this.localCampus = this.yu.getCache('campusName') ? this.yu.getCache('campusName') : this.localCampus;
		
			if (!isLogin) {
				setTimeout(() => {
					this.page = 1;
					this.goodsHomeList = [];
					if (this.yu.getCache('campus')) {
						this.campusId = this.yu.getCache('campus');
					}
					this.getNewHelpOrderList();
				}, 10)
			} else {
				this.page = 1;
				this.goodsHomeList = [];
				if (this.yu.getCache('campus')) {
					this.campusId = this.yu.getCache('campus');
				}
				this.getNewHelpOrderList();
				//订阅
				if(this.showModal) {
					this.openMsg()
				}
			}
			if (phone && phone !== 'undefined') {
				this.phone = phone;
			} else {
				this.phone = '';
			}
		},
		onHide() {
			this.content = ""
		},
		methods: {
			// 开启订阅消息
			openMsg() {
				console.log('订阅消息')
				var that = this
				wx.getSetting({
					withSubscriptions: true, //是否获取用户订阅消息的订阅状态，默认false不返回
					success(ret) {
						console.log(ret,'------------------')
						// console.log(ret.subscriptionsSetting.itemSettings)
						// console.log(Object.keys(ret.subscriptionsSetting.itemSettings).length)
						// if (JSON.stringify(ret.subscriptionsSetting.itemSettings).indexOf('accept')!=-1) {
						if (ret.subscriptionsSetting.itemSettings && Object.keys(ret.subscriptionsSetting.itemSettings).length == 2) {
							uni.setStorageSync('sendMsg', true)
							// wx.requestSubscribeMessage({
							// 	tmplIds: that.arr,
							// 	success(re) {
							// 		console.log(JSON.stringify(re), 111111111111)
							// 		var datas = JSON.stringify(re);
							// 		if (datas.indexOf("accept") != -1) {
							// 			console.log(re)
							// 		}
							// 	},
							// 	fail: (res) => {
							// 		console.log(res)
							// 	}
							// })
						} else { // 用户没有点击“总是保持以上，不再询问”则每次都会调起订阅消息
							uni.setStorageSync('sendMsg', false)
							uni.showModal({
								title: '提示',
								content: '为了更好的体验,请绑定消息推送',
								confirmText: '确定',
								cancelText: '取消',
								success: function(res) {
									if (res.confirm) {
										console.log(res,'--------------------')
										wx.requestSubscribeMessage({
											tmplIds: that.arr,
											success(re) {
												console.log(JSON.stringify(re), 111111111111)
												var datas = JSON.stringify(re);
												if (datas.indexOf("accept") != -1) {
													console.log(re)
												}
											},
											fail: (res) => {
												console.log(res)
											}
										})
										that.showModal = false
									} else if (res.cancel) {
										console.log('取消')
										that.showModal = true
									}
								}
							})
						}
					}
				})
			},
			goSearch() {
				if (uni.getStorageSync('sendMsg')) {
					wx.requestSubscribeMessage({
						tmplIds: this.arr,
						success(re) {
							var datas = JSON.stringify(re);
							if (datas.indexOf("accept") != -1) {
								console.log(re)
							}
						},
						fail: (res) => {
							console.log(res)
						}
					})
				}
				uni.navigateTo({
					url: '/pages/task/search'
				});
			},
			goSelectCity() {
				if (uni.getStorageSync('sendMsg')) {
					wx.requestSubscribeMessage({
						tmplIds: this.arr,
						success(re) {
							console.log(JSON.stringify(re), 111111111111)
							var datas = JSON.stringify(re);
							if (datas.indexOf("accept") != -1) {
								console.log(re)
							}
						},
						fail: (res) => {
							console.log(res)
						}
					})
				}
				uni.navigateTo({
					url: '/pages/index/selectCampus?localCampus=' + this.localCampus
				});
			},
			initCampusList() {
				let that = this;
				that.yu.request('/helpCampus/selectCampusList', 'GET').then(res => {
					if (res.code === 0) {
						if (res.data.length !== 0) {
							this.campusId = res.data[0].campusId;
							this.localCampus = res.data[0].campusName;
							this.yu.setCache("campus", res.data[0].campusId);
							this.yu.setCache("campusName", res.data[0].campusName);
							// this.getNewHelpOrderList();
						}
					}
				});
			},
			goMessage: function() {
				if (uni.getStorageSync('sendMsg')) {
					wx.requestSubscribeMessage({
						tmplIds: this.arr,
						success(re) {
							console.log(JSON.stringify(re), 111111111111)
							var datas = JSON.stringify(re);
							if (datas.indexOf("accept") != -1) {
								console.log(re)
							}
						},
						fail: (res) => {
							console.log(res)
						}
					})
				}
				let token = this.yu.getCache('token');
				if (token) {
					uni.navigateTo({
						url: '/pages/task/renwu'
					});
				} else {
					this.goLogin();
				}
			},
			getSelectBanner(index) {
				this.yu.request('/banner/selectBannerList?classify=' + index + '&state=1', 'GET').then(res => {
					if (res.code === 0) {
						this.banners = res.data;
						uni.stopPullDownRefresh();
					}
				});
			},
			getMenuList() {
				this.yu.request('/helpClassify/selectClassifyList', 'GET').then(res => {
					if (res.code === 0) {
						if (res.data.length > 0) {
							var dataNew = this.chunk(res.data, 10)
							this.navlist = dataNew;
							if (res.data.length > 5) {
								this.categoryHeight = "320rpx"
							} else {
								this.categoryHeight = "160rpx"
							}
						}
						uni.stopPullDownRefresh();
					}
				});
			},
			goLogin() {
				this.yu.setCache('href', '/pages/index/index');
				uni.navigateTo({
					url: '/pages/public/login'
				});
			},
			getNewHelpOrderList(type) {
				let postData = {
					page: this.page,
					limit: this.limit,
					campus: this.campusId
				}
				this.loadingType = 1;
				this.yu.request('/help/selectNewHelpOrderList', 'GET', postData).then(res => {
					if (res.code === 0) {
						if (this.page === 1) {
							this.goodsHomeList = [];
						}
						uni.hideLoading();
						if (res.data.list) {
							res.data.list.forEach(dd => {
								this.yu.request('/helpClassify/selectClassifyList', 'GET').then(ress => {
									if (ress.code === 0) {
										ress.data.forEach(ddd => {
											if (dd.classifyId == ddd.id) {
												dd.classifyName = ddd.classifyName
											}
										});
										dd.imageUrl = dd.imageUrl != null ? dd.imageUrl :
											'/static/img/logo.png'
										this.goodsHomeList.push(dd);
									}
								});
							});
							console.log('goodsList', this.goodsHomeList)
						}
						if (res.data.list.length === this.limit) {
							this.loadingType = 0;
						} else {
							this.loadingType = 3;
						}
					} else {
						this.loadingType = 2;
					}
					if (type === "refresh") {
						uni.stopPullDownRefresh();
					}
				})
			},
			clickItem: function(options) {
				if (uni.getStorageSync('sendMsg')) {
					wx.requestSubscribeMessage({
						tmplIds: this.arr,
						success(re) {
							console.log(JSON.stringify(re), 111111111111)
							var datas = JSON.stringify(re);
							if (datas.indexOf("accept") != -1) {
								console.log(re)
							}
						},
						fail: (res) => {
							console.log(res)
						}
					})
				}
				// console.log('点击',options)
				uni.navigateTo({
					url: '/pages/index/taskDetail?helpOrderId=' + options.item.id
				})
			},
			toNavList: function(item, ind) {
				if (uni.getStorageSync('sendMsg')) {
					wx.requestSubscribeMessage({
						tmplIds: this.arr,
						success(re) {
							console.log(JSON.stringify(re), 111111111111)
							var datas = JSON.stringify(re);
							if (datas.indexOf("accept") != -1) {
								console.log(re)
							}
						},
						fail: (res) => {
							console.log(res)
						}
					})
				}
				uni.navigateTo({
					url: '/pages/task/tasklist?searchValue=' + item.classifyName + '&classifyId=' + item.id +
						'&type=directSearch'
				});
			},
			// 传进数组和指定个数，进行拆分
			chunk: function(array, size) {
				const length = array.length
				if (!length || !size || size < 1) {
					return []
				}
				let index = 0
				let resIndex = 0
				let result = new Array(Math.ceil(length / size))
				while (index < length) {
					result[resIndex++] = array.slice(index, (index += size))
				}
				return result
			},
			edit() {
				this.phone = '';
				let isLogin = this.yu.isLogin();
				if (isLogin) {
					this.isDisable = true;
				} else {
					this.isDisable = false;
				}
			},
			sendDemand() {
				if (uni.getStorageSync('sendMsg')) {
					wx.requestSubscribeMessage({
						tmplIds: this.arr,
						success(re) {
							console.log(JSON.stringify(re), 111111111111)
							var datas = JSON.stringify(re);
							if (datas.indexOf("accept") != -1) {
								console.log(re)
							}
						},
						fail: (res) => {
							console.log(res)
						}
					})
				}
				let token = this.yu.getCache('token');
				if (token) {
					uni.navigateTo({
						url: '/pages/order/release?type=hasPhoneAndContent&content=' + this.content + '&phone=' +
							this.phone
					});
				} else {
					this.goLogin();
				}
			},
			getUserInfo(userId) {
				// 更新登录信息
				this.yu.request("/app/selectUserById?userId=" + userId, 'POST').then(res => {
					if (res.code === 0) {
						this.yu.setCache("avatar", res.data.imageUrl ? res.data.imageUrl : '/static/img/logo.png');
						this.yu.setCache("nickName", res.data.nickName ? res.data.nickName : res.data.phone);
						this.yu.setCache("mobile", res.data.phone);
						this.yu.setCache("invitationCode", res.data.invitationCode);
						this.yu.setCache("relation_id", res.data.relationId);
						this.yu.setCache("relation", res.data.invitationCode);
						this.yu.setCache("grade", res.data.grade);
						this.yu.setCache("isInvitation", res.data.isInvitation);
						this.yu.setCache("gender", parseInt(res.data.gender));
						this.yu.setCache("campus", res.data.campus);
						this.yu.setCache("campusName", res.data.campusName);
						uni.stopPullDownRefresh();
					}
				});
			},
		},
		onReachBottom: function() {
			this.page = this.page + 1;
			this.getNewHelpOrderList();
		},
		onPullDownRefresh: function() {
			this.getSelectBanner(1);
			this.getMenuList();
			let userId = this.yu.getCache('userId');
			this.getUserInfo(userId);
			this.page = 1;
			this.getNewHelpOrderList('refresh');
		}
	}
</script>

<style lang="scss">
	page {
		width: 100%;
		background: #F7F7F7;
	}

	.container {
		width: 100%;

		.header {
			width: 100%;
			background: #FFFFFF;

			.nav {
				height: 88upx;
				padding: 0 30upx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.navLeft {
					display: flex;
					justify-content: space-around;
					align-items: center;

					image {
						width: 34upx;
						height: 48upx;
					}

					.localName {
						font-size: 28upx;
						font-weight: bold;
						color: #333333;
						margin-left: 20upx;
					}

					text {
						font-size: 22upx;
						color: #333333;
						margin-left: 12upx;
					}
				}

				.navRight {
					width: 44upx;
					height: 39upx;

					image {
						width: 100%;
						height: 100%;
					}

				}
			}

			.search-box {
				width: 100%;
				height: 78upx;
				padding: 0 30upx;
				display: flex;
				align-items: center;

				.search-wrap {
					width: 100%;
					height: 60upx;
					background: #F2F2F2;
					border-radius: 8upx;
					display: flex;
					align-items: center;
					padding: 0 20upx;

					.search-icon {
						width: 35upx;
						height: 34upx;
					}

					.search-input {
						flex: 1;
						font-size: 24upx;
						font-weight: 500;
						color: #858585;
						margin-left: 10upx;
					}
				}
			}
		}

		.main {
			width: 100%;
			padding: 20upx 20upx 20upx;

			.home-bgi {
				width: 100%;
				height: 240upx;
				background: #FFF;

				.swiper {
					width: 100%;
					height: 100%;

					.swiper-wrap {
						width: 100%;
						height: 100%;

						image {
							width: 100%;
							height: 100%;
							display: block;
						}
					}

				}
			}

			.menu-box {
				width: 100%;
				padding: 20upx 0 20upx;
				display: flex;

				.category {
					width: 100%;
					border-radius: 20upx;

					.swiper {
						width: 100%;

						.uni-swiper-dot {
							width: 20upx;
						}

						.category-list {
							width: 100%;
							height: auto;
							display: flex;
							justify-content: flex-start;
							flex-flow: wrap;

							.icon-box {
								width: 20%;
								display: flex;
								flex-flow: wrap;
								justify-content: center;
								font-size: 22upx;
								color: #666;

								.icon {
									width: 100upx;
									height: 100upx;
								}

								.text {
									width: 100%;
									display: flex;
									justify-content: center;
									padding-bottom: 18upx;
									padding-top: 18upx;
								}
							}
						}
					}

					.dots {
						display: flex;
						align-items: center;
						justify-content: center;
						height: 15upx;
						width: 100%;

						view {
							width: 30upx;
							height: 5upx;
							background-color: rgba(0, 0, 0, 0.2);

							&.active {
								background-color: #ff570a;
							}
						}
					}
				}

				.menu-item {
					width: 20%;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;

					.iconImg {
						width: 100upx;
						height: 100upx;
					}

					text {
						margin-top: 17upx;
						font-size: 24upx;
						font-weight: bold;
						color: #333333;
					}
				}
			}

			.demand-release {
				background-color: #FFF;
				padding: 32upx 20upx 30upx;

				.title {
					font-size: 34upx;
					font-weight: 800;
					color: #333333;
					line-height: 34upx;
					margin-bottom: 26upx;
				}

				.search-wrap {
					height: 88upx;
					padding: 0 20upx;
					background: #F5F5F5;
					border-radius: 5upx;
					display: flex;
					justify-content: space-between;
					margin-bottom: 10upx;

					text {
						margin-right: 40upx;
						line-height: 88upx;
						font-size: 28upx;
					}

					.search-input {
						flex: 1;
						height: 100%;
						font-size: 28upx;
					}

					.placeholder-search-input {
						font-size: 28upx;
					}

					.edit {
						height: 88upx;
						line-height: 88upx;
						font-size: 24upx;
						font-weight: 500;
						color: #FF3530;
					}
				}

				.btn {
					width: 100%;
					height: 88upx;
					text-align: center;
					line-height: 88upx;
					background: #FF3530;
					border-radius: 5upx;
					font-size: 28upx;
					font-weight: bold;
					color: #FFFFFF;
					margin-top: 20upx;
				}
			}

			.card-box {
				// padding: 0 30upx;
				background-color: #FFF;
				margin-top: 20upx;

				.title {
					height: 86upx;
					font-size: 34upx;
					font-weight: 800;
					color: #333333;
					line-height: 86upx;
					padding: 0 30upx;
				}
			}
		}

	}
</style>
