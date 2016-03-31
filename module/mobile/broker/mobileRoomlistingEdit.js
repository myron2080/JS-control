$(document).on("click", "#moreBtn", function() {
	  var $this = $( this ),
	  html = $this.jqmData( "html" ) || "";
	$.mobile.loading( 'show', {
	  text: "加载中...",
	  textVisible: true,
	  theme: "b",
	  textonly: false,
	  html: html
	  });
}).on("mobileinit", function() {
	 //$.mobile.selectmenu.prototype.options.nativeMenu = false;//select 弹出层选择
}).ready(function(){
	 var url = window.location.href;
	 if(url.indexOf("showDetail")>0){
		 $.mobile.changePage( "#listPage", { role: "page" } );
	 }
	 $("#backBtn").bind("click",function(){
		  window.location.href = base+"/mobile/roomlisting/list";
	  });
		//物业类型
	 initSelect("propertyType");
		// 选择 室
	 initSelect("bedRoom");
		// 选择 厅
	 initSelect("livingRoom");
		// 选择 卫
	 initSelect("bathRoom");
		// 选择 阳台
		// 选择  放盘类型
	 initSelect("listingType");
		// 选择  售支付类型
	 initSelect("paymentType");
	 
	/*	$("#salePaymentTypeSelect tr td").bind("click",function(){
			$(this).addClass("selected").siblings("td").removeClass("selected");
			$("#paymentType").val($(this).attr("key"));
		});*/
		// 选择   租支付类型
		initSelect("rentPaymentType");
		
		// 选择   亮点
		$("#liangdian a").bind("click",function(){
			//$(this).addClass("choosed").siblings("a").removeClass("choosed");
			if($(this).hasClass("choosed")){
			$(this).removeClass("choosed");
			}else{$(this).addClass("choosed");}
			$("#otherDescription").val(getEachValue("liangdian"));
		});
		eachSelect("otherDescription");
		// 选择   配套
		$("#peitao a").bind("click",function(){
			//$(this).addClass("choosed").siblings("a").removeClass("choosed");
			if($(this).hasClass("choosed")){
				$(this).removeClass("choosed");
				}else{$(this).addClass("choosed");}
				$("#therFacilities").val(getEachValue("peitao"));
		});
		eachSelect("therFacilities");
		// 选择  物业类型类型
		initSelect("propertyType");
		
		$("#propertyTypeSelect tr td").each(function(){
			if($(this).hasClass("selected")){
				var key = $(this).attr("key");
				if(key=="APARTMENT"||key=="LIVINGBUILDING"){
					$("#patterns").show();
					$("#otherPatterns").hide();
					$("#otherPatterns").find("SELECT").html("");
				}else{
					$("#patterns").hide();
					$("#otherPatterns").show();}
			}
		});
		//修改时房间不可修改
		if(!isNull($("#roomListingId").val())){
		$("#gardenName").attr("disabled","disabled");
		$("#building").attr("disabled","disabled");
		$("#roomNumberStr").attr("disabled","disabled");}
		gardenSearch('0');
		isShowDel();
		
		$("#saleLi,#rentLi,#buildAreaLi").find("input").focus(function(){
			if($(this).val()==0)
			$(this).val("");
		});
		$("#saleLi,#rentLi,#buildAreaLi").find("input").blur(function(){
			if(isNull($(this).val()))
			$(this).val(0);
		});
		//$('#floorPickerDiv').css('position','fixed'); 
})
function eachSelect(val_name){
	var varStr = $("#"+val_name).val();
	var val =varStr.split(",");
	for(var item in val){
		$("a[key='"+val[item]+"']").addClass("choosed");
	}
}
function showBuilding(){
	if(isNull($("#gardenId").val())){
		msgDialog("请先选择小区");
	}else{
	getBuildingInfo($("#"+$("#gardenId").val()));
	$.mobile.changePage("#buildingPage", { role: "page" } );}
}
function backMainPage(){
	$.mobile.changePage("#listPage", { role: "page" } );	
}
function setPropertyType(key){
	if(key=="APARTMENT"||key=="LIVINGBUILDING"){
		$("#patterns").show();
		$("#otherPatterns").hide();
		$("#otherPatterns").find("SELECT").html("");
	}else{
		$("#patterns").hide();
		$("#otherPatterns").show();
		var patternStr = ""; 
		var curValue =key;
		$("#patterns input").val(0);
		$.each(patterns,function(index,item){ 
			if(curValue == item.parent){
				patternStr += "<option value='"+item.id+"'>"+item.name+"</option>";
			}
		})
		$("#otherPatterns").find("SELECT").html(patternStr);
		$("#otherPatterns").find("SELECT").trigger('change');
		$("#bedRoom").val("");
		$("#livingRoom").val("");
		$("#bathRoom").val("");
	}
	
}
/**
 * 保存
 */
