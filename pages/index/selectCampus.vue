<template>
	<view class="container">
		<view class="search-bar">
			<view class="search-bar-form">
				<view class="search-bar-box">
					<icon class="icon-search-in-box" type="search" size="16"></icon>
					<input confirm-type="search" class="search-bar-input" placeholder="输入校园名称或首字母查询" placeholder-class="phcolor"
					 :value="inputVal" :focus="inputShowed" @input="inputTyping" />
					<view class="icon-clear" v-if="inputVal" @tap="clearInput">
						<!-- #ifdef APP-PLUS || MP -->
						<icon type="clear" :size="15"></icon>
						<!-- #endif -->
						<!-- #ifdef H5 -->
						<tui-icon name="close-fill" :size="16" color="#bfbfbf"></tui-icon>
						<!-- #endif -->
					</view>
				</view>
			</view>
		</view>
		<view class="tui-list search-result" v-if="inputShowed">
			<view class="tui-list-cell" hover-class="tui-list-cell-hover" v-for="(item,index) in searchResult" :key="index" @tap="selectCity" :data-item="item" :hover-stay-time='150'>
				<view class="tui-list-cell-navigate">
					{{item.campusName}}
				</view>
			</view>
		</view>
		<view v-if="!inputVal">
			<view class="current-city">
				<view class="title">当前所选校园</view>
				<view class="city-name">
					<tui-icon name="position-fill" color="#FF3530" :size="18"></tui-icon>
					{{localCampus}}
				</view>
			</view>
			<view class="tui-list city-list">
				<block v-for="(item,index) in list" :key="index">
					<view class="tui-list-cell" hover-class="tui-list-cell-hover"
					 @tap="selectCity(item)" :data-item="item" :hover-stay-time='150'>
						<view class="tui-list-cell-navigate" :class="[list.length-1==index?'last':'']">
							{{item.campusName}}
						</view>
					</view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	import ZhToPinYin from '@/js_sdk/tui-zh-pinyin/tui-zh-pinyin.js';
	export default {
		data() {
			return {
				inputVal: '', // 搜索框输入的内容
				inputShowed: false, // 输入框是否显示
				list:[],
				searchResult: [], // 搜索城市的结果
				localCampus: "",
			}
		},
		onLoad: function(options) {
			const that = this;
			that.localCampus = options.localCampus || "";
			that.initCampusList();
		},
		methods: {
			initCampusList() {
				let that = this;
				that.yu.request('/helpCampus/selectCampusList', 'GET').then(res => {
					console.log(res)
					if (res.code === 0) {
						that.zhToPinYin = new ZhToPinYin(true);
						res.data.forEach((item, index) => {
							// console.log(item)
							item.keyword = item.campusName + (that.zhToPinYin.getPinYin(item.campusName, false)).toLocaleUpperCase();
							that.list.push(item)
						});
					}
				})
			},
			showInput() {
				this.inputShowed = true
			},
			clearInput() {
				this.inputVal = "";
				this.inputShowed = false;
				this.searchResult = [];
				uni.hideKeyboard() //强行隐藏键盘
			},
			inputTyping(e) {
				this.inputVal = e.detail.value;
				if(e.detail.value.length === 0) {
					this.searchResult = [];
					this.inputShowed = false
				}else {
					this.inputShowed = true
				}
				this.searchCity()
			},
			// 搜索城市
			searchCity() {
				let result = []
				this.list.forEach((item1, index1) => {
					console.log(item1.keyword.indexOf(this.inputVal.toLocaleUpperCase()))
					if (item1.keyword.indexOf(this.inputVal.toLocaleUpperCase()) !== -1) {
						result.push(item1)
					}
				})
				this.searchResult = result
			},
			// 选择城市
			selectCity(e) {
				console.log(e)
				let item = e;
				console.log(item)
				this.yu.setCache('campus',item.campusId);
				this.yu.setCache('campusName',item.campusName);
				// //返回并刷新上一页面
				uni.$emit('data', item);
				uni.navigateBack({delta: 1})
			},
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}
	.page {
		height: 100%;
		overflow: hidden;
	}

	.search-bar {
		display: flex;
		align-items: center;
		position: relative;
		padding: 27rpx 30rpx 35rpx;
		background-color: #fff;
	}

	.search-bar-form {
		flex: 1;
		position: relative;
		border-radius: 32rpx;
		background: #f2f5f7;
	}

	.search-bar-box {
		display: flex;
		align-items: center;
		position: relative;
		padding-left: 20rpx;
		padding-right: 20rpx;
		height: 64rpx;
		z-index: 1;
	}

	.search-bar-input {
		line-height: normal;
		width: 100%;
		padding-left: 20rpx;
		font-size: 30rpx;
		color: #333;
	}

	.phcolor {
		font-size: 30rpx;
	}

	.icon-clear {
		height: 38rpx;
	}

	.icon-clear .tui-icon-class {
		display: block
	}
	
	.search-bar-label {
		height: 64rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 2;
		border-radius: 32rpx;
		color: #ccc;
		background: #f2f5f7;
	}

	.icon-search {
		position: relative;
		height: 26rpx;
		margin-right: 20rpx;
		font-size: inherit;
	}

	.search-bar-text {
		font-size: 30rpx;
		line-height: 32rpx;
	}

	.cancel-btn {
		padding-left: 30rpx;
	}

	.search-result::before {
		display: none;
	}

	.search-result::after {
		display: none;
	}

	.tui-list-cell {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.tui-list-cell-hover {
		background-color: #eee !important;
	}

	.tui-list-cell-navigate {
		width: 100%;
		position: relative;
		padding: 30rpx 0 30rpx 30rpx;
		font-size: 28rpx;
		color: #333;
	}

	.tui-list-cell-navigate::after {
		content: '';
		position: absolute;
		border-bottom: 1rpx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 30rpx;
	}

	.current-city {
		padding: 0 30rpx 30rpx;
		background: #fff;
	}

	.tui-icon-class {
		margin-right: 10rpx;
	}

	.current-city .title {
		font-size: 24rpx;
		line-height: 24rpx;
		color: #999;
	}

	.city-name {
		display: flex;
		align-items: center;
		margin-top: 17rpx;
		font-size: 30rpx;
		font-weight: bold;
		line-height: 30rpx;
		color: #333;
	}

	.hot-city .title {
		height: 48rpx !important;
		padding-left: 30rpx;
		font-size: 24rpx !important;
		line-height: 48rpx !important;
		color: #999;
		background: #f2f5f7 !important;
	}

	.city-names {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-content: space-between;
		padding: 12rpx 90rpx 26rpx 30rpx;
		background: #fff;
	}

	.city-name-item {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 140rpx;
		height: 56rpx;
		margin-top: 16rpx;
		/* border: solid 1rpx #ccc; */
		border-radius: 28rpx;
		font-size: 28rpx;
		color: #333;
		position: relative;
	}

	.city-name-item::before {
		content: "";
		position: absolute;
		width: 200%;
		height: 200%;
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		-webkit-transform: scale(0.5, 0.5);
		transform: scale(0.5, 0.5);
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		left: 0;
		top: 0;
		border-radius: 56rpx;
		border: 1px solid #ccc;
	}

	.tap-city {
		color: #fff;
		background: #5677fc;
		/* border: solid 1rpx #5677fc; */
	}

	.tui-list {
		background-color: #fff;
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-list-cell-divider {
		height: 48rpx;
		padding-left: 30rpx;
		font-size: 24rpx;
		color: #999;
		background: #f2f5f7;
		padding: 0 30rpx;
		display: flex;
		align-items: center;
	}

	.tui-indexed-list-bar {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		z-index: 9999;
		position: absolute;
		top: 132rpx;
		right: 0;
		padding-right: 10rpx;
		width: 44rpx;
	}

	.tui-indexed-list-text {
		font-size: 22rpx;
		white-space: nowrap;
	}

	.tui-indexed-list-bar.active {
		background-color: rgb(200, 200, 200);
	}

	.tui-indexed-list-alert {
		position: absolute;
		z-index: 20;
		width: 160rpx;
		height: 160rpx;
		left: 50%;
		top: 50%;
		margin-left: -80rpx;
		margin-top: -80rpx;
		border-radius: 80rpx;
		text-align: center;
		line-height: 160rpx;
		font-size: 70rpx;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.5);
	}
</style>
