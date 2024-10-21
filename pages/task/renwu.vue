<template>
	<view class="content">

		<view v-for="(item, index) in list" :key="index" class="item">
			<view style="color: #333333;font-size: 32upx;width: 600upx;overflow: hidden;text-overflow: ellipsis;white-space:nowrap">{{ item.title }}</view>
			<view style="color: #666666;font-size: 28upx;margin-top: 10upx;">{{ item.content }}</view>

			<view style="margin-top: 10upx;color: #999999;font-size: 28upx;text-align: right;">{{ item.createAt }}</view>
		</view>

		<!-- 加载更多提示 -->
		<view class="s-col is-col-24" v-if="list.length > 0">
			<load-more :loadingType="loadingType" :contentText="contentText"></load-more>
		</view>
		<!-- 加载更多提示 -->
		<empty v-if="list.length === 0" des="暂无数据" show="false"></empty>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabFromIndex: 6,
				tabCurrentIndex: 0,
				fromInfo: 5,
				list: [],
				page: 1,
				loadingType: 0,
				scrollTop: false,
				contentText: {
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				}
			};
		},
		onPageScroll: function(e) {
			this.scrollTop = e.scrollTop > 200;
		},
		onReachBottom: function() {
			this.page = this.page + 1;
			this.loadData('');
		},
		onLoad(options) {
			this.loadData('');
		},
		methods: {
			topScrollTap: function() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			},
			//顶部渠道点击
			tabClicks(index) {
				this.list = [];
				this.page = 1;
				this.tabFromIndex = index;
				this.loadData('');
			},
			//获取消息列表
			loadData(type) {
				let that = this;
				let number = 10;
				this.loadingType = 1;
				uni.showLoading({
					title: '加载中...'
				});
				this.$Request
					.getT('/message/selectMessageByUserId?userId=' + this.$queue.getData('userId') + '&type=' + parseInt(this.tabFromIndex) +
						'&page=' + parseInt(this.page) + '&limit=' + number)
					.then(res => {
						if (res.code === 0) {
							if (this.page === 1) {
								this.newsList = [];
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
		onPageScroll: function(e) {
			this.scrollTop = e.scrollTop > 200;
		},
		onReachBottom: function() {
			this.page = this.page + 1;
			this.loadData('');
		},
		onPullDownRefresh: function() {
			this.page = 1;
			this.loadData('Refresh');
		}
	};
</script>

<style lang="scss">
	@import '../../static/css/index.css';

	page {
		background: #ffffff;
	}

	.content {
		background: #ffffff;
		height: 100%;
	}

	.item {
		background: white;
		padding: 16rpx;
		margin: 16rpx;
		font-size: 28rpx;
		box-shadow: 7px 9px 34px rgba(0, 0, 0, 0.1);
		border-radius: 16upx;
	}
</style>
