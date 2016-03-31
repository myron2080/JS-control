/**
 * 日期格式化
 */
Date.prototype.format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
} 

function getPath(){
	if(typeof(window.top.getBaseUrl)=='function'){
		return window.top.getBaseUrl();
	}
	var u = window.location;/*      http://localhost:8888/web/meal/restaurant/list    */
	var p = window.location.pathname;/*    /web/meal/restaurant/list                 */
	var ps = p.split("/");
	var pth = "";
	for(var i = 0; i < ps.length; i++){
		if(ps[i]!=null && ps[i]!=''){
			pth = ps[i];
			break;
		}
	}
	return window.location.protocol /* http:  */
		+ "//" 
		+ window.location.host /*  localhost:8888   */
		+ "/"
		+ pth;  /*  web  */
}

/**
 * @param value 传入要转换的字符串
 * @param fun 传入结果处理方法,方法第一个参数为转换结果r,r.simple为简拼,r.full为全拼
 * */
function toPinyin(value,fun){
	if(value!=null && value!=''){
		$.post(getPath()+'/framework/pinyin/getPinyin',{value:value},function(res){
			if(typeof(fun)=='function'){
				fun.call(null,res);
			}
		},'json');
	}
}

/**
 * 设置简拼的值
 * @param chineseComp  输入中文的对象
 * @param simplePinyinComp  简拼组件
 */
function setSimplePinyinValue(chineseComp,simplePinyinComp){
	setPinyinValue(chineseComp, simplePinyinComp, true);
}

/**
 * 设置简拼的值
 * @param chineseComp  输入中文的对象
 * @param simplePinyinComp  简拼组件
 */
function setFullPinyinValue(chineseComp,fullPinyinComp){
	setPinyinValue(chineseComp, fullPinyinComp, false);
}

/**
 * 设置值
 * @param chineseComp  中文组件
 * @param pinyinComp  拼音组件 
 * @param flag  false:表示是全拼，true表示是简拼
 */
function setPinyinValue(chineseComp,pinyinComp,flag){
	$(chineseComp).bind('change',function(){
		toPinyin($(this).val(),function(result){
			$(pinyinComp).val(flag?result.simple:result.full);
		});
	});
}

//级联从数据中取值
function getFieldFromData(data,name){
	if(name && name.indexOf('.')>0){
		if(name.indexOf('.')>0){
			var names = name.split('.');
			var tmp = data;
			for(var i = 0;i < names.length; i++){
				if(tmp[names[i]]){
					tmp = tmp[names[i]];
				}else{
					tmp = '';
					break;
				}
			}
			return tmp;
		}else{
			return data[name];
		}
	}
}

/**
 * 字符串 去掉两边空格
 */
String.prototype.trim = function () {
	  return this.replace(/^\s*/, '' ).replace(/\s*$/, '' );
 }

Number.prototype.toFixed=function(len)
{
var add = 0;
var s,temp;
var s1 = this + "";
var start = s1.indexOf(".");
if(s1.substr(start+len+1,1)>=5)add=1;
var temp = Math.pow(10,len);
s = Math.floor(this * temp) + add;
return s/temp;
}

function eventFun(obj){
	$(obj).blur(function(){
		if(!$(obj).val() || ($(obj).val() == "")){
			$(obj).val($(obj).attr("defaultValue"));
		}
	}).focus(function(){
		if($(obj).val() && ($(obj).val() == $(obj).attr("defaultValue"))){
			$(obj).val("");
		}else {
			$(obj).select();
		}
	});
}

$(document).ajaxError(function(event,request, settings){
	var content = '网络请求超时，请重试!';
	var resultText = request.responseText;
	if(resultText && resultText.indexOf('OUTOF-LOGIN')>-1){
		if(typeof(window.top.showAjaxLogin)=='function'){
			window.top.showAjaxLogin();
		}else{
			content = "登录超时,要重新登录才可以进行操作" 
		}
	}else if(resultText && resultText.indexOf('NO-PERMISSION')>-1){
		content = "对不起,你没有此功能权限" ;
	}else if(resultText && resultText.indexOf('LICENSE-CODE')>-1){
		content = "对不起,此模块没有获得软件许可或己超出许可日期。" ;
	}else if(resultText){	
		var cnt = request.responseText?request.responseText.substring(request.responseText.indexOf('<body>')+6,request.responseText.indexOf('</body>')):"server error";
		content = "请求远程数据异常    "+cnt;				
	}
	if(resultText){
		commonMsgShow(content);
	}
});

