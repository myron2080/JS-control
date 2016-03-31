
var turnplate={
		restaraunts:[],				//大转盘奖品名称
		colors:[],					//大转盘奖品区块对应背景颜色
		outsideRadius:192,			//大转盘外圆的半径
		textRadius:155,				//大转盘奖品位置距离圆心的距离
		insideRadius:68,			//大转盘内圆的半径
		startAngle:0,				//开始角度
		bRotate:false				//false:停止;ture:旋转
};

//旋转转盘 item:奖品位置; txt：提示语;
var rotateFn = function (item, txt,durationtmp){
	var angles = item * (360 / turnplate.restaraunts.length) - (360 / (turnplate.restaraunts.length*2));
	if(angles<270){
		angles = 270 - angles; 
	}else{
		angles = 360 - angles + 270;
	}
	$('#wheelcanvas').stopRotate();
	$('#wheelcanvas').rotate({
		angle:0,
		animateTo:angles+1800,
		duration:durationtmp,
		callback:function (){
			if (txt == "谢谢参与") {
				$("#unlucky").css("display","block");
				$(".js").fadeIn(500);
			} else {
				$("#prizeName").text("奖品"+txt+"一个");
				$("#lucky").css("display","block");
				$(".js").fadeIn(500);
			}
			turnplate.bRotate = !turnplate.bRotate;
		}
	});
};


$(document).ready(function(){
	//判断活动是否存在
	if ($("#status").val() == "0") {
		$("#actInfo").css("display","block");
		$(".js").fadeIn(500);
		return;
	}
	//用户id不能为空
	if (!isNotNull($("#code").val())) {
		$("#guanzhu").css("display","block");
		$(".js").fadeIn(500);
	}
	//抽奖活动数据
	var prize = getLuckyDrawInfos();
	//动态添加大转盘的奖品与奖品区域背景颜色
	turnplate.restaraunts = prize;
	turnplate.colors = ["#ffd206", "#fff6a0", "#ffd206", "#fff6a0","#ffd206", "#fff6a0"];
	//滚动中奖列表
	getLukcyList();
	//获取用户的抽奖次数
	if (isNotNull($("#mobilePhone").text())) {
		$(".btn-dialog").css("display","none");
		updateUserId();
	}
	
	var rotateTimeOut = function (){
		$('#wheelcanvas').rotate({
			angle:0,
			animateTo:2160,
			duration:8000,
			callback:function (){
				alert('网络超时，请检查您的网络设置！');
			}
		});
	};

	

	$('.pointer').click(function (){
		var mobile = $("#mobilePhone").text();
		var luckyCount = $("#luckyCount").text();
		if(turnplate.bRotate)return;
		//如果大麦场注册的手机号为空，提示输入大麦场注册的手机号
		if (!isNotNull(mobile)) {
			$("#meg_mobile").css("display","none");
			$("#mobile").val("");
			$("#mp").css("display","block");
			$(".js").fadeIn(500);
			return;
		}
		//如果剩余抽奖次数 等于 '0',提示购买柚子
		if (luckyCount == "0") {
			$('#unLuckyCount').css('display','block');
			$(".js").fadeIn(500);
			return;
		}
		
		turnplate.bRotate = !turnplate.bRotate;
		//获取随机数(奖品个数范围内)
		//var item = rnd(1,turnplate.restaraunts.length);
		var item = 6;
		//奖品数量等于10,指针落在对应奖品区域的中心角度[252, 216, 180, 144, 108, 72, 36, 360, 324, 288]
		rotateFn(item, turnplate.restaraunts[item-1],1000*10*3);
		item = getLuckyDraw();
		
		//弹出提示
//		if (item == 6) {
//			$("#unlucky").fadeIn(1000);
//		} else {
//			$("#lucky").fadeIn(1000);
//		}
	});
	
	//绑定大麦场注册手机号
	$('#setmobile').click(function (){
		var mobile = $("#mobile").val();
		if (!isNotNull(mobile) || mobile.length != 11) {
			$("#meg_mobile1").css("display","none");
			$("#meg_mobile").css("display","block");
			$("#meg_mobile2").css("display","none");
			return;
		}
		updateUserId();
	});
	//查看我的中奖列表
	$("#showMyLcuky").click(function (){
		var mobile = $("#mobilePhone").text();
		//如果大麦场注册的手机号为空，提示输入大麦场注册的手机号
		if (!isNotNull(mobile)) {
			$("#meg_mobile").css("display","none");
			$("#meg_mobile1").css("display","none");
			$("#meg_mobile2").css("display","none");
			$("#mobile").val("");
			$("#mp").css("display","block");
			$(".js").fadeIn(500);
			return;
		}
		
		if($('#myLuckys .popuppagebody').length>0){
			$('#myLuckys .popuppagebody').toggle();
		}else{
			//ajax请求
			getMyLuckys(mobile);
		}
		
	});
	//关闭弹窗
	$(".closeDialog").on('click',function(e) {
        $(".popupbody").fadeOut(500);
    });
	//一键拨号
	/*$("#callTel").on('click',function(e) {
        $("#call").css("display","block");
        $(".js").fadeIn(500);
    });*/
	
});

