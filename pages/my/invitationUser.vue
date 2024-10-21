<template>
	<view class="content">
		<view class="view1" v-bind:style="{backgroundImage: 'url('+backgroundImage+')'}">
			<view style="display: flex; flex-direction: row; padding-top: 880upx;" @longpress="logoTime(userImageUrl)">
				<image :src="userImageUrl"
					style="border-radius: 100upx;width: 100upx;height: 100upx;margin-left: 30upx;"></image>
				<view class="login-view-text1" style="margin-left: 30upx;width: 59%;">
					<view style="color: #FFFFFF;font-size: 16px;">{{ nickName }}</view>
					<view style="color: #FFFFFF; font-size: 12px;margin-top: 20upx;">邀请码:{{invitationCode}}</view>
				</view>
				<canvas canvas-id="qrcode" style="width: 140upx;height: 130upx;" />
			</view>
		</view>
		<view
			style="display: flex;flex-direction: row;width: 100%; padding: 20upx; margin-top: 20upx;align-items: center;">
			<view style="font-size: 12px;color: #FF5808; width: 100upx;margin-left: 20upx;text-align: center;">长按海报 自动保存
			</view>
			<image src="../../static/img/invitation/invitationright.png"
				style="width: 100upx;height: 50upx;margin-left: 40upx;"></image>
			<view style="font-size: 12px;color: #FF5808; width: 100upx;margin-left: 40upx;text-align: center;">发送微信 好友
			</view>
			<image src="../../static/img/invitation/invitationright.png"
				style="width: 100upx;height: 50upx;margin-left: 40upx;"></image>
			<view style="font-size: 12px;color: #FF5808; width: 140upx;margin-left: 40upx;text-align: center;">
				好友注册做任务赚大钱</view>
		</view>
		<view style="display: flex;flex-direction: row; padding: 40upx;">
			<!-- #ifdef H5 -->
			<button @click="share()" type="default"
				style="background-color: #FFCB49;font-size: 16px;font-weight: bold;color: #FFFFFF; width: 50%;">分享邀请链接</button>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<button @click="shareWeiXin()" type="default"
				style="background-color: #FFCB49;font-size: 16px;font-weight: bold;color: #FFFFFF; width: 50%;">分享邀请链接</button>
			<!-- #endif -->

			<!-- #ifdef MP-WEIXIN -->
			<button open-type="share"
				style="background-color: #FFCB49;font-size: 16px;font-weight: bold;color: #FFFFFF; width: 50%;position: relative;">邀请好友</button>
			<button @tap="showModal()" type="default"
				style="background-color: #FF5808;font-size: 16px;font-weight: bold;color: #FFFFFF; width: 50%; margin-left: 40upx;position: relative;">生成海报</button>
			<!-- #endif -->


			<!-- 生成海报 -->
			<!-- 图片展示由自己实现 -->
			<view class="flex_row_c_c modalView" :class="qrShow?'show':''" @tap="hideQr()">
				<view class="flex_column">
					<view class="backgroundColor-white padding1vh border_radius_10px">
						<image :src="poster.finalPath || ''" mode="widthFix" class="posterImage"></image>
					</view>
					<view class="flex_row marginTop2vh">
						<!-- #ifdef H5 -->
						<button type="primary" size="mini">长按上方图片保存</button>
						<!-- #endif -->
						<!-- #ifndef H5 -->
						<button type="primary" size="mini" @tap.prevent.stop="saveImage()">保存图片</button>
						<!-- #endif -->
					</view>
				</view>
			</view>
			<!-- 画布 -->
			<view class="hideCanvasView">
				<canvas class="hideCanvas" canvas-id="default_PosterCanvasId"
					:style="{width: (poster.width||10) + 'px', height: (poster.height||10) + 'px'}"></canvas>
			</view>
		</view>
		<tki-qrcode ref="qrcode" :val="url" :size="200" background="#fff" foreground="#000" pdground="#000"
			:onval="true" :loadMake="true" @result="qrR" :show="false"></tki-qrcode>
			<!-- #ifdef MP -->
			<view class="cu-modal" :class="modalName == 'Image' ? 'show' : ''" @tap="hideModal">
				<view class="cu-dialog" v-if="backgroundImage && XCXErweima && haibaoShow" @tap="hideModal">
					<view class="bg-img">
						<wm-poster @success="posterSuccess" :imgSrc="backgroundImage" :Referrer="'我的邀请码:'+invitationCode"
							:QrSrc="XCXErweima" :Title="tuiguang" :LineType="false"></wm-poster>
					</view>
				</view>
			</view>
			<!-- #endif -->
			<!-- #ifndef MP -->
			<view class="cu-modal" :class="modalName == 'Image' ? 'show' : ''" @tap="hideModal">
				<view class="cu-dialog" v-if="backgroundImage && erweimapath && haibaoShow" @tap="hideModal">
					<view class="bg-img">
						<wm-poster @success="posterSuccess" :imgSrc="backgroundImage" :Referrer="'我的邀请码:'+invitationCode"
							:QrSrc="erweimapath" :Title="tuiguang" :LineType="false"></wm-poster>
					</view>
				</view>
			</view>
			<!-- #endif -->
		
	</view>