/**
 * 信息提示 弹出框
 * @param content  提示内容
 * @param t 关闭时间(毫秒)
 */
function commonTipShow(content,t){
	var ww = $(window).width(); 
	var _scrollHeight = $(document).scrollTop();
	var _scrollLeft = $(document).scrollLeft();
	var _windowHeight = $(window).height();
	var _windowWidth = $(window).width();
	var commonTipDiv = $("#commonTipDiv");
	var divTop =  _scrollHeight;
	var divLeft =  _scrollLeft;
	if(commonTipDiv.length<1){
		divTop += (_windowHeight/2);
		var msgDiv = "<div id='commonTipDiv' style='position:absolute; z-index:9999;top:"+divTop+"px;left:"+divLeft+"px; max-width:65%;min-width:180px;max-height:220px;'>" +
			"<div style='background:#fff; box-shadow:2px 2px 3px #aaa; border-top-left-radius:5px; border-top-right-radius:5px; padding:15px;max-width:100%;min-width:80px;max-height:200px;overflow:scroll;' class='ui-content'  ><div  align='center' id='pop_content'>"+content+"</div>" +
		    		"</div>"+
		    "</div>";
		$(msgDiv).appendTo("body"); 
		divLeft += (_windowWidth-$("#commonTipDiv").width())/2;
		$("#commonTipDiv").css("left",divLeft);
		$(msgDiv).show();
	}else{
		divTop += (_windowHeight-commonTipDiv.height())/2;
		divLeft += (_windowWidth-commonTipDiv.width())/2;
		$("#pop_content").html(content);
		commonTipDiv.css("top",divTop);
		commonTipDiv.css("left",divLeft);
		commonTipDiv.show();
	}
	
	setTimeout(commonTipHide, t||1000);//默认1秒关闭提示
}

function commonTipHide(){
	$("#commonTipDiv").hide();
}

/**
 * 错误信息提示 弹出框  点击确定后关闭
 * @param content
 */
function commonMsgShow(content){
	var ww = $(window).width(); 
	var _scrollHeight = $(document).scrollTop();
	var _scrollLeft = $(document).scrollLeft();
	var _windowHeight = $(window).height();
	var _windowWidth = $(window).width();
	var commonMsgDiv = $("#commonMsgDiv");
	var divTop =  _scrollHeight;
	var divLeft =  _scrollLeft;
	if(commonMsgDiv.length<1){
		divTop += (_windowHeight/2);
		//divLeft += (_windowWidth/2);
		var msgDiv = "<div id='commonMsgDiv' style='position:absolute; z-index:9999;top:"+divTop+"px;left:"+divLeft+"px; max-width:65%;min-width:180px;max-height:220px;'>" +
			"<div style='background:#fff; box-shadow:2px 2px 3px #aaa; border-top-left-radius:5px; border-top-right-radius:5px; padding:15px;max-width:100%;min-width:80px;max-height:200px;overflow:auto;' class='ui-content'  ><div  align='center'>"+content+"</div>" +
		    		"</div><div style='text-align:center; padding:10px 0px;background:#f3f3f3;border-bottom-left-radius:5px; border-bottom-right-radius:5px;'> <a style='background:#2bb324; padding:0px 10px; border-radius:3px; line-height:24px; display:inline-block; color:#fff;' href='javascript:void(0);' data-role='button' onclick='commonMsgHide()' data-theme='b'>确定</a></div>"+
		    "</div><div id='commonMsgBgDiv' class='tk-bg'><div class='tk-bgin'></div></div>";
		$(msgDiv).appendTo("body"); 
		divLeft += (_windowWidth-$("#commonMsgDiv").width())/2;
		$("#commonMsgDiv").css("left",divLeft);
		$(msgDiv).show();
	}else{
		divTop += (_windowHeight-commonMsgDiv.height())/2;
		divLeft += (_windowWidth-commonMsgDiv.width())/2;
		commonMsgDiv.css("top",divTop);
		commonMsgDiv.css("left",divLeft);
		commonMsgDiv.show();
		$("#commonMsgDiv").show();
	}
	//$.mobile.loading("hide"); 
}