function rnd(n, m){
	var random = Math.floor(Math.random()*(m-n+1)+n);
	return random;
	
}


//页面所有元素加载完毕后执行drawRouletteWheel()方法对转盘进行渲染
window.onload=function(){
	drawRouletteWheel();
};

function drawRouletteWheel() {    
  var canvas = document.getElementById("wheelcanvas");    
  if (canvas.getContext) {
	  //根据奖品个数计算圆周角度
	  var arc = Math.PI / (turnplate.restaraunts.length/2);
	  var ctx = canvas.getContext("2d");
	  //在给定矩形内清空一个矩形
	  ctx.clearRect(0,0,422,422);
	  //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式  
	  ctx.strokeStyle = "#FFBE04";
	  //font 属性设置或返回画布上文本内容的当前字体属性
	  ctx.font = '26px Microsoft YaHei';      
	  for(var i = 0; i < turnplate.restaraunts.length; i++) {       
		  var angle = turnplate.startAngle + i * arc;
		  ctx.fillStyle = turnplate.colors[i];
		  ctx.beginPath();
		  //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）    
		  ctx.arc(211, 211, turnplate.outsideRadius, angle, angle + arc, false);    
		  ctx.arc(211, 211, turnplate.insideRadius, angle + arc, angle, true);
		  ctx.stroke();  
		  ctx.fill();
		  //锁画布(为了保存之前的画布状态)
		  ctx.save();   
		  
		  //----绘制奖品开始----
		  ctx.fillStyle = "#E5302F";
		  var text = turnplate.restaraunts[i];
		  var line_height = 17;
		  //translate方法重新映射画布上的 (0,0) 位置
		  ctx.translate(211 + Math.cos(angle + arc / 2) * turnplate.textRadius, 211 + Math.sin(angle + arc / 2) * turnplate.textRadius);
		  
		  //rotate方法旋转当前的绘图
		  ctx.rotate(angle + arc / 2 + Math.PI / 2);
		  
		  /** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/
		  if(text.indexOf("M")>0){//流量包
			  var texts = text.split("M");
			  for(var j = 0; j<texts.length; j++){
				  ctx.font = j == 0?'bold 20px Microsoft YaHei':'16px Microsoft YaHei';
				  if(j == 0){
					  ctx.fillText(texts[j]+"M", -ctx.measureText(texts[j]+"M").width / 2, j * line_height);
				  }else{
					  ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
				  }
			  }
		  }else if(text.indexOf("M") == -1 && text.length>6){//奖品名称长度超过一定范围 
			  text = text.substring(0,6)+"||"+text.substring(6);
			  var texts = text.split("||");
			  for(var j = 0; j<texts.length; j++){
				  ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
			  }
		  }else{
			  //在画布上绘制填色的文本。文本的默认颜色是黑色
			  //measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
			  ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
		  }
		  
		  //把当前画布返回（调整）到上一个save()状态之前 
		  ctx.restore();
		  //----绘制奖品结束----
	  }
	  
	  var canvas2 = document.getElementById("wheelcanvas2");
      var ctx2 = canvas2.getContext("2d");
       var img= document.getElementById("shan-img");
     // var beauty = new Image();
      //beauty.src = "imagesplate-pointer.png";
      ctx2.drawImage(img,0,0,310,153);

	  
  } 
}

//获取活动信息、奖品信息
function getLuckyDrawInfos() {
	var actId = $("#actId").val();
	if (!isNotNull(actId)) {
		alert("actId===活动id 不能为空");
		return;
	}
	var prize = [];
	//请求查询抽奖活动信息
	$.ajax({
		type:"POST",
		url:base+"/luckydrawapi/luckydrawInfo",
		dataType:"json",
		async:false,
		data:{actId:actId},
		success:function(res){
			setPrizeList(res);
			for ( var index in res.prize) {
				prize[index] = res.prize[index].name;
			}
	   }
	});
	return prize;
}
//设置抽奖信息
function setPrizeList(data) {
	var str = "";
	for ( var index in data.prize) {
		if (data.prize[index].status == 0) {
			str += "<tr><td>"+data.prize[index].name+"</td><td align='center' class='yellowtxt'>"+data.prize[index].pCount+"</td><td>个</td>";
		}
	}
	$("#prize").append(str);
	//活动信息
	var actInfo = data.lucky;
	//活动规则
	if (actInfo.activityRule != "") {
		$("#actRule").text("");
		$("#actRule").append(actInfo.activityRule);
	}
	//奖品领取规则
	if (actInfo.prizeRule != "") {
		$("#prizeRule").text("");
		$("#prizeRule").append(actInfo.prizeRule);
	}
	
}

//获取中奖编号
function getLuckyNumber() {
	//请求查询抽奖活动信息
	$.ajax({type:"POST",
		url:base+"/luckydrawapi/luckyDraw",
		dataType:"json",
		data:{actId:actId},
		success:function(res){
			setPrizeList(res);
	   }
	});
}

//绑定手机号
function updateUserId() {
	//取得输入的手机号、活动id、微信id
	var mobile = $("#mobile").val();
	if (mobile == "") {
		mobile = $("#mobilePhone").text();
	}
	var actId = $("#actId").val();
	var code = $("#code").val();
	if (mobile == "" || !isNotNull(mobile)) {
		//$("#meg_mobile").css("display","none");
		//$("#mp").css("display","block");
		$(".btn-dialog").css("display","block");
		return;
	}
	//设置关联的大麦场注册手机号
	$.ajax({type:"POST",
		url:base+"/luckydrawapi/getLuckyCount",
		dataType:"json",
		data:{mobilePhone:mobile,actId:actId,code:code},
		success:function(res){
			if (res.STATE == "FAIL") {
				$("#meg_mobile").css("display","none");
				$("#meg_mobile1").css("display","block");
				$("#meg_mobile2").css("display","none");
			} else {
				if (res.MSG != "") {
					$("#meg_mobile2").css("display","block");
				} else {
					$(".btn-dialog").css("display","none");
					$("#userId").val(res.userId);
					$("#mobilePhone").text(res.mobilePhone);
					$("#luckyCount").text(res.luckyCount);
					$(".js").fadeOut(500);
				}
			}
	   }

	});
}

//抽奖
function getLuckyDraw() {
	var userId = $("#userId").val();
	var actId = $("#actId").val();
	var code = $("#code").val();
	var item = 6;
	//抽奖
	$.ajax({type:"POST",
		url:base+"/luckydrawapi/luckyDraw",
		dataType:"json",
		async:false,
		data:{userId:userId,actId:actId,code:code},
		success:function(res){
			$("#luckyCount").text(res.count);
			$('#wheelcanvas').stopRotate();
			item = res.luckyNumber;
			rotateFn(item, turnplate.restaraunts[item-1],1000*2);
	   }
	});
	return item;
}
//中奖滚动列表
function getLukcyList() {
	//ajax请求中奖列表
	$.ajax({type:"POST",
		url:base+"/luckydrawapi/getLuckyList",
		dataType:"json",
		data:{},
		success:function(res){
			var record = res.records;
			var str = "";
			if (record.length != 0) {
				var mobile = "";
				for ( var index in record) {
					mobile = record[index].member.mobilePhone;
					mobile = mobile.replace(mobile.substring(3,7),"******");
					str += "<li>"+mobile+"获得"+record[index].luckyDrawItem.name+"1个</li>";
				}
				$("#demoMove2").text("");
				$("#demoMove2").append(str);
			} else {
				str += "<li>********************</li>";
			}
			$("#demoMove1").text("");
			$("#demoMove1").append(str);
	   }
	});
}

//我的中奖列表
function getMyLuckys(mobilePhone) {
	$("#myLuckys").html("");
	$.ajax({type:"POST",
		url:base+"/luckydrawapi/myLuckyResult",
		dataType:"json",
		data:{mobilePhone:mobilePhone},
		success:function(res){
			var str = "<div class='popuppagebody' style='display: block;'>";
			if (res.records.length == 0) {
				str += "<div class='prompt'>很遗憾，你未中奖</div></div>";
			} else {
				str += "<div class='titlepage'><span>恭喜你，抽奖结果如下</span></div><div class='popuppagelist'>" +
						"<table width='100%' border='0' cellspacing='0' cellpadding='0'>";
				for ( var index in res.records) {
					var record = res.records[index];
					str += "<tr><td>"+record.luckyDrawTimeStr+"</td><td width='10%' align='center'>---</td>" +
							"<td>奖品"+record.luckyDrawItem.name+"1个</td><td align='right'>";
					if (record.status == "0") {
						str += "<a href='javascript:void(0);' onclick='getPrize(\""+record.id+"\");'>领奖</a></td></tr>";
					} else {
						str += "<span style='color:#FF0000;'>已领取</span></td></tr>";
					}
				}
				str += "</table></div></div>"
			}
			$("#myLuckys").append(str);
	   }
	});
}

function getPrize(recordId){
	$("#recordId").val(recordId);
	$("#captchatext").val("");
	$("#captchali").hide();
	$("#captchaimg").attr("src",base+"/captcha/getcode?t="+(new Date()).getTime());
	$('#getPrize').css('display','block');
	$(".js").fadeIn(500);
}

//领奖
function captchatext(){
	if($("#captchatext").val()!=getCookie('RANDOMVALIDATECODEKEY')){
		$("#captchali").show();
		$("#captchaimg").attr("src",base+"/captcha/getcode?t="+(new Date()).getTime());
		return false;
	}
	$("#captchali").hide();
	//手机号
	var mobile = $("#mobilePhone").text();
	var recordId = $("#recordId").val();
	//ajax请求更新抽奖记录状态
	$.ajax({type:"POST",
		url:base+"/luckydrawapi/updateRecord",
		dataType:"json",
		data:{recordId:recordId},
		success:function(res){
			getMyLuckys(mobile);
			$('.popupbody').css('display','none');
			$(".js").fadeOut(500);
	   }
	});
}


//判断是否为空
var isNotNull = function(value){
	if(!value) return false;
	if("undefined" == typeof(value)) return false;
	if("string" != typeof(value)) return true;
	//下面的方法只能字符类型使用,不然报错
	value = $.trim(value);
	var flag = false;
	if(value==null){
		flag = false;
	}else if(value==""){
		flag = false;
	}else if(value=="null"){
		flag = false;
	}else{
		flag = true;
	}
	return flag;
}

//微信分享
wx.ready(function(){
	
	var wx_shareInfo ={};
	wx_shareInfo.title=$("#title").val();
	wx_shareInfo.desc=$("#desc").val();
	wx_shareInfo.link="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+$("#appId").val()+"&redirect_uri="+base+"/weixinapi/luckyplatform?url=/luckydrawapi/luckyIndex?actId="+$("#actId").val()+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect ";
	var  imgUrl = $("#icon").val();
	wx_shareInfo.imgUrl =base+"/images/"+imgUrl.replace("size","origin");
//	wx_shareInfo.title="买柚子抽大奖",
	// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
	//分享给微信朋友
	wx.onMenuShareAppMessage({
	    title: wx_shareInfo.title, // 分享标题
	    desc: wx_shareInfo.desc, // 分享描述
	    link: wx_shareInfo.link, // 分享链接
	    imgUrl: wx_shareInfo.imgUrl, // 分享图标
	    type: 'link', // 分享类型,music、video或link，不填默认为link
	    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
	    success: function () { 
	        // 用户确认分享后执行的回调函数
	    	window.reload();
	    },
	    cancel: function () { 
	        // 用户取消分享后执行的回调函数
	    	window.reload();
	    }
	});
	//分享给微信朋友圈
	wx.onMenuShareTimeline({
	    title: wx_shareInfo.title, // 分享标题
	    link: wx_shareInfo.link, // 分享链接
	    imgUrl: wx_shareInfo.imgUrl, // 分享图标
	    success: function () { 
	        // 用户确认分享后执行的回调函数
	    	window.reload();
	    },
	    cancel: function () { 
	        // 用户取消分享后执行的回调函数
	    	window.reload();
	    }
	});
	//分享给QQ好友
	wx.onMenuShareQQ({
	    title: wx_shareInfo.title, // 分享标题
	    desc: wx_shareInfo.desc, // 分享描述
	    link: wx_shareInfo.link, // 分享链接
	    imgUrl: wx_shareInfo.imgUrl, // 分享图标
	    success: function () { 
	        // 用户确认分享后执行的回调函数
	    	window.reload();
	    },
	    cancel: function () { 
	        // 用户取消分享后执行的回调函数
	    	window.reload();
	    }
	});
});
