
function ShowDiv(show_div, bg_div) {
	document.getElementById(show_div).style.display = 'block';
	document.getElementById(bg_div).style.display = 'block';
	var bgdiv = document.getElementById(bg_div);
	bgdiv.style.width = document.body.scrollWidth;
	// bgdiv.style.height = $(document).height();
	$("#" + bg_div).height($(document).height());
};
// 关闭弹出层
function CloseDiv(show_div, bg_div) {
	document.getElementById(show_div).style.display = 'none';
	document.getElementById(bg_div).style.display = 'none';
};
//在线反馈
function feedback(){
	var base = $("#base").val();
	$.post("feedback",{context:$("#context").val()},function(data){
		if(data.MSG == "描述类容长度不能超过200"){
			layer.msg('描述类容长度不能超过200', {
				icon : 2,
				time : 1000
			}, function() {
				window.location.reload();
			});
		} else if(data.MSG == "描述类容不能为空"){
			layer.msg('描述类容不能为空', {
				icon : 2,
				time : 1000
			}, function() {
				window.location.reload();
			});
		}else if(data.MSG == "请先登录"){
			layer.msg('请先登录', {
				icon : 5,
				time : 2000
			}, function() {
				location.href = base+"/login";
			});
		} else{
			layer.msg('提交成功', {
				icon : 1,
				time : 1000
			}, function() {
				location.href = "help";
			});
		}
	},"json");
}

/**
 * 账号问题
 */
//如何注册账号
function registerAccount(){
	location.href = "q_detail?id=1";
}
//修改密码
function resetPassword(){
	location.href = "q_detail?id=2";
}
//忘记登录密码
function forgetPassword(){
	location.href = "q_detail?id=3";
}
//修改手机号
function resetPhone(){
	location.href = "q_detail?id=4";
}
//收不到手机验证码
function phoneCode(){
	location.href = "q_detail?id=5";
}
//使用手机号码注册不了新账户
function registerNewUser(){
	location.href = "q_detail?id=6";
}
//注册失败
function registerError(){
	location.href = "q_detail?id=7";
}

/**
 * 价格&商品
 */
//商品是正品吗
function goodsAuthentic(){
	location.href = "q_detail?id=8";
}
//为什么价格很便宜
function cheapPrice(){
	location.href = "q_detail?id=9";
}
//商品材质/资料
function goodsMaterial(){
	location.href = "q_detail?id=10";
}
//为什么价格不一样
function priceDifferent(){
	location.href = "q_detail?id=11";
}
//限时抢购的商品如何设置开售提醒
function snappingGoods(){
	location.href = "q_detail?id=12";
}
//为什么商品上线没多久就售完了
function goodsSales(){
	location.href = "q_detail?id=13";
}

/**
 * 订单&物流
 */
//如何下单购买
function shopping(){
	location.href = "q_detail?id=14";
}
//修改订单收货地址、电话
function resetOrderAccount(){
	location.href = "q_detail?id=15";
}
//购物车无商品
function shoppingCar(){
	location.href = "q_detail?id=16";
}
//多长时间收货
function receiving(){
	location.href = "q_detail?id=17";
}
//如何查询订单
function selectOrder(){
	location.href = "q_detail?id=18";
}
//如何查询优惠券
function selectCoupon(){
	location.href = "q_detail?id=19";
}
//如何使用优惠券
function useCoupon(){
	location.href = "q_detail?id=20";
}

/**
 * 支付问题
 */
//如何支付
function pay(){
	location.href = "q_detail?id=21";
}
//支持哪些支付方式
function payType(){
	location.href = "q_detail?id=22";
}
//支付不成功订单重新支付
function againPay(){
	location.href = "q_detail?id=23";
}
//运费说明
function freightCharges(){
	location.href = "q_detail?id=24";
}

/**
 * 售后问题
 */
//如何签收与拒收商品
function sign(){
	location.href = "q_detail?id=25";
}
//如果办理退换货
function returnGoods(){
	location.href = "q_detail?id=26";
}
//可以开箱验货吗
function inspection(){
	location.href = "q_detail?id=27";
}
//包裹错发/漏发
function wrongHair(){
	location.href = "q_detail?id=28";
}
//偏远地区能否送到
function remoteAreas(){
	location.href = "q_detail?id=29";
}
//没收到商品但是订单显示签收了
function notReceived(){
	location.href = "q_detail?id=30";
}
//退货后，什么时候退款
function refundDate(){
	location.href = "q_detail?id=31";
}
//退款到哪里
function refundWhere(){
	location.href = "q_detail?id=32";
}
//退货能上门取件吗
function pickUp(){
	location.href = "q_detail?id=33";
}
//没有收到赠品怎么办
function premiums(){
	location.href = "q_detail?id=34";
}
//投诉、建议
function complaints(){
	location.href = "q_detail?id=35";
}

/**
 * 补充
 */
//如何取消订单
function cancelOrder(){
	location.href = "q_detail?id=36";
}