//根据版本选择获取相应的机型和数据
function getDataToDeviceName(type){
	if(type=="0"){
		$("#tablethtml").html("");
		alert("请选择适用版本！");
		return ;
	}else{
		//执行请求
		var url=base+"/ebsite/startupparam/getStartUpParamList";
		$.ajax({
			type: "POST",
			url: url,
			dataType: "json",
			data:{"deviceVision":type},
			success: function(data){
				//var datas=eval("("+data+")");
				//动态布局页面
				var datalength=data.length;
				var pagehtml="";
				$("#deviceTypeCount").attr("value",data.length);
				 $.each(data,function(index,obj){
					 pagehtml+=getHmtl(data,obj,index);
				});
				$("#tablethtml").html(pagehtml);
				for(var i=0;i<datalength;i++){
					uploadImage("btn_image_"+i,"showimage_"+i);
				}
			}
		});
		
	}
}
//提交表单验证...
function beforesave(){
	var deviceVision=$("#deviceVision").val();
	if(deviceVision=="0"){
		alert("请选择适用版本！");
		return ;
	}
	var useStartTime=$("input[name='useStartTime']").val();
	var useEndTime=$("input[name='useEndTime']").val();
	if(useStartTime==null || useStartTime==""){
		alert("请选择开始时间！");
		return ;
	}else if(useEndTime==null || useEndTime==""){
		alert("请选择结束时间！");
		return ;
	}else{
		//判断时间是否已经被选定，在使用期间，统一时间内只有一个任务运行
		$.ajax({
			type: "POST",
			url: base+"/ebsite/startup/checkDatetime",
			async: false,
			data:{"startdate":useStartTime,"enddate":useEndTime,"deviceVision":deviceVision},
			success: function(msg){
				$("#checktimetype").attr("value",msg);
			}
		});
		var result=$("#checktimetype").val();
		if(result=="error"){
			alert("任务已经存在，请重新选择时间！");
			return;
		}
	}
	//判断是否选择了机型，每个机型只能选择一个...
	var deviceIds=new Array();
	$("select[id='deviceName']").each(function(){
		var deviceId=$(this).val();
		if(deviceId==0){
			$("#deviceNameRepeat").attr("value",0);
			return false;
		}else{
			$("#deviceNameRepeat").attr("value",1);
			deviceIds.push(deviceId);
		}
	});
	var deviceNameRepeat=$("#deviceNameRepeat").val();
	if(deviceNameRepeat==0){
		alert("请选择机型！");
		return ;
	}else{
		//判断数据组中的数据是否相同
		var nary = deviceIds.sort();
		for(var i = 0; i < nary.length - 1; i++){
			if (nary[i] == nary[i+1]){
				$("#deviceIdRepeat").attr("value",1);
				break;
			}else{
				$("#deviceIdRepeat").attr("value",0);
			}
		}
		if($("#deviceIdRepeat").val()==1){
			alert("机型重复，请重新选择！");
			return ;
		}
	}
	//判断机型唯一结束.....
	var count=$("#deviceTypeCount").val();
		//判断是否上传了图片
	for(var i=0;i<count;i++){
		var uploadImage=$("#updateImages_"+i).val();
		//var deviceSize=$("#updateImages_"+i).parent().parent().parent().parent().prev().find("input").val();
		if(uploadImage==null || uploadImage==""){
			alert("请上传图片！");
			return;
		}
		//else if(deviceSize==null || deviceSize==""){
			//alert("请选择机型!");
			//return ;
	//	}
	}
	//当前遇到的问题是return false没有效果
	$("#dataForm_1").attr("action",base+"/ebsite/startup/save");
}



//根据机型获取容量大小
function getStartParamSizeForJsp(obj){
	var type=obj.value;
	if(type=="0"){
		$(obj).parent().next().next().find("input").attr("value","");
		$(obj).parent().next().next().next().find("#deviceSizeFont").html(0);
		alert("请选择机型版本！");
		return ;
	}else{
		var url=base+"/ebsite/startupparam/getStartUpParamById";
		$.post(url,{"id":type},function(data){
			//var datas=eval("("+data+")");
			$.each(data,function(index,obj1){
				$(obj).parent().next().next().find("input").attr("value",obj1.deviceSize+"*"+obj1.deviceSize2);
				$(obj).parent().next().next().next().find("#deviceSizeFont").html(obj1.devicePicSize);
			});
		},"json");
	}
}
//拼接页面上的元素
function getHmtl(datas,obj,i){
	var html="<tr>";
               html+="<td class='c_left'>选择机型：</td>";
               html+="<td id='deviceNameTd'>";
               html+="<select id='deviceName' name='deviceName_"+i+"' onchange='getStartParamSizeForJsp(this)' style='width: 120px;'><option value='0'>--请选择--</option>";
               $.each(datas,function(index,obj){
   					html+="<option value='"+obj.id+"'>"+obj.deviceName+"</option>";
   				});
               html+="</select></td>";
               html+="<td class='c_left'>尺寸(px)：</td>";
               html+="<td><input class='txt1' style='width: 120px;' name='deviceSize_"+i+"' id='deviceSize' readonly='readonly'   type='text'   value=''/></td>";
            	html+="<td colspan='4' class='c_right'>";
            	   html+="<div class='titDiv2' style='margin-top: 0 ; margin-left: 25px ; float: left;'>";
            	     html+="<a href='javascript:void(0);' id='btn_image_"+i+"' class='btn_upload' style='margin-top: 40px'>浏览</a>";                 
            	      html+="<br><span style='color: red;width:100px  '>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
            	      html+="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>";
            	   html+="</div>";
            	html+="<div class='picList' float: left;'>";
            	   html+="<dl class='picList-dl'>";
            	      html+="<dd class='innerImage'>";
            	      html+="<input type='hidden' name='updateImages_"+i+"' id='updateImages_"+i+"'>";
            	        html+="<img class='bor3' id='showimage_"+i+"' name='showimage_"+i+"'  src='' width='120' height='120' value=''>";
            	        html+="<br><span style='color: red;'>注：最大容量<font id='deviceSizeFont'>0</font>KB</span>";
            	    html+="</dd>";
            	    html+="</dl><div><input type='hidden' name='uploadimagewidth_"+i+"' id='uploadimagewidth'/>" +
            	    		"<input type='hidden' name='uploadimageheight_"+i+"' id='uploadimageheight'/></div>";
            	html+="</dl><div class='clear'></div>";
            	html+="</div>";
            	html+="</td>";
         html+="</tr>";
      return html;
}

