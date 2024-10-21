<template>
	<view class="container">
		<tki-qrcode cid="qrcodeCid" class="poster_erweima" ref="qrcode" :val="qrCodeKey" :background="background" :foreground="foreground" :pdground="pdground" :onval="onval" :loadMake="loadMake" :usingComponents="true" @result="qrR" />
		<view class="region-box">
			<view class="goods_info_box">
				<view class="img-wrap">
					<image class="goods_image" :src="backgroundImageUrl"></image>
					<view class="goods_info">
						<view class="left">
							<image :src="userImageUrl" class="userImageUrl"></image>
							<view class="login-view-text">
								<view class="nick">{{ nickName }}</view>
								<view class="invitationCode">邀请码：{{ invitationCode }}</view>
							</view>
						</view>
						<!-- #ifdef H5 -->
						<view class="poster_code_image">
							<image :src="qrSrc"></image>
						</view>
						<!-- #endif -->
						<!-- #ifdef MP-WEIXIN -->
						<view class="poster_code_image">
							<image :src="urlCode"></image>
						</view>
						<!-- #endif -->
					</view>
				</view>
				<view class="goods_info_b">
					<view class="poster_info">
						<view class="text">长按海报 自动保存</view>
						<image src="../../static/img/my/right.png" class="jiantou"></image>
						<view class="text">发送微信 好友</view>
						<image src="../../static/img/my/right.png" class="jiantou"></image>
						<view class="text">好友注册并 成为正式会员</view>
					</view>
				</view>
			</view>
			<view class="btn-wrap">
				<!-- #ifdef H5 -->
				<view class="share" @tap="h5share()">
					<text>分享邀请链接</text>
				</view>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<button class="share" open-type="share">
					<text>分享微信好友</text>
				</button>
				<!-- #endif -->
				<view @click.stop="posterSharing" class="share download">
					<text>生成海报邀请</text>
				</view>
			</view>
		</view>
		<!-- #ifdef H5 -->
		<view v-if="haibaomodelshow" @tap="closeHBmodelshow" class="poster_canvas_container">
			<view class="img-box">
				<image :src="H5ImgUrl"></image>
			</view>
		</view>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<view v-if="haibaomodelshow" @click="closeHBmodelshow" class="poster_canvas_container">
			<view class="img-box">
				<view class="down" @click.stop="onSaveImg">
					<text class="cuIcon cuIcon-down"></text>
				</view>
				<image :src="H5ImgUrl" @longpress="onSaveImg"></image>
			</view>
		</view>
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<view v-if="haibaomodelshow" @tap="closeHBmodelshow" class="poster_canvas_container">
			<view class="img-box">
				<image :src="H5ImgUrl"></image>
			</view>
		</view>
		<!-- #endif -->
		<canvas canvas-id="poster" class="poster_canvas"></canvas>
	</view>
</template>

