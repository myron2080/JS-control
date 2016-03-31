/* *
 * 配置方式
 * 
 *<label id="对应DataPicker的ID" dataPickerUrl="DataPicker页面的URL" width="打开DataPicker窗口的宽度" height="打开DataPicker页面的高度" title="打开的DataPicker窗口标题" >
 *	<input dataPicker="value" name="assessPeriod.id" id="assessPeriod.id" type="hidden" readOnly="readOnly" />
 *	<input dataPicker="name" name="assessPeriod.name" id="assessPeriod.name" type="text" readOnly="readOnly" ondblclick="openDataPicker('对应DataPicker的ID')"/>
 *	<strong onclick="clearDataPicker('对应DataPicker的ID')"></strong>
 *	<span class="p_hov" onclick="openDataPicker('对应DataPicker的ID')"></span>
 *</label>
 *
 * */
/**
 * modified by taking.wang 2014-12-15 加了自定义的菜单
 * 需要f7效果的输入框的id
 * options 参数，map buttons表示自定义的按钮数组，buttonName：按钮的名称,callbackFun:点击按钮回调的函数
 * {
 * 	buttons:[
 * 				{
 * 				buttonName:xxx,
 * 				callbackFun:xxxx
 * 				}
 * 			]
 * }
 */
function openDataPicker(id,options){
	var dataPicker = getDataPickerInstance(id,options);
	
	//f7选择的时候,条件不满足不弹出F7
	var flag=true;
	if(dataPicker.beforeOpenF7){
		flag = window[dataPicker.beforeOpenF7].call();
	}
	if(dataPicker && !dataPicker.disabled && flag){
		dataPicker.show();
	}
}
function clearDataPicker(id){
	var dataPicker = getDataPickerInstance(id);
	if(dataPicker && !dataPicker.disabled){
		dataPicker.clear();
	}
}
function getDataPickerInstance(id,options){
	var dataPicker = new DataPicker(id,options);
	return dataPicker;
}
var currentDataPicker;
function returnDataPickerValue(value){
	if(currentDataPicker && currentDataPicker != null){
		currentDataPicker.setValue(value);
	}
}
function DataPicker(id,options){
	return this.create(id,options);
}
DataPicker.prototype.create = function(id,options){
	this.dataPickerid = id;
	this.options = options;
	this.doc = $('#'+id);
	this.url = this.doc.attr('dataPickerUrl');
	this.title = this.doc.attr('title');
	this.width = this.doc.attr('width');
	this.height = this.doc.attr('height');
	this.isMultiple = this.doc.attr('isMultiple');
	this.disabled = this.doc.attr('disabled')=='disabled'?true:false;
	this.setDisabled(this.disabled);
	this.onValueChange = this.doc.attr('onchange');
	this.addParam = this.doc.attr('addParam');
	this.beforeOpenF7 = this.doc.attr('beforeOpenF7');
	this.oldValue = null;
	this.value = null;
	this.nameField = this.doc.attr('nameField') || 'name';
	this.valueField = this.doc.attr('valueField') || 'id';
	this.tree = eval('('+this.doc.attr("tree") + ')');
	this.list = eval('(' + this.doc.attr("list") + ')');
	var id = this.doc.find('input[dataPicker="value"]').val();
	var name =this.doc.find('input[dataPicker="name"]').val();
	this.returnFunName="returnDataPickerValue";
	if(id != null && id != ''){
		this.oldValue = {};
		this.oldValue[this.valueField] = id;
		this.oldValue[this.nameField] = name;
		this.value = this.oldValue;
	}
	return this;
}
DataPicker.prototype.show = function(){
	art.dialog.data('returnFunName','returnDataPickerValue');
	currentDataPicker = this;
	art.dialog.data('currentDataPicker',currentDataPicker);
	//设置按钮
	var buttonArry = [];
	if(this.options && this.options.buttons.length >0){
		for(var i=0; i<this.options.buttons.length;i++){
			var tmpBtnMap = {};
			tmpBtnMap.name = this.options.buttons[i].buttonName;
			var tmpCallBackFun = this.options.buttons[i].callbackFun;
			var tmpDoc = this.doc;
			tmpBtnMap.callback = function(){
				if(tmpCallBackFun)
					eval('window["'+tmpCallBackFun+'"]').call(null,tmpDoc);	//回调函数  	必须要用eval否则调用不到
			};
			buttonArry.push(tmpBtnMap);
		}
	}
	buttonArry.push({name:'确定',callback:sureValue});
	buttonArry.push({name:'取消'});
	var dlg = art.dialog.open(this.url,
			{id:this.dataPickerid,
			 title: this.title,
			 width:this.width,
			 height:this.height,
			 lock: true,
			 button:buttonArry
			 }
	);
	function sureValue(){
		if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.okSelect){
			dlg.iframe.contentWindow.okSelect();
		}
		return false;
	}
}
DataPicker.prototype.setValue = function(value){
	var newValue = value;
	if(value && value != null){
		if(value && value.length){//如果是数组
			//传过来的是数组
			if(this.isMultiple){
				//当前为多选DataPicker
				var vs = "";
				var ns = "";
				for(var i = 0; i < value.length; i++){
					vs = (vs==""?value[i][this.valueField]:vs+";"+value[i][this.valueField]);
					ns = (ns==""?value[i][this.nameField]:ns+";"+value[i][this.nameField])
				}
				this.doc.find('input[dataPicker="value"]').val(vs);
				this.doc.find('input[dataPicker="name"]').val(ns);
			}else{
				this.doc.find('input[dataPicker="value"]').val(value[0][this.valueField]);
				this.doc.find('input[dataPicker="name"]').val(value[0][this.nameField]);
				newValue = value[0];
			}
		}else{
			//传来的是非数组，或者数组长度为0
			this.doc.find('input[dataPicker="value"]').val(value[this.valueField]);
			this.doc.find('input[dataPicker="name"]').val(value[this.nameField]);
			if(this.isMultiple){
				newValue = new Array();
				newValue.push(value);
			}
		}
	}else{
		this.doc.find('input[dataPicker="value"]').val("");
		this.doc.find('input[dataPicker="name"]').val("");
	}
	this.oldValue = this.value;
	this.value = newValue;
	$(this.doc).attr('value',value);
	if(this.value==null){
		$(this.doc).find('strong').css("display",'none');
	}else{
		$(this.doc).find('strong').css("display",'block');
	}
	if(this.onValueChange && this.onValueChange != '' && this.onValueChange != null){
		window[this.onValueChange].call(null,this.oldValue,newValue,this.doc);
	}
}

DataPicker.prototype.getValue = function(){
	return $(this.doc).attr('value');
}
DataPicker.prototype.clear = function(){
	this.setValue({});
}
DataPicker.prototype.setDisabled = function(disabled){
	if(true == disabled){
		this.doc.find('input[dataPicker]').attr('disabled','disabled');
	}else{
		this.doc.find('input[dataPicker]').removeAttr('disabled');
	}
	this.disabled = disabled;
}

$(document).ready(function(){
	$('div[dataPickerUrl]').each(function(){
		var v = $(this).find('input[dataPicker="value"]');
		if(v && (v.val()==null || v.val()=='')){
			$(this).find('strong').css('display','none');
		}else{
			$(this).find('strong').css('display','block');
		}
	});
});
