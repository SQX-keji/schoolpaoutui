<template>
	<view class="container" style="padding-bottom: 150upx;">
		<view class="main">
			<view class="user-card">
				<view class="user-card-top">
					<image class="img" :src="info.user.imageUrl ? info.user.imageUrl : '../../static/img/logo.png'">
					</image>
					<view class="right">
						<view class="first-row">
							<text class="nickName">{{info.user.nickName}}</text>
							<view class="icon-wrap">
								<image @tap='complaint(info)' src="../../static/img/home/jubao.png"></image>
								<!-- <image @tap='goMessage()' src="../../static/img/home/news.png"></image> -->
								<image v-if="isJieDanUser" @tap='callContact(info.user.phone)'
									src="../../static/img/home/phone.png"></image>
							</view>
						</view>
						<view class="last-row">
							<text>{{info.createTime}}</text>
							<!-- <text class="line">|</text> -->
							<!-- <text>{{info.user.address}}</text> -->
						</view>
					</view>
				</view>
				<view class="user-card-bottom">
					<view class="first-row">
						<text class="tit">{{info.content}}</text>
						<text class="zhuan" v-if="info.commission">赚￥{{info.commission?info.commission:'0'}}</text>
					</view>
					<view class="tag-box">
						<view class='tag-item'
							:class="{'tag-item-orange': info.userType == 0, 'tag-item-blue': info.userType == 1 , 'tag-item-pink': info.userType == 2}">
							{{person}}</view>
						<view class='tag-item tag-item-orange' v-if="info.classifyName">{{info.classifyName}}</view>
						<view class='tag-item tag-item-green' v-if="status">{{status}}</view>
						<!-- info.status == 1 ? '待审核' : info.status == 2 ? '待接单' : info.status == 3 ? '待送达' : info.status == 4 ? '已完成' :'' -->
					</view>
				</view>
			</view>
			<view class="schedule-card">
				<view class="tit">
					<image class="positioning" src="../../static/img/home/1.png"></image>
					<text>{{info.site}}</text>
				</view>
				<view class="steps-box-bar">
					<view class="title">
						<text>完成时间/进度</text>
						<text class="date">{{info.deliveryTime}}</text>
					</view>
					<tui-steps :items="items" :type="2" spacing="250rpx" deactiveColor='#333333' activeColor='#FF7D26'
						:activeSteps="activeSteps"></tui-steps>
				</view>
			</view>
			
			<view v-if="info.status === 3 && info.helpTake && info.helpTake.user && !isMyOrder && imageList.length > 0">
				<shmily-drag-image :list.sync="imageList" :select="false"></shmily-drag-image>
			</view>
			
			<view v-if="isMyOrder && imageList.length > 0">
				<shmily-drag-image :list.sync="imageList" :select="false"></shmily-drag-image>
			</view>

			<view class="contact-user-card"
				v-if="info.status > 2 && info.status < 5 && info.helpTake && info.helpTake.user">
				<view class="tit">接单跑腿</view>
				<view class="user-card-top">
					<image class="img" :src="info.helpTake.user.imageUrl"></image>
					<view class="right">
						<view class="nickName">{{info.helpTake.user.nickName}}</view>
						<view class="last-row">
							<text class="deta">{{info.helpTake.createTime}}</text>
							<!-- <text class="line">|</text> -->
							<!-- <text>西安电子科技大学</text> -->
						</view>
					</view>
				</view>
				<view class="contact">
					<text>联系跑腿</text>
					<text class="num" @tap='callContact(info.helpTake.user.phone)' >{{info.helpTake.user.phone_}}</text>
				</view>
			</view>
		</view>
		<view class="grab-an-order" @tap="grabAnOrder(info.id)"
			v-if="((info.status == 1 || info.status == 2) && isMyOrder == false) && isLogin">
			<image src="../../static/img/home/grab-an-order.png"></image>
		</view>
	</view>
</template>

