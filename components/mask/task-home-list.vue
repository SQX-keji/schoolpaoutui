<template>
	<view class="yu-home-list">
		<block v-for="(item, index) in list" :key="index">
			<view class="home-list-item" :class="{'active-margin-bottom': bottomMargin, 'active-border-radius' : radius}" :style="{ background: backgroundColor }" @tap="clickItem(item,index)">
				<view class="item-wrap" :class="{'active-border-bottom': splitLine }">
					<view class="first-row">
						<text class="tit">{{item.content}}</text>
						<text class="zhuan">赚￥{{item.commission}}</text>
					</view>
					<view class="tag-box">
						<view class='tag-item' :class="{'tag-item-orange': item.userType == 0, 'tag-item-blue': item.userType == 1 , 'tag-item-pink': item.userType == 2}">{{item.userType == 0 ? '不限' : item.userType == 1 ? '限男生' : item.userType == 2 ? '限女生' : ''}}</view>
						<view class='tag-item tag-item-orange'>{{item.classifyName}}</view>
						<view class='tag-item tag-item-green'>{{item.status == 1 ? '待审核' : item.status == 2 ? '待接单' : item.status == 3 ? '待送达' : item.status == 4 ? '已完成' :''}}</view>
					</view>
					<view class="userInfo">
						<view class="avatar">
							<image :src="item.imageUrl"></image>
							<text>{{item.nickName}}</text>
						</view>
						<text class="date">{{item.createTime}}</text>
					</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		name: 'taskHomeList',
		props: {
			list: {
				type: Array,
				default () {
					return [];
				}
			},
			//背景颜色
			backgroundColor: {
				type: String,
				default: '#FFFFFF'
			},
			//是否需要下方横线
			splitLine: {
				type: Boolean,
				default: false
			},
			//下方20rpx margin
			bottomMargin: {
				type: Boolean,
				default: false
			},
			radius: {
				type: Boolean,
				default: false
			},
		},
		watch: {

		},
		data() {
			return {};
		},
		methods: {
			clickItem(item, index) {
				this.$emit('click', {
					item: item,
					index: index,
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.yu-home-list {
		.home-list-item {
			padding: 0 30upx;
			.item-wrap {
				padding: 30upx 0;
				.first-row {
					display: flex;
					justify-content: space-between;
				align-items: center;
					.tit {
						flex: 7;
						font-size: 32upx;
						font-weight: 800;
						color: #333333;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;/*显示几行*/
						overflow: hidden;
					}
				
					.zhuan {
						flex: 3;
						font-size: 28upx;
						font-weight: 800;
						color: #FF3530;
						text-align: center;
					}
				}
				
				.tag-box {
					display: flex;
					padding: 20upx 0 34upx;
				
					.tag-item {
						// width: 94upx;
						padding:  0 10upx 0;
						height: 38upx;
						text-align: center;
						display: inline-block;
						font-size: 24upx;
						line-height: 38upx;
						border-radius: 5upx;
						margin-right: 10upx;
					}
				
					.tag-item-blue {
						background: #D9EDFF;
						color: #66A6FF;
					}
				
					.tag-item-orange {
						background: #FFE8D9;
						color: #FF7D26;
					}
				
					.tag-item-pink {
						background: #FFD9D9;
						color: #FF6666;
					}
				
					.tag-item-green {
						background: #D9FFFB;
						color: #17D2BD;
					}
				}
				
				.userInfo {
					display: flex;
					justify-content: space-between;
					align-items: center;
				
					.avatar {
						height: 60upx;
						display: flex;
						align-items: center;
				
						image {
							width: 60upx;
							height: 100%;
							border-radius: 50%;
						}
				
						text {
							font-size: 28upx;
							font-weight: 500;
							color: #666666;
							margin-left: 15upx;
						}
					}
				
					.date {
						font-size: 28upx;
						font-weight: 500;
						color: #666666;
					}
				}
			}
			
		}
		// 是否有底部线条
		.home-list-item .active-border-bottom {
			border-bottom: 2rpx solid #E6E6E6;
		}
		
		.home-list-item:last-child .active-border-bottom {
			// 是否有底部线条
			border-bottom: 0;
		}

		// 是否圆角
		.active-border-radius {
			border-radius: 10upx;
		}

		// 是否有底部20rpx边距
		.active-margin-bottom {
			margin-bottom: 20upx;
		}

		.active-margin-bottom:last-child {
			margin-bottom: 0;
		}
	}
</style>
