/**
 * 批量设置房间
 */
jQuery(document).ready(function() {
	if(roomids){
		art.dialog.data("roomIds","");
		openPostWindow(getPath()+"/broker/room/roomBatchSetView");
	}
	art.dialog.data("roomSave",saveRoom);
	//生成按钮绑定事件
	$("#result").bind("click",function(){
	
		//当点击时获取选择条件
		//用途
		var property =  $("#property").val();
		if(property!=''){
			 if(property=='clean'){
				 $(".property").val("");
				 $(".property").siblings("span").text("");
			}else{
			 $(".property").val(property);
			 $(".property").siblings("span").text($("#property option:selected").text());
			}
		}
		//房屋结构
		var roomStructural =  $("#roomStructural").val();
		if(roomStructural!=''){
			 if(roomStructural=='clean'){
				 $(".roomStructural").val("");
				 $(".roomStructural").siblings("span").text("");
			}else{
			 $(".roomStructural").val(roomStructural);
			 $(".roomStructural").siblings("span").text($("#roomStructural option:selected").text());
			}
		
		}
		//装修标准
		var decoration =  $("#decoration").val();
		if(decoration!=''){
			if(decoration=='clean'){
				 $(".decoration").val("");
				 $(".decoration").siblings("span").text("");
			}else{
			 $(".decoration").val(decoration);
			 $(".decoration").siblings("span").text($("#decoration option:selected").text());
			}
		}
		//朝向
		var direction =  $("#direction").val();
		if(direction!=''){
			if(direction=='clean'){
				 $(".direction").val("");
				 $(".direction").siblings("span").text("");
			}else{
				 $(".direction").val(direction);
				 $(".direction").siblings("span").text($("#direction option:selected").text());
			}
		}
		//平面图
		var imageV =  $("#imageV").val();
		if(imageV!=''){
			 $(".imageV").val(imageV)
		}
		//层高
		var floorHigh =  $("#floorHigh").val();
		if(floorHigh!=''){
			 $(".floorHigh").val(floorHigh);
			 $(".floorHigh").siblings("span").text(floorHigh)
		}
		//建筑面积
		var buildArea =  $("#buildArea").val();
		if(buildArea!=''){
			 $(".buildArea").val(buildArea);
			 $(".buildArea").siblings("span").text(buildArea)
		}
		//套内面积
		var roomArea =  $("#roomArea").val();
		if(roomArea!=''){
			 $(".roomArea").val(roomArea);
			 $(".roomArea").siblings("span").text(roomArea);
		}
		
		//替换1
		var replace1 =  $("#replace1").val();
		//替换2
		var replace2 =  $("#replace2").val();
		
			$(".roomNumber").each(function(){
				var val = $(this).val();
				 $(this).val(val.replace(replace1,replace2));
				 $(this).siblings("span").text(val.replace(replace1,replace2));
			});
			$("#replace1").val("");
			$("#replace2").val("");
		//前缀
		var beforStr =  $("#beforStr").val();
		if(beforStr!=''){
			$(".roomNumber").each(function(){
				var val = $(this).val();
				 $(this).val(beforStr+val);
				 $(this).siblings("span").text(beforStr+val);
				 $("#beforStr").val("");
			});
		}
		//室 
		var bedRoom =  $("#bedRoom").val();
		if(bedRoom!=''){
			 $(".bedRoom").val(bedRoom);
			 $(".bedRoom").siblings("span").find(".sel1").text(bedRoom);
		}
		// 厅 
		var livingRoom =  $("#livingRoom").val();
		if(livingRoom!=''){
			 $(".livingRoom").val(livingRoom);
			 $(".livingRoom").siblings("span").find(".sel2").text(livingRoom);
		}
		//厨
		var kitchen =  $("#kitchen").val();
		if(kitchen!=''){
			 $(".kitchen").val(kitchen);
			 $(".kitchen").siblings("span").find(".sel3").text(kitchen);
		}
		//卫 
		var bathRoom =  $("#bathRoom").val();
		if(bathRoom!=''){
			 $(".bathRoom").val(bathRoom);
			 $(".bathRoom").siblings("span").find(".sel4").text(bathRoom);
		}
		//阳
		var balcony =  $("#balcony").val();
		if(balcony!=''){
			 $(".balcony").val(balcony);
			 $(".balcony").siblings("span").find(".sel5").text(balcony);
		}
		var factoryType = $("#factoryType").css("display");
		var shopType = $("#shopType").css("display");
		if(shopType=="block"){
			$(".roomType").css("display","none");
			$(".factoryType").css("display","none");
			$(".shopType").css("display","block");
			$(".shp").val($("#shp").val());
			$(".shp").siblings("span").text($("#shp option:selected").text());
		}else if(factoryType=="block"){
			$(".roomType").css("display","none");
			$(".shopType").css("display","none");
			$(".factoryType").css("display","block");
			$(".fac").val($("#fac").val());
			$(".fac").siblings("span").text($("#fac option:selected").text());
		}else{
			if(property!=''){
				$(".shopType").css("display","none");
				$(".factoryType").css("display","none");
				$(".roomType").css("display","block");
			}
		}
		
		art.dialog.tips("生成成功！",null,"succeed");
		
	});
	//阻止td里的input，select冒泡
	$("#batchSet select").click(function(event){
		event.stopPropagation(); 
	});
	$("#batchSet input").click(function(event){
		event.stopPropagation(); 
	});
	//给td绑定事件
	$("#batchSet td").bind("click",function(){
		//找到已经打开的元素
		var selectE = $(".selectE");
		//如果打开的元素是类型
		if(selectE.hasClass("proE")){
			//找到显示状态的div
			var roomType = selectE.find(".roomType").css("display");
			var factoryType = selectE.find(".factoryType").css("display");
			var shopType = selectE.find(".shopType").css("display");
			if(shopType=="block"){
				//如果是商铺/得到值赋值给span
				//赋值给span
				var newval = selectE.find(".shopType span").siblings().val();
				if(selectE.find(".shopType span").siblings().hasClass("selc")){
					newval = selectE.find(".shopType span").siblings().find("option:selected").text();
				}
				selectE.find(".shopType span").text(newval);
				//设置元素隐藏显示
				selectE.find(".shopType span").css("display","block");
				selectE.find(".shopType span").siblings().css("display","none");
				selectE.removeClass("selectE");
			}else if(factoryType=="block"){
				var newval = selectE.find(".factoryType span").siblings().val();
				if(selectE.find(".factoryType span").siblings().hasClass("selc")){
					newval = selectE.find(".factoryType span").siblings().find("option:selected").text();
				}
				selectE.find(".factoryType span").text(newval);
				//设置元素隐藏显示
				selectE.find(".factoryType span").css("display","block");
				selectE.find(".factoryType span").siblings().css("display","none");
				selectE.removeClass("selectE");
			}else{
				selectE.find(".sel1").text(selectE.find(".bedRoom").val());
				selectE.find(".sel2").text(selectE.find(".livingRoom").val());
				selectE.find(".sel3").text(selectE.find(".kitchen").val());
				selectE.find(".sel4").text(selectE.find(".bathRoom").val());
				selectE.find(".sel5").text(selectE.find(".balcony").val());
				//设置元素隐藏显示
				selectE.find(".roomType input").css("display","none");
				selectE.find(".sel1").css("display","inline");
				selectE.find(".sel2").css("display","inline");
				selectE.find(".sel3").css("display","inline");
				selectE.find(".sel4").css("display","inline");
				selectE.find(".sel5").css("display","inline");
				selectE.removeClass("selectE");
			}
			
		}else{
			//赋值给span
			var newval = selectE.find("span").siblings().val();
			if(selectE.find("span").siblings().hasClass("selc")){
				newval = selectE.find("span").siblings().find("option:selected").text();
			}
			selectE.find("span").text(newval);
			//设置元素隐藏显示
			selectE.find("span").css("display","block");
			selectE.find("span").siblings().css("display","none");
			selectE.removeClass("selectE");
		}
		//移除选中
		
		if($(this).hasClass("proE")){
			var roomType = $(this).find(".roomType").css("display");
			var factoryType =  $(this).find(".factoryType").css("display");
			var shopType =  $(this).find(".shopType").css("display");
			if(shopType=="block"){
				$(this).find(".shopType span").css("display","none");
				$(this).find(".shopType span").siblings().css("display","block");
				$(this).addClass("selectE");
			}else if(factoryType=="block"){
				$(this).find(".factoryType span").css("display","none");
				$(this).find(".factoryType span").siblings().css("display","block");
				$(this).addClass("selectE");
			}else{
				$(this).find(".roomType input").css("display","inline");
				$(this).find(".sel1").css("display","none");
				$(this).find(".sel2").css("display","none");
				$(this).find(".sel3").css("display","none");
				$(this).find(".sel4").css("display","none");
				$(this).find(".sel5").css("display","none");
				$(this).addClass("selectE");
			}
		}else{
			$(this).find("span").css("display","none");
			$(this).find("span").siblings().css("display","block");
			$(this).addClass("selectE");
		}
	});
	
	//给属性绑定值
	$("#property").bind("change",function(){
		var select = $(this).val();
		typeSelect(select);
	});
	$(".property").bind("change",function(){
		var select = $(this).val();
		var tr= $(this).closest('tr');
		tr.find(".shopType").css("display","none");
		tr.find(".factoryType").css("display","none");
		tr.find(".roomType").css("display","none");
		if(select=="SHOP"){
			tr.find(".shopType").css("display","block");
		}else if(select=="FACTORY"){
			tr.find(".factoryType").css("display","block");
		}else{
			tr.find(".roomType").css("display","block");
		}
	});
});
function saveRoom(){	
	var ishasNull=0;
	var roomNumbers="";
	$(".roomNumber").each(function(){
		var number = $(this).val();
		if(number==''){
			ishasNull=1;
			return false;
		}
		roomNumbers+=number+",";
	});
	if(ishasNull == 1){
		art.dialog.tips("房间号不能为空！");
		return;
	}
	var roomIds="";
	$(".roomid").each(function(){
		var roomid = $(this).val();
		roomIds+=roomid+",";
	});
/*	$.post(ctx+"/room/getRoomByRoomNumbers",{buildid:buildid,roomNumbers:roomNumbers,roomIds:roomIds},function(data){
		if(data.ret==1){
			art.dialog.alert("重复的房间名:"+data.reNames+"请修改后保存！");
		}else{*/
			$("#loading").show();
			$("#batchSet").ajaxSubmit(function(message) {
				if("undefined" != typeof message.msg){
					art.dialog({
						content: message.msg,
						time:1,
						close:function(){
							art.dialog.close();
						},
						width:200
					});
					setTimeout(function(){
						art.dialog.close();
					},100);
				}else{
					art.dialog.tips("批量设置成功！",null,"succeed");
					art.dialog.data("batchSetValidate")(message);
					setTimeout(function(){
						art.dialog.close();
					},100);
				}
				$("#loading").hide();
				return false;
			});
		//}
	//});
	
}
function typeSelect(pro){
	
		$("#shopType").css("display","none");
		$("#factoryType").css("display","none");
		$("#roomType").css("display","none");
		if(pro=="SHOP"){
			$("#roomSt").text("商铺类型");
			$("#shopType").css("display","block");
		}else if(pro=="FACTORY"){
			$("#roomSt").text("工厂类型");
			$("#factoryType").css("display","block");
		}else{
			$("#roomSt").text("户型");
			$("#roomType").css("display","block");
		}
}
function typeSelect1(pro){
	$.post(ctx+"/room/getParentEnum",{pro:pro},function(data){
		$("#shopType").css("display","none");
		$("#factoryType").css("display","none");
		$("#roomType").css("display","none");
		if(data.parent=="SHOP"){
			$(".shopType").css("display","block");
		}else if(data.parent=="FACTORY"){
			$(".roomSt").text("工厂类型");
			$(".factoryType").css("display","block");
		}else{
			$(".roomSt").text("户型");
			$(".roomType").css("display","block");
		}
	});
	
}

function openPostWindow(url)  
{  
   var tempForm = document.createElement("form");  
    tempForm.id="tempForm1";  
    tempForm.method="post";  
    tempForm.action=url;  
    tempForm.target=name;  
    
    var hideInput = document.createElement("input");  
    hideInput.type="hidden";  
    hideInput.name= "roomIds"
   hideInput.value= roomids;
     tempForm.appendChild(hideInput);  
     
     var hideInput1 = document.createElement("input");  
     hideInput1.type="hidden";  
     hideInput1.name= "buildingId"
    hideInput1.value= buildingId;
      tempForm.appendChild(hideInput1);   
      
      var hideInput2 = document.createElement("input");  
      hideInput2.type="hidden";  
      hideInput2.name= "gardenId"
     hideInput2.value= gardenId;
       tempForm.appendChild(hideInput2);   
       
     document.body.appendChild(tempForm);  
   // tempForm.fireEvent("onsubmit");
    tempForm.submit();
    document.body.removeChild(tempForm);
}