<template>
	<view style="text-align: left">
		<view v-for="(item, index) in list" :key="index" class="item">
			<view>
				<view style="color: #999999;font-size: 28upx;">
					<view style="margin-bottom: 8upx">用户姓名: {{ mobile }}</view>
					<view style="margin-bottom: 8upx">充值时间: {{ item.createTime }}</view>
					<view style="margin-bottom: 8upx;text-align: right;">
						<!-- 提现金额： -->
						<text style="color: #e10a07;font-size: 32upx;font-weight: 600">￥{{ item.money }}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 加载更多提示 -->
		<view class="s-col is-col-24" v-if="list.length > 0"><load-more :loadingType="loadingType" :contentText="contentText"></load-more></view>
		<!-- 加载更多提示 -->
		<empty v-if="list.length === 0" des="暂无数据" show="false"></empty>
	</view>
</template>

<script>
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue';

	export default {
		components: {
			uniListItem
		},
		data() {
			return {
				list: [],
				page: 1,
				size: 10,
				min_id: 1,
				cid: 0,
				type: 1,
				isInvitation: 0,
				mobile: '',
				sort: 4,
				genderKey: 'gender',
				loadingType: 0,
				scrollTop: false,
				contentText: {
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				}
			};
		},
		onLoad: function(e) {
			let userId = this.$queue.getData('userId');
			if (userId) {
				this.getUserInfo(userId);
				this.loadList();
			}
		},
		onPageScroll: function(e) {
			this.scrollTop = e.scrollTop > 200;
		},
		methods: {
			//获取用户信息
			getUserInfo(userId) {
				this.$Request.postJson('/app/selectUserById?userId=' + userId).then(res => {
					if (res.code === 0) {
						this.$queue.setData('image_url', res.data.imageUrl);
						this.$queue.setData('relation_id', res.data.relationId);
						this.$queue.setData('nickName', res.data.nickName);
						this.$queue.setData('member', res.data.member);
						this.$queue.setData('isInvitation', res.data.invitationCode);
						this.$queue.setData('relation', res.data.invitationCode);
						this.$queue.setData('gender', parseInt(res.data.gender));
						this.gender = parseInt(res.data.gender);
						if (res.data.nickName) {
							this.mobile = res.data.nickName;
						} else {
							this.mobile = res.data.phone;
						}
					} else {
						this.$queue.logout();
						uni.showModal({
							title: '用户信息提示',
							content: '本地用户信息失效需要重新授权登录',
							showCancel: false,
							success: e => {
								uni.navigateTo({
									url: '../public/login'
								});
							}
						});
					}
				});
			},
			loadList: function(type) {
				this.loadingType = 1;
				let userId = this.$queue.getData('userId');
				let data = {
					page: this.page,
					limit: this.size,
					userId: userId,
					state: '1'
				};
				this.$Request.getJ('/cash/selectUserRechargeByUserIdApp', data).then(res => {
					if (res.code === 0) {
						if (this.page === 1 ) {
							this.list = [];
						}
						res.data.list.forEach(d => {
							this.list.push(d);
						});
						if (res.data.list.length === this.size) {
							this.loadingType = 0;
						} else {
							this.loadingType = 3;
						}
					} else {
						this.loadingType = 2;
					}
					uni.hideLoading();
					if (type === 'Refresh') {
						uni.stopPullDownRefresh(); // 停止刷新
					}
				});
			}
		},
		onReachBottom: function() {
			this.page = this.page + 1;
			this.loadList();
		},
		onPullDownRefresh: function() {
			this.page = 1;
			this.min_id = 1;
			this.loadList('Refresh');
		}
	};
</script>

<style lang="less">
	page{
		background: #FFFFFF;
	}
	.item {
		background: white;
		padding: 32rpx;
		margin: 32rpx;
		font-size: 28rpx;
		box-shadow: 7px 9px 34px rgba(0, 0, 0, 0.1);
		border-radius: 16upx;
	}

	.index-content {
		background-color: #f3f3f3;

		.list-item {
			background-color: #ffffff;

			.list-item-wrap {
				display: flex;
				flex-direction: column;

				.list-title {
					font-weight: bold;
				}
			}
		}
	}
</style>
