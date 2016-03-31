$(function(){
	//地址栏地址
	var baseurl=window.location.href;
	//请求连接
	$.post(base+"/ebsite/recommendedRecord/getMoney",function(data){
		var datas=eval("("+data+")");
		if(datas.msg==1){
			$("#money_font1").html(datas.money);
			$("#money_font2").html(datas.money);
			$("#money_font3").html(datas.money);
		}else{
			alert("数据异常，请联系管理员！");
		}
	});	
	
	$("#submitred").click(function(){
		//判断拼接参数
		var id="";
		if(baseurl.indexOf("&")!=-1){//说明出了ID还有其他的参数
			id=baseurl.substring(baseurl.indexOf("=")+1,baseurl.indexOf("&"));
		}else{
			var str=baseurl.split("=");
			id=str[1];
		}
		//获取地址栏中的url然后得到用户ID
		if($.trim(id)==null || $.trim(id)==""){
			alert("该链接已失效！");
			return ;
		}
		//获取电话号码
		var phone=$.trim($("#phone").val());
		if(phone==null || phone ==""){
			alert("请填写手机号码！");
			return ;
		}
		if(!/^1[3|4|5|7|8|9]\d{9}$/.test(phone)){
			alert("请输入正确的手机号码！");
			return ;
		}
		//使用异步请求
		$.ajax({
		   type: "POST",
		   url: base+"/ebsite/recommendedRecord/getInfo",
		   //data:"uid="+id+"&phone="+phone+"&url="+baseurl,
		   data:{uid:id,phone:phone,url:baseurl},
		   success: function(data){
			  var datas=eval("("+data+")");
			  var type=datas.type;
			  if(type=="success"){
				  window.location.href=base+"/ebsite/recommendedRecord/jumpToSuccess?money="+datas.money+"&phone="+datas.phone;
			  }else if(type=="old"){
				  window.location.href=base+"/ebsite/recommendedRecord/jumpToOldFriend?id="+datas.id;
			  }else if(type=="get"){
				  alert("你已经领过一次，请重新输入手机号码！");
			  }
		   }
		});
		//$("#form_share").attr("action",base+"/ebsite/recommendedRecord/getInfo");
		//$("#form_share").submit();
	});
	
	 $("body").keydown(function() {
         if (event.keyCode == "13") {//keyCode=13是回车键
        	 var id="";
     		if(baseurl.indexOf("&")!=-1){//说明出了ID还有其他的参数
     			id=baseurl.substring(baseurl.indexOf("=")+1,baseurl.indexOf("&"));
     		}else{
     			var str=baseurl.split("=");
     			id=str[1];
     		}
     		//获取地址栏中的url然后得到用户ID
     		if($.trim(id)==null || $.trim(id)==""){
     			alert("该链接已失效！");
     			return ;
     		}else{
     			$("#uid").val(id);
     		}
        	 var phone=$.trim($("#phone").val());
     		if(phone==null || phone ==""){
     			alert("请填写手机号码！");
     			return ;
     		}
     		if(!/^1[3|4|5|7|8|9]\d{9}$/.test(phone)){
     			alert("请输入正确的手机号码！");
     			return ;
     		}
     		//使用异步请求
    		$.ajax({
    		   type: "POST",
    		   url: base+"/ebsite/recommendedRecord/getInfo",
    		   //data:"uid="+id+"&phone="+phone+"&url="+baseurl,
    		   data:{uid:id,phone:phone,url:baseurl},
    		   success: function(data){
    			  var datas=eval("("+data+")");
    			  var type=datas.type;
    			  if(type=="success"){
    				  window.location.href=base+"/ebsite/recommendedRecord/jumpToSuccess?money="+datas.money+"&phone="+datas.phone;
    			  }else if(type=="old"){
    				  window.location.href=base+"/ebsite/recommendedRecord/jumpToOldFriend?id="+datas.id;
    			  }else if(type=="get"){
    				  alert("你已经领过一次，请重新输入手机号码！");
    			  }
    		   }
    		});
         }
     });
	
	$("#oldfriendsubmit").click(function(){
		//判断拼接参数
		var id="";
		if(baseurl.indexOf("&")!=-1){//说明出了ID还有其他的参数
			id=baseurl.substring(baseurl.indexOf("=")+1,baseurl.indexOf("&"));
		}else{
			var str=baseurl.split("=");
			id=str[1];
		}
		//获取地址栏中的url然后得到用户ID
		if($.trim(id)==null || $.trim(id)==""){
			alert("该链接已失效！");
			return ;
		}else{
			$("#uid").val(id);
		}
		//获取电话号码
		var phone=$.trim($("#phone").val());
		if(phone==null || phone ==""){
			alert("请填写手机号码！");
			return ;
		}
		if(!/^1[3|4|5|7|8|9]\d{9}$/.test(phone)){
			alert("请输入正确的手机号码！");
			return ;
		}
		//使用异步请求
		$.ajax({
		   type: "POST",
		   url: base+"/ebsite/recommendedRecord/getInfo",
		   //data:"uid="+id+"&phone="+phone+"&url="+baseurl,
		   data:{uid:id,phone:phone,url:baseurl},
		   success: function(data){
			  var datas=eval("("+data+")");
			  var type=datas.type;
			  if(type=="success"){
				  window.location.href=base+"/ebsite/recommendedRecord/jumpToSuccess?money="+datas.money+"&phone="+datas.phone;
			  }else if(type=="old"){
				  window.location.href=base+"/ebsite/recommendedRecord/jumpToOldFriend?id="+datas.id;
			  }else if(type=="get"){
				  alert("你已经领过一次，请重新输入手机号码！");
			  }
		   }
		});
	});
	
	$("#pic_close").click(function(){
		$("#oldfrienddiv").hide();
	});
});
