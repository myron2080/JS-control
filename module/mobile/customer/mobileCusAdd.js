$(document).on("mobileinit", function() {
  $.mobile.selectmenu.prototype.options.nativeMenu = false;//select 弹出层选择
}).ready(function(){
	  priceTypeChange('first');
	  $("#addBtn").bind("click",function(event, ui) {
			addContact();
	  });
	  $("#backBtn").bind("click",function(){
		  window.location.href = base+"/mobilefastsale/mobileCustomer/list";
	  });
	  initSelect("intentionType");
	  initSelect("customerPurpose");
	  initSelect("publicLevel");
});
function initSelect(name){
	var  val = $("input[name='"+name+"']").val();
	tdClick($("td[key='"+val+"']"));
}
function tdClick(obj){
var val =  $(obj).attr("key");
var name = $(obj).attr("name");
	$(obj).addClass("now").siblings("td[name='"+name+"']").removeClass("now");
	$("td[name='"+name+"']").find("span").removeClass("icon-svg25 Greenico").addClass("Ashico");
	$(obj).find("span").addClass("icon-svg25 Greenico");
	$("input[name='"+name.substring(1)+"']").val(val);
}
/**
 * 选择按钮
 * @param obj
 * @param key
 * @param val
 */
function changeType(obj,key,value){
	$("#"+key).val(value);
	//选择样式变化
	$(".btnbox ul li").each(function(){
		if($(this).attr("key").indexOf(key) != -1){
			$(this).attr("class","");
		}
	});
	$(obj).parent().attr("class","bluea");
}


function typeTdClick(obj,str){
	$("#sorcuseLabel").text($(obj).text());
	$("#customerSource").val(str);
	$("#orderDiv").toggle();
}

/**
 * 客户意向条件  选择
 * @param obj
 */
function changeDiv(obj){
	var id=$(obj).attr("key");
	$("#allCondition div").each(function(){
		if($(this).attr("key") == 'conditionKey'){
			$(this).hide();
		}
	});
	$("#"+id).show();
}

/** 
 * 选择排序类型
 */
function chooseType(){
	$("#orderDiv").toggle();
}

function addContact(){
	var param=parseInt($("#indexParam").val(),10)+1;
	$("#indexParam").val(param);
	var div="<div class='chakanbox'><a class='Deletean1' onclick='deleteContact(this);'  href='javascript:void(0);' data-role='button'  data-inline='true' data-icon='delete'><div class='icon-svg27'></div></a><div data-role='fieldcontain' key='contactField' style=' margin:0; padding:0;'>";
	div+="<p><label for='nameId_"+param+"' style=' color: #1a1a1a;'>姓名</label>";
	div+="<input type='text' name='name' id='nameId_"+param+"' value='' /></p>";
	div+="<p><label for='mobileId_"+param+"' style=' color: #1a1a1a;'>电话</label>";
	div+="<input type='text' name='mobile' id='mobileId_"+param+"' value='' /></p>";
	div+="</div></div>";
	$("#contactDiv").append(div);
	$("#contactDiv").parent().trigger('create');
}

function deleteContact(obj){
	var list=$("div[key='contactField']").length;
	if(list==1){
		//msgDialog("至少保留一个联系人!");
		commonTipShow("至少保留一个联系人!",1000);
	}else{
		$(obj).parent().remove();
	}
}

/**
 * 客户保存
 */
function saveCustomer(){
	 var $this = $( this ),
	  html = $this.jqmData( "html" ) || "";
	$.mobile.loading( 'show', {
		  text: "保存中...",
		  textVisible: true,
		  theme: "b",
		  textonly: false,
		  html: html
		  });
	
	var source = $("#customerSource").val();
	if(source==null||source==''){
		msgPopup("请选择来源!");
		return;
	}	if(checkContact()){
		setContact();
	    submitForm();
	}
}

function submitForm(){
		
		$.post($('form').attr('action'),$('form').serialize(),function(res){
			if(res.STATE == "SUCCESS"){
				if(res.MSG){
//					msgDialog(res.MSG);
					setTimeout(function(){
						var id=$("#id").val();
						if(null != id && id != ''){
							window.location.href = base+"/mobilefastsale/mobileCustomer/customerView?id="+id;
						}else{
							window.location.href = base+"/mobilefastsale/mobileCustomer/list";
						}
					},2000);
				}else{
					//关闭
//					msgDialog(res.MSG);
					setTimeout(function(){
						var id=$("#id").val();
						if(null != id && id != ''){
							window.location.href = base+"/mobilefastsale/mobileCustomer/customerView?id="+id;
						}else{
							window.location.href = base+"/mobilefastsale/mobileCustomer/list";
						}
					},2000);
				}
			}else{
				//错误信息
				//msgDialog(res.MSG);
				$.mobile.loading( "hide" );
				commonTipShow(res.MSG,1000);
			}
	    },'json');
}