function saveRoomlisting(){
	if(checkForm()){
	$("#buildingIds").val($("#building_Id").val());
    $("#buildName").val($("#building_Name").html());
   // alert("保存");
		submitForm();
    }
}
function contactStr(id,otherId){
	var _other = $("#"+otherId).val();
	var _main = $("#"+id).val();
	if(!isNull(_other)) {
		$("#"+id).val(_main+","+_other);
	}	
}
function submitForm(){
	showLoader();
	 contactStr("therFacilities","therFacilities_other");
	 contactStr("otherDescription","otherDescription_other");
	$.post(base+'/mobile/roomlisting/saveRoomListing',$('form').serialize(),function(res){
		if(res.STATE == "SUCCESS"){
			if(res.MSG){
				msgDialog(res.MSG);
				window.location.href = base+"/mobile/roomlisting/list";
			}
		}else{
			//错误信息
			msgDialog(res.MSG);
		}
		$.mobile.loading( "hide" );
    },'json');
}
//显示加载器  
function showLoader() {  
    //显示加载器.for jQuery Mobile 1.2.0  
    $.mobile.loading('show', {  
        text: '加载中...', //加载器中显示的文字  
        textVisible: true, //是否显示文字  
        theme: 'b',        //加载器主题样式a-e  
        textonly: false,   //是否只显示文字  
        html: ""           //要显示的html内容，如图片等  
    });}
