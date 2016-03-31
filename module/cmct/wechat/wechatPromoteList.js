var $list_editUrl=getPath()+"/cmct/wechatPromote/edit";
var $list_addUrl=getPath()+"/cmct/wechatPromote/add";
var $list_editWidth="750px";
var $list_editHeight="380px";
var $list_deleteUrl=getPath()+"/cmct/wechatPromote/delete";
var parentWechatId="";
$(document).ready(function(){
	$("#searchBtn").bind("click",function(){
		searchData();
	});
	
	params ={};
	params.width = 260;
	params.inputTitle = "创建日期";
	MenuManager.common.create("DateRangeMenu","createDate",params);
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '标题', name: 'title', align: 'center', width: 220},
            {display: '发布人', name: 'updator.name', align: 'left', width: 70},
            {display: '发布时间', name: 'lastUpdateTime', align: 'center', width: 150},
            {display: '状态', name: '', align: 'center', width: 80,render:getStatus},
            {display: '操作', name: '', align: 'center', width: 180,render:renderOprate},
            {display: '阅读量', name: 'readAmount', align: 'left', width: 80},
            {display: '注册量', name: 'registAmount', align: 'center', width: 80},
            {display: '报表', name: 'state', align: 'center', width: 100,render:viewData}
        ],
        parms:{sortType:"sort1"},
        url:getPath()+'/cmct/wechatPromote/listData',
    }));
	
	EnlargerImg.init();
	addPhotoButton("uploadImage","wechatPhotonames","image");
	addPhotoButton("uploadImage2","wechatPhotonames2","image");
	
	$(".system_tab li").click(function(){
		delete $list_dataParam['sortType'];
		$(this).addClass("hover").siblings("li").removeClass("hover");
		var key = $(this).attr("key");
		$list_dataParam['sortType']=key;
		searchData();
	});
});

function viewYXL(){
	if(typeof(window.top.addTabItem)=='function'){
		parentWechatId="";
		window.top.addTabItem('viewYXL',getPath()+'/cmct/wechatPromote/viewDetail','影响力排名');
	}
}

function viewQR(){
	if(typeof(window.top.addTabItem)=='function'){
		parentWechatId="";
		window.top.addTabItem('viewQR',getPath()+'/cmct/qr/list','二维码推广');
	}
}

function viewRecruit(){
	if(typeof(window.top.addTabItem)=='function'){
		parentWechatId="";
		window.top.addTabItem('viewRecruit',getPath()+'/cmct/ri/list','招募推广');
	}
}

function getStatus(data){
	if(data.isPublish=='Y'){
		return "已发布";
	}
	return "已保存";
}
function opender1(data){
	if(data.namount==0){
		return "";
	}
	return data.namount;
}

function opender2(data){
	if(data.verifyAmount==0){
		return "";
	}
	return data.verifyAmount;
}

function onEmpty(){
	$("#isPublish").val("");
	MenuManager.menus["createDate"].resetAll();
	$("#key").val($("#key").attr("dValue"));
}
function renderEnum(record, rowindex, value, column){
	return map[value];
}

function viewData(data){
	return "<a href=\"javascript:viewDetail({id:'"+data.id+"',title:'"+data.title+"'});\">查看详情</a>";
}

function renderOprate(data){
	var str="";
	if(data.isPublish != 'Y'){
		str += '<a href=javascript:editRow({id:\''+data.id+'\'});>修改&nbsp;</a>'; 
		str += '<a href=javascript:deleteRow({id:\''+data.id+'\'});>删除&nbsp;</a>';
	}
	str += '<a href=javascript:publish(\''+data.id+'\');>发布&nbsp;</a>';
	str += '<a href=javascript:ylPublish(\''+data.id+'\');>预览</a>';
	return str;
}

function publish(id){
	art.dialog.confirm('确定发布所有人?',function(){
		sendWxMessage(id,"","publish","");		
	});
}

function ylPublish(id){
	art.dialog({
		content:$("#ylPublish")[0],
		title:'预览',
		id:'ylPublish',
		button:[{name:'确定',callback:function(){
			var personId=$('#personId').val();
			if(!personId){
				art.dialog.tips("预览人不能为空");
				return false;
			}
			sendWxMessage(id,personId,"ylpublish",this);
			return false;
		}},{name:'取消',callback:function(){
			return true;
		}}]
	});
}

function sendWxMessage(dataId,personId,type,currentDialog){
	Loading.init(null, '正在发布中......');		
	var bottuns;
    if(currentDialog){
	   bottuns=currentDialog.config.button;
	   $(bottuns).each(function(){
		  var name=this.name; 
		  currentDialog.button({name:name,disabled:true});
	   });
	}
	$.post(getPath()+"/cmct/wechatPromote/sendWxMessage",{dataId:dataId,personId:personId,type:type},function(res){
		if(res.STATE=="SUCCESS"){
			art.dialog.alert("发送成功",function(){
				window.location.reload(); 
			});
		}else{
			if(currentDialog){
				$(bottuns).each(function(){
				  var name=this.name; 
				  currentDialog.button({name:name,disabled:false});
			    });
			}
			art.dialog.alert(res.MSG);
		}
		Loading.close();
	},'json');
}

