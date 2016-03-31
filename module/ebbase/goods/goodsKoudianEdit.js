$(document).ready(function(){
	if($(".scrollContent>tr").length==0){
		addItemload();
	}
	$(".addProLink").click(function(){
		addItem();
	});
	$("input[id*='barCode']").focus(function(){
		if(!checkStorage()){
			$("#provideExtName").select();
		}
	});
	//鼠标点击 可编辑状态
	$(".scrollContent").delegate("td[key='edit_td']","click",function(){
		$(this).find("span").hide();
		$(this).find("input[key='edit_input']").show().focus();
	}); 
	$("td[key='edit_td']").each(function(){
		$(this).attr("title","点击编辑");
	});
	$(".scrollContent").delegate("td[key='edit_td']","focusout",function(){
		var input=$(this).find("input[key='edit_input']");
		var name=input.attr("name");
		if(name=="endPrice"){
			if(input.val()=="以上"){
				$(this).find("span").text(input.val()).show();
			}else{
				$(this).find("span").text(input.val()+"(包含)").show();
			}
		}else if(name=="startPrice"){
			$(this).find("span").text(input.val()+"(不包含)").show();
		}else{
			$(this).find("span").text(input.val()).show();
		}
		input.hide();
	}); 
	
	//鼠标点击 可编辑状态
	$(".scrollContent").delegate("td[key='edit_auto']","click",function(){
		
		$(this).find("span").hide();
		$(this).find("input[key='auto_input']").show().focus();
	}); 
	$("td[key='edit_auto']").each(function(){
		$(this).attr("title","点击编辑");
	});
	//导入商品
	$(".importProLink").click(function(){
		getInstorageExcelData();
	});
	//加载所有商品
	$(".loadAllGoods").click(function(){
		afterSelectSupplier();
	});
	//加载所有商品
	$(".clearAll").click(function(){
		removeAllItem();
	});
	$(".clearUnContent").click(function(){
		removeUnContent();
	});
	if(edit_view=="VIEW"){

		//输入框
		$('input,textarea,select').each(function(){
			$(this).attr('disabled','disabled');
		});
		//超链接
		$('a').each(function(){
			if(!$(this).attr('escape')){//如果有escape属性，则跳过
				$(this).removeAttr('onclick');
				$(this).attr('href','javascript:void(0)');
				$(this).attr('disabled','disabled');
			}
		});
		//F7
		$('div[class="f7"]').each(function(){
			$(this).attr('disabled','disabled');
			$(this).find('span').each(function(){
				$(this).removeAttr('onclick');
			});
			$(this).find('strong').each(function(){
				$(this).removeAttr('onclick');
			});
		});
		//关闭按钮 tab_box_close
		$('div[class="tab_box_close"]').each(function(){
			$(this).css('display','none');
			
		});
		//新增按钮 tab_box_add
		$('.tab_box_add').each(function(){
			$(this).css('display','none');
			
		});
	}
});

/**
 * 移除  未输入 信息 的tr
 * @returns
 */
function removeUnContent(){
	$(".scrollContent tr").each(function(){
		var flag=false;
		if(!isNotNull($(this).find("#startPrice").val())){
			flag=true;
		}
		if(!isNotNull($(this).find("#endPrice").val())){
			flag=true;
		}
		if(!isNotNull($(this).find("#koudianPercent").val())){
			flag=true;
		}
		if(flag){
			$(this).fadeOut(function(){
				$(this).remove();
			});
		}
	});
}


//删除所有
function removeAllItem(){
	$(".scrollContent").html("");//清空所有
}


function addItemload(){
	var item=$("#cloneTr").clone();
	item.removeAttr("id");
	item.find("#startPrice").parents("td").find("span").text("0(不包含)");
	item.find("#startPrice").val("0");
	

	var item1=$("#cloneTr").clone();
	item1.removeAttr("id");
	item1.find("#endPrice").parents("td").find("span").text("以上");
	item1.find("#endPrice").val("以上");

	$(".scrollContent").append(item);
	$(".scrollContent").append(item1);
	item.fadeIn();
	item1.fadeIn();
	AutoComp.init();
}
function addItem(data){
	var item=$("#cloneTr").clone();
	item.removeAttr("id");
		
	$(".scrollContent").append(item);
	item.fadeIn();
	AutoComp.init();
}
//删除明细
function deleteItem(obj){
	if($(".scrollContent>tr").length>1){
		$(obj).parents("tr").remove();
	}else{
		art.dialog.tips("请至少保留一条商品信息",1.5);
	}
}
function isExist(arrayObj,emailAddr){
	 var index ;
	 if(arrayObj.length ==0){
	  return -1;
	 }
	 for(var i=0;i<arrayObj.length;i++){
	  if(emailAddr == arrayObj[i])
	   return i;
	 }
	 
	 return -1;

	}

