<template>
	<view>
		<loading :loadModal="loadModal"></loading>
		<cu-custom bgColor="bg-gradual-blue" class="customHead" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">装箱查询</block>
		</cu-custom>
		<scroll-view scroll-y class="page" :style="{ height: pageHeight + 'px' }">
			<view v-for="(item, index) in cuIList" :key="index">
				<view class="cu-list menu-avatar">
					<view class="cu-item" style="width: 100%;padding:15rpx 0 15rpx 0;margin-top: 2px;height: auto;">
						<view style="clear: both;width: 100%;" class="grid text-left col-2" data-target="Modal"
							data-number="item.number">
							<view class="text-grey">提交日期:{{ item[0].FCreatedate }}</view>
							<view class="text-grey">单据编号:{{ item[0].FBillNo }}</view>
							<view class="text-grey" style="width: 100%;">包装码:{{ item[0].fpackcode }}</view>
							<block v-for="(itemt, indext) in item" :key="indext">
								<view class="text-grey">{{ indext+1 }}:产品码:{{ itemt.FBarCode }}</view>
							</block>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>
<script>
	import production from '@/api/production';
	import service from '@/service.js';
	import loading from '@/components/loading';
	export default {
		components: {
			loading
		},
		data() {
			return {
				pageHeight: 0,
				headName: '',
				loadModal: false,
				gridCol: 3,
				cuIList: [],
			};
		},
		onUnload() {
			// 移除监听事件
			uni.$off('scancodedate');
		},
		onLoad: function(option) {
			let me = this;
			uni.$on('scancodedate', function(data) {
				// _this 这里面的方法用这个 _this.code(data.code)
				me.getScanInfo(data.code);
			});
		},
		onReady: function() {
			var me = this;
			me.getScanInfo(1);
			uni.getSystemInfo({
				success: function(res) {
					// res - 各种参数
					setTimeout(function() {
						me.pageHeight = res.windowHeight - 30;
					}, 1000);
				}
			});
		},
		methods: {
			getScanInfo(res) {
				var that = this;
				let number = 0;
				console.log(res)
				production
					.checkBarCode({
						uuid: res,
					})
					.then(reso => {
						console.log(reso)
						if (reso.success) {
							let array = []
							let result = []
							let itemArr = []
							reso.data.forEach((item, index) => {
								if (result.indexOf(item.fpackcode) == -1) {
									result.push(item.fpackcode)
									if (index != 0) {
										array.push(itemArr)
									}
									itemArr = []
									itemArr.push(item)
								} else {
									itemArr.push(item)
								}
								if (reso.data.length == index + 1) {
									array.push(itemArr)
								}

							})
							/* that.boxList = array; */
							that.cuIList = array
						}
					})
					.catch(err => {
						uni.showToast({
							icon: 'none',
							title: err.message
						});
					});
			},
		}
	};
</script>

<style>
	.action {
		font-size: 13px !important;
	}

	.ruidata {
		font-size: 13px;
		height: 7vw !important;
	}

	.box {
		width: 100%;
	}

	.cu-bar {
		min-height: 30px;
	}

	/* .page {
		height: calc(100vh - 75px);
	} */
	.nav-title::first-letter {
		font-size: 16px;
		margin-right: 2px;
	}

	.loading-text {
		height: 80upx;
		line-height: 80upx;
		font-size: 30upx;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}
</style>
