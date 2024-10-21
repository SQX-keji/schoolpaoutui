<template>
	<view class="content">
		<view class="view1" style="background-image: url(../../static/img/my/user-bj.png);" > 
			
			<!-- #ifdef MP-WEIXIN -->
			<image class="image" src="../../static/img/my/user-bj.png" mode=""></image>
			<view class="view1 views">
				<view style="font-size: 58upx;color: #FFFFFF;font-weight: 400;"> <text style="font-size: 38upx;">￥</text> {{ money }}</view>
				<view style="font-size: 32upx;color: #FFFFFF;margin-top:30upx;">可用余额</view>
			</view>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<view style="font-size: 58upx;color: #FFFFFF;font-weight: 400;"> <text style="font-size: 38upx;">￥</text> {{ money }}</view>
			<view style="font-size: 32upx;color: #FFFFFF;margin-top:30upx;">可用余额</view>  
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view style="font-size: 58upx;color: #FFFFFF;font-weight: 400;"> <text style="font-size: 38upx;">￥</text> {{ money }}</view>
			<view style="font-size: 32upx;color: #FFFFFF;margin-top:30upx;">可用余额</view>  
			<!-- #endif -->
		 
			
		</view>
		<view class="view2">
			<view class="view2-view" @click="goRecharge">
				<image src="../../static/img/my/recharge.png" class="view2-view-image"></image>
				<view class="view2-view1">
					<view class="view2-view-text">充值</view>
					<text class="right cuIcon-right"></text>
				</view>
			</view>
			<view class="view2-view" @tap="goCash">
				<image src="../../static/img/my/withdrawal.png" class="view2-view-image"></image>
				<view class="view2-view1">
					<view class="view2-view-text">提现</view>
					<text class="right cuIcon-right"></text>
				</view>
			</view>
			<view class="view2-view" @tap="detail">
				<image src="../../static/img/my/moneydetails.png" class="view2-view-image"></image>
				<view class="view2-view1">
					<view class="view2-view-text">资金明细</view>
					<text class="right cuIcon-right"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				money:0
			};
		},
		onShow() {
			let userId = this.$queue.getData('userId');
			if (userId) {
				this.getUserMoney(userId);
			}
		},
		onLoad() {
			let userId = this.$queue.getData('userId');
			if (userId) {
				this.getUserMoney(userId);
			}
		},
		methods: {
			goCash() {
				uni.navigateTo({
					url: '/pages/member/cash'
				});
			},
			goRecharge() {
				uni.navigateTo({
					url: '/pages/task/recharge'
				});
			},
			detail: function() {
				uni.navigateTo({
					url: '/pages/my/moneydetails'
				});
			},
			getUserMoney(userId) {
				this.$Request.getT('/userMoney/selectUserMoney?userId=' + userId).then(res => {
					if (res.code === 0) {
						this.money = res.data.money;
					}
				});
			},
			getOut() {
				let that = this;
				let token = this.$queue.getData('token');
				let userId = this.$queue.getData('userId');
				if (token) {
					if (that.zhifubao && that.zhifubaoName) {
						if (parseFloat(this.money).toFixed(1) >= 10) {
							uni.showModal({
								title: '提现申请提示',
								content: '请仔细确认收款人信息\n\n姓名:' + that.zhifubaoName + '\n\n收款账号：' + that.zhifubao + '',
								success: e => {
									if (e.confirm) {
										this.$queue.showLoading('提现中...');
										this.$Request.getT('/cash/out/' + userId).then(res => {
											if (res.status === 0 && res.data) {
												that.$queue.showToast('提现申请成功，预计三个工作日到账');
												that.getMoney();
											}
											uni.hideLoading();
										});
									}
								}
							});
						} else {
							this.$queue.showToast('提现金额必须大于或等于10元才可提现');
						}
					} else {
						uni.navigateTo({
							url: '/pages/member/zhifubao'
						});
					}
				} else {
					uni.navigateTo({
						url: '/pages/public/login'
					});
				}
			}
		}
	};
</script>

<style>
	.content{position: relative;}
	.view1 {
		width: 100%;
		height: 375upx;
		display: flex;flex-direction: column;justify-content: center;align-items: center;
		/* #ifdef MP-WEIXIN */
		position: relative;
		/* #endif */
		background-size: 100%;
	}
	.views{
		position: absolute;
		top: 0;
		left: 0;
		z-index: 33;
	}
	.image{
		width: 100%;
		height: 375upx;
	}

	.view2 {
		background-color: #ffffff;
		width: 100%;
		height: 300upx;
		margin-top: 20upx;
		padding: 0 34upx 0 40upx;
	}

	.view2-view {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 100upx;
		align-items: center;
	}

	.view2-view1 {
		display: flex;
		flex-direction: row;
		width: 100%;
		justify-content: space-between;
		align-items: center;
	}

	.view2-view-image {
		width: 50upx;
		height: 50upx;
	}

	.view2-view-text {
		font-size: 14px;
		color: #000000;
		margin-left: 20upx;
		width: 80%;
	}

	.view2-view-image-right {
		width: 18upx;
		height: 20upx;
		margin-left: 50upx;
	}
</style>
