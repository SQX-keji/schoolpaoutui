<template>
	<view style="background: #FFFFFF;">
		<view class="first">
			<view class="circle">
				<view class="small">
					<view style="margin-top: 80upx;">
						<view style="font-size: 60upx;margin-bottom: 16upx;color: #FF332F;">{{list.score}}</view>
						<view style="color: #FF332F;" >信用评级：{{list.scoreName}}</view>
						<view style="color: #999999;margin-top: 20upx;" @tap="goDetail()">查看明细</view>
					</view>
				</view>
			</view>
			<view class="my">
					<view style="display: flex;align-items: center;">
						<image src="../../static/img/plus.png" style="height: 100rpx;width: 100rpx;"></image>
						<view style="margin-left: 30rpx;">
							<view style="color: #333333;">已加信用</view>
							<view style="color: #979899;">+{{list.addScore}}</view>
						</view>
					</view>
					<view style="display: flex;align-items: center;">
						<image src="../../static/img/reduce.png" style="height: 100rpx;width: 100rpx;"></image>
						<view style="margin-left: 30rpx;">
							<view style="color: #333333;">已扣信用</view>
							<view style="color: #979899;">-{{list.reduceScore}}</view>
						</view>
					</view>
			</view>
		</view>
		<view class="rule">
			<view class="ruleB">
				<view class="rtitle">信用级别</view>
				<view class="rdesc">
					0分：冻结、1-39分：差、40-79分:良、80-99:优秀、100分：完美
				</view>
			</view>
			<view class="ruleB">
				<view class="rtitle">信用处罚</view>
				<view class="rdesc">
					信用分为0分的不可接单。
				</view>
			</view>
			<view class="ruleB">
				<view style="display: flex; flex-direction: row; width: 100%;">
					<view class="rtitle">信用规则</view>
				</view>
				<view class="rdesc">
					1.接单：完成任务+2分</br>
					2.派单：完成任务+2分</br>
					3.接单：取消订单-5分</br>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				page : 0,
				size : 10,
				list: {
					id : 0,
					userId : 0,
					score:0,
					scoreName : '',
					addScore : 0,
					reduceScore:0
				}
			}
		},
		onLoad() {
			this.getList();
		},
		methods: {
			getList(){
				let userId = this.$queue.getData('userId');
				let data = {
					"userId" : userId
				}
				this.$Request.getJ('/help/selectUserScore',data).then(res =>{
					if(res.code === 0){
						this.list.id = res.data.id;
						this.list.userId = res.data.userId;
						this.list.score = res.data.score;
						if(res.data.score === 0){
							this.list.scoreName = '冻结';	
						}else if(res.data.score <= 39){
							this.list.scoreName = '差';	
						}else if(res.data.score <= 79){
							this.list.scoreName = '良';	
						}else if(res.data.score <= 99){
							this.list.scoreName = '优秀';	
						}else if(res.data.score === 100){
							this.list.scoreName = '完美';	
						}
						this.list.addScore = res.data.addScore;
						this.list.reduceScore = res.data.reduceScore;
					}
				});
			},
			goDetail: function() {
				uni.navigateTo({
					url: '/pages/my/prestigeDetail'
				});
			}
		}
	}
</script>

<style lang="less">
	.header {
		height: 88upx;
		background-color: #fff;
		display: flex;
		align-items: center;
		margin-top: 30upx;
	
		.header-title {
			width: calc(100% - 72upx);
			text-align: center;
			color: #0f1930;
			font-size: 32upx;
			font-weight: bold;
		}
	
		.detail {
			font-size: 32rpx;
			width: 104rpx;
		}
	}
	
	.first {
		height: 656rpx;
		background: #FFFFFF;
		padding: 40rpx 60rpx;
		margin-top: 20upx;
		width: 95%;
		margin-left: 20upx;
		box-shadow: rgba(183, 183, 183, 0.3) 1px 1px 10px 1px;
	}

	.circle {
		width: 400rpx;
		height: 400rpx;
		border-radius: 250rpx;
		text-align: center;
		background: #EEEEEE;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.small {
		font-size: 36rpx;
		width: 360rpx;
		height: 360rpx;
		border-radius: 180rpx;
		text-align: center;
		background: #FFFFFF;
		color: #EEEEEE;
	}
	.my{
		margin-top: 60rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #EEEEEE;
	}
	.rule{
		// margin-top: 40rpx;
		background: #FFFFFF;
		color:#B5B5B5;
		margin-top: 20upx;
		width: 95%;
		margin-left: 20upx;
		box-shadow: rgba(183, 183, 183, 0.3) 1px 1px 10px 1px;
		
		.ruleB{
			padding: 56rpx 36rpx;
			border-bottom: 1px solid #F4F4F4;
			.rtitle{
				color: #000000;
				font-weight: bold;
				margin-bottom: 16rpx;
			}
		}
		
	}
</style>
