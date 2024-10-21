<template>
	<view class="container">
		<view v-if="isLogin">
			<view class="header">
				<view class="menuTab">
					<view class="menuTab-item" :class="{'active': menuIndex == 0}" @click="getClick(0)">发布订单</view>
					<view class="menuTab-item" :class="{'active': menuIndex == 1}" @click="getClick(1)">跑腿订单</view>
				</view>
				<view class="type-box">
					<view class="navbar">
						<view v-for="(item, index) in tabList" :key="index" class="nav-item"
							@tap="fromTabSelect(index)">
							<view class="txt" :class="{ active_txt: fromTabIndex === index }">{{ item.name }}</view>
							<view class="line" :class="{ active_line: fromTabIndex === index }"></view>
						</view>
					</view>
				</view>
			</view>
			<view class="main">
				<view v-if="menuIndex == 0" class="card-box-order">
					<view class="list-item" v-for="(item,index) in createHelpOrderList" :key="index"
						@tap="goDetailCreate(item.id)">
						<view class="title">
							<text class="nickName">{{item.nickName}}</text>
							<text
								class="status">{{item.status == 1 ? '待审核' : item.status == 2 ? '待接单' : item.status == 3 ? '待送达' : item.status == 4 ? '已完成':''}}</text>
						</view>
						<view class="info-wrap">
							<view class="express">{{item.content}}</view>
							<view class="tag-box">
								<view class='tag-item'
									:class="{'tag-item-orange': item.userType == 0, 'tag-item-blue': item.userType == 1 , 'tag-item-pink': item.userType == 2}">
									{{item.userType == 0 ? '不限' : item.userType == 1 ? '限男生' : item.userType == 2 ? '限美女' : ''}}
								</view>
								<view class='tag-item tag-item-orange'>{{item.classifyName}}</view>
								<view class='tag-item tag-item-green'>
									{{item.status == 1 ? '待审核' : item.status == 2 ? '待接单' : item.status == 3 ? '待送达' : item.status == 4 ? '已完成': item.status == 5 ? '已下架' :''}}
								</view>
							</view>
							<view class="times">下单时间: {{item.createTime}}</view>
							<view class="code">
								<view class="ma" v-if="item.status == 3 || item.status == 4">收货码：{{ item.code }}</view>
								<view class="ma" v-else></view>
								<view class="pay">实付款：<text>￥{{item.money}}</text></view>
							</view>
							<view class="btn-wrap">
								<view class="btn delete" v-if="item.status === 2 || item.status === 1"
									@tap.stop="delDemandModel(item.id,item.content,index)">删除</view>
								<view class="btn demand" v-if="item.status === 2 || item.status === 1"
									@tap.stop="perfectDemand(item,index)">完善需求</view>
							</view>
						</view>
					</view>
				</view>
				<view v-if="menuIndex == 1" class="card-box-run">
					<view class="list-item" v-for="(item,index) in runHelpOrderList" :key="index"
						@tap="goDetail(item.helpOrderId)">
						<view class="title">
							<view class="date">
								<image src="../../static/img/order/clock.png"></image>
								<text class="txt">{{item.deliveryTime}}</text>
							</view>
							<view class="status">{{item.money}}<text>元</text></view>
						</view>
						<view class="info-wrap">
							<view class="steps-box">
								<view class="left">
									<view class="round top"></view>
									<view class="vertical-line"></view>
									<view class="round bottom"></view>
								</view>
								<view class="right">
									<view class="text">{{item.content}}</view>
									<view class="distance"></view>
									<view class="text">{{item.site}}</view>
								</view>
							</view>
							<view class="contact-person">
								<text class="nickName">{{item.nickName}}：</text>
								<text class="moblie">{{item.phone_}}</text>
							</view>
							<view class="btn-wrap" v-if="RunStatus == 1">
								<view class="btn" style="margin-right: 20upx;" @tap.stop="Gophone(item)">联系Ta</view>
								<view class="btn" style="margin-right: 20upx;" @tap.stop="endTask(item)">取消订单</view>
								<view class="btn" @tap.stop="sureService(item)">确认送达</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 加载更多提示 -->
			<view v-if="createHelpOrderList.length > 0 && menuIndex == 0">
				<load-more :loadingType="loadingType" :contentText="contentText"></load-more>
			</view>
			<view v-if="runHelpOrderList.length > 0 && menuIndex == 1">
				<load-more :loadingType="loadingType" :contentText="contentText"></load-more>
			</view>
			<!-- 暂无数据展示 -->
			<empty v-if="createHelpOrderList.length === 0 && menuIndex == 0" des="暂无订单数据" show="false"></empty>
			<empty v-if="runHelpOrderList.length === 0 && menuIndex == 1" des="暂无订单数据" show="false"></empty>
		</view>
		<view v-else>
			<tui-no-data :fixed="true" imgUrl="/static/img/order/login.png" btnText="去登录" backgroundColor='#FF3530'
				@click="orderLogin">您还未完成登录</tui-no-data>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				menuIndex: 0,
				fromTabIndex: 0,
				tabList: [],
				tabListOrder: [{
						name: "待接单"
					},
					{
						name: "派送中"
					},
					{
						name: "已完成"
					},
					{
						name: "已下架"
					}
				],
				tabListRun: [{
						name: "派送中"
					},
					{
						name: "已完成"
					}
				],
				// 发布订单
				SendStatus: 2,
				SendPage: 1,
				SendLimit: 10,
				createHelpOrderList: [],
				// 跑腿订单
				RunStatus: 1,
				RunPage: 1,
				RunLimit: 10,
				runHelpOrderList: [],
				ClassIfyList: [],
				loadingType: 0,
				contentText: {
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				},
				isLogin: false
			}
		},
		onLoad(d) {
			this.tabList = this.tabListOrder;
			let token = this.$queue.getData('token');
			this.isLogin = this.yu.isLogin();
				
			if (token) {
				this.userId = this.yu.getCache('userId');
				this.getClassIfy();
			}
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
			let token = this.$queue.getData('token');
			this.isLogin = this.yu.isLogin();
			if (token) {
				this.userId = this.yu.getCache('userId');
				
				if(this.menuIndex === 0){
					this.SendPage = 1;
					this.getCreateHelpOrder();
				}else{
					this.RunPage = 1;
					this.getRunHelpOrder();
				}
			}
		},
		methods: {
			getClassIfy() {
				this.yu.request('/helpClassify/selectClassifyList', 'GET').then(res => {
					if (res.code === 0) {
						this.ClassIfyList = res.data;
						this.SendPage = 1;
						this.getCreateHelpOrder();
					}
				});
			},
			getClick(index) {
				this.menuIndex = index;
				switch (index) {
					case 0:
						this.tabList = this.tabListOrder;
						this.fromTabIndex = 0;
						this.SendStatus = 2;
						this.SendPage = 1;
						this.getCreateHelpOrder();
						break;
					case 1:
						this.tabList = this.tabListRun;
						this.fromTabIndex = 0;
						this.RunStatus = 1;
						this.RunPage = 1;
						this.getRunHelpOrder();
						break;
				}
			},
			fromTabSelect(index) {
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
				this.fromTabIndex = index;
				console.log("this.menuIndex___:" + this.menuIndex)
				let menuIndex = this.menuIndex;
				this.SendPage = 1;
				switch (menuIndex) {
					case 0: //发布订单
						switch (index) {
							case 0: //待接单
								this.SendStatus = 2;
								this.getCreateHelpOrder();
								break;
							case 1: //派送中
								this.SendStatus = 3;
								this.getCreateHelpOrder();
								break;
							case 2: //已完成
								this.SendStatus = 4;
								this.getCreateHelpOrder();
								break;
							case 3: //待审核
								this.SendStatus = 5;
								this.getCreateHelpOrder();
								break;
						}
						break;
					case 1: //跑腿订单
						switch (index) {
							case 0: //派送中
								this.RunStatus = 1;
								this.getRunHelpOrder();
								break;
							case 1: //已完成
								this.RunStatus = 2;
								this.getRunHelpOrder();
								break;
						}
						break;
				}
			},
			// 发布订单
			getCreateHelpOrder(type) {
				let getData = {
					userId: this.userId,
					status: this.SendStatus,
					page: this.SendPage,
					limit: this.SendLimit
				}
				this.loadingType = 1;
				this.yu.request('/help/selectCreateHelpOrder', 'GET', getData).then(res => {
					if (res.code === 0) {
						if (this.SendPage === 1) {
							this.createHelpOrderList = [];
						}
						uni.hideLoading();
						if (res.data.list) {
							res.data.list.forEach(dd => {
								this.ClassIfyList.forEach(ddd => {
									if (dd.classifyId == ddd.id) {
										dd.classifyName = ddd.classifyName
									}
								});
								dd.nickName = this.yu.getCache('nickName')
								this.createHelpOrderList.push(dd);
								console.log('订单', this.createHelpOrderList)
							});
						}
						if (res.data.list.length === this.SendLimit) {
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
				});
			},
			// 跑腿订单
			getRunHelpOrder(type) {
				let getData = {
					userId: this.userId,
					status: this.RunStatus,
					page: this.RunPage,
					limit: this.RunLimit
				}
				this.loadingType = 1;
				this.yu.request('/help/selectRunHelpOrder', 'GET', getData).then(res => {
					if (res.code === 0) {
						if (this.RunPage === 1) {
							this.runHelpOrderList = [];
						}
						uni.hideLoading();
						if (res.data.list) {
							res.data.list.forEach(dd => {
								if(dd.phone.length == 11) {
									dd.phone_ = this.geTel(dd.phone)
								} else{
									dd.phone_ = dd.phone
								}
								this.ClassIfyList.forEach(ddd => {
									if (dd.classifyId == ddd.id) {
										dd.classifyName = ddd.classifyName
										return;
									}
								});
								this.runHelpOrderList.push(dd);
							});
						}
						if (res.data.list.length === this.RunLimit) {
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
				});
			},
			geTel(tel){
			   return tel.substring(0, 3)+"****"+tel.substr(tel.length-4);
			},
			delDemandModel(helpOrderId, content, index) {
				uni.showModal({
					title: '温馨提示',
					content: '确认要删除“' + content + '”订单吗？',
					confirmColor: '#FF3530',
					success: (res) => {
						if (res.confirm) {
							this.delDemand(helpOrderId, index);
						}
					}
				});
			},
			delDemand(helpOrderId, index) {
				this.yu.request('/help/deleteHelpOrder', 'POST', {}, {
					helpOrderId
				}).then(ress => {
					if (ress.code === 0) {
						this.yu.toast('删除成功!', 'success', 1500);
						this.createHelpOrderList.splice(index, 1)
					}
				});
			},
			perfectDemand(item) {
				uni.navigateTo({
					url: '/pages/order/release?type=hasEdit&id=' + item.id + '&content=' + item.content +
						'&site=' + item.site +
						'&phone=' + item.phone + '&deliveryTime=' + item.deliveryTime + '&classifyId=' + item
						.classifyId +
						'&classifyName=' + item.classifyName + '&userType=' + item.userType + '&commission=' + item
						.commission
				});
			},
			goDetail(helpOrderId) {
				uni.navigateTo({
					url: "/pages/order/runDetail?helpOrderId=" + helpOrderId
				})
			},
			goDetailCreate(id) {
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
					url: '/pages/index/taskDetail?helpOrderId=' + id
				})
			},
			Gophone(item){
				uni.makePhoneCall({
					phoneNumber: item.phone
				});
			},
			endTask(item){
				let that = this;
				uni.showModal({
					title: '温馨提示',
					content: '取消订单将会扣除您的信誉分，确认取消订单吗？',
					showCancel: true,
					cancelText: '取消',
					confirmText: '确认',
					success: res => {
						if(res.confirm){
							that.$queue.showLoading('取消中...');
							that.$Request.postT('/help/endHelpTake?id=' + item.helpTakeId).then(res =>{
								if(res.code === 0){
									that.$queue.showToast('取消成功!');
									uni.hideLoading();
									that.RunPage = 1;
									that.RunStatus = 1;
									that.getRunHelpOrder();
								}else{
									that.$queue.showToast(res.msg);
								}
							})
						}
					}
				});
			},
			sureService(item) {
				uni.navigateTo({
					url: "/pages/member/checkService?helpOrderId=" + item.helpOrderId + "&helpTakeId=" + item
						.helpTakeId
				})
			},
			orderLogin() {
				this.$queue.setData('href', '/pages/order/index');
				uni.navigateTo({
					url: "/pages/public/login"
				});
			}
		},
		onReachBottom: function() {
			let menuIndex = this.menuIndex;
			switch (menuIndex) {
				case 0: //派送中
					this.SendPage = this.SendPage + 1;
					this.getCreateHelpOrder();
					break;
				case 1: //已完成
					this.RunPage = this.RunPage + 1;
					this.getRunHelpOrder();
					break;
			}
		},
		onPullDownRefresh: function() {
			let menuIndex = this.menuIndex;
			switch (menuIndex) {
				case 0:
					this.SendPage = 1;
					this.getCreateHelpOrder('refresh');
					break;
				case 1:
					this.RunPage = 1;
					this.getRunHelpOrder('refresh');
					break;
			}
		}
	}
</script>

<style lang="scss">
	page {
		width: 100%;
	}

	.container {
		width: 100%;

		.header {
			width: 100%;
			height: 156upx;
			background-color: #FFF;
			position: fixed;
			z-index: 99;

			.menuTab {
				width: 100%;
				height: 78upx;
				display: flex;

				.menuTab-item {
					width: 50%;
					background-color: #FFF;
					font-size: 32upx;
					font-weight: bold;
					color: #333333;
					text-align: center;
					line-height: 78upx;
				}

				.active {
					background: #F7F6FD;
				}
			}

			.navbar {
				width: 100%;
				height: 78upx;
				background: #FFF;
				padding-top: 10upx;
				display: flex;
				align-items: center;
				justify-content: space-around;

				.nav-item {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;

					.txt {
						font-size: 32upx;
						font-weight: 500;
						color: #666666;
					}

					.active_txt {
						font-size: 32upx;
						font-family: PingFang SC;
						font-weight: bold;
						color: #333333;
					}

					.line {
						width: 60upx;
						height: 8upx;
						border-radius: 4upx;
						margin-top: 10upx;
					}

					.active_line {
						background: #FF3530;
					}
				}
			}
		}

		.main {
			padding: 176upx 20upx 0;

			.card-box-order {
				.list-item {
					background: #FFFFFF;
					border-radius: 20upx;
					padding: 30upx;
					margin-bottom: 20upx;

					.title {
						display: flex;
						align-items: center;
						justify-content: space-between;
						border-bottom: 1upx solid #E6E6E6;
						padding-bottom: 20upx;

						.status {
							font-size: 28upx;
							font-weight: bold;
							color: #FF3530;
						}

						.nickName {
							font-size: 28upx;
							font-weight: 500;
							color: #666666;
						}
					}

					.info-wrap {
						.express {
							padding-top: 30upx;
							padding-bottom: 20upx;
							font-size: 32upx;
							line-height: 32upx;
							font-weight: bold;
							color: #333333;
						}

						.tag-box {
							display: flex;
							margin-bottom: 20upx;

							.tag-item {
								display: inline-block;
								height: 38upx;
								line-height: 38upx;
								border-radius: 5upx;
								padding: 0 13upx;
								margin-right: 10upx;
							}

							.tag-item-blue {
								background: #D9EDFF;
								color: #66A6FF;
							}

							.tag-item-orange {
								background: #FFE8D9;
								color: #FF7D26;
							}

							.tag-item-pink {
								background: #FFD9D9;
								color: #FF6666;
							}

							.tag-item-green {
								background: #D9FFFB;
								color: #17D2BD;
							}
						}

						.times {
							font-size: 28upx;
							font-weight: 500;
							color: #666666;
							margin-bottom: 20upx;
						}

						.code {
							display: flex;
							justify-content: space-between;

							.ma {
								font-size: 28upx;
								font-weight: 500;
								color: #666666;
							}

							.pay {
								font-size: 24upx;
								font-weight: 500;
								color: #666666;

								text {
									color: #333333;
									font-size: 32upx;
								}
							}
						}

						.btn-wrap {
							display: flex;
							justify-content: flex-end;
							margin-top: 25upx;

							.btn {
								width: 150upx;
								height: 46upx;
								line-height: 42upx;
								text-align: center;
								margin-left: 20upx;
								font-size: 24upx;
								border-radius: 25px;
							}

							.delete {
								color: #333333;
								border: 2upx solid #999999;
							}

							.demand {
								color: #FFFFFF;
								border: 2upx solid #FF3530;
								background: #FF3530;
							}
						}
					}
				}

				.list-item:last-child {
					margin-bottom: 0;
				}
			}

			.card-box-run {
				.list-item {
					background: #FFFFFF;
					border-radius: 20upx;
					padding: 30upx;
					margin-bottom: 20upx;

					.title {
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding-bottom: 20upx;

						.date {
							display: flex;
							align-items: center;

							image {
								width: 30upx;
								height: 32upx;
							}

							.txt {
								font-size: 28upx;
								font-weight: bold;
								color: #FF3530;
								margin-left: 10upx;
							}
						}

						.status {
							font-size: 32upx;
							font-weight: 800;
							color: #FF3530;

							text {
								font-size: 24upx;
							}
						}
					}

					.info-wrap {
						.steps-box {
							display: flex;

							.left {
								padding: 30upx 0;
								display: flex;
								flex-direction: column;
								justify-content: space-between;
								position: relative;

								.round {
									width: 20upx;
									height: 20upx;
									background: #CCCCCC;
									border-radius: 50%;
									z-index: 2;
								}

								.vertical-line {
									width: 2upx;
									height: 140upx;
									background: #D9D9D9;
									position: absolute;
									left: 9upx;
									top: 40upx;
									z-index: 1;
								}
							}

							.right {
								margin-left: 10upx;

								.text {
									display: flex;
									font-size: 32upx;
									align-items: center;
									height: 80upx;
								}

								.distance {
									font-size: 28upx;
									font-family: PingFang SC;
									font-weight: 500;
									color: #999999;
									height: 58upx;
									line-height: 58upx;
								}
							}
						}

						.contact-person {
							display: flex;
							align-items: center;
							padding: 0 30upx;
							margin: 20upx 0 10upx;

							.nickName {
								font-size: 28upx;
								font-weight: 500;
								color: #666666;
							}

							.moblie {
								font-size: 28upx;
								font-weight: 500;
								color: #FF3530;
							}
						}

						.btn-wrap {
							display: flex;
							justify-content: flex-end;

							.btn {
								width: 200upx;
								height: 60upx;
								background: #FF3530;
								border-radius: 30upx;
								font-size: 28upx;
								font-weight: bold;
								line-height: 60upx;
								text-align: center;
								color: #FFFFFF;
							}
						}
					}
				}
			}
		}
	}
</style>
