<template>
	<view class="container">
		<view class="header">
			<image src="../../static/img/my/user-bj.png" class="user-bj"></image>
			<view class="user-box">
				<view class="user-info-box">
					<view class="avatar" @tap="checkLogin()">
						<image :src="avatar"></image>
					</view>
					<view class="user-info" v-if="isLogin">
						<view class="nick-wrap">
							<text class="nick" @tap="goPageLogin('/pages/my/updataNickName')">{{ nickName }}
							</text>
							<view>
								<image class="nick_image" v-if="sex==1" src="../../static/img/my/man.png"></image>
								<image class="nick_image" v-if="sex==0" src="../../static/img/my/girl.png"></image>
							</view>
							<view v-show="isStudent === 0" class="activation" @tap="goPageLogin('/pages/my/studentEdit')">未认证</view>
							<view v-show="isStudent === 1" class="activation">审核中</view>
						</view>
						<text class="code">邀请码：{{ invitationCode }}</text>
					</view>
					<view class="noLogin" @tap="checkLogin()" v-else>登录</view>
				</view>
				<view class="info-icon" @tap="goPageLogin('/pages/task/renwu')">
					<image src="../../static/img/my/info.png"></image>
				</view>
			</view>
		</view>
		<view class="main">
			<view class="integrals-box">
				<view class="integral" @tap="goPageLogin('/pages/member/jifen')">
					<view class="left">
						<image src="../../static/img/my/jifen.png"></image>
						<text>我的积分</text>
					</view>
					<text class="right cuIcon-right"></text>
				</view>
				<view class="integral" @tap="goPageLogin('/pages/my/ranking')">
					<view class="left">
						<image src="../../static/img/my/shouyi.png"></image>
						<text>收益排行</text>
					</view>
					<text class="right cuIcon-right"></text>
				</view>
				<view class="integral" @tap="goPageLogin('/pages/my/wallet')">
					<view class="left">
						<image src="../../static/img/my/qianbao.png"></image>
						<text>我的钱包</text>
					</view>
					<text class="right cuIcon-right"></text>
				</view>
				<view class="integral" @tap="goPageLogin('/pages/my/prestige')">
					<view class="left">
						<image src="../../static/img/jifens.png"></image>
						<text>我的信誉</text>
					</view>
					<text class="right cuIcon-right"></text>
				</view>
				<view class="integral" @tap="goPageLogin('/pages/my/invitationUser')">
					<view class="left">
						<image src="../../static/img/my/myshare.png"></image>
						<text>分享好友</text>
					</view>
					<text class="right cuIcon-right"></text>
				</view>
			</view>
			<view class="integrals-box">
				<!--#ifdef H5-->
				<view class="integral" @tap="goPageLogin('/pages/my/customer')">
					<view class="left">
						<image src="../../static/img/my/kefu.png"></image>
						<text>联系客服</text>
					</view>
					<text class="right cuIcon-right"></text>
				</view>
				<!--#endif-->
				<!--#ifdef MP-WEIXIN-->
				<view class="integral">
					<view class="left">
						<image src="../../static/img/my/kefu.png"></image>
						<button class="view-text" open-type='contact' session-from=''>客服中心</button>
					</view>
					<text class="right cuIcon-right"></text>
				</view>
				<!--#endif-->
				<view class="integral" @tap="goPageLogin('/pages/my/account')">
					<view class="left">
						<image src="../../static/img/my/shezhi.png"></image>
						<text>设置中心</text>
					</view>
					<text class="right cuIcon-right"></text>
				</view>
				<view class="integral" v-if="isLogin" @tap='loginOut()'>
					<view class="left">
						<image src="../../static/img/my/loginout.png"></image>
						<text>退出登录</text>
					</view>
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
				isLogin: false,
				avatar: "../static/img/logo.png",
				nickName: "",
				isStudent: -1,
				invitationCode: "",
				sex: '',
				arr:[]
			}
		},
		onLoad() {
			this.$Request.getT('/common/type/121').then(res => { //报名成功通知
				if (res.code == 0) {
					if (res.data && res.data.value) {
						// that.orderStart = res.data;
						this.arr.push(res.data.value)
					}
				}
			})
			this.$Request.getT('/common/type/122').then(res => { //活动即将开始提醒
				if (res.code == 0) {
					if (res.data && res.data.value) {
						// that.orderStart = res.data;
						this.arr.push(res.data.value)
					}
				}
			})
		},
		onShow() {
			this.isLogin = this.yu.isLogin();
			let avatar = this.yu.getCache('avatar');
			if (avatar && avatar !== 'undefined') {
				this.avatar = avatar;
			} else {
				this.avatar = '/static/img/logo.png';
			}
			let nickName = this.yu.getCache('nickName');
			if (nickName && nickName !== 'undefined') {
				this.nickName = nickName;
			} else {
				this.nickName = '';
			}
			let invitationCode = this.yu.getCache('invitationCode');
			if (invitationCode && invitationCode !== 'undefined') {
				this.invitationCode = invitationCode;
			} else {
				this.invitationCode = '';
			}
			this.sex = this.yu.getCache('sex');
			let userId = this.yu.getCache('userId');
			if (userId) {
				this.getUserInfo(userId);
			}
		},
		methods: {
			getUserInfo(userId) {
				this.yu.request("/app/selectUserById?userId=" + userId, 'POST').then(res => {
					if (res.code === 0) {
						this.isStudent = res.data.isStudent;
						this.yu.setCache("avatar", res.data.imageUrl ? res.data.imageUrl : '/static/img/logo.png');
						this.yu.setCache("nickName", res.data.nickName ? res.data.nickName : res.data.phone);
						this.yu.setCache("mobile", res.data.phone);
						this.yu.setCache("invitationCode", res.data.invitationCode);
						this.yu.setCache("relation_id", res.data.relationId);
						this.yu.setCache("relation", res.data.invitationCode);
						this.yu.setCache("grade", res.data.grade);
						this.yu.setCache("isInvitation", res.data.isInvitation);
						this.yu.setCache("gender", parseInt(res.data.gender));
						this.yu.setCache("sex", res.data.sex);
						let campus = res.data.campus;
						if (campus && campus != null) {
							this.yu.setCache("campus", res.data.campus);
							this.yu.setCache("campusName", res.data.campusName);
						}
					} else {
						this.yu.logout();
						uni.showModal({
							showCancel: false,
							title: '登录失败',
							content: res.msg,
						});

					}
					uni.hideLoading();
				});
			},
			goPageLogin(url) {
				if (uni.getStorageSync('sendMsg')) {
					wx.requestSubscribeMessage({
						tmplIds: this.arr,
						success(re) {
							console.log(JSON.stringify(re), 111111111111)
							var datas = JSON.stringify(re);
							if (datas.indexOf("accept") != -1) {
								console.log(re)
							}
						},
						fail: (res) => {
							console.log(res)
						}
					})
				}
				let token = this.yu.getCache('token');
				if (token) {
					console.log('是否有token')
					uni.navigateTo({
						url
					})
				} else {
					this.goLogin();
				}
			},
			checkLogin() {
				let token = this.yu.getCache('token');
				let userId = this.yu.getCache('userId');
				if (token) {
					this.upDateLoginInfo(userId);
				} else {
					this.goLogin();
				}
			},
			upDateLoginInfo(userId) {
				// 更新登录信息
				this.yu.request("/app/selectUserById?userId=" + userId, 'POST').then(res => {
					if (res.code === 0) {
						this.yu.setCache("avatar", res.data.imageUrl ? res.data.imageUrl : '/static/img/logo.png');
						this.yu.setCache("nickName", res.data.nickName ? res.data.nickName : res.data.phone);
						this.yu.setCache("mobile", res.data.phone);
						this.yu.setCache("invitationCode", res.data.invitationCode);
						// 
						this.yu.setCache("relation_id", res.data.relationId);
						this.yu.setCache("relation", res.data.invitationCode);
						this.yu.setCache("grade", res.data.grade);
						this.yu.setCache("isInvitation", res.data.isInvitation);
						this.yu.setCache("gender", parseInt(res.data.gender));
					}
				});
			},
			goLogin() {
				this.yu.setCache('href', '/pages/my/index');
				uni.navigateTo({
					url: '/pages/public/login'
				});
			},
			//退出登录
			loginOut() {
				let that = this;
				uni.showModal({
					title: '退出提醒',
					content: '确定要退出登录么',
					success: e => {
						if (e.confirm) {
							that.yu.logout();
							that.isLogin = that.yu.isLogin();
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

		.header {
			width: 100%;
			height: 370upx;
			display: block;
			position: relative;

			.user-bj {
				width: 100%;
				height: 370upx;
				position: absolute;
				z-index: 5;
			}

			.user-box {
				width: 100%;
				height: 370upx;
				position: absolute;
				z-index: 15;
				padding: 100upx 30upx 0;
				display: flex;
				align-items: center;

				.user-info-box {
					flex: 1;
					height: 100%;
					display: flex;
					align-items: center;

					.avatar {
						width: 110upx;
						height: 110upx;
						border-radius: 50%;
						overflow: hidden;

						image {
							width: 100%;
							height: 100%;
							display: block;
						}
					}

					.noLogin {
						display: flex;
						display: flex;
						flex-direction: column;
						margin-left: 20upx;
						font-size: 40upx;
						font-weight: 800;
						color: #FEFEFE;
					}

					.user-info {
						display: flex;
						display: flex;
						flex-direction: column;
						margin-left: 20upx;

						.nick-wrap {
							display: flex;
							align-items: center;
							height: 45upx;

							.nick {
								font-size: 38upx;
								height: 38upx;
								line-height: 38upx;
								font-weight: 800;
								color: #FEFEFE;


							}

							.nick_image {
								width: 38upx;
								height: 38upx;
								margin-left: 20upx;
							}

							.activation {
								width: 100upx;
								height: 38upx;
								line-height: 38upx;
								text-align: center;
								background: #FFFFFF;
								border-radius: 19upx;
								margin-left: 20upx;
								font-size: 24upx;
								font-weight: bold;
								color: #FF332F;
							}
						}

						.code {
							display: flex;
							align-items: center;
							height: 45upx;
							font-size: 24upx;
							font-family: PingFang SC;
							font-weight: 500;
							color: #FEFEFE;
						}

					}


				}

				.info-icon {
					width: 46upx;
					height: 48upx;

					image {
						width: 100%;
						height: 100%;
						display: block;
					}
				}
			}

		}

		.main {
			.integrals-box {
				margin-top: 20upx;
				background-color: #FFF;
				padding: 10upx 34upx 10upx 40upx;

				.integral {
					width: 100%;
					height: 92upx;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.left {
						display: flex;
						align-items: center;
						flex: 1;

						image {
							width: 42upx;
							height: 42upx;
						}

						text {
							margin-left: 20upx;
							color: #333333;
							font-size: 28upx;
						}

						button {
							flex: 1;
							padding: 0;
							margin: 0;
							border: none;
							background: transparent;
							text-align: left;
						}

						button::after {
							border: none;
						}

						button::before {
							border: none;
						}

						.view-text {
							font-size: 28upx;
							color: #333333;
							margin-left: 20upx;
						}
					}

					.right {
						font-size: 28upx;
						color: #333333;
					}
				}
			}
		}
	}
</style>