function enterSearch(e) {
	var charCode = ($.browser.msie) ? e.keyCode : e.which;
	if (charCode == 13) {
		searchData();
	}
}

//加载编辑数据...
$(function(){
	var deviceNameObj="";
	var deviceTypeCount="";
	var id=$("#id").val();
	if(id!=null && id!=""){
		//然后加载机型...
		var url=base+"/ebsite/startupparam/getStartUpParamList";
		var type=$("#deviceVision").val();
		/*$.post(url,{"deviceVision":type},function(data){
			deviceNameObj=eval("("+data+")");
		});*/
		var url=base+"/ebsite/startupparam/getStartUpParamList"
		$.ajax({
			type: "POST",
			url: url,
			async: false,
			dataType: "json",
			data:{"deviceVision":type},
			success: function(data){
				//deviceNameObj=eval("("+data+")");
				deviceNameObj=data;
			}
		});
		//然后加载页面元素
		$.ajax({
			type: "POST",
			url: base+"/ebsite/startup/getStartupToJson",
			async: false,
			dataType: "json",
			data:{"id":id},
			success: function(data){
				var pagehtml="";
				//var datas=eval("("+data+")");
				deviceTypeCount=data.length;
				$("#deviceTypeCount").attr("value",deviceTypeCount);
				$.each(data,function(index,item){
					pagehtml+=editHtml(deviceNameObj,item,index);
				});
				$("#tablethtml").html(pagehtml);
			}
		});
	}
});


function editHtml(datas,obj,i){
		var html="<tr>";
	    html+="<td class='c_left'>选择机型：</td>";
	    html+="<td id='deviceNameTd'>";
	    html+="<select id='deviceName' name='deviceName_"+i+"' onchange='getStartParamSizeForJsp(this)' style='width: 120px;'><option value='0'>--请选择--</option>";
	    $.each(datas,function(index,objs){
	    		if(obj.deviceName==objs.deviceName){
	    			html+="<option selected=selected value='"+objs.id+"'>"+objs.deviceName+"</option>";
	    		}else{
	    			html+="<option value='"+objs.id+"'>"+objs.deviceName+"</option>";
	    		}
			});
	    html+="</select></td>";
	    html+="<td class='c_left'>尺寸(PX)：</td>";
	    html+="<td><input class='txt1' style='width: 120px;' name='deviceSize_"+i+"' id='deviceSize' readonly='readonly'   type='text'   value='"+obj.deviceSize+"*"+obj.deviceSize2+"'/></td>";
	 	html+="<td colspan='4' class='c_right'>";
	 	   html+="<div class='titDiv2' style='margin-top: 0 ; margin-left: 25px ; float: left;'>";
	 	     html+="<a href='javascript:void(0);' id='btn_image_"+i+"' class='btn_upload' style='margin-top: 40px'>浏览</a>";                 
	 	      html+="<br><span style='color: red;width:100px  '>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
	 	      html+="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>";
	 	   html+="</div>";
	 	html+="<div class='picList' float: left;'>";
	 	   html+="<dl class='picList-dl'>";
	 	      html+="<dd class='innerImage'>";
	 	      html+="<input type='hidden' name='updateImages_"+i+"' id='updateImages_"+i+"' value='"+obj.devicePicUrl+"'>";
	 	        html+="<img class='bor3' id='showimage_"+i+"' name='showimage_"+i+"'  src='"+obj.devicePicUrl+"' width='120' height='120' value=''>";
	 	        html+="<br><span style='color: red;'>注：最大容量<font id='deviceSizeFont'>"+obj.devicePicSize+"</font>KB</span>";
	 	    html+="</dd>";
	 	    html+="</dl><div><input type='hidden' name='uploadimagewidth_"+i+"' id='uploadimagewidth'/>" +
	 	    		"<input type='hidden' name='uploadimageheight_"+i+"' id='uploadimageheight'/></div>";
	 	html+="</dl><div class='clear'></div>";
	 	html+="<input type='hidden' name='deviceId_"+i+"' value='"+obj.deviceId+"'/>";
	 	html+="</div>";
	 	html+="</td>";
	html+="</tr>";
	return html;
}






		