/**
 * 拨打电话成功后 弹出提示层
 */
function commonCallShow(phone,div,time){
	var divTop;
	var html = '';
	html+='<div id="pop_callDiv" class="pop_callDiv_class"><span style="width:100%;float:left;font-size:14px;height:50%;font-weight:bold;">接听号码:'+phone+'</span><span style="width:100%;float:left;font-size:12px;">系统呼叫中:请耐心等待5-10秒...<span/></div>';
	$("body").append(html);
	
	divTop = $(div).offset().top+$(div).height()+20; 
	$("#pop_callDiv").css('top',divTop);
	$("#pop_callDiv").css('right',10);
	
	$("#pop_callDiv").addClass('p_fadeInRight');
	$("#pop_callDiv").show();
	setTimeout(function(){
		$("#pop_callDiv").addClass('p_fadeOutRight');
		setTimeout(function(){
			$("#pop_callDiv").remove();
		},1000);
	},time || 5000);
}

function commonMsgHide(){
	$("#commonMsgDiv").hide();
	$("#commonMsgBgDiv").hide();
}

/**
 *  信息确认 弹出框   
 * @param content
 * @param callBackFun  确认回调函数 如：'openNewWin("url")'
 */
function commonCfmShow(content,callBackFun){
	//$("#commonCfmDiv").remove();
	
	var ww = $(window).width(); 
	var _scrollHeight = $(document).scrollTop();
	var _scrollLeft = $(document).scrollLeft();
	var _windowHeight = $(window).height();
	var _windowWidth = $(window).width();
	var commonCfmDiv = $("#commonCfmDiv");
	var divTop =  _scrollHeight;
	var divLeft =  _scrollLeft; 
	if(commonCfmDiv.length<1){
		divTop += _windowHeight/2;
		var cfmDiv = "<div id='commonCfmDiv' style='position:absolute; z-index:9999;top:"+divTop+"px;left:18.5%;'>" +
		"<div style='background:#fff; box-shadow:0 0 15px #666; border-radius:5px; padding:15px; max-width:100%;' class='ui-content'  ><div style='text-align:center; font-size:18px;'>"+content+"</div>" +    		
				"<div style='text-align:center; padding-top:15px;'>" +
				" <a id='OKBtn' style='background:#2bb324; padding:0px 15px; border-radius:3px; line-height:30px; display:inline-block; font-size:16px; color:#fff;' href='javascript:void(0);' data-role='button' onclick="+(callBackFun || 'commonCfmHide()')+"; data-theme='b'>确定</a>" +
	    		" <a style='background:#e0e0e0; padding:0px 15px; border-radius:3px; line-height:30px; display:inline-block; font-size:16px; color:#333;' href='javascript:void(0);' data-role='button' onclick='commonCfmHide()' data-theme='b'>取消</a>" +
	    		"</div>"+
	    		"</div>"+
	    "</div><div id='commonCfmBgDiv' class='tk-bg'><div class='tk-bgin'></div></div>";
		$(cfmDiv).appendTo("body");
		divLeft += (_windowWidth-$("#commonCfmDiv").width())/2;
		$("#commonCfmDiv").css("left",divLeft);
		$(cfmDiv).show();
	}else{
		divTop += (_windowHeight-commonCfmDiv.height())/2;
		divLeft += (_windowWidth-commonCfmDiv.width())/2;
		commonCfmDiv.css("top",divTop);
		commonCfmDiv.css("left",divLeft);
		commonCfmDiv.show();
		$("#commonCfmBgDiv").show();
	}
	
	//$.mobile.loading("hide"); 
}

