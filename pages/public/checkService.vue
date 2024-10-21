<template>
	<view class="container">
		<view class="main">
			<view class="box">
				<view class="input-item-wrap">
					<view class="input-wrap">
						<input class="input" placeholder-class="phcolor-input" type="text" v-model="secretKey" placeholder="请输入收货码" />
					</view>
				</view>
				<view class="btn-wrap">
					<button @tap="writeOff" class="btn" type="button">确认送达</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const form = require("@/common/yu-validation.js")
	export default {
		data() {
			return {
				secretKey: "",
			}
		},
		onLoad() {
			// this.writeOffRecords('','');
		},
		onShow() {
			// this.writeOffRecords('','');
		},
		methods: {
			writeOff: function() {
				//表单规则
				let that = this;
				let userId = that.yu.getCache('userId');
				let rules = [{
					name: "secretKey",
					rule: ["required"],
					msg: ["请输入数字核销码"]
				}]
				//进行表单检查
				let formData = {
					secretKey: that.secretKey
				};
				let merchantId = that.yu.getCache("merchantId");
				let merchantStoreId = that.yu.getCache("merchantStoreId");
				formData.merchantId = merchantId;
				formData.merchantStoreId = merchantStoreId;
				let url = "/orders/confirm";
				let checkRes = form.validation(formData, rules);
				if (!checkRes) {
					that.yu.request(url, "GET", formData).then(res => {
						if (res.status == 0) {
							that.writeOffRecords('', '');
							that.yu.toast(res.data);
						} else {
							that.yu.toast(res.msg);
						}
					});
				} else {
					uni.showToast({
						title: checkRes,
						icon: "none"
					});
				}
			},
			DateChange(e) {
				this.date = e.detail.value
				this.writeOffRecords(this.date, this.date)
			},
			writeOffRecords(startTime, endTime, type) {
				let that = this,
					url = "/orders/findMerchantStoreList",
					merchantStoreId = that.yu.getCache("merchantStoreId"),
					getParams = {
						merchantStoreId: merchantStoreId,
						page: that.page,
						size: that.size,
						startTime: startTime,
						endTime: endTime,
						status: 4
					};
				that.loadingType = 1;
				that.yu.request(url, "GET", getParams).then(res => {
					console.log(res)
					if (res.status === 0) {
						if (that.page === 0 || res.status) {
							that.orderList = [];
						}
						if (res.data.content) {
							res.data.content.forEach(dd => {
								that.orderList.push(dd);
							});
						}
						if (res.data.content.length === that.size) {
							that.loadingType = 0;
						} else {
							that.loadingType = 3;
						}
					} else {
						that.loadingType = 2;
					}
					if (type === "refresh") {
						uni.stopPullDownRefresh(); // 停止刷新
					}
				});

			}
		},
		onReachBottom: function() {
			this.page = this.page + 1;
			this.writeOffRecords();
		},
		onPullDownRefresh: function() {
			this.page = 0;
			this.writeOffRecords('refresh');
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: #F2F2F2;
	}

	.container {
		.main {
			.box {
				width: 100%;
				background: #F2F2F2;
				padding-top: 10upx;
				position: fixed;
				z-index: 999;

				.input-item-wrap {
					display: flex;
					align-items: center;
					justify-content: space-between;
					height: 115upx;
					padding: 0 40upx;
					background-color: #fff;
					border-bottom: 1upx solid #E6E6E6;

					.input-wrap {
						flex: 1;
						.input {
							height: 100%;
							font-size: 38upx;
							color: #333;
							font-weight: bold;
						}
						.phcolor-input {
							font-size: 38upx;
							font-weight: bold;
							color: #CCCCCC;
						}
					}
				}

				.btn-wrap {
					width: 100%;
					height: 148upx;
					background: #FFF;
					padding: 0 20upx;
					display: flex;
					align-items: center;

					.btn {
						width: 100%;
						height: 88upx;
						line-height: 88upx;
						background: #FF2824;
						border-radius: 10upx;
						font-size: 32upx;
						font-weight: bold;
						color: #FFFFFF;
					}
				}
			}
		}
	}
</style>