function isNull(val){
if(val==null||val=='')
	return true;
    return false;
}
function checkForm(){
	var key; 
	key=$("#listingType").val();
/*	$("#listingTypeSelect tr td").each(function(){
		if($(this).hasClass("selected")){
			key=$(this).attr("key");
		}
	});*/
	if(isNull($("#gardenName").val())){
		msgDialog("请选择小区!");
		return false;
	}
	if(isNull($("#building_Id").val())){
		msgDialog("请选择选择楼栋!");
		return false;
	}
	if(isNull($("#roomNumber").val())){
		msgDialog("请选择房间!");
		return false;
	}
	if(isNull($("#buildArea").val())){
		msgDialog("请输入建筑面积!");
		return false;
	}else{
		var reg= /^\d*(\.\d{1,2})?$/;
		if(!reg.test($("#buildArea").val())){
		msgDialog("建筑面积只能为数字，且最多留两位小数!");
		return false;}
	}
	/*if(isNull($("#roomArea").val())){
		msgDialog("请输入套内面积!");
		return false;
	}else{
		var reg= /^\d*(\.\d{1,2})?$/;
		if(!reg.test($("#roomArea").val())){
		msgDialog("套内面积只能为数字，且最多留两位小数!");
		return false;}
	}*/
	if(key=="APARTMENT"||key=="LIVINGBUILDING"){
	if(isNull($("input[name='bedRoom']").val())){
		msgDialog("请输入卧室!");
		return false;
	}
	if(isNull($("input[name='livingRoom']").val())){
		msgDialog("请输入厅!");
		return false;
	}
	if(isNull($("input[name='bathRoom']").val())){
		msgDialog("请输入卫!");
		return false;
	}
	}
	/*if(isNull($("input[name='direction']").val())){
		msgDialog("请选择朝向!");
		return false;
	}*/
	
	var listingType = $("#listingType").val();
	if(listingType=="SALE"||listingType=="RENT_SALE")
	if(isNull($("#price").val())){
		msgDialog("请输入售价!");
		return false;
	}else{
		var reg= /^\d*(\.\d{1,2})?$/;
		if(!reg.test($("#price").val())){
		msgDialog("售价只能保留两位小数!");
		return false;}
	}
	if(listingType=="RENT"||listingType=="RENT_SALE")
	if(isNull($("#rent").val())){
		msgDialog("请输入租价!");
		return false;
	}else{
		var reg= /^\d*(\.\d{1,2})?$/;
		if(!reg.test($("#rent").val())){
		msgDialog("租价只能保留两位小数!");
		return false;}
	}
	setContactJsonStr();
	if(!contactFlag){
		return false;
	}
	return true;
}
//遍历选择数据
function getEachValue(id){
	var valueStr="";
	$("#"+id+" a").each(function(){
		if($(this).hasClass("choosed"))
			valueStr+=$(this).html()+",";
	});
	if (valueStr.indexOf(",") != -1) {
		valueStr = valueStr.substring(0, valueStr.length - 1);
	}
	return valueStr;
}
function addPerson(){
	var param=parseInt($("#indexParam").val(),10)+1;
	$("#indexParam").val(param);
	var div='';
	/* div+='<div class="yilantwo-white" key="contactField">';
     
	 div+='     <div class="addpan-list">';
	 div+='          <div class="addpan-r">';
	 div+='               <div class="addpan-rin font14">';
	 div+='                    <input style="width:95%;"  data-role="none"  class="fl addpan-input" name="cname" id="cnameId'+param+'" type="text" />';
	 div+='                </div>';
	 div+='             </div>';
	 div+='             <div class="addpan-l">姓名:</div>';
	 div+='        </div>';
           
	 div+='         <div class="addpan-list">';
	 div+='               <div class="addpan-r">';
	 div+='                  <div class="addpan-rin font14">';
	 div+='                      <input style="width:95%;" data-role="none"  class="fl addpan-input" name="cphoneNumber" id="cphoneNumber'+param+'" type="tel" />';
	 div+='                 </div>';
	 div+='             </div>';
	 div+='             <div class="addpan-l">电话:</div>';
	 div+='         </div>';
	 div+='  <input  type="hidden" name="cid" id="cid'+param+'" />';
     div+='  <input  type="hidden" name="clandlineNumber" id="clandlineNumber'+param+'" />';
	 div+='  <input type="hidden" name="crelation" id="crelation'+param+'"  />';
	 div+='  <input type="hidden" name="cidNumber" id="cidNumber'+param+'" />';
	 div+='  <input type="hidden" name="ccountry" id="ccountry'+param+'" />';
     div+='  <input type="hidden" name="caddress" id="caddress'+param+'" /> ';
	 div+='        <a class="addpan-close" href="javascript:void(0);" onclick="deleteperson(this);"><b style="color:#fff;" data-role="none" class="icon-svg26 font16"></b></a>';
           
	 div+='  </div>';*/
	
	div+='<div class="chakanbox">';
	div+='<a data-icon="delete" key="delete" data-inline="true" data-role="button" onclick="deleteperson(this);" href="javascript:void(0);" class="Deletean1 ui-btn ui-btn-up-c ui-shadow ui-btn-corner-all ui-btn-inline ui-btn-icon-left" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c"><span class="ui-btn-inner"><span class="ui-btn-text"><div class="icon-svg27"></div></span><span class="ui-icon ui-icon-delete ui-icon-shadow">&nbsp;</span></span></a>';
	div+='<div style=" margin:0; padding:0;" key="contactField" data-role="fieldcontain" class="ui-field-contain ui-body ui-br">';
	div+='<p>';
	div+='<label for="nameId" class="ui-input-text">姓名</label>';
	div+='  <input type="text" name="cname" id="cnameId'+param+'"  value="" />';
	div+='  </p>';
	div+='  <p>';
	div+='  <label for="mobileId" class="ui-input-text">电话</label>';
	div+='  <input  name="cphoneNumber" id="cphoneNumber'+param+'" type="tel"  value="" />';
		div+='  <input  type="hidden" name="cid" id="cid'+param+'" />';
    div+='  <input  type="hidden" name="clandlineNumber" id="clandlineNumber'+param+'" />';
	 div+='  <input type="hidden" name="crelation" id="crelation'+param+'"  />';
	 div+='  <input type="hidden" name="cidNumber" id="cidNumber'+param+'" />';
	 div+='  <input type="hidden" name="ccountry" id="ccountry'+param+'" />';
    div+='  <input type="hidden" name="caddress" id="caddress'+param+'" /> ';
	  
	div+='  </p>';
	div+='</div>';
	div+='</div>';
	
	
	$("#contactDiv").append(div);
	$("#contactDiv").parent().trigger('create');
	 isShowDel();
}
//新版Js Start
function initSelect(name){
	var  val = $("input[name='"+name+"']").val();
	if(val==0){
	var val=1;
	 $("input[name='"+name+"']").val(1)}
	tdClick($("td[key='"+val+"'][name='_"+name+"']"));
	if(name=="listingType")
	showPriceLi($("td[key='"+val+"'][name='_"+name+"']"));
}
function tdClick(obj){
var val =  $(obj).attr("key");
//alert(key)；
var name = $(obj).attr("name");
	$(obj).addClass("now").siblings("td[name='"+name+"']").removeClass("now");
	$("td[name='"+name+"']").find("span").removeClass("icon-svg25 Greenico").addClass("Ashico");
	$(obj).find("span").addClass("icon-svg25 Greenico");
	//alert(name);
	$("input[name='"+name.substring(1)+"']").val(val);
}
function showPriceLi(obj){
	var key =$(obj).attr("key");
	if(key=='RENT'){
	$("#rentLi").show();
	$("#saleLi").hide();
	$("#rentPersonId").val(currentId);
	$("#salePersonId").val("");
	$("#rentLi").find("input").attr("disabled",false);
	$("#saleLi").find("input").attr("disabled","disabled");
	}else if(key=="SALE"){
	$("#rentLi").hide();
	$("#saleLi").show();
	$("#rentPersonId").val("");
	$("#salePersonId").val(currentId);
	$("#saleLi").find("input").attr("disabled",false);
	$("#rentLi").find("input").attr("disabled","disabled");
	}else{
	$("#rentLi").show();
	$("#saleLi").show();
	$("#rentPersonId").val(currentId);
	$("#salePersonId").val(currentId);
	$("#rentLi").find("input").attr("disabled",false);
	$("#saleLi").find("input").attr("disabled",false);
	}
}

