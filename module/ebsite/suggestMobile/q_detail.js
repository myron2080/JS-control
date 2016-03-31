
$(function(){
	var id = $("#id").val();
	if(id == 1){
		$("#detailDiv").append(
				'<h3>如何注册成为会员？</h3>'
				+'<div class="detailDivInfo"><p>进入"个人中心"，点击"注册"输入相关信息提交即可成为会员（目前只支持手机号注册）</p></div>'
		);
	} else if(id == 2){
		$("#detailDiv").append(
				'<h3>如何修改密码？</h3>'
				+'<div class="detailDivInfo"><p>你可以点击首页右上角个人中心图标进入“个人中心”，点击右上角“设置”，进入后点依次点击“账号与安全”、“修改密码”，输入相关信息提交即可</p></div>'
		);
	} else if(id == 3){
		$("#detailDiv").append(
				'<h3>忘记登录密码</h3>'
				+'<div class="detailDivInfo"><p>你可以点击首页右上角个人中心图标，进入“个人中心”，点击最上方“登录”按钮进入登录页面，点击“忘记密码”，根据提示找回密码</p></div>'
		);
	} else if(id == 4){
		$("#detailDiv").append(
				'<h3>如何修改手机号</h3>'
				+'<div class="detailDivInfo"><p>你可以点击首页右上角个人中心图标进入“个人中心”，点击右上角“设置”，进入后点依次点击“账号与安全”、“修改手机号”，输入相关信息提交即可</p></div>'
		);
	} else if(id == 5){
		$("#detailDiv").append(
				'<h3>收不到手机验证码</h3>'
				+'<div class="detailDivInfo">'
				+'<p>可能是网络问题或输入的手机号码有误导致，建议仔细检查你输入的手机号是否有误，并且确保网络畅通情况下，重新尝试获取验证码。'
				+'如果仍然无法解决，请拨打我们的客户电话咨询，祝购物愉快！</p></div>'
		);
	} else if(id == 6){
		$("#detailDiv").append(
				'<h3>使用手机号码注册不了新账户</h3>'
				+'<div class="detailDivInfo">'
				+'<p>由于目前在大麦场使用手机号注册时会提示进行绑定手机验证，即用户注册的手机号必须要获取验证码，同时该手机号必须是没有绑定过才能注册成功。如您的手机号已于其他账号绑定，则无法注册新账户，如需注册，建议使用其他号码即可。造成不便，敬请谅解！'
				+'</p></div>'
		);
	} else if(id == 7){
		$("#detailDiv").append(
				'<h3>注册失败</h3>'
				+'<div class="detailDivInfo"><p>可能是网络问题或输入信息有误导致，建议确保网络畅通情况下，关闭后重新尝试</p></div>'
		);
	} else if(id == 8){
		$("#detailDiv").append(
				'<h3>大麦场的商品是正品吗</h3>'
				+'<div class="detailDivInfo"><p>在非凡大麦场售卖的品牌均为正品行货，并且非凡大麦场为您购买的每一件商品进行承诺：老少无欺，请您放心购买</p></div>'
		);
	} else if(id == 9){
		$("#detailDiv").append(
				'<h3>为啥价格便宜</h3>'
				+'<div class="detailDivInfo"><p>1.非凡大麦场以海量订单直接从厂商进货，一手货源，拒绝中间环节；</p>'
				+'<p>2.持续大批量的采购策略、良好的厂商渠道关系、大麦场经营方雄厚的资金实力等确保我们的价格始终比周边超市更便宜</p></div>'
		);
	} else if(id == 10){
		$("#detailDiv").append(
				'<h3>商品材质/资料</h3>'
				+'<div class="detailDivInfo"><p>商品详细，商品参数信息可在“商品信息”查看材质等说明</p></div>'
		);
	} else if(id == 11){
		$("#detailDiv").append(
				'<h3>相同商品不同时期价格不一样</h3>'
				+'<div class="detailDivInfo"><p>由于我司商品由厂商或供应商提供，厂商在不同时间、不同批次，供货价格可能不同；另外促销期间，价格也会有所不同，由此为你带来困惑，我们深表歉意</p></div>'
		);
	} else if(id == 12){
		$("#detailDiv").append(
				'<h3>限时抢购的商品如何设置开售提醒</h3>'
				+'<div class="detailDivInfo"><p>点击屏幕下方的“特惠”，进入的页面点击顶部“抢购”，点击“提醒我”即可开启开售提醒</p></div>'
		);
	} else if(id == 13){
		$("#detailDiv").append(
				'<h3>为什么商品上线没多久就售完了</h3>'
				+'<div class="detailDivInfo"><p>由于我们的部分产品是以限时限量的方式进行销售，因此会有较多的会员将商品放入购物车后会占去其他商品库存量，建议您间隔5-10分钟关闭后重新打开查看，一旦有释放出来的库存，您便可以赶紧下单进行订购</p></div>'
		);
	} else if(id == 14){
		$("#detailDiv").append(
				'<h3>如何下单购买</h3>'
				+'<div class="detailDivInfo"><p>在手机端，选择购买的商品-“加入购物车”-核实商品，点击页面底部的"购物车"，进入的页面点击底部“去结算”，在结算页面，填写或修改收货地址、配送方式等，点击底部“去支付”，在支付页面选择支付方式，点击确认，按照提示完成付款即可</p></div>'
		);
	} else if(id == 15){
		$("#detailDiv").append(
				'<h3>修改订单收货地址、电话</h3>'
				+'<div class="detailDivInfo"><p>1.点击页面底部的"购物车"，进入的页面点击底部“去结算”，在结算页面，填写或修改收货地址、电话、配送方式等；</p>'
				+'<p>2.第二种方法，在个人中心，点“待支付”，点待支付的订单即可进入结算页面，填写或修改收货地址、电话</p></div>'
		);
	} else if(id == 16){
		$("#detailDiv").append(
				'<h3>购物车无商品</h3>'
				+'<div class="detailDivInfo"><p>出现“购物车还是空的，表示当前购物车中没有商品，你可以选择中意的商品加入购物车</p></div>'
		);
	} else if(id == 17){
		$("#detailDiv").append(
				'<h3>多长时间收货</h3>'
				+'<div class="detailDivInfo"><p>非凡大麦场会在订单审核合格后，尽快为您发货（一般情况下，如果当天22点以前下单，第二天即可收到货；12点以后的订单，最迟第二天收到货）</p></div>'
		);
	} else if(id == 18){
		$("#detailDiv").append(
				'<h3>如何查询订单</h3>'
				+'<div class="detailDivInfo"><p>您可以点击首页右上角个人中心图标，进入“个人中心”，点击“全部订单”或“待支付”“待收货”“退单”即可以查看相应的订单信息</p></div>'
		);
	} else if(id == 19){
		$("#detailDiv").append(
				'<h3>如何查询优惠券</h3>'
				+'<div class="detailDivInfo"><p>如需了解代金券数量及金额，请进入个人中心“我的代金券”中查询</p></div>'
		);
	} else if(id == 20){
		$("#detailDiv").append(
				'<h3>如何使用优惠券</h3>'
				+'<div class="detailDivInfo"><p>你可以按照以下流程进行操作，选购商品→进入购物车→ 使用优惠券，系统会为您自动使用符合使用条件的代金券，您可以选择取消或修改</p></div>'
		);
	} else if(id == 21){
		$("#detailDiv").append(
				'<h3>如何支付</h3>'
				+'<div class="detailDivInfo"><p>在手机端，选择购买的商品-“加入购物车”-核实商品，点击页面底部的"购物车"，进入的页面点击底部“去结算”，在结算页面，填写或修改收货地址、配送方式等，点击底部“去支付”，在支付页面选择支付方式，点击确认，按照提示完成付款即可</p></div>'
		);
	}  else if(id == 22){
		$("#detailDiv").append(
				'<h3>支持哪些支付方式</h3>'
				+'<div class="detailDivInfo"><p>非凡大麦场移动端提供付款方式有：微信支付、支付宝支付两种</p></div>'
		);
	} else if(id == 23){
		$("#detailDiv").append(
				'<h3>支付不成功订单重新支付</h3>'
				+'<div class="detailDivInfo"><p>如您支付不成功，可在“待支付”订单中重新选择您的支付方式</p></div>'
		);
	} else if(id == 24){
		$("#detailDiv").append(
				'<h3>运费说明</h3>'
				+'<div class="detailDivInfo"><p>非凡大麦场目前订单满39元，即可享受包邮；订单不满39元，统一收取运费10元/单</p></div>'
		);
	} else if(id == 25){
		$("#detailDiv").append(
				'<h3>如何签收与拒收商品</h3>'
				+'<div class="detailDivInfo"><p>非凡大麦场采用自营配送，支持开箱验货，请在配送人员还在场的情况下，当面验收您的商品；同时如果配送人员给你的商品外包装有破损时，请不要签收，选择拒收</p></div>'
		);
	} else if(id == 26){
		$("#detailDiv").append(
				'<h3>如果办理退换货</h3>'
				+'<div class="detailDivInfo"><p>1.您可以通过手机客户端“已完成订单或“我的预购”在线申请退货；</p>'
				+'<p>2.联系官方客服，配送人员将协助你完成退换货</p></div>'
		);
	} else if(id == 27){
		$("#detailDiv").append(
				'<h3>可以开箱验货吗</h3>'
				+'<div class="detailDivInfo"><p>非凡大麦场采用自营配送，支持开箱验货，请在配送人员还在场的情况下，当面验收您的商品</p></div>'
		);
	} else if(id == 28){
		$("#detailDiv").append(
				'<h3>包裹错发/漏发</h3>'
				+'<div class="detailDivInfo"><p>如发现包裹错发/漏发，请及时联系客服提供信息为您核实，我们会尽快为您处理</p></div>'
		);
	} else if(id == 29){
		$("#detailDiv").append(
				'<h3>偏远地区能否送到</h3>'
				+'<div class="detailDivInfo"><p>目前非凡大麦场仅支持新郑市区及观音寺镇及下辖地区，其余地区暂未覆盖，敬请谅解</p></div>'
		);
	} else if(id == 30){
		$("#detailDiv").append(
				'<h3>没收到商品但是订单显示签收了</h3>'
				+'<div class="detailDivInfo"><p>建议您可以先与家人核实是否已代签收，如有疑问请联系客服查询</p></div>'
		);
	} else if(id == 31){
		$("#detailDiv").append(
				'<h3>退货后，什么时候退款</h3>'
				+'<div class="detailDivInfo"><p>非凡大麦场采用退上门取件，由工作人员带回3天内办理退款</p></div>'
		);
	} else if(id == 32){
		$("#detailDiv").append(
				'<h3>退款到哪里</h3>'
				+'<div class="detailDivInfo"><p>包裹由非凡大麦场工作人员带回3天内为您办理退款。退款将原路返回，即支付宝支付订单，退款将返回到您的支付宝，微信支付，返回到微信</p></div>'
		);
	} else if(id == 33){
		$("#detailDiv").append(
				'<h3>退货能上门取件吗</h3>'
				+'<div class="detailDivInfo"><p>非凡大麦场采用退换货上门取件</p></div>'
		);
	} else if(id == 34){
		$("#detailDiv").append(
				'<h3>没有收到赠品怎么办</h3>'
				+'<div class="detailDivInfo"><p>赠品库存有限，送完即止，如果您的订单中含有赠品的话，会在您下单成功后在订单详细信息中显示该赠品的信息</p></div>'
		);
	} else if(id == 35){
		$("#detailDiv").append(
				'<h3>投诉、建议</h3>'
				+'<div class="detailDivInfo"><p>1.您可以拨打官方客服电话直接投诉或建议；</p>'
				+'<p>2.在线反馈：请点此进入投诉、建议页面，把你的问题或建议反馈给我们</p></div>'
		);
	} else if(id == 36){
		$("#detailDiv").append(
				'<h3>如何取消订单</h3>'
				+'<div class="detailDivInfo"><p>你可以按照以下流程进行操作，个人中心-待支付，选择取消订单即可</p></div>'
		);
	}
});