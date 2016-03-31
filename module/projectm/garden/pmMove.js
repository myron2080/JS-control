var roomids = art.dialog.data("roomIds");
var gardenObj = {};
var cityId =null;
$(document).ready(function(){
	cityId=$("#cityId").val();
	$( "#garden" ).autocomplete({
		serviceUrl:getPath()+"/projectm/pmGarden/getGardensByKey",
		type:'POST',
		dataType:'json',
		width:'300px',
		minChars:0,
		maxHeight:50,
		paramName:'term',
		labelKey:'name',
		valueKey:'id',
		clsIncomplete:true,
		transformResult:function (response, originalQuery) {
			var result = typeof response === 'string' ? $.parseJSON(response) : response;
            result.query = originalQuery;
            result.suggestions = result.items;
            return result;
		},
		formatResult:function(options,item, currentValue){
			var reEscape = new RegExp('(\\' + ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'].join('|\\') + ')', 'g'),
            pattern = '(' + currentValue.replace(reEscape, '\\$1') + ')';
			var res = 
			item.name + (item.registerName ? ", " + item.registerName : "") + " (" + (item.geographyArea ? item.geographyArea.name : "")+")";
            return res.replace(new RegExp(pattern, 'gi'), '<strong style="color:red;">$1<\/strong>');
		},
		onSelect:setGardenInfo
		});
	
	$("#roomId").val(roomids);

	var ynum=$('#ynum').text();
	var yfloor=$('#yfloor').text();
	if(ynum=='不是同一个序号'){
		$('#ynum').css('color','red');
	}
	if(yfloor=='不是同一层楼'){
		$('#yfloor').css('color','red');
	}
	$("input[name='move']").bind("change",function(){
		art.dialog.data("floorId",$("#floor").val());
		art.dialog.data("roomNumber",$("#roomNumber").val());
		art.dialog.data("type",$("input:radio[name='move']:checked").val());
		var val=$("input:radio[name='move']:checked").val();
		if(val=='mr'){
			$("#mr").show();
			$("#ml").hide();
			$("#mb").hide();
			$("#mf").hide();
		}
		if(val=='ml'){
			$("#ml").show();
			$("#mr").hide();
			$("#mb").hide();
			$("#mf").hide();
		}
		if(val=='mb'){
			$("#mb").show();
			$("#mr").hide();
			$("#ml").hide();
			$("#mf").hide();
		}
		if(val=='mf'){
			$("#mb").hide();
			$("#mr").hide();
			$("#ml").hide();
			$("#mf").show();
		}
	});
	
});



function submitMove(dlg){
	currentDialog=dlg;
	if(check()){
		
// 	$("#moveform").submit( function(data){
// 		 if(data.STATE=='FAILL'){
// 			art.dialog.alert(data.MSG);
// 		}
		
// 	} );
		var url = $('form').attr('action');
		if($("input[name='move']:checked").val()=='mf'){
			url= base+'/projectm/pmRoom/saveFreeMove';
		}
		$.ajax({
			url:url,
			dataType: "json",
			type:"POST",
			data: $('form').serialize(),
			success: function(res) {
				if(res.STATE == "SUCCESS"){
					art.dialog.data("flag",true);
					if(res.MSG){
						art.dialog({
							icon: 'succeed',
						    time: 1,
						    content: res.MSG
						});
						setTimeout(function(){art.dialog.close();},1000);				
					}else{
						art.dialog.close();
					}
				}else{
					art.dialog.alert(res.MSG);
				}
			}
		});
	}
return false;
}



function check() {
    var roomNumber = $('#roomNumber').val();
    if($("input[name='move']:checked").val()=='mr'){
	    if (roomNumber == ''||roomNumber =='0'){
	       art.dialog.alert('序号不能为空');
	        return false;
	    }
	    if($('#ynum').text()=='不是同一个序号'){
	    	   art.dialog.alert('不是同一个序号');
	    	   return false;
	    }
	   
    }
    if($("input[name='move']:checked").val()=='ml'){
	    if($('#yfloor').text()=='不是同一层楼'){
	 	   art.dialog.alert('不是同一层楼');
	 	   return false;
		 }
    }
    if($("input[name='move']:checked").val()=='mb'){
	    if($('#building').val()==''){
	 	   art.dialog.alert('楼栋不能为空');
	 	   return false;
		 }
    }
    if($("input[name='move']:checked").val()=='mf'){
	    if($('#distance').val()==''){
	 	   art.dialog.alert('移动距离不能为空');
	 	   return false;
		 }
	    if($('#distance').val()<=0){
	    	art.dialog.alert('移动距离不能为0');
	    	return false;
	    }
    }
    return true;
}


function setGardenInfo(obj){
	var htmlStr = "";
	$( "#garden" ).val( obj.name ); 
	$( "#gardenId" ).val( obj.id );
	getBuildingInfo(obj);
}

var buildOptionStr;
function getBuildingInfo(obj){
	var id = obj.id;
	
	$.post(getPath()+"/broker/building/getBuildingByGardenId",{gardenId:id,type:'UNIT',cityId:cityId},function(result){		
		var resultData = eval(result);
		var tempHtmlStr = "<option value=''></option>";
		$.each(resultData.items,function(index,item){
			tempHtmlStr+="<option value='"+item.id+"'"+(index==0?"selected":"")+">"+((item.name==item.unitName)?item.name:(item.name+item.unitName))+"</option>"
		});

		$("#building").html(tempHtmlStr);

	},'json');
}
