<template>
	<view>
		<!-- <uni-list v-show="list.length > 0" class="index-content">
			<uni-list-item class="list-item" :show-arrow="false" v-for="(item, index) in list" :key="index">
				<view class="list-item-wrap">
					<view class="list-title">{{ item.title }}</view>
					<view class="list-title" style="margin-top: 10upx;">{{ item.content }}</view>
					<view style="display: flex;justify-content: space-between;margin-top: 20rpx;">
						<view>
							<text>{{ item.createTime }}</text>
						</view>
					</view>
				</view>
			</uni-list-item>
		</uni-list> -->
		<!-- 添加 -->
		<view class="item_wrap" v-for="(item,index) in list" :key="index">
			<view class="title1"><text>{{item.title}}</text></view>
			<view class="title2"><text>{{item.content}}</text></view>
			<view class="createTime">{{ item.createTime }}</view>
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
		onPageScroll: function(e) {
			this.scrollTop = e.scrollTop > 200;
		},
		methods: {
			loadList: function(type) {
				this.loadingType = 1;
				let userId = this.$queue.getData('userId');
				let data = {
					page: this.page,
					limit: this.size,
					userId: userId
				};
				console.log('loadList',data)
				this.$Request.getT('/userMoney/selectUserMoneyDetails', data).then(res => {
					console.log('userMoney',res)
					if (res.code === 0) {
						if (this.page === 1) {
							this.list = [];
						}
						for (var i = 0; i < res.data.list.length; i++) {
							this.list.push(res.data.list[i]);
						}
						console.log('list',this.list,this.size)
						
						this.min_id = res.min_id;
						
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
		onLoad: function(e) {
			this.loadList();
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
	page {
		background: #FFFFFF;
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
	
	
	.item_wrap{
		padding-left: 30upx;
		padding-bottom: 20upx;
		border-bottom: 2upx solid #CCCCCC;
		margin-bottom: 20upx;
	}
	.title1{
		font-size: 32upx;
		font-weight: bold;
	}
	.title2{
		font-size: 32upx;
		font-weight: bold;
		margin: 20upx 0;
	}
	.createTime{
		font-size: 28upx;
	}
</style>
