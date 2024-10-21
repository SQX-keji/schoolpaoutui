<template>
	<view class="container">
		<view class="wrapper">
			<view class="input-content">
				<view class="cu-form-group" style="border: 2upx solid whitesmoke;margin-bottom: 20px;border-radius: 30px">
					<text class="title">原昵称</text>
					<input type="text" :value="oldnickName" placeholder-class="input-empty" disabled="true" />
				</view>
				<view class="cu-form-group" style="border: 2upx solid whitesmoke;margin-bottom: 20px;border-radius: 30px">
					<text class="title">新昵称</text>
					<input type="text" v-model="nickName" placeholder="请设置新昵称" placeholder-class="input-empty" maxlength="20"
					 minlength="6" />
				</view>
			</view>
			<button class="confirm-btn" @click="updatNickName">修改昵称</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				nickName: '',
				oldnickName: ''
			}
		},
		onLoad() {
			this.oldnickName = this.$queue.getData('nickName');
		},
		methods: {
			updatNickName() {
				var patrn = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、 ]/im;
				if (patrn.test(this.nickName)) { // 如果包含特殊字符返回false
					this.$queue.showToast('包含特殊字符,请重新输入');
					return;
				}
				
				if(!this.nickName){
					this.$queue.showToast('请输入新昵称');
					return;
				}
				
				uni.showLoading({
					title: '提交中...'
				});
				let userId = this.$queue.getData('userId');
				this.$Request.postJson('/app/updateUser?userId=' + userId + '&nickName=' + this.nickName).then(res => {
					uni.hideLoading();
					if (res.code === 0) {
						this.$queue.showToast("更新成功");
						this.yu.setCache('nickName',this.nickName);
						setTimeout(() => {
							uni.navigateBack();
						}, 500);
					}
				});
			},
		},
	}
</script>

<style lang='scss'>
	page {
		background: #fff;
	}

	.send-msg {
		border-radius: 30px;
		color: white;
		height: 30px;
		font-size: 14px;
		line-height: 30px;
		background: #e10a07;
	}

	.container {
		padding-top: 32upx;
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: #fff;
	}

	.wrapper {
		position: relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 20px;
	}

	.back-btn {
		position: absolute;
		left: 20px;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 20px;
		font-size: 20px;
		color: $font-color-dark;
	}

	.left-top-sign {
		font-size: 80px;
		color: $page-color-base;
		position: relative;
	}

	.right-top-sign {
		position: absolute;
		top: 40px;
		right: -15px;
		z-index: 95;

		&:before,
		&:after {
			display: block;
			content: "";
			width: 20px;
			height: 40px;
			background: -moz-linear-gradient(left, #fa4dbe 0, #fbaa58 100%);
			background: -webkit-gradient(linear,
				left top,
				left right,
				color-stop(0, #fa4dbe),
				color-stop(100%, #fbaa58));
			background: -webkit-linear-gradient(left, #fa4dbe 0, #fbaa58 100%);
			background: -o-linear-gradient(left, #fa4dbe 0, #fbaa58 100%);
			background: -ms-linear-gradient(left, #fa4dbe 0, #fbaa58 100%);
			background: linear-gradient(to left, #fa4dbe 0, #fbaa58 100%);
		}

		&:before {
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}

		&:after {
			position: absolute;
			right: -198px;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}

	.left-bottom-sign {
		position: absolute;
		left: -270px;
		bottom: -320px;
		/*border: 100upx solid #d0d1fd;*/
		border-radius: 50%;
		padding: 90px;
	}


	.welcome {
		position: relative;
		left: 30px;
		top: -55px;
		font-size: 28px;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0, 0, 0, .3);
	}

	.input-content {
		padding: 0 20px;
	}

	.input-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 0 30px;
		background: $page-color-light;
		height: 64px;
		border-radius: 4px;
		margin-bottom: 30px;

		&:last-child {
			margin-bottom: 0;
		}

		.tit {
			height: 30px;
			line-height: 28px;
			font-size: $font-sm+2upx;
			color: $font-color-base;
		}

		input {
			height: 40px;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 100%;
		}
	}

	.confirm-btn {
		width: 300px;
		height: 42px;
		line-height: 42px;
		border-radius: 30px;
		margin-top: 40px;
		background: -moz-linear-gradient(left, #F15B6C, #e10a07 100%);
		background: -webkit-gradient(linear, left top, left right, color-stop(0, #F15B6C), color-stop(100%, #e10a07));
		background: -webkit-linear-gradient(left, #F15B6C 0, #e10a07 100%);
		background: -o-linear-gradient(left, #F15B6C 0, #e10a07 100%);
		background: -ms-linear-gradient(left, #F15B6C 0, #e10a07 100%);
		background: linear-gradient(to left, #F15B6C 0, #e10a07 100%);
		color: #fff;
		font-size: $font-lg;

		&:after {
			border-radius: 60px;
		}
	}

	.confirm-btn1 {
		width: 300px;
		height: 42px;
		line-height: 42px;
		border-radius: 30px;
		margin-top: 40px;
		background: whitesmoke;
		color: grey;
		font-size: $font-lg;

		&:after {
			border-radius: 60px;
		}
	}

	.forget-section {
		font-size: $font-sm+2upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40px;
	}

	.register-section {
		position: fixed;
		left: 0;
		bottom: 30px;
		width: 100%;
		font-size: $font-sm+2upx;
		color: $font-color-base;
		text-align: center;

		text {
			color: $font-color-spec;
			margin-left: 10px;
		}
	}
</style>
