<template>
	<view class="container">
		<!-- 搜索板块 -->
		<view class="header">
			<view class="tui-search">
				<input type="text" class="text-search" v-model="searchValue" placeholder="输入关键字搜索任务" />
			</view>
			<view @tap='rtBubble' class="btn">搜索</view>
		</view>
		<view class="main">
			<view class="listitem" v-for="(item, index) in selectOption" :key="index">
				<view class="title">
					<view class="item">
						<view @click="itemClick(item)">
							<view class="item-text">{{ item.classifyName }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				selectOption: [],
				searchValue: ''
			};
		},
		onLoad() {
			this.getselectClassifyList();
		},
		methods: {
			getselectClassifyList() {
				this.yu.request('/helpClassify/selectClassifyList', 'GET').then(res => {
					if (res.code === 0) {
						res.data.forEach(dd => {
							this.selectOption.push(dd);
						});
					}
				});
			},
			rtBubble() {
				if (this.searchValue === '' || this.searchValue === ' ') {
					uni.showToast({
						icon: 'none',
						title: '搜索框输入为空'
					});
				}else {
					uni.navigateTo({
						url:'/pages/task/tasklist?searchValue=' + this.searchValue + '&classifyId&type=fuzzySearch' 
					});
					this.searchValue = ''
				}
			},
			itemClick(item) {
				uni.navigateTo({
					url:'/pages/task/tasklist?searchValue=' + item.classifyName + '&classifyId=' + item.id + '&type=directSearch' 
				});
			}
		}
	};
</script>

<style lang="scss">
	page {
		background: #FFFFFF;
	}

	.container {
		.header {
			width: 100%;
			height: 88upx;
			background-color: #FFF;
			padding: 0 20upx;
			display: flex;
			align-items: center;
			border-bottom: 1upx solid #dcdcdc;
			justify-content: space-between;
			position: fixed;

			.tui-search {
				flex: 1;
				height: 60upx;

				.text-search {
					line-height: 60upx;
					padding: 0 20upx;
					background: #F2F2F2;
					height: 60upx;
					border-radius: 32upx;
					display: flex;
					color: #333;
					font-size: 28upx;
				}
			}

			.btn {
				color: #333333;
				background-color: #FFFFFF;
				font-size: 30upx;
				margin-left: 20upx;
			}
		}
		.main {
			padding-top: 88upx;
			.title {
				padding: 20upx;
			}
			.item-text-title {
				color: #000000;
				font-size: 15px;
				font-weight: bold;
				margin-left: 20upx;margin: 10upx; color: #333;
			}
			
			.item {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
			}
			
			.item-text {
				margin-left: 20upx;
				border-radius: 50upx;
				margin: 10upx;
				border: 1px solid #dee0de;
				padding: 5upx;
				padding-left: 20upx;
				padding-right: 20upx;
				font-size: 13px;
				color: #555555;
			}
		}
	}


	
</style>