function chooseFunc(obj){
	var _id = $(obj).attr("key");
	var _value = $(obj).attr("value");
	var _name=$(obj).attr("name");
	if(_id=='project')
	$("#"+_id).val(_name);
	$("#"+_id+"_Id").val(_value);
	$("#"+_id+"_Name").html(_name);
	$("#"+_id+"_Name").css("color","#2bb342");
	if(_id=='building'){
	$("#roomNumber").val("");
	$("#roomNumberStr").val("");
	$("#roomNumber_Name").html("未选择>>");
	$("#roomNumber_Name").css("color","");	
}
	$.mobile.changePage( "#listPage", { role: "page" } );
}
//新版 End
/**
 * 弹出 提示信息
 * @param txt
 */
function msgDialog(txt){
	$.mobile.loading( "hide" );
	$("#msgStr").text(txt);
	//$.mobile.changePage( "#systemMsg", { role: "dialog" } );
	$( "#popupSystemMsg" ).popup( "open" );
	setTimeout("$( '#popupSystemMsg' ).popup( 'close') ", 1000 )
}
function msgDialog(txt,second){
	$.mobile.loading( "hide" );
	$("#msgStr").text(txt);
	//$.mobile.changePage( "#systemMsg", { role: "dialog" } );
	$( "#popupSystemMsg" ).popup( "open" );
	 var mm=1000;
	 if(second){
		 mm=second*1000;
	 }
	 setTimeout("$( '#popupSystemMsg' ).popup( 'close') ", mm )
}

