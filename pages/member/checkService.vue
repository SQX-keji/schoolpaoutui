<template>
	<view class="container">
		<view class="main">
			<view class="box">
				<view class="input-item-wrap">
					<view class="input-wrap">
						<input class="input" placeholder-class="phcolor-input" type="text" v-model="code" placeholder="请输入收货码" />
					</view>
				</view>
				<view class="btn-wrap">
					<button @tap="sureSend" class="btn" type="button">确认送达</button>
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
				code: "",
				helpTakeId:'',
				helpOrderId:''
				
			}
		},
		onLoad(e) {
			this.helpTakeId = e.helpTakeId;
			this.helpOrderId = e.helpOrderId;
		},
		methods: {
			sureSend: function() {
				this.$queue.showLoading('提交中...');
				//表单规则
				let that = this;
				let userId = that.yu.getCache('userId');
				let rules = [{
					name: "code",
					rule: ["required"],
					msg: ["请输入收货码"]
				}]
				//进行表单检查
				let formData = {
					code: that.code,
					helpTakeId: that.helpTakeId,
					helpOrderId: that.helpOrderId
				};
				let checkRes = form.validation(formData, rules); 
				if (!checkRes) {
					that.yu.request('/help/closeOrder', "POST", {}, formData).then(res => {
						console.log(res)
						if(res.code === 0){
							this.yu.toast('送达成功!','success',1500,()=>{
								setTimeout(()=>{
									uni.hideLoading();
									uni.navigateBack();
								},1500);
							});
						}else{
							uni.hideLoading();
							this.$queue.showToast(res.msg)
						}
					});
				} else {
					uni.hideLoading();
					uni.showToast({
						title: checkRes,
						icon: "none"
					});
				}
			}
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
