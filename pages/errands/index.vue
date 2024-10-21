<template>
	<view class="container">
		<view class="header">
			<scroll-view scroll-x class="nav" scroll-with-animation :scroll-left="scrollLeft">
				<view class="nav-item" v-for="(item, index) in tabBars" :key="index" @tap="tabSelect(item.id,index)">
					<view class="tab-item-title" :class="{ 'tab-item-title-active': index == tabIndex }">
						<view class="name">{{ item.classifyName }}</view>
						<view class="line"></view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="main">
			<view class="card-box">
				<task-home-list bottomMargin radius @click="clickItem" :list="goodsHomeList"></task-home-list>
			</view>
			<!-- 加载更多提示 -->
			<view v-if="goodsHomeList.length > 0">
				<load-more :loadingType="loadingType" :contentText="contentText"></load-more>
			</view>
			<!-- 暂无数据展示 -->
		</view>
		<empty v-if="goodsHomeList.length === 0" des="暂无任务数据" show="false"></empty>
		<view class="release" @tap="goRelease">
			<text class="cuIcon-add"></text>
			<text>发布</text>
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
			campusId:null,
			tabIndex:0,
			scrollLeft: 0,
			tabBars: [],
			classifyId: null,
			goodsHomeList:[],
			page:1,
			limit:10,
			loadingType: 0,
			contentText: {
				contentdown: '上拉显示更多',
				contentrefresh: '正在加载...',
				contentnomore: '没有更多数据了'
			},
			arr: []
		};
	},
	onLoad() {
		this.campusId = this.yu.getCache('campus');
		this.getTabList();
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
		this.campusId = this.yu.getCache('campus');
		this.getHelpOrderByClassifyList();
	},
	methods: {
		getTabList(type) {
			this.yu.request('/helpClassify/selectClassifyList', 'GET').then(res => {
				if (res.code === 0) {
					this.tabBars = res.data;
					if(type === "refresh") {
						this.getHelpOrderByClassifyList('refresh');
					}else {
						this.classifyId = res.data[0].id;
						this.campusId = this.yu.getCache('campus');
						setTimeout(()=>{
							this.getHelpOrderByClassifyList();
						},10);
					}
				}
			});
		},
		// 切换
		tabSelect: function(itemId,index) {
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
			let id = index;
			this.tabIndex = id;
			this.classifyId = itemId;
			this.scrollLeft = (id - 1) * 48;
			this.page = 1;
			this.getHelpOrderByClassifyList();
		},
		getHelpOrderByClassifyList(type) {
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
						this.goodsHomeList = [];
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
									this.goodsHomeList.push(dd);
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
			uni.navigateTo({
				url: '/pages/index/taskDetail?helpOrderId=' + options.item.id
			})
		},
		goRelease: function() {
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
			if(token) {
				uni.$emit('demandInfo', {
					content: '',
					phone: ''
				});
				uni.navigateTo({
					url: '/pages/order/release?type=empty'
				});
			}else {
				this.yu.setCache('href', '/pages/errands/index');
				uni.navigateTo({
					url: '/pages/public/login'
				});
			}
			
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
		this.page = this.page + 1;
		this.getHelpOrderByClassifyList();
	},
	onPullDownRefresh: function() {
		this.page = 1;
		this.getTabList('refresh');
	}
};
</script>

<style lang="scss">
	page {
		width: 100%;
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
			padding: 100upx 20upx 20upx;
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