<script>
	import shmilyDragImage from '@/components/shmily-drag-image/shmily-drag-image.vue'
	export default {
		components: {
			shmilyDragImage
		},
		data() {
			return {
				// 页面信息
				info: {
					classifyName: '',
					user: {
						imageUrl: "",
						phone: ""
					},
					helpTake: {
						createTime: "",
						user: {
							imageUrl: "",
							nickName: "",
							phone: ""
						}
					}
				},
				items: [{
						title: "待接单",
					},
					{
						title: "派送中",
					},
					{
						title: "已送达",
					},
				],
				imageList: [],
				isJieDanUser: false,
				activeSteps: -1,
				helpOrderId: '',
				isMyOrder: false,
				isLogin: false
			}
		},
		computed: {
			status() {
				let status = this.info.status
				if (status == 1) {
					return '待审核'
				} else if (status == 2) {
					return '待接单'
				} else if (status == 3) {
					return '待送达'
				} else if (status == 4) {
					return '已完成'
				} else {
					return ''
				}
			},
			person() {
				let person = this.info.userType
				if (person == 0) {
					return '不限'
				} else if (person == 1) {
					return '限男生'
				} else if (person == 2) {
					return '限美女'
				} else {
					return ''
				}
				// {{info.userType == 0 ? '不限' : info.userType == 1 ? '限男生' : info.userType == 2 ? '限美女' : ''}}
			},
		},
		onLoad(e) {
			console.log(e)
			let helpOrderId = e.helpOrderId;
			this.helpOrderId = e.helpOrderId;
			this.initHelpOrder(helpOrderId);

		},
		onShow() {
			this.isLogin = this.yu.isLogin();
		},
		methods: {
			initHelpOrder(helpOrderId) {
				this.$queue.showLoading('加载中...');
				let that = this;
				this.yu.request('/help/selectHelpOrderDetails', 'GET', {
					helpOrderId
				}).then((res) => {
					if (res.code == 0) {
						if (res.data.image) {
							that.imageList = res.data.image.split(",");
							console.log("this.imageList——————————：" + that.imageList)
						}
						this.yu.request('/helpClassify/selectClassifyList', 'GET').then(ress => {

							if (ress.code === 0) {
								let myUserId = this.yu.getCache('userId');
								this.info = res.data;
								console.log('res.data', res.data)
								if (res.data.user) {
									if (res.data.user != null) {
										console.log(1)
										this.info.user.imageUrl = res.data.user.imageUrl ? res.data.user
											.imageUrl : '/static/img/logo.png';
									} else {
										console.log(12)
									}

									this.info.user.phone = res.data.user.phone;
									if (res.data.user.userId == myUserId) {
										this.isMyOrder = true;
									} else {
										this.isMyOrder = false;
									}
								}
								if (res.data.helpTake && res.data.helpTake.user) {
									this.info.helpTake.user.phone_ = this.geTel(this.info.helpTake.user.phone)
									this.info.helpTake.user.imageUrl = res.data.helpTake.user.imageUrl ?
										res.data.helpTake.user.imageUrl :
										'/static/img/logo.png';
									if (res.data.helpTake.userId == myUserId) {
										this.isJieDanUser = treue;
									}
								}
								ress.data.forEach(ddd => {
									if (res.data.classifyId == ddd.id) {
										this.info.classifyName = ddd.classifyName
									}
								});
							}
						});
						switch (res.data.status) {
							case 1: //待审核
								this.activeSteps = -1;
								break;
							case 2: //待接单
								this.activeSteps = 0;
								break;
							case 3: //待送达
								this.activeSteps = 1;
								break;
							case 4: //已完成
								this.activeSteps = 2;
								break;
						}
						uni.hideLoading();
					}else{
						this.$queue.showToast('已超时！');
						setTimeout(d=>{
							uni.hideLoading();
							uni.navigateBack();
						},1000);
					}
				});
			},
			geTel(tel){
			   return tel.substring(0, 3)+"****"+tel.substr(tel.length-4);
			},
			grabAnOrder(orderId) {
				this.$queue.showLoading('抢单中...');
				let postData = {
					userId: this.yu.getCache('userId'),
					orderId: orderId,
				};
				this.yu.request('/help/saveHelpTake', 'POST', postData).then(res => {
					uni.hideLoading();
					if (res.code === 0) {
						this.yu.toast('抢单成功!', 'success', 1500, () => {
							this.initHelpOrder(this.helpOrderId);
						});
					} else {
						this.yu.toast(res.msg);
					}
				});
			},
			complaint(info) {
				console.log(info)
				let isLogin = this.yu.isLogin();
				if (isLogin) {
					uni.navigateTo({
						url: "/pages/index/complaint?helpTaskId=" + info.id
					});
				} else {
					this.goLogin();
				}
			},
			goMessage: function() {
				let isLogin = this.yu.isLogin();
				if (isLogin) {
					uni.navigateTo({
						url: '/pages/task/renwu'
					});
				} else {
					this.goLogin();
				}
			},
			callContact(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				});
			},
			goLogin() {
				this.yu.setCache('href', '/pages/index/taskDetail?helpOrderId=' + this.helpOrderId);
				uni.navigateTo({
					url: '/pages/public/login'
				});
			},
		}
	}