/**
 * 弹出 提示信息
 * @param txt
 */
function msgDialog(txt){
	$.mobile.loading( "hide" );
	$("#msgStr").text(txt);
	$.mobile.changePage( "#systemMsg", { role: "dialog" } );
}


/**
 * 拼接联系人json
 */
function setContact(){
	var contactJson="[";
	$("#contactDiv div").each(function(){
		if($(this).attr("key") == 'contactField'){
			contactJson+="{";
			if($(this).find("input[name='concatPersonId']").length >0 ){
				contactJson+="'id':'"+$(this).find("input[name='concatPersonId']").val()+"',";
			}
			contactJson+="'name':'"+$(this).find("input[name='name']").val()+"',";
			contactJson+="'mobile':'"+$(this).find("input[name='mobile']").val()+"'},";
		}
	});
	if (contactJson.indexOf(",") != -1) {
		contactJson = contactJson.substring(0, contactJson.length - 1)+"]";
	}else{
		contactJson="";
	}
	$("#customerJson").val(contactJson);
}

/**
 * 弹出 提示信息
 * @param txt
 */
function msgPopup(txt){
	$.mobile.loading( "hide" );
	$("#popupMsgStr").text(txt);
	$( "#popupSystemMsg" ).popup( "open" );
	setTimeout("$('#popupSystemMsg').popup( 'close') ", 1000 );
}
/**
 * 联系人信息 校验
 */
function checkContact(){
	var flag=true;
	/**
	 * 遍历验证  联系人信息
	 */
	$("#contactDiv div").each(function(){
		if($(this).attr("key") == 'contactField'){
			var name=$(this).find("input[name='name']");
			if(name.val() == ''){
				msgPopup("请输入联系人姓名!");
				flag=false;
				return flag;
			}
			var mobile=$(this).find("input[name='mobile']");
			if(mobile.val() == ''){
				msgPopup("请输入联系人电话!");
				flag=false;
				return flag;
			}else{
				var reg=/1[0-9][0-9]{9}/;
				if(!reg.test(mobile.val())){
				msgPopup("请输入正确的电话!");
				flag=false;
				return flag;
				}
			}
		}
	});
	
	return flag;
}


//========================================================客户意向条件js===========================================
/**
 * 客户意向条件  选择楼层
 */
function floorChange(){
	var temp="";
	$("input[name='floorType']").each(function(){
		if($(this).attr("checked")){
			temp=$(this).val();
		}
	});
	if(temp == 'one'){//低层
		$("#floorFrom").val(1);
		$("#floorTo").val(8);
	}else if(temp == 'two'){//中层
		$("#floorFrom").val(9);
		$("#floorTo").val(18);
	}else{//高层
		$("#floorFrom").val(19);
		$("#floorTo").val(35);
	}
}

/**
 * 确定选择 所有意向条件
 */