<script>
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue"
	let settingWritePhotosAlbum = false;
	export default {
		data() {
			return {
				userImageUrl:'/static/img/logo.png',
				nickName:"",
				invitationCode: '',
				backgroundImageUrl: '',
				shareUrl:'',
				urlCode: '',
				// 二维码
				qrCodeKey: '', // 要生成的二维码值
				background: '#F8F8F8', // 背景色
				foreground: '#333333', // 前景色
				pdground: '#333333', // 角标色
				icon: '', // 二维码图标
				iconsize: 40, // 二维码图标大小
				lv: 3, // 二维码容错级别 ， 一般不用设置，默认就行
				onval: true, // val值变化时自动重新生成二维码
				loadMake: true, // 组件加载完成后自动生成二维码
				qrSrc: '' ,// 二维码生成后的图片地址或base64
				
				// 海报分享
				H5ImgUrl:'',
				haibaomodelshow:false,
			};
		},
		onLoad() {
			this.getBackImageList();
			this.getQRCodeInfo();
			// #ifdef MP-WEIXIN
			this.getQrCode();
			// #endif
		},
		methods: {
			getBackImageList() {
				this.yu.request('/banner/selectInvitationBackground','GET').then(res => {
					if (res.code === 0) {
						this.backgroundImageUrl = res.data.imageUrl;
						this.describes = res.data.describes + '\n';
					}
				});
			},
			getQrCode() {
				this.urlCode = this.yu.interface() + "?invitation="  + invitationCode;
			},
			getQRCodeInfo() {
				let userId = this.yu.getCache('userId');
				this.yu.request('/user/selectInviteAndPoster?userId=' + userId ,'GET').then(res => {
					if (res.code === 0) {
						if (res.data.user.imageUrl) {
							this.userImageUrl = res.data.user.imageUrl;
						} else {
							this.userImageUrl = '/static/img/logo.png';
						}
						if (res.data.user.nickName) {
							this.nickName = res.data.user.nickName;
						} else {
							this.nickName = res.data.user.phone;
						}
						this.invitationCode = res.data.user.invitationCode;
						this.shareUrl = res.data.url;
						this.qrCodeKey = res.data.url + '/#/?invitation=' + res.data.user.invitationCode;
					}
				});
			},
			qrR(res) {
				this.qrSrc = res;
			},
			h5share() {
				let that = this;
				uni.showModal({
					title: '链接推广',
					content: this.describes + this.qrCodeKey,
					showCancel: true,
					cancelText: '关闭',
					confirmText: '一键复制',
					success: res => {
						if (res.confirm) {
							uni.setClipboardData({
								data: this.describes + this.qrCodeKey,
								success: function() {
									console.log('success');
									that.$queue.showToast('复制成功');
								}
							});
						}
					}
				});
			},
			closeHBmodelshow() {
				this.haibaomodelshow = false;
			},
			// 创建海报
			createPoster() {
				let that = this;
				return new Promise((resolve, reject) => {
					uni.showLoading({
						title: '海报生成中'
					});
					const ctx = uni.createCanvasContext('poster');
					ctx.fillRect(0, 0, 375, 673);
					ctx.setFillStyle("#FFF");
					ctx.fillRect(0, 0, 375, 673);
					let imgUrl = that.backgroundImageUrl;
					console.log(imgUrl)
					
					
					
					ctx.drawImage(res.tempFilePath, 0, 0, 375, 500);
					// 长按识别二维码访问
					let textTop = 0;
					ctx.setFontSize(19);
					ctx.setFillStyle('#333');
					ctx.fillText("长按识别图中二维码", 17, textTop + 590);
					// 二维码
					let imgCodeUrl = that.qrSrc;
					ctx.drawImage(imgCodeUrl, 238, textTop + 526, 120, 120);
					ctx.draw(true, () => {
						// canvas画布转成图片并返回图片地址
						uni.canvasToTempFilePath({
							canvasId: 'poster',
							width: 375,
							height: 673,
							success: (res) => {
								console.log("海报制作成功！");
								resolve(res.tempFilePath);
							},
							fail: () => {
								uni.hideLoading();
								reject();
							}
						})
					});
					
					
					
					// uni.downloadFile({
					// 	url: imgUrl,
					// 	success: (res) => {
					// 		if (res.statusCode === 200) {
								
					// 		} else {
					// 			uni.hideLoading();
					// 			uni.showToast({
					// 				title: '海报制作失败，图片下载失败',
					// 				icon: 'none'
					// 			});
					// 		}
					// 	},
					// 	fail: err => {
					// 		that.yu.toast(err)
					// 		console.log(err)
					// 		uni.hideLoading();
					// 		uni.showToast({
					// 			title: '海报制作失败，图片下载失败',
					// 			icon: 'none',
					// 		});
					// 	}
					// });
				});
			},
			// 保存图片
			async posterSharing() {
				let imgUrl = await this.createPoster();
				uni.hideLoading();
				this.H5ImgUrl = imgUrl;
				this.haibaomodelshow = true;
			},
			onSaveImg() {
				// #ifdef MP-WEIXIN
				uni.showLoading({
					title: '海报下载中'
				});
				if (settingWritePhotosAlbum) {
					uni.getSetting({
						success: res => {
							if (res.authSetting['scope.writePhotosAlbum']) {
								uni.saveImageToPhotosAlbum({
									filePath: this.h5SaveImg,
									success: () => {
										uni.hideLoading();
										uni.showToast({
											title: '保存成功'
										});
									}
								});
							} else {
								uni.showModal({
									title: '提示',
									content: '请先在设置页面打开“保存相册”使用权限',
									confirmText: '去设置',
									cancelText: '算了',
									success: data => {
										if (data.confirm) {
											uni.hideLoading();
											uni.openSetting();
										}
									}
								});
							}
						}
					});
				} else {
					uni.hideLoading();
					settingWritePhotosAlbum = true;
					uni.authorize({
						scope: 'scope.writePhotosAlbum',
						success: () => {
							uni.saveImageToPhotosAlbum({
								filePath: this.h5SaveImg,
								success: () => {
									uni.hideLoading();
									uni.showToast({
										title: '保存成功'
									});
								}
							});
						}
					});
				}
				// #endif
			},
		},
		// 小程序分享
		onShareAppMessage(e) {
			let token = this.yu.getCache('token');
			let relation_id = this.yu.getCache('relation_id');
			let shareInfo = {
				path: "/pages/index/index?relation=" + relation_id,
				title: "跑腿",
				imageUrl: this.backgroundImageUrl
			};
			return shareInfo;
		},
	}