</template>

<script>
	import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue';
	import appShare from '@/utils/share.js';
	import wmPoster from '@/components/wm-poster/wm-posterorders.vue';
	import uQRCode from "../../js_sdk/Sansnn-uQRCode/uqrcode.js"
	import _app from '../../js_sdk/QuShe-SharerPoster/QS-SharePoster/app.js';
	// import getSharePoster from '../../js_sdk/QuShe-SharerPoster/QS-SharePoster/QS-SharePoster.js';
	export default {
		components: {
			tkiQrcode,
			wmPoster
		},
		data() {
			return {
				erweimapath: '',
				poster: {},
				qrShow: false,
				backgroundImage1: '../../static/img/invitation/123.jpg',
				haibaoImg: null,
				haibaoShow: false,
				modalName: '',
				canvasId: 'default_PosterCanvasId',
				imageUrl: '',
				userImageUrl: '',
				nickName: '',
				invitationCode: '',
				backgroundImage: '',
				XCXErweima: '',
				tuiguang: '',
				url: ''
			};
		},
		onLoad() {
			this.goList();
			this.getBackImageList();
		},
		onShareAppMessage(res) {
			return {
				path: '/pages/index/index', //这是为了传参   onload(data){let id=data.id;} 
				title: this.tuiguang
			}
		},
		methods: {
			posterSuccess(haibaoImg) {
				this.haibaoImg = haibaoImg;
				this.modalName = 'Image';
			},
			showModal() {
				if (!this.haibaoImg) {
					this.haibaoShow = true;
					this.$queue.showLoading('海报生成中...');
				} else {
					this.modalName = 'Image';
				}
			},
			hideModal() {
				this.modalName = null;
			},
			qrR(path) {
				this.erweimapath = path;
			},
			getBackImageList() {
				this.$Request.getT('/banner/selectInvitationBackground').then(res => {
					if (res.code === 0) {
						this.backgroundImage = res.data.imageUrl;
						this.tuiguang = res.data.describes + '\n';
					}
				});
			},
			make() {
				uQRCode.make({
					canvasId: 'default_PosterCanvasId',
					componentInstance: this,
					text: this.url,
					size: 68,
					margin: 4,
					backgroundColor: '#ffffff',
					foregroundColor: '#000000',
					fileType: 'jpg',
					correctLevel: uQRCode.errorCorrectLevel.H,
					success: res => {
						console.log(res)
					}
				})
			},
			shareWeiXin() {
				let relationId = this.invitationCode;
				let shareData = {
					shareUrl: this.url,
					shareTitle: '邀请你加入省钱兄！做任务，邀好友，赚大钱！',
					shareContent: '邀请码：' + relationId + '，点击进入，在省钱兄中和我一起做任务赚大钱吧！',
					shareImg: this.$queue.publicYuMing() + '/logo.png',
					type: 0
				};
				appShare(shareData, res => {
					console.log('分享成功回调', res);
				});
			},
			share() {
				this.sharurl();
			},
			sharurl() {
				let that = this;
				// this.$queue.showLoading('加载中...');
				uni.showModal({
					title: '链接推广',
					content: this.tuiguang + this.url,
					showCancel: true,
					cancelText: '关闭',
					confirmText: '一键复制',
					success: res => {
						if (res.confirm) {
							uni.setClipboardData({
								data: this.tuiguang + this.url,
								success: function() {
									console.log('success');
									that.$queue.showToast('复制成功');
								}
							});
						}
					}
				});
			},
			logoTime(urlList) {
				uni.previewImage({
					current: 0,
					urls: urlList,
					loop: true,
					longPressActions: {
						itemList: ['收藏'],
						itemColor: "#007AFF"
					}
				})
			},
			goList() {
				let userId = this.$queue.getData('userId');
				this.$Request.getT('/user/selectInviteAndPoster?userId=' + userId).then(res => {
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
						this.imageUrl = res.data.url;

						// #ifndef H5
						this.url = this.$queue.publicYuMing() + '/#/pages/member/download?invitation=' + this
							.invitationCode;
						//#endif
						// #ifdef H5
						this.url = this.$queue.publicYuMing() + '/#/?invitation=' + this.invitationCode;
						//#endif
						// #ifndef MP-WEIXIN
						this.make();
						// #endif
						// #ifdef MP-WEIXIN
						this.XCXErweima = this.$queue.publicYuMing() +
									'/sqx_fast/statistical/mpCreateQr?invitationCode=' + this.invitationCode
						// #endif
					}
				});
			},
			async shareFc() {
				let _this = this;
				try {
					const d = await getSharePoster({
						type: 'testShareType',
						backgroundImage: _this.backgroundImage,
						posterCanvasId: _this.canvasId, //canvasId
						delayTimeScale: 20, //延时系数
						drawArray: ({
							bgObj,
							type,
							bgScale
						}) => {
							const dx = bgObj.width * 0.3;
							const fontSize = bgObj.width * 0.045;
							const lineHeight = bgObj.height * 0.04;
							//可直接return数组，也可以return一个promise对象, 但最终resolve一个数组, 这样就可以方便实现后台可控绘制海报
							return new Promise((rs, rj) => {
								rs([{
										type: 'custom',
										setDraw(Context) {
											Context.setFillStyle('black');
											Context.setGlobalAlpha(0.3);
											Context.fillRect(0, bgObj.height - bgObj
												.height * 0.2, bgObj.width, bgObj
												.height * 0.2);
											Context.setGlobalAlpha(1);
										}
									},
									{
										type: 'text',
										fontStyle: 'italic',
										text: '邀请码:' + _this.invitationCode,
										size: fontSize,
										color: 'white',
										alpha: 1,
										textAlign: 'left',
										textBaseline: 'middle',
										infoCallBack(textLength) {
											return {
												dx: bgObj.width - textLength - fontSize,
												dy: bgObj.height - lineHeight * 3
											}
										},
										serialNum: 0,
										id: 'tag1' //自定义标识
									},
									{
										type: 'qrcode',
										text: _this.url,
										size: bgObj.width * 0.2,
										dx: bgObj.width * 0.05,
										dy: bgObj.height - bgObj.width * 0.25
									}
								]);
							})
						},
						setCanvasWH: ({
							bgObj,
							type,
							bgScale
						}) => { // 为动态设置画布宽高的方法，
							_this.poster = bgObj;
						}
					});
					//_app.log('海报生成成功, 时间:' + new Date() + '， 临时路径: ' + d.poster.tempFilePath)
					_this.poster.finalPath = d.poster.tempFilePath;
					_this.qrShow = true;
				} catch (e) {
					_app.hideLoading();
				}
			},
			saveImage() {
				uni.saveImageToPhotosAlbum({
					filePath: this.poster.finalPath,
					success(res) {
						_app.showToast('保存成功');
					}
				})
			},
			hideQr() {
				this.qrShow = false;
			}
		}
	}
</script>

<style scoped>
	page {
		background: #ffffff;
	}

	.view1 {
		background-size: 100%;
		width: 95%;
		height: 1000upx;
		margin: 20upx 20upx 0 20upx;
	}

	.hideCanvasView {
		position: relative;
	}

	.hideCanvas {
		position: fixed;
		top: -99999upx;
		left: -99999upx;
		z-index: -99999;
	}

	.flex_row_c_c {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.modalView {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
		outline: 0;
		transform: scale(1.2);
		perspective: 2500upx;
		background: rgba(0, 0, 0, 0.6);
		transition: all .3s ease-in-out;
		pointer-events: none;
		backface-visibility: hidden;
		z-index: 999;
	}

	.modalView.show {
		opacity: 1;
		transform: scale(1);
		pointer-events: auto;
	}

	.flex_column {
		display: flex;
		flex-direction: column;
	}

	.backgroundColor-white {
		background-color: white;
	}

	.border_radius_10px {
		border-radius: 10px;
	}

	.padding1vh {
		padding: 1vh;
	}

	.posterImage {
		width: 60vw;
	}

	.flex_row {
		display: flex;
		flex-direction: row;
	}

	.marginTop2vh {
		margin-top: 2vh;
	}
</style>