function conditionSure(){
	//设置户型value
	var layouts="";
	$("input[name='layout']").each(function(){
		if($(this).attr("checked")){
			layouts+=$(this).val()+",";
		}
	});
	if(layouts.indexOf(",") != -1){
		layouts=layouts.substring(0,layouts.length-1);
	}
	$("#layouts").val(layouts);
	
	//朝向   
	var decorations="";
	$("input[name='decoration']").each(function(){
		if($(this).attr("checked")){
			decorations+=$(this).val()+",";
		}
	});
	if(decorations.indexOf(",") != -1){
		decorations=decorations.substring(0,decorations.length-1);
	}
	$("#decorations").val(decorations);
	
	//装修
	var directions="";
	$("input[name='direction']").each(function(){
		if($(this).attr("checked")){
			directions+=$(this).val()+",";
		}
	});
	if(directions.indexOf(",") != -1){
		directions=directions.substring(0,directions.length-1);
	}
	$("#directions").val(directions);
	
	//拼接意向描述----------------------------start---------------------------------
	var desc="";
	/**
	 * 用途
	 */
	$("input[name='propertyType']").each(function(){
		if($(this).attr("checked")){
			var id=$(this).attr("id");
			var tem=$("label[for='"+id+"']").text();
			desc+="用途:"+tem;
		}
	});
	
	/**
	 * 户型
	 */
	var layoutTemp="户型:";
	$("input[name='layout']").each(function(){
		if($(this).attr("checked")){
			var id=$(this).attr("id");
			var tem=$("label[for='"+id+"']").text();
			layoutTemp+=tem+",";
		}
	});
	if(layoutTemp.indexOf(",") != -1){
		layoutTemp=layoutTemp.substring(0,layoutTemp.length-1);
		desc+=" "+layoutTemp;//意向描述  增加户型
	}else{
		layoutTemp="";
	}
	
	/**
	 * 面积
	 */
	var areaFrom=$("#areaFrom").val();
	var areaTo=$("#areaTo").val();
	if(areaFrom != '' || areaTo != ''){//面积 有值
		var areaStr="建筑面积";
		$("input[name='areaType']").each(function(){
			if($(this).attr("checked")){
				var tem=$(this).val();
				if(tem == 'two'){
					areaStr="套内面积";
				}
			}
		});
		desc+=" "+areaStr+":"+areaFrom+"m²-"+areaTo+"m²";
	}
	
	/**
	 * 价格
	 */
	var priceFrom=$("#priceFrom").val();
	var priceTo=$("#priceTo").val();
	if(priceFrom != '' || priceTo != ''){//价格 有值
		var priceStr="";
		var priceVal="";
		$("input[name='priceType']").each(function(){
			if($(this).attr("checked")){
				priceVal=$(this).val();
				var id=$(this).attr("id");
				priceStr=$("label[for='"+id+"']").text();
			}
		});
		var danwei="";
		if(priceVal=='one'){//售价
			danwei="万";
		}else if(priceVal=='two'){//租价
			danwei="元";
		}else if(priceVal=='three'){//售单价
			danwei="元/m²"
		}else if(priceVal=='four'){//租单价
			danwei="元/月*m²";
		}
		desc+=" "+priceStr+":"+priceFrom+"-"+priceTo+danwei;
	}
	
	/**
	 * 楼层
	 */
	var floorFrom=$("#floorFrom").val();
	var floorTo=$("#floorTo").val();
	if(floorFrom != '' || floorTo != ''){//价格 有值
		desc+=" 楼层:"+floorFrom+"-"+floorTo+"层";
	}
	
	/**
	 * 朝向
	 */
	var directionTemp="朝向:";
	$("input[name='direction']").each(function(){
		if($(this).attr("checked")){
			var id=$(this).attr("id");
			var tem=$("label[for='"+id+"']").text();
			directionTemp+=tem+",";
		}
	});
	if(directionTemp.indexOf(",") != -1){
		directionTemp=directionTemp.substring(0,directionTemp.length-1);
		desc+=" "+directionTemp;//意向描述  增加户型
	}else{
		directionTemp="";
	}
	function ()
	/** decoration
	 * 装修
	 */
	var decorationTemp="装修:";
	$("input[name='decoration']").each(function(){
		if($(this).attr("checked")){
			var id=$(this).attr("id");
			var tem=$("label[for='"+id+"']").text();
			decorationTemp+=tem+",";
		}
	});
	if(decorationTemp.indexOf(",") != -1){
		decorationTemp=decorationTemp.substring(0,decorationTemp.length-1);
		desc+=" "+decorationTemp;//意向描述  增加户型
	}else{
		decorationTemp="";
	}
	$("#intentionDescription").val(desc);
	//拼接意向描述----------------------------end---------------------------------
}

/**
 * 每次点击  客户意向条件 默认显示第一个div
 */
function showFirstDiv(){
	$("#useDiv").show();
	$("#layoutsDiv").hide();
	$("#areaDiv").hide();
	$("#priceDiv").hide();
	$("#floorDiv").hide();
	$("#wardDiv").hide();
	$("#fitmentDiv").hide();
}

/**
 * 客户意向条件  意向面积
 */
function areaChange(){
	var temp="";
	$("input[name='areaDetail']").each(function(){
		if($(this).attr("checked")){
			temp=$(this).val();
		}
	});
	var list=temp.split("-");
	$("#areaFrom").val(list[0]);
	$("#areaTo").val(list[1]);
}

/**
 * 价格选项类型 变化
 */
function priceTypeChange(str){
	var temp="";
	$("input[name='priceType']").each(function(){
		if($(this).attr("checked")){
			temp=$(this).val();
		}
	});
    /*SALE("售价","SALE") one
	,SALEAVERAGE("售单价","SALEAVERAGE")three
	,RENT("租价","RENT")two
	,RENTAVERAGE("租单价","RENTAVERAGE");four
	*/
	$("#priceDetail_one").hide();
	$("#priceDetail_two").hide();
	$("#priceDetail_three").hide();
	$("#priceDetail_four").hide();
	
	$("#priceDetail_"+temp).show();
	
	/**
	 * 将价格文本框的值 设置为空
	 */
	if(null != str && str != ''){
		
	}else{
		$("#priceFrom").val("");
		$("#priceTo").val("");
	}
}
function chooseSrc(obj){
	$.mobile.changePage( "#editPage", { role: "page" } );
	$("#customerSource").val($(obj).attr("key"));
	var srcName = $(obj).attr("name");
	$("#sourceName").html(srcName+">>");
	$("#sourceName").css("color","#2bb342");
	$("#srcKeyWord").val("");
}
/**
 * 选择一个价格区间  将值赋值到文本框
 * @param obj
 */
function priceDetailChange(obj){
	var list=$(obj).val().split("-");
	$("#priceFrom").val(list[0]);
	$("#priceTo").val(list[1]);
}
