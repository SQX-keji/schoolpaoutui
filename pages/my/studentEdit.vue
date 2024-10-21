<template>
	<view class="newTask">
		<view class="taskBox">
			<form @submit="formSubmit">
				<tui-list-cell :hover="false">
					<view class="tui-line-cell">
						<view class="tui-title">学生名称</view>
						<input style="font-size: 28upx;text-align: right;" placeholder-class="tui-phcolor" class="tui-input" name="stuName"
						 v-model="stuName" placeholder="请输入学生名称" maxlength="10" type="text" />
					</view>
				</tui-list-cell>
				<tui-list-cell :hover="false">
					<view class="tui-line-cell">
						<view class="tui-title">学校名称</view>
						<input style="font-size: 28upx;text-align: right;" placeholder-class="tui-phcolor" class="tui-input" name="schoolName"
						 v-model="schoolName" placeholder="请输入学校名称" maxlength="20" type="text" />
					</view>
				</tui-list-cell>
				<tui-list-cell :hover="false">
					<view class="tui-line-cell">
						<view class="tui-title">地址信息</view>
						<input style="font-size: 28upx;text-align: right;" placeholder-class="tui-phcolor" class="tui-input" name="stuAddress"
						 v-model="stuAddress" placeholder="请输入地址信息" maxlength="50" type="text" />
					</view>
				</tui-list-cell>
				<view style="margin-left: 30rpx;">证件照片</view>
				<view style="display: flex;margin-top: 20upx;margin-bottom: 16upx;">
					<view style="width: 49%;">
						<image style="width: 100%;height: 300upx;" :src="sfzZheng" @click="uploadImg(1)" />
						<view style="font-size: 28upx;margin-top: 16upx;">
							<text style="margin-left: 12upx;color: red;">*身份证正面</text>
						</view>
					</view>
					<view style="width: 49%;margin-left: 10rpx;">
						<image style="width: 100%;height: 300upx;" :src="sfzFan" @click="uploadImg(2)" />
						<view style="font-size: 28upx;margin-top: 16upx;">
							<text style="margin-left: 12upx;color: red;">*身份证国徽面</text>
						</view>
					</view>
				</view>
				<view style="width: 49%;margin-left: 10rpx;">
					<image style="width: 100%;height: 300upx;" :src="xszShou" @click="uploadImg(3)" />
					<view style="font-size: 28upx;margin-top: 16upx;">
						<text style="margin-left: 12upx;color: red;">*学生证照片</text>
					</view>
				</view>
				<view class="tui-btn-box">
					<button class="tui-button-primary" hover-class="tui-button-hover" formType="submit" type="primary" style="color: #FFFFFF;background: #E6325C;">提交</button>
				</view>
			</form>
		</view>
	</view>
	</view>
</template>

