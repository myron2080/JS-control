var $edit_viewstate = 'VIEW';//编辑页面状态:VIEW,EDIT,ADD
var $edit_defaultGridParam = {//默认表格设置,分录使用
	width: '99%', 
    height: '99%',
    pageParmName:'currentPage',
    pagesizeParmName:'pageSize',
    root:'items',
    record:'recordCount',
    checkbox: false,
    rownumbers:false,
    enabledSort:false,
    usePager:false,
    enabledEdit: true,
    onBeforeShowData:function(data){
    	//用于支持多级取值方式绑定如name:'data.aa.dd.bcc'的方式
    	function updateColumnData(column){
    		var name = column.columnname;
    		if(name && name.indexOf('.')>0){
    			var names = name.split('.');
    			var fieldName = getDataFieldName(data);
    			if(data[fieldName]){
	       			 for(var i = 0; i < data[fieldName].length; i++){
	       				 var tmp = data[fieldName][i];
	       				 for(var j = 0;j < names.length; j++){
	       					 if(tmp[names[j]]){
	       						 tmp = tmp[names[j]];
	       					 }else{
	       						 tmp = null;
	       						 break;
	       					 }
	       				 }
	       				data[fieldName][i][name] = tmp;
	       			 }
    			}
    		}
    		if(column.columns && column.columns.length > 0){
    			for(var i = 0; i < column.columns.length;i++){
    				updateColumnData(column.columns[i]);
    			}
    		}
    	}
    	if(this.columns){
    		for(var i = 0; i < this.columns.length;i++){
    			updateColumnData(this.columns[i]);
    		}
    	}
    	return true;
    }
};

//查看状态下，所有的输入框全部置为disabled
$(document).ready(function(){
	initPageState();
	if($edit_viewstate!='VIEW'){
		initForm();
	}
});

function initPageState(){
	var loc = self.location+"";
	var queryString = loc.replace(/^[^\?]+\??/,'');
	var params = parseQuery( queryString );
	$edit_viewstate = params['VIEWSTATE'];
	if($edit_viewstate=='VIEW'){
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
}

function parseQuery ( query ) {
   var Params = {};
   if ( ! query ) {return Params;}// return empty object
   var Pairs = query.split(/[;&]/);
   for ( var i = 0; i < Pairs.length; i++ ) {
      var KeyVal = Pairs[i].split('=');
      if ( ! KeyVal || KeyVal.length != 2 ) {continue;}
      var key = unescape( KeyVal[0] );
      var val = unescape( KeyVal[1] );
      val = val.replace(/\+/g, ' ');
      Params[key] = val;
   }
   return Params;
}

function initForm(){
	$.metadata.setType("attr", "validate");
	var v = $("form").validate({
        //调试状态，不会提交数据的
        debug: true,
        onkeyup:false,
        errorPlacement: function (lable, element)
        {

            if (element.is("textarea"))
            {
                element.addClass("l-textarea-invalid");
            }
            else if (element.is("input"))
            {
                element.parent().addClass("l-text-invalid");
            }
            $(element).attr("title", lable.html());
            $(element).poshytip();
            
            
        },
        success: function (lable)
        {
            var element = $("#" + lable.attr("for"));
            if (element.hasClass("l-textarea"))
            {
                element.removeClass("l-textarea-invalid");
            }
            else if (element.hasClass("l-text-field"))
            {
                element.parent().removeClass("l-text-invalid");
            }
            //$(element).removeAttr("title").ligerHideTip();
            $(element).poshytip("destroy");
            $(element).removeAttr("title");
        },
        submitHandler: function ()
        {
        	submitForm();
        }
    });
	$("form:not(.noLiger)").ligerForm();
}
var currentDialog;
//保存新增数据
function saveAdd(dlg){
	currentDialog = dlg;
	saveEdit(dlg);
	return false;
}
//保存编辑数据
function saveEdit(dlg){
	//增加前置函数,用于保存时逻辑检测和赋值
	if(typeof(beforesave) == "function"){
		beforesave(dlg);
	}
	currentDialog = dlg;
	$('form').submit();
	return false;
}
function submitForm(){
	 var bottuns;
   if(currentDialog){
	   bottuns=currentDialog.config.button;
	   $(bottuns).each(function(){
		  var name=this.name; 
		  currentDialog.button({name:name,disabled:true});
	   });
	}
	$.ajax({
		url:$('form').attr('action'),
		dataType: "json",
		type:"POST",
		data: $('form').serialize(),
		success: function(res) {
			if(res.STATE == "SUCCESS"){
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
				if(currentDialog){
					$(bottuns).each(function(){
					  var name=this.name; 
					  currentDialog.button({name:name,disabled:false});
				    });
					if(currentDialog.iframe.contentWindow && currentDialog.iframe.contentWindow.saveFail){
						currentDialog.iframe.contentWindow.saveFail(res);
					}
				}
				art.dialog.alert(res.MSG);
			}
		},
		error:function(){
			if(currentDialog){
				$(bottuns).each(function(){
				  var name=this.name; 
				  currentDialog.button({name:name,disabled:false});
			    });
			}
		}
	});
	
}

$.extend($.ligerDefaults.Form,{
	editorBulider:function (jinput){
	    var inputOptions = eval('(' + jinput.attr('options') + ')')||{};
	    if (jinput.is("select")){
	        //jinput.ligerComboBox(inputOptions);
	    }else if (jinput.is(":text") || jinput.is(":password")){
	        var ltype = jinput.attr("ltype");
	        switch (ltype){
	            case "select":
	            case "combobox":
	                jinput.ligerComboBox(inputOptions);
	                break;
	            case "orgbox":
	            	jinput.ligerOrgBox(inputOptions);
	            	break;
	            case "spinner":
	                jinput.ligerSpinner(inputOptions);
	                break;
	            case "date":
	                jinput.ligerDateEditor(inputOptions);
	                break;
	            case "float":
	            case "number":
	                inputOptions.number = true;
	                jinput.ligerTextBox(inputOptions);
	                break;
	            case "int":
	            case "digits":
	                inputOptions.digits = true;
	            case "none":
	                break;    
	            default:
	                jinput.ligerTextBox(inputOptions);
	                break;
	        }
	    }else if (jinput.is(":radio")){
	        //jinput.ligerRadio(inputOptions);
	    }else if (jinput.is(":checkbox")){
	        //jinput.ligerCheckBox(inputOptions);
	    }else if (jinput.is("textarea")){
	        jinput.addClass("l-textarea");
	    }
	}
});