function deleteperson(obj){
/*	if(list==1){
		msgDialog("至少保留 一个联系人!");
	}else{
		$(obj).parent().remove();
	}*/
	$(obj).parent().remove();
	isShowDel();
	
}
function isShowDel(){
	var list=$("div[key='contactField']").length;
	if(list==1){
	$("a[key='delete']").hide();	
	}else{
	$("a[key='delete']").show();	
	}
}
var contactFlag = true;
function setContactJsonStr(){
	contactFlag = true;
	var contactJson="[";
	$("#contactDiv div").each(function(){
		if($(this).attr("key") == 'contactField'){
			contactJson+="{";
			contactJson += "'id':'"+$(this).find("input[name='cid']").val()+"',";
			contactJson += "'landlineNumber':'"+$(this).find("input[name='clandlineNumber']").val()+"',";
			contactJson += "'idNumber':'"+$(this).find("input[name='cidNumber']").val()+"',";
			var relation = $(this).find("input[name='crelation']").val();
			if(!isNull(relation))
			contactJson += "'relation':'"+relation+"',";
			var country = $(this).find("input[name='ccountry']").val();
			if(!isNull(country))
			contactJson += "'country':'"+country+"',";
			contactJson += "'address':'"+$(this).find("input[name='caddress']").val()+"',";
			var name =$(this).find("input[name='cname']").val();
			if(isNull(name)){
				msgDialog("联系人姓名不能为空!");
				contactFlag = false;
				return;
			}				
			contactJson+="'name':'"+name+"',";
			var reg = /^[1][3-8]\d{9}$/;
			var phoneNumber = $(this).find("input[name='cphoneNumber']").val();
			if(isNull(phoneNumber)){
				msgDialog("联系电话不能为空!");
				contactFlag = false;
				return;
			}else if(!reg.test(phoneNumber)){//
				msgDialog("请输入正确的联系人手机号码!");
				contactFlag = false;
				$(this).find("input[name='cphoneNumber']").val("");
			    //$(this).find("input[name='cphoneNumber']").select();
				return;
			}
			contactJson+="'phoneNumber':'"+phoneNumber+"'},";
		}
	});
	if (contactJson.indexOf(",") != -1) {
		contactJson = contactJson.substring(0, contactJson.length - 1)+"]";
	}else{
		contactJson="";
	}
	$("#ownerJsonStr").val(contactJson);
}
// 盘源选择器
function chooseOne(obj){
	$.mobile.changePage( "#listPage", { role: "page" } );
	var id = $(obj).attr("id");
	var name = $(obj).attr("name");
	$("#gardenId").val(id);
	$("#gardenName").val(name);
	$("#garden_Name").html(name);
	$("#garden_Name").css("color","#2bb342");
//	getBuildingInfo(obj);
	$("#building_Id").val("");
	$("#building_Name").html("未选择>>");
	$("#building_Name").css("color","");	
	$("#roomNumber").val("");
	$("#roomNumberStr").val("");
	$("#roomNumber_Name").html("未选择>>");
	$("#roomNumber_Name").css("color","");	
	
	$("#gardenKeyWord").val("");
}
//楼栋选择器
function getBuildingInfo(obj){
	var id = $(obj).attr("id");
	var nocustom = $(obj).attr("noCustom");;
	var propertyTypes = $(obj).attr("propertyTypes");;
	
	$.post(getPath()+"/broker/building/getBuildingByGardenId",{gardenId:id,type:'UNIT'},function(result){
		var resultData = eval(result);
		//var tempHtmlStr = "<option value=''></option>";
		var tempHtmlStr ='';
		$.each(resultData.items,function(index,item){
			tempHtmlStr+='<div class="growingjq-listin bold" style="font-size:18px;"  key="building"  value="'+item.id+'"  name ="'+((item.name==item.unitName)?item.name:(item.name+item.unitName))+'" onclick="chooseFunc(this);">'+((item.name==item.unitName)?item.name:(item.name+item.unitName))+'</div>';
			//tempHtmlStr+="<option value='"+item.id+"'"+(index==0?"selected":"")+">"+((item.name==item.unitName)?item.name:(item.name+item.unitName))+"</option>"
		});
		//有办公与厂房用途才可整栋放盘
		/*var prop = propertyTypes.split('#');
		var isallbuild = false;
		for(var m=0;m<prop.length;m++){
			if(prop[m]=='FACTORY'){isallbuild = true;break;}
			if(prop[m]=='BUILDING'){isallbuild = true;break;}
		}
		if(propertyTypes.indexOf("FACTORY")>-1||propertyTypes.indexOf("BUILDING")>-1) 
		if(isallbuild) tempHtmlStr +=  "<option value='allbuild'>整栋放盘</option>";*/
		if(tempHtmlStr=='')
		tempHtmlStr='<div class="growingjq-listin bold" style="font-size:18px;" onclick="backMainPage();">未查找到所选小区楼栋数据</div>';
		$("#buildingList").html(tempHtmlStr);
	},'json');
}
//楼层选择器
function getFloorInfo(buildingId){
	$("#floorListData").html("");
	$("#roomListData").html("");
	if(!buildingId) {
		msgDialog("请选择楼栋!");
		return;}
	$.post(getPath()+"/mobile/roomlisting/getFloorByBuildingId",{buildingId:buildingId},function(result){
		var resultData = eval(result);
		var tempHtmlStr = '';	
		var firstId='';
		if(resultData.items.length==0){
			tempHtmlStr+='<a href="javascript:void(0);">该楼栋楼层没有建模或无可租售的盘,可联系管理员建模或选择其他楼栋</a>';
			$("#roomListData").html("");
			return ;
		}
		$("#totalFloor").val(resultData.items.length);
		$.each(resultData.items,function(index,item){
			tempHtmlStr+='<a href="javascript:void(0);" id="'+item.id+'" floornum="'+item.floornum+'" onclick="getRoomInfoByFloor(this);">'+item.name+'</a>';
			if(index==0)
			firstId = item.id;
		})
		$("#floorListData").html(tempHtmlStr);
		if(firstId!='')
		getRoomInfoByFloor($("#"+firstId));
		
	},'json');
}
function getRoomInfoByFloor(obj){
	$(obj).addClass("tnow").siblings("a").removeClass("tnow");
	var floorId = $(obj).attr("id");
	$("#roomListData").html("");
	$.post(getPath()+"/mobile/roomlisting/getRoomInfoByFloor",{floorId:floorId},function(result){
		var resultData = eval(result);
		var tempHtmlStr = '';		
		if(resultData.items.length==0){
			msgDialog("该楼栋楼层没有建模,可联系管理员建模或选择其他楼栋");
			//tempHtmlStr+='<a href="javascript:void(0);">该楼栋楼层没有建模或无可租售的盘,可联系管理员建模或选择其他楼栋</a>';
		}else{
			$("#floorPickerBg").show();
			$("#floorPickerDiv").show();
		}
		$.each(resultData.items,function(index,item){
			tempHtmlStr+='<a href="javascript:void(0);" onclick="chooseRoom(this);" id="'+item.id+'">'+item.roomNumber+'</a>';
		})
		$("#roomListData").html(tempHtmlStr);
	},'json');
}
function chooseRoom(obj){
	$(obj).addClass("tnow").siblings("a").removeClass("tnow");
}
function pickRoomOk(){
	var floorName = $("#floorListData .tnow").html();
	var roomNumber = $("#roomListData .tnow").html();
	$("#roomId").val($("#roomListData .tnow").attr("id"));
	$("#buildingIds").val(buildingIds)
	$("#floorIds").val($("#floorListData .tnow").attr("id"));
	$("#floorNum").val($("#floorListData .tnow").attr("floornum"));
	if(floorName!=undefined&&roomNumber!=undefined){
	floorName+= floorName.indexOf("层")>0?"":"层";
	$("#roomNumberStr").val(floorName+roomNumber);
	$("#roomNumber_Name").html(floorName+roomNumber);
	$("#roomNumber_Name").css("color","#2bb342");
	$("#roomNumber").val(roomNumber);
	
	setRoomByEnter();
	}
	
	hideFloorPickerDiv();
}
function showFloorPickerDiv(){
	if($("#building_Id").val()==null||$("#building_Id").val()==''){
	msgDialog("请先选择楼栋！");
	return;}else{
    getFloorInfo($("#building_Id").val());
	}
}
function hideFloorPickerDiv(){
	$("#floorPickerBg").hide();
	$("#floorPickerDiv").hide();
}
function setSelect(divId,keyValue){
	$("#"+divId+" tr td").each(function(){
		if($(this).attr("key") == keyValue){
			$(this).addClass("selected").siblings("td").removeClass("selected");
			$("#bathRoom").val($(this).attr("key"));
			}
		});
}
//初始化房间信息 Start
function setRoomByEnter(){
	var num = $("#roomNumber").val();
	if(num){
	var buildId = $("#building_Id").val();
	var room = {number:num,buildId:buildId};
	initBaseInput();
	setRoom(room);
	}
}
function buildingChange(){
	resetRoomInfo();
	$("#roomId").val("");
	$("#buildingIds").val("")
	$("#floorIds").val("");
	$("#floorNum").val("");
	$("#roomNumberStr").val("");
	$("#roomNumber").val("");
}
function setRoom(room){
	
	$.ajax({
		url:getPath()+"/broker/roomListing/getRoomDetail",
		dataType: "json",
		data: {roomId:room.value,roomNum:room.number,buildId:room.buildId},
		success: function( data ) {
			initRoomData(data);
		}
	});

	$("#roomNumber").val(room.number); 
}
function initRoomData(data){
	
	if(data.roomListingId){
		msgDialog("该房间存在放盘,请重新选择!");
		$("#roomNumber").val(""); 
		$("#roomNumber").val("");
		$("#roomNumberStr").val("");
		$("#roomNumber_Name").html("未选择>>");
		$("#roomNumber_Name").css("color","");	
		resetRoomInfo();
		/*art.dialog.confirm("该房间存在放盘,点击确定进入盘源详情页面修改",function(){
			window.location.href= getPath() +"/broker/roomDetail/view?roomListingId="+data.roomListingId;
		},function(){
			$("#roomNumber").val(""); 
			return;
		});*/
	}
	
	else{
	
	//清理之前数据	
	resetRoomInfo();
	
	if(!data.roomData){	
		msgDialog("该房间未建模!");
	}else{
		initRoomInfo(data);
	}
	}
}
//初始化基本参数,避免后台转换出错 double类型,不可设null
function initBaseInput(){
	$("#rent").val(0);
	$("#price").val(0);
}
//初始化房间信息
function initRoomInfo(data){
	if(data.roomData){
		$("#roomId").val(data.roomData.id); 
		$("#buildArea").val(data.roomData.buildArea); 
		$("#floor").val(data.roomData.floor.id);
		$("#roomArea").val(data.roomData.roomArea);
		$("#decoration").val(data.roomData.decoration);
		
		$("#legalNumber").val(data.roomData.legalNumber);
		if(data.roomData.bedRoom!=0){
		$("input[name='bedRoom']").val(data.roomData.bedRoom);
		 initSelect("bedRoom");}
		//setSelect("bedRoomNum",data.roomData.bedRoom);
		if(data.roomData.livingRoom!=0){
			$("input[name='livingRoom']").val(data.roomData.livingRoom);
		 initSelect("livingRoom");}
		//setSelect("livingRoomNum",data.roomData.livingRoom);
		if(data.roomData.bathRoom!=0){
			$("input[name='bathRoom']").val(data.roomData.bathRoom);
		initSelect("bathRoom");}
		//setSelect("bathRoomNum",data.roomData.bathRoom);
		//阳台
		$("#balcony").val(data.roomData.balcony);
		//setSelect("balconyNum",data.roomData.balcony);
		if(data.roomData.propertyType){
			$("input[name='propertyType']").val(data.roomData.propertyType);
		initSelect("propertyType");}
		//setSelect("propertyTypeSelect",data.roomData.propertyType);
		//$("#roomPattern").val(data.roomData.roomPattern);
		//changePropertyType($("#propertyType")[0]);
		if(data.roomData.direction){
		$("input[name='direction']").val(data.roomData.direction);
		$("#direction_Name").html(data.roomData.directionName);
		$("#direction_Name").css("color","#2bb342");}
		//$("#roomStructural").val(data.roomData.roomStructural);
	}
}

