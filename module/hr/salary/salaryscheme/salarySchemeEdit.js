$(document).ready(function(){
	bindEvent();
});
function openFormula(id){
	var formula = encodeURI($("td[id='"+id+"']").attr("formula")!=''?$("td[id='"+id+"']").attr("formula").replace(/[+]/g,'~'):$("td[id='"+id+"']").attr("formula"));
	var dlg = art.dialog.open(base+"/hr/salaryScheme/formulaPicker?id="+id+"&formula="+formula+"&arr="+encodeURI(getSelectedItemValue()),
			{title:"设置公式",
			 lock:true,
			 width:750||'auto',
			 height:422||'auto',
			 id:"设置公式-ADD",
			 button:[{name:'确定',callback:function(){
					var formula = $(dlg.iframe.contentWindow.document).find("textarea[id='formula']").val();
					$("#"+id).html(formula);
					$("#"+id).attr("formula",formula);
					return true;
				}},{name:'取消',callback:function(){
					return true;
				}}],
			 close:function(){
				 return true;
			 }
			});
}


function openSalaryItem(){
	var dlg = art.dialog.open(getPath()+"/hr/salaryScheme/pickerItem",
			{title:"添加薪酬项目",
			 lock:true,
			 width:500||'auto',
			 height:300||'auto',
			 id:"添加薪酬项目-ADD",
			 button:[{name:'确定',callback:function(){
				 var rowDatas = dlg.iframe.contentWindow.$list_dataGrid.getSelectedRows();
				 if(rowDatas.length>0){
					 var dataHtml = "";
					 for(var i = 0;i<rowDatas.length;i++){
						 var row = rowDatas[i];
						 if(!$("#"+row.id).get(0)){
							 dataHtml+='<tr class="queue">'+
						        '<td>'+row.name+'</td>'+
						        '<td formula="" id="'+row.id+'"></td>'+
						        '<td>'+
						        	'<a class="moveup" href="javascript:void(0);"><img src="'+base+'/default/style/images/broker/lplist03.png"/> 上移</a>&nbsp;&nbsp;'+
	            					'<a class="movedown"  href="javascript:void(0);"><img src="'+base+'/default/style/images/broker/lplist04.png"/> 下移</a>&nbsp;&nbsp;'+
	            					'<a class="moveTop" href="javascript:void(0);"><img src="'+base+'/default/style/images/broker/lplist03.png"/> 置顶</a>&nbsp;&nbsp;'+
						        	(row.itemType.value=='FORMULA'?'<a class="delete_font" href="javascript:void(0)" onclick="openFormula(\''+row.id+'\',null)">设置公式</a>':'')+
						        '</td>'+
						      '</tr>';
						 }
					 }
					$("#itemTb").append(dataHtml);
					bindEvent();
					return true;
				 }else{
					 dlg.iframe.contentWindow.returnVal();
					 return false;
				 }
				 
				}},{name:'取消',callback:function(){
					return true;
				}}],
			 close:function(){
			 }
			});
}


function getSelectedItemValue(){
	var result = "[";
	$("#itemTb>tr").each(function(){
		result += "{'itemId':'" + $(this).find("td").eq(1).attr("id")+ "','formula':'" + $(this).find("td").eq(1).attr("formula") + "','name':'"+$(this).find("td").eq(0).html()+"'},";
	});
	if(result.length > 1){
		result = result.substring(0,result.length-1);
	}
	result += "]";
	return result;
}

function beforesave(dlg){
	$("#itemJson").val(getSelectedItemValue());
	return false;
}


function bindEvent(){
	$('.moveup').bind('click', function (e) {
        var obj = $(e.target).closest('tr');
        c_pre($(obj[0]));
    });

    $('.movedown').bind('click', function (e) {
        var obj = $(e.target).closest('tr');
        c_next($(obj[0]));
    });
    
    $('.moveTop').bind('click', function (e) {
        var obj = $(e.target).closest('tr');
        c_top($(obj[0]));
    });

}


function c_top(o){
	 var pres = o.prevAll('tr.queue');
	    if (pres.length > 0) {
	    	var tmp = o.clone(true);
	        var oo = pres[pres.length-1];
	        o.remove();
	        $(oo).before(tmp);
	    }
}

function c_pre(o) {
    var pres = o.prevAll('tr.queue');
    if (pres.length > 0) {
        var tmp = o.clone(true);
        var oo = pres[0];
        o.remove();
        $(oo).before(tmp);
    }
}

function c_next(o) {
    var nexts = o.nextAll('tr.queue');
    if (nexts.length > 0) {
        var tmp = o.clone(true);
        var oo = nexts[0];
        o.remove();
        $(oo).after(tmp);
    }
}


function getObject(){
	var val = $("input[name='objectType']:checked").val();
	var schemeId = $("#dataId").val();
	if(val!="COMPANY"){
		$("#partObject").show();
		if(val=="ORG"){
			$("#org").attr("dataPickerUrl",base+"/basedata/org/orgDataPicker?multi=true");
		}else if(val=="JOB"){
			$("#org").attr("dataPickerUrl",base+"/hr/salaryScheme/jobDataPicker?multi=true&schemeId="+schemeId);
		}
	}else{
		$("#partObject").hide();
	}
}
