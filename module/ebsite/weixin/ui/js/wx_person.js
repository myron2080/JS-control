

$(document).ready(function() {
	//统计数量
	getCount();
	//加载列表数据
	searchData(1);
	//获取排名数据
	getNumber();

})

function getNumber() {
	var id = $("#pId").val();
	//获取参与人排名
	$.ajax({type:"POST",
		url:getPath()+"/ebsite/weixin/relation/getNumber",
		dataType:"json",
		data:{id:id},
		success:function(res){
			$("#number").text(res.number);
	   }

	});
}

function searchData(page) {
	var pId = $("#pId").val();
	//获取投票列表
	$.ajax({type:"POST",
			url:getPath()+"/ebsite/weixin/relation/getList",
			dataType:"json",
			data:{page:page,pId:pId},
			success:function(res){
				setValue(res.items);//设置列表数据
				setPage(res);//设置分页按钮
		   }

		});
}
//
function setValue(data){
	var home = "<h3><img src='"+getPath()+"/default/js/module/ebsite/weixin/ui/images/title.png' /></h3>";
	$(".rankinglist").html("");
	for ( var info in data) {
		home += "<dl><dt><img src='"+data[info].vImage+"' onerror='errorImg(this);' /></dt>" +
				"<dd><span>投了"+data[info].count+"票</span>"+data[info].vNickName+"</dd></dl>";
	}
	$(".rankinglist").append(home);
}

/**
 *  投票
 */
function setVote() {
	//判断是否关注
	if(isAttention()){
		return ;
	} else {
		var vId = $("#vId").val();//投票人id
		var pId = $("#pId").val();//参与人id
		if (vId == "" || vId == null) {
			openWindow("请重新登录");//提示
			return ;
		}
		//获取投票列表
		$.ajax({type:"POST",
				url:getPath()+"/ebsite/weixin/relation/save",
				dataType:"json",
				data:{vId:vId,pId:pId},
				success:function(res){
					openWindow(res.MSG);//提示
					//统计数量
					getCount();
					//获取排名数据
					getNumber();
					//加载列表数据
					searchData(1);
				},
				error:function(){
					openWindow(res.MSG);//提示
	            }
			});
	}
}

wx.ready(function(){
	// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
	//分享给微信朋友
	wx.onMenuShareAppMessage({
	    title: '大麦场合伙人投票', // 分享标题
	    desc: '大麦场合伙人投票', // 分享描述
	    link: '	https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc0487456c94c3293&redirect_uri=http://120.25.236.193/dmcerp/weixinapi/platform?urlnumber=INDEX&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect', // 分享链接
	    imgUrl: getPath()+'/default/js/module/ebsite/weixin/ui/images/banner.jpg', // 分享图标
	    type: 'link', // 分享类型,music、video或link，不填默认为link
	    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
	    success: function () { 
	        // 用户确认分享后执行的回调函数
	    },
	    cancel: function () { 
	        // 用户取消分享后执行的回调函数
	    }
	});
	//分享给微信朋友圈
	wx.onMenuShareTimeline({
	    title: '大麦场合伙人投票', // 分享标题
	    link: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc0487456c94c3293&redirect_uri=http://120.25.236.193/dmcerp/weixinapi/platform?urlnumber=INDEX&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect', // 分享链接
	    imgUrl: getPath()+'/default/js/module/ebsite/weixin/ui/images/banner.jpg', // 分享图标
	    success: function () { 
	        // 用户确认分享后执行的回调函数
	    },
	    cancel: function () { 
	        // 用户取消分享后执行的回调函数
	    }
	});
	//分享给QQ好友
	wx.onMenuShareQQ({
	    title: '大麦场合伙人投票', // 分享标题
	    desc: '大麦场合伙人投票', // 分享描述
	    link: '	https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc0487456c94c3293&redirect_uri=http://120.25.236.193/dmcerp/weixinapi/platform?urlnumber=INDEX&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect', // 分享链接
	    imgUrl: getPath()+'/default/js/module/ebsite/weixin/ui/images/banner.jpg', // 分享图标
	    success: function () { 
	        // 用户确认分享后执行的回调函数
	    },
	    cancel: function () { 
	        // 用户取消分享后执行的回调函数
	    }
	});
});
function shara(){
	$("#Body_a").show();
	setTimeout('$("#Body_a").hide();',3000);
}

