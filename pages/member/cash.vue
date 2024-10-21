<template>
	<view class="cash">
		<!-- background-image: url(../../static/img/my/cashbackground.png);background-size: 100%; -->
		<view style="height: 400upx;position: relative;">
			<image class="cas1" src="../../static/img/my/cashbackground.png"></image>
			<view class="cas2">
				<view style="font-size: 16px;color: #FFFFFF;padding-top: 100upx;">可提现总额</view>
				<view style="font-size: 29px;color: #FFFFFF;padding-top: 20upx;">¥ {{mayMoney}}</view>
				<view style="width: 90%;height: max-content;margin-left: 40upx;background-color: #FFFFFF;box-shadow: rgba(183, 183, 183, 0.3) 0px 1px 10px;margin-top: 50upx;border-radius: 20upx;">
					<view style="display: flex;flex-direction: row;padding: 20upx;">
						<view style="font-size: 16px;color: #333333;">提现金额</view>
						<view style="font-size: 11px;color: #333333;margin-left: 20upx;margin-top: 10upx;">{{min}}{{value}}元</view>
					</view>
					<view style="display: flex;flex-direction: row;padding: 20upx;">
						<view style="font-size: 14px;color: #333333;">¥</view>
						<input type="number" v-model="money" placeholder="请输入金额" style="font-size: 14px;color: #333333;text-align: left;margin-left: 10upx;width: 100%;" />
					</view>
					<view style="background: #E6E6E6;width: 100%;height: 1upx;"></view>
				
					<view style="display: flex;flex-direction: row;flex-wrap: wrap;">
						<view style="display: flex;flex-direction: row;" v-for="(item, index) in moneyList" :key="index">
							<view>
								<view style="padding: 20upx;" @click="getOut1(item.money)">
									<view style="padding-top: 40upx;width: 180upx; height: 120upx;background-color: #FFFFFF;border:1px solid #FF332F;border-radius: 10upx;">
										{{ item.money }}
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view @click="getOut" v-if="mayMoney !== '0'" style="margin: 32upx;font-size: 18px;background: #e64340;color: white;border-radius: 10px;height: 40px;line-height: 40px">
					提现
				</view>
				
				<view style="display: flex;width: 100%;justify-content: center;">
					<view style="color: grey;padding-bottom: 30px;padding-top: 20upx;flex: 1;" @click="goZhifuBao">提现账号</view>
					<view style="color: grey;padding-bottom: 30px;padding-top: 20upx;flex: 1;" @click="list">提现记录</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				money: '',
				zhifubao: '',
				mayMoney: '0',
				zhifubaoName: '',
				moneyList: [],
				value: 0,
				min: ''
			};
		},
		onShow: function(e) {
			this.getMoney();
			this.getMoneyClassifyList();
			this.getasdas();
		},
		onNavigationBarButtonTap() {
			this.list();
		},
		methods: {
			getasdas() {
				this.$Request.getT('/common/type/87').then(res => {
					if (res.code === 0) {
						this.min = res.data.min;
						this.value = res.data.value;
					}
				});
			},
			getMoneyClassifyList() {
				this.$Request.getT('/cashClassify/selectCashClassifyList').then(res => {
					if (res.code === 0) {
						this.moneyList = [];
						res.data.forEach(d => {
							this.moneyList.push(d);
						});
					}
				});
			},
			list() {
				uni.navigateTo({
					url: '/pages/member/cashList'
				});
			},
			goZhifuBao() {
				uni.navigateTo({
					url: '/pages/member/zhifubao'
				});
			},
			getMoney() {
				let that = this;
				let token = this.$queue.getData('token');
				let userId = this.$queue.getData('userId');
				if (token) {
					//this.$queue.showLoading("加载中...");
					//可以提现金额查询预估收入查询
					this.$Request.getT('/userMoney/selectUserMoney?userId=' + userId).then(res => {
						if (res.code === 0 && res.data) {
							that.mayMoney = res.data.money;
						} else if (res.code === -102) {
							this.$queue.showToast(res.msg);
							this.$queue.logout();
							uni.navigateTo({
								url: '/pages/public/login'
							});
						} else {
							that.mayMoney = '0';
							//this.$queue.showToast(res.msg);
						}
					});
					this.$Request.postT('/app/selectUserById?userId=' + userId).then(res => {
						if (res.code === 0 && res.data) {
							that.zhifubao = res.data.zhifubao;
							that.zhifubaoName = res.data.zhifubaoName;
						}
						uni.hideLoading();
					});
				}
			},
			getOut() {
				let that = this;
				let token = this.$queue.getData('token');
				let userId = this.$queue.getData('userId');
				if (token) {
					if (that.zhifubao && that.zhifubaoName) {
						if (!/^\d+$/.test(this.money)) {
							uni.showToast({
								icon: 'none',
								title: '请输入正确金额,不能包含中文,英文,特殊字符和小数'
							});
							return;
						}
						if (parseFloat(this.money).toFixed(1) >= this.value) {
							uni.showModal({
								title: '提现申请提示',
								content: '请仔细确认收款人信息\n\n姓名:' + that.zhifubaoName + '\t\t金额:' + this.money + '\n\n收款账号：' + that.zhifubao + '',
								success: e => {
									if (e.confirm) {
										this.$queue.showLoading('提现中...');
										this.$Request.postT('/userMoney/cashMoney?userId=' + userId + '&money=' + this.money).then(res => {
											if (res.code === 0) {
												that.$queue.showToast('提现申请成功，预计三个工作日到账');
												that.getMoney();
											} else {
												uni.showModal({
													title: '温馨提示',
													content: res.msg,
													showCancel: false,
													cancelText: '取消',
													confirmText: '确认'
												});
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
			},
			getOut1(money) {
				let that = this;
				let token = this.$queue.getData('token');
				let userId = this.$queue.getData('userId');
				if (token) {
					if (that.zhifubao && that.zhifubaoName) {
						if (parseFloat(money).toFixed(1) >= 10) {
							uni.showModal({
								title: '提现申请提示',
								content: '请仔细确认收款人信息\n\n姓名:' + that.zhifubaoName + '\t\t金额:' + money + '\n\n收款账号：' + that.zhifubao + '',
								success: e => {
									if (e.confirm) {
										this.$queue.showLoading('提现中...');
										this.$Request.postT('/userMoney/cashMoney?userId=' + userId + '&money=' + money).then(res => {
											if (res.code === 0) {
												that.$queue.showToast('提现申请成功，预计三个工作日到账');
												that.getMoney();
											} else {
												uni.showModal({
													title: '温馨提示',
													content: res.msg,
													showCancel: false,
													cancelText: '取消',
													confirmText: '确认'
												});
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

<style lang="less">
	@import '../../static/css/index.css';

	.view2-view-text {
		font-size: 14px;
		color: #000000;
		margin-left: 20upx;
		width: 80%;
	}

	.view2-view-image-right {
		width: 18upx;
		height: 30upx;
		margin-left: 50upx;
	}

	.cash {
		text-align: center;
		background: white;
		height: 100%;
		position: absolute;
		width: 100%;
		.cas1{
			width: 750upx;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 10;
		}
		.cas2{
			position: absolute;
			top: 0;
			left: 0;
			z-index: 20;
		}
		.cash-top {
			padding: 32upx 32upx 50upx 32upx;
			/* border-bottom: 1px solid gainsboro; */
			background: #e10a07;
		}

		.leiji {
			font-size: 14px;
			color: #ffffff;
			margin-bottom: 10px;
		}
	}
</style>