function viewDetail(data){
	if(data.id){		
		parentWechatId=data.id;
	}else{
		parentWechatId="";
	}
	var dlg = art.dialog.open(getPath()+"/cmct/wechatPromote/viewDetail",{
		id : 'viewDetail',
		title:'查看详情-'+data.title,
		width : 463,
		height : 600,
		lock:true,
		cancelVal: '关闭',
	    cancel: true,
	});
}


$(document).keydown(function(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		$("#searchBtn").click();
     }
}); 

function searchData(){
	var sD = "";
	var eD = "";
	if(MenuManager.menus["createDate"]){//天
		sD = MenuManager.menus["createDate"].getValue().timeStartValue;
		eD = MenuManager.menus["createDate"].getValue().timeEndValue;
	}
	$list_dataParam['isPublish']=$("isPublish").val();
	$list_dataParam['startDate']=sD;
	$list_dataParam['endDate']=eD;
	$list_dataParam['sortType']=$('.hover').attr("key");
	var key = $("#key").val();
	if(key!="" && key!=null && key!=$("#key").attr("dValue")){
		$list_dataParam['key'] = key;
	}else{
		delete $list_dataParam['key'];
	}
	resetList();
}
 
 
function setWechat(){
	
	art.dialog({
		content:$("#setWechatDiv")[0],
		title:'微信设置',
		id:'ylPublish',
		button:[{name:'确定',callback:function(){
			saveWechatConfig();
			return false;
		}},{name:'取消',callback:function(){
			return true;
		}}]
	});
}

function saveWechatConfig(){
	var flag=false;
	$("#setWechatDiv input").each(function(i,obj){
		if($(this).val()){
			flag=true;
		}
	});
	if(!flag){
		art.dialog.tips("数据不能同时为空");
		return false;
	}
	
	$.post(getPath()+"/cmct/wechatPromote/saveWechatConfig",$('#dataForm2').serialize(),function(res){
		if(res.STATE=='SUCCESS'){
			art.dialog.alert("设置成功",function(){
				window.location.reload(); 
			});
		}else{
			art.dialog.alert(res.MSG);
		}
	},'json');
}

function delphoto(id,type,parentdiv){
	if(parentdiv=="wechatPhotonames"){
 	   $("#gzPic").val('');
    }else{
 	   $("#dbPic").val('');
    }
	$("#"+id+"div").remove();
	var url = "/basedata/photo/delete";
	$.post(getPath()+url,{id:id},function(json){
		json = eval("("+json+")");
		if(json.STATE=='FAIL'){
    		alert(json.MSG);
    		return;
    	}else{
    		  art.dialog({
           	   content:json.MSG,
           	   time:1,
           	   close:function(){
           	   return true;
           	   },
           	   width:200
           	   });
    	}
	});
	
}

addPhotoButton=function(id,parentdiv,type){
	var url = "/basedata/photo/upload?direct=wechat";
	new AjaxUpload($("#"+id), {
    	action: getPath()+url,
        autoSubmit: true,
        name: "image",
        responseType: "json",
        onSubmit: function(file, extension){
        	//图片上传时做类型判断
        	if(type=='image'){
        	if (extension && /^(jpg|png|jpeg|gif)$/.test(extension)) {
            }
            else {
                alert("只允许上传jpg|png|jpeg|gif图片");
                return false;
            }
        	
        	var length = $("#"+parentdiv).find("div").length;
        	if(length>=1){
        		alert("最多只允许上传1张照片");
        		return false;
        	}
        	}
        },
        onComplete: function(file, json){  
        	if(json.STATE=='FAIL'){
        		alert(json.MSG);
        		return;
        	}else{
            // 在输入框显示url，并触发url文本框的onchange事件，以便预览图片
           var url=json.path;
           var id = json.id;
           var name = json.fileName;
           var pdiv = $("<div style='float:left;margin-left:10px;' id='"+json.id+"div' imgid='"+json.id+"'><span>"+name+"</span><a href='javascript:void(0)' onclick=delphoto('"+json.id+"','"+type+"','"+parentdiv+"')>删除</a></div>");
           $("#"+parentdiv).append(pdiv);
           
           if(parentdiv=="wechatPhotonames"){
        	   $("#gzPic").val(url);
        	   $('[editImg1]').remove();
           }else{
        	   $("#dbPic").val(url);
        	   $('[editImg2]').remove();
           }
           art.dialog({
        	   content:json.MSG,
        	   time:1,
        	   close:function(){
        	   return true;
        	   },
        	   width:200
        	   });
        }
        }
    });
}