/**
 * 获取根路径
 * @returns
 */
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
 * 获取window的宽高
 * @returns {___anonymous1299_1331}
 */
function getWinSize(){
	var winWidth = 0;
	var winHeight = 0;
	//获取窗口宽度
	if (window.innerWidth)
		winWidth = window.innerWidth;
	else if ((document.body) && (document.body.clientWidth))
		winWidth = document.body.clientWidth;
	//获取窗口高度
	if (window.innerHeight)
		winHeight = window.innerHeight;
	else if ((document.body) && (document.body.clientHeight))
		winHeight = document.body.clientHeight;
	//通过深入Document内部对body进行检测，获取窗口大小
	if (document.documentElement && document.documentElement.clientHeight
			&& document.documentElement.clientWidth){
		winHeight = document.documentElement.clientHeight;
		winWidth = document.documentElement.clientWidth;
	}
	return {width:winWidth,height:winHeight};
}

/**
 * 取得cookie    
 * @param name
 * @returns
 */
function getCookie(name) {    
	 var nameEQ = name + "=";    
	 var ca = document.cookie.split(';');    //把cookie分割成组    
	 for(var i=0;i < ca.length;i++) {    
		 var c = ca[i];                      //取得字符串    
		 while (c.charAt(0)==' ') {          //判断一下字符串有没有前导空格    
			 c = c.substring(1,c.length);    //有的话，从第二位开始取    
		 }    
		 if (c.indexOf(nameEQ) == 0) {       //如果含有我们要的name    
			 return unescape(c.substring(nameEQ.length,c.length));    //解码并截取我们要值    
		 }    
	 }
	 return false;
}

/**
 * 文本框回车触发查询
 * @param objId
 * @param searchFun
 */
function inputEnterSearch(objId,searchFun){
	$("#"+objId).keydown(function(e){
		var keyCode= ($.browser.msie) ? e.keyCode : e.which ;  
		if(keyCode == 13){  
			searchFun();
	    }
	});
}
/**
 * 文本获取焦点默认值清空
 * @param obj
 */
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
/**
 * 级联从数据中取值
 * @param data
 * @param name
 * @returns
 */
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
 * 文本默认占位符提示
 */
var DT_TIP = {
	init:function(eid,dval){
		var $eid = $("#"+eid) ;
		var _placeholderTxt = $(eid).attr("placeholder");
		$eid.bind('keydown',function(obj){
			if($eid.val() == _placeholderTxt){
				$eid.val('');
			}
		});
		$eid.bind('keyup',function(obj){
			if($eid.val() == ''){
				$eid.val(_placeholderTxt);
			}
		});
	}
}


/**
 * 判断传入标签id是否获得焦点
 * @param tags  逗号分隔的标签id
 * @returns {Boolean}
 */
function isAllfocus(tags){
	var flag=true;
	var tag=tags.split(",");
	for(var i=0;i<tag.length;i++){
		var tagId=tag[i];
//		if($("#"+tagId).is(":focus")){
//			flag=false;
//		}
	}
	return flag;
}

/**
 * 清空方法
 * @param tags 逗号分隔的标签id
 */
function resetCommonFun(tags){
	var tag=tags.split(",");
	for(var i=0;i<tag.length;i++){
		var tagId=tag[i];
		if($("#"+tagId).attr("defaultValue") == undefined){
			$("#"+tagId).val("");
		}else{
			$("#"+tagId).val($("#"+tagId).attr("defaultValue"));
		}
	}
	if(typeof(searchData) == "function"){//默认执行查询
		searchData();
	}
}
