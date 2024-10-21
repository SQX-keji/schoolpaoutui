<template>
	<view>
		<view style="background: #FFFFFF;padding: 20upx;margin: 20upx;width: 95%;border-radius: 20rpx;">
			<view style="font-size: 32rpx;color: #333333;">举报详情</view>
			<view class="orang-view">
				<view><textarea placeholder="请输入举报详情,便于管理员审核~" v-model="content" style="color: #999999;font-size: 26rpx;width: 100%;" /></view>
			</view>
			<shmily-drag-image :list.sync="imageList"></shmily-drag-image>
		</view>
		<button style="background-color: #FF332F;width: 690upx;color: #FFFFFF;border-radius: 20rpx;margin-top: 40rpx;" @click='addPinglun()'>提交举报</button>
	</view>
</template>

<script>
	import shmilyDragImage from '@/components/shmily-drag-image/shmily-drag-image.vue'
export default {
	components: {
		shmilyDragImage
	},
	data() {
		return {
			stars: [1, 2, 3, 4, 5],
			imageList: [],
			userImage:'',
			userName:'',
			userId:'',
			content:'',
			helpTaskId:null,
			list:[],
			evaluate:'',
			score: 0
		};
	},
	onLoad(d) {
		this.helpTaskId = d.helpTaskId;
	},
	methods: {
		addPinglun(){
			let userId = this.$queue.getData('userId');
			uni.showLoading({
				title: '加载中...'
			});
			var picture = '';
			for (var i = 0; i < this.imageList.length; i++) {
				if(i === 0){
					picture = this.imageList[i];
				}else{
					picture = picture + ',' + this.imageList[i];
				}
			}
			if(this.content == ''){
				uni.hideLoading();
				this.$queue.showToast('举报内容不能为空！');
				return;
			}
			let data = {
				helpTaskId:this.helpTaskId,
				content:this.content,
				picture:picture,
				userId:userId
			}
			this.yu.request('/helpComplaint/insertHelpComplaint','POST',data).then(res =>{
				if(res.code === 0){
					uni.showToast({
						icon:'none',
						title: '举报成功！'
					});
					setTimeout(res =>{
						uni.hideLoading();
						uni.navigateBack();
					},1000);
				}
			});
		}
	}
};
</script>

<style lang="scss">
	page {
		background-color: #F2F2F2;
	}
	.ping-img{
		width: 38upx;
		height: 38upx; 
		vertical-align: text-top;
		margin-right: 14upx;
	}
	.orang-view{
		background: #F5F6F8; 
		padding: 20upx;
		border-radius: 15upx;
		margin: 20upx 0 40upx;
	}
	.header-ping{
		display: flex;
		justify-content: space-around;
		padding-bottom: 20upx;
	}
</style>