</script>

<style lang="scss">
	page {
		width: 100%;
		height: 100%;
	}
	.container {
		width: 100%;
		height: 100%;
		.poster_canvas_container {
			width: 100%;
			height: 667px;
			background-color: rgba(0, 0, 0, 0.8);
			// position: fixed;
			top: 0;
			left: 0;
			z-index: 99999;
			display: flex;
			justify-content: center;
			align-items: center;
			
		}
		.img-box {
			width: 330px;
			height: 540px;
			// width: 100%;
			// height: 100%;
			position: relative;
			top: 0;
			left: 0;
			image {
				width: 100%;
				height: 100%;
				border-radius: 10upx;
				position: absolute;
				top: 0;
				left: 0;
			}
			.down {
				width: 60upx;
				height: 60upx;
				border-radius: 50%;
				background-color: #f2f2f2;
				position: absolute;
				top: 20upx;
				right: 20upx;
				z-index: 99;
				text-align: center;
				line-height: 60upx;
				font-size: 34upx;
			}
		}
		.poster_erweima {
			position: fixed;
			top: -10000upx;
			left: 0;
		}
		.poster_canvas {
			width: 750upx;
			height: 1334upx;
			position: fixed;
			top: -10000upx;
			left: 0;
		}
		.region-box {
			width: 100%;
			height: 100%;
			padding: 20upx 20upx 20upx;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.goods_info_box {
				width: 100%;
				height: 90%;
				background: #FFF;
				border-radius: 15upx;
				position: relative;
				overflow: hidden;
				.img-wrap {
					width: 100%;
					height: 88%;
					position: absolute;
					.goods_image {
						width: 100%;
						height: 100%;
						display: block;
						position: absolute;
					}
					.goods_info {
						width: 100%;
						height: 16%;
						padding: 0 20upx;
						position: absolute;
						bottom: 0;
						display: flex;
						align-items: center;
						justify-content: space-between;
						.left {
							display: flex;
							align-items: center;
							.userImageUrl{
								border-radius: 100upx;
								width: 100upx;
								height: 100upx;
								margin-right: 30upx;
							}
							.login-view-text {
								.nick {
									display: flex;
									flex-direction: column;
									color: #FFF;
									font-size: 32rpx;
								}
								.invitationCode {
									color: #FFF;
									font-size: 32rpx;
								}
							}
						}
						.poster_code_image {
							width: 100rpx;
							height: 100rpx;
							flex-shrink: 0;
							overflow: hidden;
							image {
								width: 100%;
								height: 100%;
							}
						}
					}
				}
				.goods_info_b {
					width: 100%;
					height: 12%;
					padding: 15rpx;
					position: absolute;
					bottom: 0;
					.goods_name {
						color: #333;
						font-size: 28rpx;
					}
					.poster_info {
						height: 100%;
						display: flex;
						align-items: center;
						justify-content: space-between;
						.jiantou {
							width: 100upx;
							height: 50upx;
						}
						.text {
							width: 120upx;
							font-size: 12px;
							color: #FF5808; 
							text-align: center;
						}
					}
				}
			}
			.btn-wrap {
				width: 90%;
				display: flex;
				justify-content: space-between;
				.share {
					width: 45%;
					height: 80upx;
					background-color: #FB5531;
					color: #fff;
					line-height: 80upx;
					font-size: 28upx;
					margin: 0;
					margin-top: 20upx;
					border-radius: 10upx;
					text-align: center;
				}
				.download {
					width: 45%;
					height: 80upx;
					background-color: #06C061;
					color: #fff;
					line-height: 80upx;
					margin-top: 20upx;
					font-size: 28upx;
					border-radius: 10upx;
					text-align: center;
				}
			}
		}
	}
</style>
