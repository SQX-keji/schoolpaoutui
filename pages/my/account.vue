<template>
    <view class="container">
		<!-- #ifndef MP-WEIXIN -->
        <view class="list-cell b-b" @click="navTo('/pages/public/pwd')" hover-class="cell-hover"
              :hover-stay-time="50">
            <text class="cell-tit">修改密码</text>
			<text class="right cuIcon-right"></text>
        </view>
		<!-- #endif -->
		<view class="list-cell b-b" @click="navTo('/pages/member/feedback')" hover-class="cell-hover"
		      :hover-stay-time="50">
		    <text class="cell-tit">意见反馈</text>
			<text class="right cuIcon-right"></text>
		</view>
		<!-- #ifndef MP-WEIXIN -->
        <view class="list-cell b-b" style="margin-top: 2upx" @click="navTo('/pages/public/bind')"
              hover-class="cell-hover"
              :hover-stay-time="50">
            <text class="cell-tit">换绑手机号</text>
			<text class="right cuIcon-right"></text>
        </view>
		<!-- #endif -->
		<view class="list-cell b-b" style="margin-top: 2upx"
		      hover-class="cell-hover"
		      :hover-stay-time="50">
		    <text class="cell-tit">当前校区</text>
			<view class="right-txt">
				<picker @change="bindPickerChangeClassify" :value="classifyIndex" :range="classifyArray">
				    <text>{{campusName}}</text>
				</picker>
				<text class="right cuIcon-right"></text>
			</view>
		</view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                isShow: false,
                version: '',
                relation_id:'',
				campusName:'',
				classifyIndex:0,
				classifyArray:[],
				classifyArrayNew:[]
            };
        },
        onShow() {
            let that = this;
            let token = this.$queue.getData("token");
            let userId = this.$queue.getData("userId");
            let relation_id = this.$queue.getData("relation_id");
			that.getUserInfo(userId)
			that.initCampusList();
            if (relation_id) {
                this.relation_id = relation_id;
            }
            if (token) {
                this.isShow = true;
            }

        },
        methods: {
			initCampusList() {
				let that = this;
				that.yu.request('/helpCampus/selectCampusList', 'GET').then(res => {
					if (res.code === 0) {
						if(res.data.length !== 0) {
							that.classifyArrayNew = res.data;
							res.data.forEach(dd => {
								that.classifyArray.push(dd.campusName);
							});
							console.log('新数组',that.classifyArray)
							that.campusName=that.classifyArray[0]
						}
					}
				});
			},
            navTo(url) {
                let token = this.$queue.getData("token");
                if (token) {
                    uni.navigateTo({
                        url: url
                    });
                } else {
                    uni.navigateTo({
                        url: '/pages/public/login'
                    });
                }
            },
            navTo1(url) {
                uni.navigateTo({
                    url: url
                });
            },
            about(url) {
                uni.showModal({
                    showCancel: false,
                    title: '省钱兄',
                    content: '省钱兄是一个汇聚了全网隐藏优惠券的网购返利软件 ！这里汇聚淘宝、京东、天猫、拼多多等商城优惠券信息！每天实时更新优惠券，发放一些商家的大额优惠券！这里可以帮你网购省钱返利，也可以帮你兼职赚钱！每年最高能让你网购省50%的钱！\n\n西安省钱兄网络科技有限公司',
                    success: (e) => {
                        if (e.confirm) {

                        }
                    }
                });
            },
            //switch
            switchChange(e) {
                let statusTip = e.detail.value ? '打开' : '关闭';
                this.$api.msg(`${statusTip}消息推送`);
            },
            update() {
                //#ifdef APP-PLUS
                // APP检测更新 具体可以参考：https://ask.dcloud.net.cn/article/35667
                plus.runtime.getProperty(plus.runtime.appid, widgetInfo => {
                    this.$Request.get("/update.json").then(res => {
                        console.error(res.wgtUrl);
                        console.error(res.version);
                        console.error(widgetInfo.version);
                        if (res.wgtUrl && widgetInfo.version < res.version) {
                            uni.downloadFile({
                                url: res.wgtUrl,
                                success: (downloadResult) => {
                                    if (downloadResult.statusCode === 200) {
                                        plus.runtime.install(downloadResult.tempFilePath, {
                                            force: false
                                        }, (d) => {
                                            console.log('install success...');
                                            plus.runtime.restart();
                                        }, (e) => {
                                            console.error('install fail...');
                                        })
                                    }
                                }
                            })
                        }
                    })
                });
                //#endif
            },
			getUserInfo(userId) {
				// 更新登录信息
				this.yu.request("/app/selectUserById?userId=" + userId, 'POST').then(res => {
					if (res.code === 0) {
						console.log('更新登录信息',res)
						if(res.data.campusName==null){return;}
						this.campusName = res.data.campusName;
						
					}
				});
			},
			bindPickerChangeClassify(e) {
				this.classifyIndex = e.target.value;
				let campusId = this.classifyArrayNew[e.target.value].campusId;
				let campusName = this.classifyArrayNew[e.target.value].campusName;
				console.log(campusName)
				this.updateCampus(campusId,campusName);
			},
			updateCampus(campusId,campusName) {
				// /user/updateCampusByUserId   修改校区   get   campus  校区id  userId  用户id
				let that = this;
				let userId = this.$queue.getData("userId");
				let data = {
					campus:campusId,
					userId:userId
				};
				that.yu.request('/user/updateCampusByUserId', 'GET', data).then(res => {
					if (res.code === 0) {
						this.yu.toast('修改成功','success')
						this.yu.setCache("campus", campusId);
						this.yu.setCache("campusName", campusName);
						this.getUserInfo(userId)
					}
				});
			}
        }
    }
</script>

<style lang='scss'>
    page {
        background: $page-color-base;
    }
	.right-txt {
		display: flex;
		align-items: center;
	}

    .list-cell {
        display: flex;
        align-items: baseline;
        padding: 20upx $page-row-spacing;
        line-height: 60upx;
        position: relative;
        background: #fff;
        justify-content: center;

        &.log-out-btn {
            margin-top: 40upx;

            .cell-tit {
                color: $uni-color-primary;
                text-align: center;
                margin-right: 0;
            }
			
        }

        &.cell-hover {
            background: #fafafa;
        }

        &.b-b:after {
            left: 32upx;
        }

        &.m-t {
            margin-top: 18upx;
        }

        .cell-more {
            align-self: baseline;
            font-size: $font-lg;
            color: $font-color-light;
            margin-left: 12upx;
        }

        .cell-tit {
            flex: 1;
            font-size: $font-base + 2upx;
            color: $font-color-dark;
            margin-right: 12upx;
        }

        .cell-tip {
            font-size: $font-base;
            color: $font-color-light;
        }

        switch {
            transform: translateX(8px) scale(.84);
        }
    }
</style>