function commonCfmHide(f){
	$("#commonCfmDiv").hide();
	$("#commonCfmBgDiv").hide();
	f();
}

function backMethod(){
		commonback();
}

function commonback(){
	history.back();
}





//显示加载器  
function showLoader(tips) {  
	showload(tips);
}


function hideLoader(){
	hideload();
}

//公用加载器
function showX(tips){
	showload(tips);
}
function hideX(){
	hideload();
}
//公用
function showwarndiv(msg){
	var stop = ($(window).scrollTop()-15)+"px";
	$("#warndiv").css({"top":stop});
	$("#warndiv").css({"z-index":9999});
	$("#warnspan").html(msg);
	$("#warndiv").show();
	setTimeout(function(){
		$("#warndiv").hide();
	},1000);
}

function openwindowurl(url){
	window.location.href = url;
}
//去掉头部
$(function(){
	$("div[data-role=header]").remove();
})


//加载框
function showload(tips){
	tips = tips || '加载中';
	if($("#wechatin")){
		$("#wechatin").remove();
		$("#wechatinP").remove();
	}
	var html ='';
	html +='<div id="wechatinP" style="display:none;position:fixed; z-index:1000; top:0; left:0; opacity:0.5; background:#fff; width:100%; height:100%;">';
	html +='<div id="wechatin" class="ui-loader ui-corner-all ui-body-b ui-loader-verbose"><span class="ui-icon ui-icon-loading"></span><h1>'+tips+'</h1></div>';
	html +='</div>';
	$("body").append(html);
	$('#wechatin').show();
	$("#wechatinP").show();
}

function hideload(){ 
	$('#wechatin').hide();
	$("#wechatinP").hide();
}
/*呼叫绑定*/
function bindCallPhone(){
	$("a[key=tel]").click(function(){
		var obj = $(this);
		event.preventDefault();
		var param={};
		param.phoneNumber =obj.attr('call_phoneNumber');
		param.personName = obj.attr('call_personName');
		param.telType="mobile";
		$.post(base+'/cmct/mobileMember/ajaxPhoneCall',param,function(res){
			if(res && res.STATE=='SUCCESS'){
				var phone = call_currentUserPhone || '尚未设置';
				commonCallShow(phone,obj);
				return false;
			}
			window.location.href="tel:"+obj.attr('call_phoneNumber');
		},'json')
	})
}

function onBridgeReady(){
	 WeixinJSBridge.call('hideOptionMenu');
	}

	if (typeof WeixinJSBridge == "undefined"){
	    if( document.addEventListener ){
	        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
	    }else if (document.attachEvent){
	        document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
	        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
	    }
	}else{
	    onBridgeReady();
	}