//重置房间信息
function resetRoomInfo(){
	
		$("#roomId").val(""); 
		$("#buildArea").val(""); 
		$("#floor").val("");
		$("#roomArea").val(0);
		$("#decoration").val("");
		$("#legalNumber").val("");
		$("input[name='bedRoom']").val(1);
		 initSelect("bedRoom");
		$("input[name='livingRoom']").val(1);
		 initSelect("livingRoom");
		$("input[name='bathRoom']").val(1);
		 initSelect("bathRoom");
		$("#balcony").val(0);
		
		//$("#propertyType").val('');
       //$("#roomPattern").val('');
		
		$("#floorNum").val('');
	//	$("#moreFloorNum").val('');
		
}
//初始化房间信息 End
function initPanelInfo(data){

	
	if(data.roomListingId){
		
		$("#roomListingId").val(data.roomData.roomListing.id);
		$("#listingType").val(data.roomData.roomListing.listingType);
		//$("#keyNumber").val(data.roomData.roomListing.keyNumber);
		//$("#powerofAttorney").val(data.roomData.roomListing.powerofAttorney);
		$("#price").val((data.roomData.roomListing.price/10000).toFixed(1));
		$("#paymentType").val(data.roomData.roomListing.paymentType); 
		//$("#mortgageBank").val(data.roomData.roomListing.mortgageBank);
		//$("#mortgagearrears").val(data.roomData.roomListing.mortgagearrears);
		//$("#propertyStatus").val(data.roomData.roomListing.propertyStatus);
		$("#rent").val(data.roomData.roomListing.rent);
		$("#rentPaymentType").val(data.roomData.roomListing.rentPaymentType);
		//$("#deposit").val(data.roomData.roomListing.deposit);
		$("#saleDescription").val(data.roomData.roomListing.saleDescription);
		$("#rentDescription").val(data.roomData.roomListing.rentDescription);
		//$("#transferfee").val(data.roomData.roomListing.transferfee);
		$("#rentFacilities").val(data.roomData.roomListing.rentFacilities);
		if(data.roomData.roomListing.keyPerson){
			$("#keyPersonId").val(data.roomData.roomListing.keyPerson.id);
		}
		if(data.roomData.roomListing.salePerson){
			$("#salePersonId").val(data.roomData.roomListing.salePerson.id);
		}
		if(data.roomData.roomListing.rentPerson){
			$("#rentPersonId").val(data.roomData.roomListing.rentPerson.id);
		}
	}
	//业主信息
	$("#owners").html("");
	if(data.ownerList){
		$.each(data.ownerList,function(index,item){
			var ownerTemp = addPerson();
			ownerTemp.find("input[name='cid']").val(item.id);
			ownerTemp.find("input[name='cname']").val(item.name);
			ownerTemp.find("input[name='cphoneNumber']").val(item.phoneNumber);
			ownerTemp.find("input[name='clandlineNumber']").val(item.landlineNumber);
			ownerTemp.find("input[name='cidNumber']").val(item.idNumber);
			ownerTemp.find("input[name='crelation']").val(item.relation);
			ownerTemp.find("input[name='caddress']").val(item.address);
		});
	}else{
		addPerson();
	}
}