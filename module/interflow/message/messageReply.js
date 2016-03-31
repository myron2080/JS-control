
$(document).ready(function(){
	initData(1);
});
/**
 * 初始化数据
 */
function initData(page){
	$.post(getPath()+"/interflow/messageReply/getData",{page:page},function(pag){
		var list = pag.items;
		$("#mail_rightboxin").html('');
		var dl="";
		for(var i = 0;i<list.length;i++){
			var obj=list[i];
			dl+="<dl><dt><img src='"+getPath()+"/default/style/images/home/woman_head.gif'/></dt><dd>";
			if(null != obj.contact){
				dl+="<p><span class='fl'><b class='font14 colorblue'>"+obj.contact.name+"</b></span>" +
				"  <b class='fr color999'>"+obj.sendContent+"</b></p>";
			}else{
				dl+="<p><span class='fl'><b class='font14 colorblue'>"+obj.mobile+"</b>&nbsp;&nbsp;<a class='colorblue' href='javascript:void(0);' onclick=addcontact('"+obj.mobile+"');>+添加至通讯录</a></span>" +
				"  <b class='fr color999'>"+obj.sendContent+"</b></p>";
			}
			dl+="<p><a href='javascript:void(0);' onclick=showDetail('"+obj.mobile+"');>"+obj.content+"</a></p></dd></dl>";
		}
		$("#mail_rightboxin").append(dl);
		var totalPage = pag.recordCount%pag.pageSize==0?(pag.recordCount/pag.pageSize):Math.floor(pag.recordCount/pag.pageSize)+1;
		$("#currentPage").html(page);
		$("#totalPage").html(totalPage);
	},'json');
}

/**
 * 挑战到 与该号码的短信详情
 * @param mobile
 */
function showDetail(mobile){
	var dlg = art.dialog.open(getPath()+"/interflow/messageReply/toDetail?mobile="+mobile,{
		id : 'detail',
		title:"短信详情",
		width : 600,
		height : 340,
		lock:true
	});
}

function addcontact(mobile){
	var flag = false;
	var dlg = art.dialog.open(getPath() +"/interflow/contact/add?mobile="+mobile,
			{
				id : "addcontact",
				title : '新增联系人',
				background : '#333',
				width : 400,
				height : 340,
				lock : true,
				button:[{name:'确定',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
							dlg.iframe.contentWindow.saveAdd(this);
						}
						flag = true;
						return false;
					}},{name:'取消',callback:function(){
						flag = false;
						return true;
					}}],
				close:function(){
					if(flag){
						initData(1);
					}
				}
			});			
}

function pageChange(type){
	var page=parseInt($("#currentPage").html(),10);
	var total=parseInt($("#totalPage").html(),10);
	if(type == 'prev'){//上一页
		if(page != 1){//第一页
			initData(page-1);
		}
	}else{//下一页
		if(page != total){//不是最后一页
			initData(page+1);
		}
	}
}