function changenum(){//设置拼音
	var number = $("#number").val();
	var number1 = $("#number1").val();
	if(number==number1){

		return true; 
	}
		$.ajax({ url: base+"/ebbase/goodskoudianconf/checkNumber",type:"post",
		data:{number:number},dataType:"json", success: function(data){
		if (data.STATE == 'SUCCESS') {
			art.dialog.alert("该编码已存在！");
			flag = false;
			return false; 
		}}
		});
}
function saveEdit(dlg){

	currentDialog = dlg;
	var flag = true;
	var jsonStr = "[";
			
	if(!isNotNull($("#name").val())){
		art.dialog.tips('请填写名称！');
		flag = false;
		return false;
	}
	/*2016/2/1 10:58 xyz改*/
	if(!isNotNull($("#number").val())){
		art.dialog.tips('请填写编码！');
		flag = false;
		return false;
	}
	
	
	if($("#description").val().length > 2000){
		art.dialog.tips('描述最多可以输入2000个字符！');
		flag = false;
		return false;
	}
	
	var allTotal = 0;
	if($(".scrollContent>tr").length <= 1){
		art.dialog.tips("请至少保存两条库存扣点明细!");
		return;
	}

	var arrayObj = new Array(); //开始金额集合

	 var exist99=0;
	//遍历数据
	$(".scrollContent tr").each(function(){

		var startPricetemp = parseFloat($(this).find('input[name="startPrice"]').val());
		 arrayObj.push(startPricetemp);  
	});
	//遍历数据
	 var exist0 = isExist(arrayObj,0);
	 if(exist0<0){ //数组不包含元素
		 if(endPrice!=990000000){
			art.dialog.tips("请填写起始金额0 . ");
			flag = false;
			return false; 
		 }
	  }
	$(".scrollContent tr").each(function(){
		var koudianitemId =  $(this).find('input[name="koudianitemId"]').val();
		var startPrice = parseFloat($(this).find('input[name="startPrice"]').val());
		var endPrice = parseFloat($(this).find('input[name="endPrice"]').val());
		var percent=$(this).find('input[name="koudianPercent"]').val();
		if(percent.indexOf(".")>=0){
			var percentfendian=percent.substring(percent.indexOf("."),percent.length);
			if(percentfendian.length>3){
				percent=percent.substring(0,percent.indexOf("."))+percent.substring(percent.indexOf("."),percent.indexOf(".")+3);
			}
		}
		var koudianPercent = parseFloat(percent);
		if($(this).find('input[name="endPrice"]').val()=="以上"){
			var endPrice = parseFloat(990000000);
		}
		
		if(!startPrice || startPrice < 0){
			if(startPrice!=0){
				art.dialog.tips('请填写开始金额！');
				flag = false;
				return false;
			}
		}

		/*2016/2/1 10:58 xyz改*/
		if(!endPrice || endPrice <= 0){
			if(endPrice!=0){
				art.dialog.tips('请填写结束金额！最终结束金额填（以上）');
			}else{
				art.dialog.tips('结束金额不为0！');
			}
			flag = false;
			return false;
		}
		 var exist = isExist(arrayObj,endPrice);
		 if(exist<0){ //数组不包含元素
			 if(endPrice!=990000000){
				art.dialog.tips('请检查起始金额是否有'+endPrice+"  ");
				flag = false;
				return false; 
			 }else{
				 exist99++;
			 }
		  }
		if(!koudianPercent || koudianPercent < 0 || koudianPercent > 50){
			if(koudianPercent!=0){
				art.dialog.tips('请填写0-50扣除比例！');
				flag = false;
				return false;
			}
		}

		jsonStr+="{\"id\":\""+koudianitemId+"\",";
		jsonStr+="\"startPrice\":\""+startPrice+"\",";
		jsonStr+="\"endPrice\":\""+endPrice+"\",";
		jsonStr+="\"koudianPercent\":\""+(koudianPercent)+"\"";
		jsonStr +="},";
	});

	if(flag){
		 
	}
	if(jsonStr.indexOf(",")!=-1){
		jsonStr=jsonStr.substring(0,jsonStr.length-1);
	}
	jsonStr+="]";
	jsonStr.replace("undefined","");
	var number = $("#number").val();
	var number1 = $("#number1").val();
	$.ajax({ url: base+"/ebbase/goodskoudianconf/checkNumber",type:"post",
		data:{number:number},dataType:"json", success: function(data){
		if (data.STATE == 'SUCCESS' && number!=number1) {
			art.dialog.alert("该编码已存在！");
			flag = false;
			return false; 
		}else{
			if(flag){
				$('#koudianitemDetailStr').val(jsonStr);
				$.post(base + "/ebbase/goodskoudianconf/save",$('form').serialize(),function(res){
					if(res.STATE == "SUCCESS"){
						if(res.MSG){
							art.dialog({
								content: res.MSG,
								time:1,
								close:function(){
									art.dialog.close();
								},
								width:200
							});
						}else{
							art.dialog.close();
						}
					}else{
						art.dialog.tips(res.MSG);
					}
			    },'json');
			}
			if(currentDialog && flag){
				currentDialog.button({name:"取消",disabled:true});
				currentDialog.button({name:"保存",disabled:true});
			}
			return false;
		}}}
		);
}