<script>
	const form = require('@/components/tui-validation/tui-validation.js');
	import tuiModal from '@/components/tui-modal/tui-modal.vue';
	import tuiListCell from '@/components/tui-list-cell/tui-list-cell.vue';
	import configdata from '../../common/config.js';
	export default {
		components: {
			tuiModal,
			tuiListCell
		},
		data() {
			return {
				stuName: '',
				schoolName: '',
				checkState: 0,
				yyzhizhaoPicture: 'https://shop.shengqianxiong.com.cn/img/20201211/0ab14fafa08f404eb03a667bf1ab3882.png',
				sfzZheng: 'https://shop.shengqianxiong.com.cn/img/20201211/0ab14fafa08f404eb03a667bf1ab3882.png',
				sfzFan: 'https://shop.shengqianxiong.com.cn/img/20201211/0ab14fafa08f404eb03a667bf1ab3882.png',
				xszShou: 'https://shop.shengqianxiong.com.cn/img/20201211/0ab14fafa08f404eb03a667bf1ab3882.png',
			}
		},
		onLoad() {
			this.getStudent();
		},
		methods: {
			formSubmit: function(e) {
				if (this.checkState != 0) return;
				this.checkState = 1;
				uni.showLoading({
					title: '提交中...'
				});
				let userId = this.$queue.getData('userId');
				var that = this;
				//表单规则
				let rules = [{
						name: 'stuName',
						rule: ['required'], //可使用区间，此处主要测试功能
						msg: ['请输入学生名称']
					},
					{
						name: 'schoolName',
						rule: ['required'],
						msg: ['请输入学校名称']
					},
					{
						name: 'stuAddress',
						rule: ['required'],
						msg: ['请输入地址信息']
					}
				];
				//进行表单检查
				let formData = e.detail.value;
				if (formData) {
					let checkRes = form.validation(formData, rules);
					if (!checkRes) {
						if (this.sfzZheng === 'https://shop.shengqianxiong.com.cn/img/20201211/0ab14fafa08f404eb03a667bf1ab3882.png') {
							uni.hideLoading();
							uni.showToast({
								icon: 'none',
								title: '请上传身份证正面照片'
							});
							this.checkState = 0;
							return;
						}
						if (this.sfzFan === 'https://shop.shengqianxiong.com.cn/img/20201211/0ab14fafa08f404eb03a667bf1ab3882.png') {
							uni.hideLoading();
							uni.showToast({
								icon: 'none',
								title: '请上传身份证国徽面照片'
							});
							this.checkState = 0;
							return;
						}
						if (this.xszShou === 'https://shop.shengqianxiong.com.cn/img/20201211/0ab14fafa08f404eb03a667bf1ab3882.png') {
							uni.hideLoading();
							uni.showToast({
								icon: 'none',
								title: '请上传学生证照片'
							});
							this.checkState = 0;
							return;
						}
						let data = {
							userId: userId,
							userName: formData.stuName,
							address: formData.stuAddress,
							school: formData.schoolName,
							studentImg: this.xszShou,
							cardBack: this.sfzFan,
							cardFront: this.sfzZheng
						}
						this.$Request.postJson('/student/insertStudentAuthentication', data).then(res => {
							if (res.code === 0) {
								uni.hideLoading();
								this.$queue.showToast('提交成功，等待审核通过');
								setTimeout(d => {
									this.checkState = 0;
									uni.navigateBack();
								}, 1000);
							} else {
								uni.hideLoading();
								this.checkState = 0;
								this.$queue.showToast(res.msg);
							}
						});
					} else {
						uni.hideLoading();
						this.checkState = 0;
						uni.showToast({
							title: checkRes,
							icon: 'none'
						});
					}
				}
			},
			uploadImg(index) {
				let that = this;
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: function(res) {
						let token = uni.getStorageSync('token');
						uni.showLoading({
							title: '上传中...'
						});
						uni.uploadFile({
							url: that.config("APIHOST1") + '/alioss/upload', //仅为示例，非真实的接口地址
							filePath: res.tempFilePaths[0],
							header: {
								token: token
							},
							name: 'file',
							success: uploadFileRes => {
								//index 1，身份证正面  2，身份证反面  3，学生证
								if (index === 1) {
									that.sfzZheng = JSON.parse(uploadFileRes.data).data;
								} else if (index === 2) {
									that.sfzFan = JSON.parse(uploadFileRes.data).data;
								} else if (index === 3) {
									that.xszShou = JSON.parse(uploadFileRes.data).data;
								}
								uni.hideLoading();
							}
						});
					}
				});
			},
			config: function(name) {
				var info = null;
				if (name) {
					var name2 = name.split("."); //字符分割
					if (name2.length > 1) {
						info = configdata[name2[0]][name2[1]] || null;
					} else {
						info = configdata[name] || null;
					}
					if (info == null) {
						let web_config = cache.get("web_config");
						if (web_config) {
							if (name2.length > 1) {
								info = web_config[name2[0]][name2[1]] || null;
							} else {
								info = web_config[name] || null;
							}
						}
					}
				}
				return info;
			},
			getStudent() {
				let userId = this.$queue.getData('userId');
				this.$Request.getT('/student/selectStudentByUserId?userId=' + userId).then(res => {
					if (res.code === 0 && res.data) {
						this.stuName = res.data.userName;
						this.stuAddress = res.data.address;
						this.schoolName = res.data.school;
						this.xszShou = res.data.studentImg;
						this.sfzFan = res.data.cardBack;
						this.sfzZheng = res.data.cardFront;
					}
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	page {
		background: #FFFFFF;
	}

	.newTask {
		.footer {
			padding-left: 32upx;
			margin-top: 16upx;
			text-align: center;
			display: flex;
		}

		background: #FFFFFF;

		.taskBox {
			// margin-top: 40rpx;
			background: #ffffff;
			padding: 40rpx 24rpx;

			.title {
				border-bottom: 2upx solid #f2f2f2;
				padding-bottom: 32upx;
				margin-left: 32upx;
				font-size: 38upx;
				font-weight: bold;

				.link {
					margin-left: 32upx;
					color: #5677fc;
					font-size: 28upx;
					font-weight: normal;
				}
			}

			.titles {
				border-bottom: 2upx solid #f2f2f2;
				// padding-bottom: 32upx;
				margin-left: 32upx;
				font-size: 32upx;
				font-weight: bold;

				.link {
					margin-left: 32upx;
					color: #5677fc;
					font-size: 28upx;
					font-weight: normal;
				}
			}
		}

		.tui-line-cell {
			width: 100%;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 2upx solid #f2f2f2;
			padding: 0 0 16upx 0;
		}

		.tui-title {
			line-height: 32rpx;
			min-width: 120rpx;
			flex-shrink: 0;
		}

		.tui-input {
			font-size: 32rpx;
			color: #333;
			padding-left: 20rpx;
			flex: 1;
		}

		// .radio-group {
		// 	margin-left: auto;
		// 	transform: scale(0.8);
		// 	transform-origin: 100% center;
		// 	flex-shrink: 0;
		// }

		.tui-radio {
			display: inline-block;
			padding-left: 28rpx;
			font-size: 36rpx;
			vertical-align: middle;
		}

		.myRadio {
			// height: 16upx;
			// width: 16upx;
			margin-top: 16upx;
			margin-right: 16upx;
		}

		.tui-btn-box {
			padding: 40rpx 50rpx;
			box-sizing: border-box;
		}

		.tui-button-gray {
			margin-top: 30rpx;
		}

		.tui-tips {
			padding: 30rpx;
			color: #999;
			font-size: 24rpx;
		}
	}
</style>
