/**
 * 批量设置房间
 */
jQuery(document).ready(function() {
	
	$('[APARTMENT],[LIVINGBUILDING],[SHOP],[VILLA],[BUILDING],[GROUND],[FACTORY],[OTHER]').hide();
	$('#propertyType').change(function(){
		$('[APARTMENT],[LIVINGBUILDING],[SHOP],[VILLA],[BUILDING],[GROUND],[FACTORY],[OTHER]').hide();
		var val=$(this).val();
		$('['+val+']').show();
	});
	
	if(roomids){
		art.dialog.data("roomIds","");
		openPostWindow(getPath()+"/projectm/pmRoom/roomBatchSetView?cityId="+cityId);
	}
	//art.dialog.data("roomSave",saveRoom);
	//生成按钮绑定事件
	$("#result").bind("click",function(){
		$(this).closest('#conditionDiv').find('input:visible,select:visible').each(function(){
			var name=$(this).attr('name');
			var tagName =this.tagName;
			var val=$(this).val();
			if(tagName=='INPUT'){
				var chckStr=$(this).attr('checked');
				var type=$(this).attr('type');
				$('#batchSet [name='+name+']').each(function(){
					$(this).val(val);
					$(this).next('span').html(val);
					if(type=='checkbox' ){
						if(chckStr){
							$(this).attr('checked','checked');
						}else{
							$(this).removeAttr('checked');
						}
					}
				});
			}else if(tagName=='SELECT'){
				var str=$(this).find('option:selected').html();
				$('[name='+name+']').each(function(){
					if(val){
						if(val=='clean'){
							$(this).val('');
							$(this).closest('td').find('span').html('');
						}else{
							$(this).val(val);
							$(this).closest('td').find('span').html(str);
						}
					}
					
				});
			}
			
		});
	});
	
	//阻止td里的input，select冒泡
	$("#batchSet select").click(function(event){
		event.stopPropagation(); 
	});
	$("#batchSet input").click(function(event){
		event.stopPropagation(); 
	});
	
	$("#batchSet td span").show();
	$("#batchSet td input[type!=checkbox],#batchSet td select").hide();
	//给td绑定事件
	$("#batchSet td").bind("click",function(){
		$("#batchSet td span").show();
		$("#batchSet td input[type!=checkbox],#batchSet td select").hide();
		$(this).find('span').hide();
		$(this).find('input[type!=checkbox],select').show();
		if($(this).hasClass("proE")){
			var metd = $(this);
			$(this).find('input[type!=checkbox]').unbind('change').change(function(){
				metd.find('span[forinput="'+$(this).attr("name")+'"]').html($(this).val());
			});
		}else{
			
			$(this).find('input[type!=checkbox]').unbind('change').change(function(){
				$(this).closest('td').find('span').html($(this).val());
			});
			$(this).find('select').unbind('change').change(function(){
				$(this).closest('td').find('span').html($(this).find(':selected').html());
			});
		}
	});
	
	/*//给属性绑定值
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
	});*/
});

function saveData(dlg){
	var flag=true;
	/*$('[name=roomNumber]:visible').each(function(){
		var oName=$(this).val();
		var oId=$(this).attr('id');
		if(!oName){
			art.dialog.tips('楼层名不能为空');
			validetError(this,'楼层名不能为空');
			flag=false;
			return;
		}
		var _this=this;
		$('[name=name][id!='+oId+']:visible').each(function(){
			var iName=$(this).val();
			if(oName==iName){
				art.dialog.tips('楼层名不能重复');
				validetError(this,'楼层名不能重复');
				validetError(_this,'楼层名不能重复');
				flag=false;
				return;
			}
		});
	}); */
	var jsonStr=getJsonStr($('#batchSet tr:gt(0)'));
	$('#jsonStr').val(jsonStr);
	if(flag)saveAdd(dlg);
}

/*function typeSelect(pro){
	
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
}*/
/*function typeSelect1(pro){
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
	
}*/

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