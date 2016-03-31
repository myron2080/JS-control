/**
 * 
 */

            //得到焦点触发事件
function OnfocusFun(element,elementvalue)
{
    if(element.value==elementvalue)
    {
        element.value="";
        element.style.color="#000";
    }
}
 
//离开输入框触发事件
function OnBlurFun(element,elementvalue)
{
    if(element.value==""||element.value.replace(/\s/g,"")=="")
    {
        element.value=elementvalue;
        element.style.color="#999";
    }
}

function limitLength(obj, length){
	if(obj.value.length > length){
		art.dialog.tips("内容不应超出" + length + "个字符");
		obj.value = obj.value.substr(0,length);
	}
}

var checkBoxSelect = {
	init:function(params,htmlStr){
		 var dataPanel = $("#dataPanel");
		 if(dataPanel.length>0){
			 dataPanel.show();
			 return;
		 }
		var targetInput=$("#"+params.targetId);
		if(!htmlStr){
			return false;
		}else{ 
			dataPanel= $("<div id='dataPanel' style='position:relative;'>"+htmlStr+"</div>");
			dataPanel.find(".popmenu").css("width","150px")
			dataPanel.find(".popmenu").css("height","100px")
			dataPanel.find(".popmenu").css("top","20px")
			dataPanel.prependTo(targetInput.parent());
			dataPanel.show();
			dataPanel.find(".item").click(function(event){
			if(params.resultType=="checkBox"){
				if($(this).find(".miniCheckbox").hasClass("checked")){
					$(this).find(".miniCheckbox").removeClass("checked");
					if(targetInput.val()){
						var selectedValue = targetInput.val();
						if(selectedValue == $(this).find("label").html()){
							selectedValue = "";
						} 
						selectedValue = selectedValue.replace(","+$(this).find("label").html()+",",",");
						if(selectedValue.indexOf($(this).find("label").html()+",")==0){
							selectedValue = selectedValue.replace($(this).find("label").html()+",","");
						}
						if(selectedValue.lastIndexOf(","+$(this).find("label").html())!=-1&&selectedValue.lastIndexOf(","+$(this).find("label").html())==(selectedValue.length-(","+$(this).find("label").html()).length)){
							selectedValue = selectedValue.substring(0,(selectedValue.length-(","+$(this).find("label").html()).length));
						}
					} 
					targetInput.val(selectedValue);
				}else{
					$(this).find(".miniCheckbox").addClass("checked");
					if(!selectedValue||(targetInput.val().indexOf(","+$(this).find("label").html()+",")==-1&&
							selectedValue.lastIndexOf(","+$(this).find("label").html())!=(selectedValue.length-(","+$(this).find("label").html()).length)&&
								targetInput.val().indexOf($(this).find("label").html()+",")!=0)){
						if(targetInput.val()){
							targetInput.val(targetInput.val()+","); 
						}
						targetInput.val(targetInput.val()+$(this).find("label").html());
					} 
				}
			}else{
				targetInput.val($(this).find("label").html());
			}
			event.stopPropagation();
			});
		}
		$(document).click(function() {
			dataPanel.hide(); 
		});
	},
	clearMenu:function(){
		$("#dataPanel").remove();
	}
}