<template>
	<view class="container">
		<view class="main">
			<view class="card-box">
				<task-home-list bottomMargin radius @click="clickItem" :list="goodsTaskList"></task-home-list>
			</view>
			<!-- 加载更多提示 -->
			<view v-if="goodsTaskList.length > 0">
				<load-more :loadingType="loadingType" :contentText="contentText"></load-more>
			</view>
			<!-- 暂无数据展示 -->
			<empty v-if="goodsTaskList.length === 0" des="暂无任务数据" show="false"></empty>
		</view>
	</view>
</template>

<script>
	import taskHomeList from "@/components/mask/task-home-list.vue"
export default {
	components: {
		taskHomeList
	},
	data() {
		return {
			goodsTaskList:[],
			page:1,
			limit:10,
			loadingType: 0,
			contentText: {
				contentdown: '上拉显示更多',
				contentrefresh: '正在加载...',
				contentnomore: '没有更多数据了'
			},
		};
	},
	onLoad(e) {
		let type = e.type;
		this.type = e.type;
		if(type == 'directSearch') {
			uni.setNavigationBarTitle({
				title: e.searchValue
			});
			this.classifyId = e.classifyId;
			this.campusId = this.yu.getCache('campus');
			this.directSearchList()
		}else if(type == 'fuzzySearch') {
			uni.setNavigationBarTitle({
				title: '任务列表'
			});
			this.content = e.searchValue;
			this.campusId = this.yu.getCache('campus');
			this.fuzzySearchList()
		}
	},
	onShow() {
		this.campusId = this.yu.getCache('campus');
	},
	methods: {
		directSearchList(type) {
			let postData = { 
				classifyId: this.classifyId,
				campus: this.campusId,
				page: this.page, 
				limit: this.limit
			}
			this.loadingType = 1;
			this.yu.request('/help/selectHelpOrderByClassifyList', 'GET', postData).then(res => {
				if (res.code === 0) {
					if (this.page === 1 ) {
						this.goodsTaskList = [];
					}
					uni.hideLoading();
					if(res.data.list) {
						res.data.list.forEach(dd => {
							this.yu.request('/helpClassify/selectClassifyList', 'GET').then(ress => {
								if (ress.code === 0) {
									ress.data.forEach(ddd => {
										if(dd.classifyId == ddd.id) {
											dd.classifyName = ddd.classifyName
										}
									});
									dd.imageUrl = dd.imageUrl != null ? dd.imageUrl : '/static/img/logo.png'
									this.goodsTaskList.push(dd);
								}
							});
						});
					}
					if (res.data.list.length === this.limit) {
						this.loadingType = 0;
					} else {
						this.loadingType = 3;
					}
				} else {
					this.loadingType = 2;
				}
				if (type === "refresh") {
					uni.stopPullDownRefresh(); // 停止刷新
				}
			})
		},
		fuzzySearchList(type) {
			let postData = { 
				content: this.content,
				campus: this.campusId,
				page: this.page, 
				limit: this.limit
			}
			this.loadingType = 1;
			this.yu.request('/help/selectHelpOrderByNameList', 'GET', postData).then(res => {
				console.log(res)
				if (res.code === 0) {
					if (this.page === 1 ) {
						this.goodsTaskList = [];
					}
					uni.hideLoading();
					if(res.data.list) {
						res.data.list.forEach(dd => {
							this.yu.request('/helpClassify/selectClassifyList', 'GET').then(ress => {
								if (ress.code === 0) {
									ress.data.forEach(ddd => {
										if(dd.classifyId == ddd.id) {
											dd.classifyName = ddd.classifyName
										}
									});
									this.goodsTaskList.push(dd);
								}
							});
						});
					}
					if (res.data.list.length === this.limit) {
						this.loadingType = 0;
					} else {
						this.loadingType = 3;
					}
				} else {
					this.loadingType = 2;
				}
				if (type === "refresh") {
					uni.stopPullDownRefresh(); // 停止刷新
				}
			})
		},
		clickItem: function(options) {
			uni.navigateTo({
				url: '/pages/index/taskDetail?helpOrderId=' + options.item.id
			})
		},
		getUserInfo(userId) {
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
					let campus = res.data.campus;
					if(campus){
						this.yu.setCache("campus", res.data.campus);
					}
					uni.stopPullDownRefresh();
				}
			});
		},
	},
	onReachBottom: function() {
		let type = this.type;
		if(type == 'directSearch') {
			this.page = this.page + 1;
			this.directSearchList()
		}else if(type == 'fuzzySearch') {
			this.page = this.page + 1;
			this.fuzzySearchList()
		}
	},
	onPullDownRefresh: function() {
		let type = this.type;
		if(type == 'directSearch') {
			this.page = 1;
			this.directSearchList('refresh');
		}else if(type == 'fuzzySearch') {
			this.page = 1;
			this.fuzzySearchList('refresh');
		}
	}
};
</script>

<style lang="scss">
	page {
		width: 100%;
		background-color: #f8f8f8;
	}
	.container {
		width: 100%;
		.header {
			width: 100%;
			height: 80upx;
			background-color: #FFF;
			display: flex;
			align-items: center;
			position: fixed;
			.nav {
				.nav-item {
					display: inline-block;
					margin: 0 34upx;
					.tab-item-title {
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: space-between;
						padding-top:20upx;
						.name {
							font-size: 32upx;
							font-weight: 500;
							color: #666;
							line-height: 32upx;
							text-align: center;
							margin-bottom: 20upx;
						}
						.line {
							width: 90upx;
							height: 8upx;
							background: #FFF;
							border-radius: 4upx;
						}
					}
					.tab-item-title-active {
						.name {
							font-size: 32upx;
							font-weight: 800;
							color: #333;
						}
						.line {
							width: 90upx;
							height: 8upx;
							background: #FF3530;
							border-radius: 4upx;
						}
					}
				}
			}
		}
		.main {
			width: 100%;
			padding: 20upx 20upx 20upx;
		}
		.release {
			width: 120upx;
			height: 120upx;
			border-radius: 50%;
			background-color: #FF3630;
			color: #fff;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			position: fixed;
			right: 5%;
			bottom: 15%;
			z-index: 100;
			.cuIcon-add {
				font-size: 38upx;
				font-weight: bold;
			}
		}
	}

</style>