</script>

<style lang="scss">
	page {
		width: 100%;
	}

	.container {
		width: 100%;

		.main {
			padding: 20upx 20upx 0;

			.user-card {
				background: #FFFFFF;
				border-radius: 20upx;

				.user-card-top {
					padding: 30upx;
					display: flex;
					border-bottom: 1upx solid #E6E6E6;

					.img {
						width: 100upx;
						height: 100upx;
						border-radius: 50%;
					}

					.right {
						flex: 1;
						margin-left: 20upx;
						padding-top: 14upx;
						padding-bottom: 14upx;
						display: flex;
						flex-direction: column;
						justify-content: space-between;

						.first-row {
							display: flex;
							justify-content: space-between;

							.nickName {
								font-size: 28upx;
								font-weight: bold;
								color: #333333;
							}

							.icon-wrap {
								display: flex;
								margin-top: -18upx;

								image {
									width: 44upx;
									height: 44upx;
									margin-left: 20upx;
								}
							}
						}

						.last-row {
							font-size: 24upx;
							font-weight: 500;
							color: #666666;
							display: flex;
							align-items: center;

							.line {
								margin: 0 10upx;
							}
						}
					}
				}

				.user-card-bottom {
					padding: 30upx;

					.first-row {
						display: flex;
						justify-content: space-between;

						.tit {
							font-size: 32upx;
							font-weight: 800;
							color: #333333;
						}

						.zhuan {
							font-size: 28upx;
							font-weight: 800;
							color: #FF3530;
						}
					}

					.tag-box {
						display: flex;
						margin-top: 20upx;

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
				}
			}

			.schedule-card {
				background-color: #FFF;
				border-radius: 20upx;
				margin-top: 20upx;

				.tit {
					display: flex;
					align-items: center;
					height: 104upx;
					padding: 0 30upx;
					border-bottom: 1upx solid #E6E6E6;

					.positioning {
						width: 32upx;
						height: 44upx;
					}

					text {
						margin-left: 20upx;
						font-size: 32upx;
					}
				}

				.steps-box-bar {
					padding: 30upx;

					.title {
						font-size: 28upx;
						font-weight: bold;
						color: #666666;
						display: flex;
						justify-content: space-between;
						padding: 0 30upx 30upx;

						.date {
							font-size: 28upx;
							font-weight: bold;
							color: #FF3530;
						}
					}
				}

			}

			.contact-user-card {
				background: #FFFFFF;
				border-radius: 20upx;
				margin-top: 20upx;

				.tit {
					line-height: 80upx;
					height: 80upx;
					padding: 0 30upx;
					font-size: 32upx;
					font-weight: bold;
					color: #333333;
					border-bottom: 1upx solid #E6E6E6;
				}

				.user-card-top {
					padding: 30upx;
					display: flex;

					.img {
						width: 100upx;
						height: 100upx;
						border-radius: 50%;
					}

					.right {
						flex: 1;
						margin-left: 20upx;
						padding-top: 14upx;
						padding-bottom: 14upx;
						display: flex;
						flex-direction: column;
						justify-content: space-between;

						.nickName {
							font-size: 28upx;
							font-weight: bold;
							color: #333333;
						}

						.last-row {
							font-size: 24upx;
							font-weight: 500;
							color: #666666;
							display: flex;
							align-items: center;

							.deta {
								font-size: 24upx;
								color: #FF3530;
							}

							.line {
								margin: 0 10upx;
							}
						}
					}
				}

				.contact {
					font-size: 28upx;
					font-weight: bold;
					color: #666666;
					height: 87upx;
					line-height: 87upx;
					padding: 0 30upx;
					border-top: 1upx solid #E6E6E6;
					display: flex;
					justify-content: space-between;

					.num {
						font-size: 28upx;
						font-weight: bold;
						color: #FF3530;
					}
				}
			}
		}

		.grab-an-order {
			width: 150upx;
			height: 150upx;
			border-radius: 50%;
			position: fixed;
			right: 5%;
			bottom: 5%;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
