<template>
	<view class="container" style="padding-bottom: 150upx;">
		<view class="main">
			<view class="tit" v-if="info.status == 3">订单派送中...</view>
			<view class="tit" v-if="info.status == 4">订单已送达</view>
			<view class="list-item">
				<view class="title">
					<view class="date">
						<image src="../../static/img/order/clock.png"></image>
						<text class="txt">{{info.deliveryTime}}</text>
					</view>
					<view class="status">{{info.helpTake.money}}<text>元</text></view>
				</view>
				<view class="info-wrap">
					<view class="steps-box">
						<view class="left">
							<view class="round top"></view>
							<view class="vertical-line"></view>
							<view class="round bottom"></view>
						</view>
						<view class="right">
							<view class="text">{{info.content}}</view>
							<view class="distance"></view>
							<view class="text">
								<image class="Positioning" src="../../static/img/home/1.png"></image>
								<text>{{info.site}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="steps-box-bar">
				<tui-steps :items="items" :type="2" spacing="240rpx" deactiveColor='#333333' activeColor='#FF7D26'
					:activeSteps="activeSteps"></tui-steps>
			</view>
			<view v-if="info.status == 3 && imageList.length > 0">
				<shmily-drag-image :list.sync="imageList" :select="false"></shmily-drag-image>
			</view>
			<view class="info-box">
				<view class="info-item">
					<text class="tit">期望时间</text>
					<text>{{info.deliveryTime}}</text>
				</view>
				<view class="info-item">
					<text class="tit">订单编号</text>
					<text>{{info.orderNo}}</text>
				</view>
				<view class="info-item">
					<text class="tit">接单时间</text>
					<text>{{info.helpTake.createTime}}</text>
				</view>
				<view class="info-item" v-if="info.user">
					<text class="tit">联系Ta</text>
					<image @tap="callContact(info.user.phone)" src="../../static/img/home/phone.png"
						style="width: 50upx;height: 50upx;"></image>
				</view>
			</view>
			<view style="background-color: #e5e5e5;height: 3rpx;" v-if="info.status == 3"></view>
			<view style="display: flex;text-align: center;background: #FFFFFF;" v-if="info.status == 3">
				<view style="flex: 1;height: 98upx;line-height: 98upx;font-size:32upx;font-weight: 800;" @tap="endTask">
					取消订单</view>
				<view style="background-color: #e5e5e5;width: 3rpx;"></view>
				<view style="flex: 1;height: 98upx;line-height: 98upx;font-size:32upx;font-weight: 800;"
					@tap="sureService">确认送达</view>
			</view>
			<!-- <view class="release" @tap="goRelease">
				<image src="../../static/img/home/phone.png" style="width: 100upx;height: 100upx;"></image>
				<view style="margin-top: 10upx;">联系Ta</view>
			</view> -->
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
				items: [{
					title: "派送中",
				}, {
					title: "已送达",
				}],
				imageList: [],
				activeSteps: 1,
				helpOrderId: 0,
				info: {
					helpTake: {}
				}
			}
		},
		onLoad(e) {
			let helpOrderId = e.helpOrderId;
			this.helpOrderId = e.helpOrderId;
			this.initHelpOrder(helpOrderId);
		},
		onShow() {
			if (this.helpOrderId != 0) {
				this.initHelpOrder(this.helpOrderId);
			}
		},
		methods: {
			sureService() {
				uni.navigateTo({
					url: "/pages/member/checkService?helpOrderId=" + this.helpOrderId + "&helpTakeId=" + this
						.info.helpTakeId
				})
			},
			endTask() {
				let that = this;
				uni.showModal({
					title: '温馨提示',
					content: '取消订单将会扣除您的信誉分，确认取消订单吗？',
					showCancel: true,
					cancelText: '取消',
					confirmText: '确认',
					success: res => {
						if (res.confirm) {
							that.$queue.showLoading('取消中...');
							that.$Request.postT('/help/endHelpTake?id=' + that.info.helpTakeId).then(res => {
								if (res.code === 0) {
									that.$queue.showToast('取消成功!');
									uni.hideLoading();
									uni.navigateBack();
								} else {
									that.$queue.showToast(res.msg);
								}
							})
						}
					}
				});
			},
			callContact(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				});
			},
			initHelpOrder(helpOrderId) {
				this.yu.request('/help/selectHelpOrderDetails', 'GET', {
					helpOrderId
				}).then((res) => {
					if (res.code == 0) {
						console.log(res)
						if (res.data.image) {
							this.imageList = res.data.image.split(",");
							console.log("this.imageList——————————：" + this.imageList)
						}
						this.info = res.data
						switch (res.data.status) {
							case 3: //待送达
								this.activeSteps = 0;
								break;
							case 4: //已完成
								this.activeSteps = 1;
								break;
						}
					}
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
			padding: 0 20upx 0;

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

			.tit {
				height: 95upx;
				font-size: 38upx;
				line-height: 95upx;
				font-weight: 500;
				color: #333333;
				padding: 0 10upx;
			}

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
					background-color: #FFF;

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

								.Positioning {
									width: 32upx;
									height: 44upx;
								}

								text {
									margin-left: 10upx;
								}
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
				}
			}

			.steps-box-bar {
				background-color: #FFF;
				padding: 30upx 0;
				border-radius: 10upx;
			}

			.info-box {
				background-color: #FFF;
				padding: 10upx 30upx 10upx;
				border-radius: 10upx;
				margin-top: 20upx;

				.info-item {
					height: 66upx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					font-size: 28upx;
					font-weight: 500;
					color: #666666;

					.tit {
						font-size: 28upx;
						color: #333333;
					}
				}
			}

			.release {
				width: 200upx;
				height: 200upx;
				border-radius: 50%;
				color: #000;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				position: fixed;
				right: 5%;
				bottom: 10%;
				z-index: 100;

				.cuIcon-add {
					font-size: 38upx;
					font-weight: bold;
				}
			}
		}
	}
</style>