/*初始化组织*/
	function initOrgLevel(orgLevelDesc){
		var p = $('select[name="orgDesc"]');
		p.val("");
		p.html("");
		var div ="";
		if(orgLevelDesc!=''&&orgLevelDesc!=null){
			$.post(getPath()+'/weixinapi/mobile/bihero/getOrgLevelDesc',{orgleveldesc:orgLevelDesc},function(res){
				if(res && res.length > 0){
					for(var i = 0; i < res.length; i++){
						div+="<option value='"+res[i].DESC_ID+"'>"+res[i].DESC_NAME+"</option>";
					}
				}
				div+="<option value='personLevel'>个人级</option>";
				p.html(div);
				p.attr('value','personLevel');
				p.selectmenu('refresh');
			},'json');
		}else{
			div+="<option value='personLevel'>个人级</option>";
			p.html(div);
		}
	}
	function initScroll(){
		$(window).scroll(function(){
			　　var scrollTop = $(this).scrollTop();
			　　var scrollHeight = $(document).height();
			　　var windowHeight = $(this).height();
			　　if(scrollTop + windowHeight == scrollHeight){
					if($("#currentPage").val()!= $("#totalPage").val())
			　　　　searchData('1');
			　　}
		});
	}
	function phoneFormart(phone){
		return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
	}
	
	function addWarnDiv(){
		var warnDiv ='';
		warnDiv+='<div id="warndiv" style="position:absolute;top:0px;width:90%;padding-left: 5%;display:none">';
		warnDiv+='<div style="margin-top:15px;" >';
		warnDiv+='<div class="tsbtn" style="margin-top: 10px;"><b class="icon-svgTs" style="margin-right: 15px;"></b><span id="warnspan"></span></div>';
		warnDiv+='</div>';
		warnDiv+='</div>';
		$("body").append(warnDiv);
		}

	function showwarndiv_Fixed(msg,top){
		if($("#warndiv").length<1)
		addWarnDiv();
		$("#warndiv").css({"top":top+"px"})
		$("#warndiv").css({"z-index":9999});
		$("#warnspan").html(msg);
		$("#warndiv").fadeIn(200);
		setTimeout(function(){
			$("#warndiv").fadeOut();
		},1000);
	}

	function showwarndiv(msg){
		if($("#warndiv").length<1)
		addWarnDiv();
		var scrollTop =$(window).scrollTop();
		var stop = (scrollTop==0?30:(scrollTop-15))+"px";
		$("#warndiv").css({"top":"0px"})
		$("#warndiv").css({"z-index":9999});
		$("#warnspan").html(msg);
		$("#warndiv").fadeIn(200);
		$("#warndiv").animate({"top":stop});
		setTimeout(function(){
			$("#warndiv").fadeOut();
		},1000);
	}

	function showwarndiv(msg,t){
		if($("#warndiv").length<1)
		addWarnDiv();
		var scrollTop =$(window).scrollTop();
		var stop = (scrollTop==0?30:(scrollTop-15))+"px";
		$("#warndiv").css({"top":"0px"});
		$("#warndiv").css({"z-index":9999});
		$("#warnspan").html(msg);
		$("#warndiv").fadeIn(200);
		$("#warndiv").animate({"top":stop});
		setTimeout(function(){
			$("#warndiv").fadeOut();
		},t);
	}
	
	/** 
	 * 计算收益
	 * 用法 
	 * @param amount: 投资金额，qi:投资期数，rate:年利率，payoption：投资类型,type:计息方式（ATJX：按天计息；AYJX：按月计息）
	 */
	function incomeCalculate(amount,qi,rate,payoption,type){
		var income =0;
		if(payoption=="ONEOFF"){
			if(type=='ATJX')
			income = amount*qi*rate/100/365.0;
			else
			income = amount*qi*rate/100/12.0;	
		}else if(payoption=="AFTER"){
			income = amount*qi*rate/100/12;
		}else{
		 income = amount*(rate/12.0/100)*(Math.pow((1+rate/12.0/100),qi))/(Math.pow((1+rate/12.0/100),qi)-1)*qi-amount;
		}
		return income;
	}
	
	/**
	 * 返回前一页（或关闭本页面）
	 * <li>如果没有前一页历史，则直接关闭当前页面</li>
	 */
	function goBack(){
	    if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)){ // IE
	        if(history.length > 0){
	            window.history.go( -1 );
	        }else{
	            window.opener=null;window.close();
	        }
	    }else{ //非IE浏览器
	        if (navigator.userAgent.indexOf('Firefox') >= 0 ||
	            navigator.userAgent.indexOf('Opera') >= 0 ||
	            navigator.userAgent.indexOf('Safari') >= 0 ||
	            navigator.userAgent.indexOf('Chrome') >= 0 ||
	            navigator.userAgent.indexOf('WebKit') >= 0){

	            if(window.history.length > 1){
	                window.history.go( -1 );
	            }else{
	                window.opener=null;window.close();
	            }
	        }else{ //未知的浏览器
	            window.history.go( -1 );
	        }
	    }
	}
	  window.onload=function(){
          //禁用苹果长按a标签
          document.documentElement.style.webkitTouchCallout='none';

      };