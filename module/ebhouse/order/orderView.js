$(function(){
	queryOrderFollow(1);
	
	
});


var param = {};
function queryOrderFollow(page){
	param.pageSize = 10 ;
	param.currentPage = page||1 ;
	param.orderId = $("#id").val();
	$.post(ctx+"/ebhouse/order/allOrderFollow",param,function(res){
		var data = res.items;
		$("#dataFollow").html('');
		if(data.length == 0){
			$("#dataFollow").html('<a href="javascript:void(0)">&nbsp;&nbsp;&nbsp;暂无跟进信息～～</a>');
		}
		for(var i = 0;i<data.length;i++){
			$('<div class="quan-tab">' + data[i].content + '<span style="float: right;">' + data[i].createDate + '</span></div>').appendTo("#dataFollow");
		}
		var total = Math.floor(res.count%res.pageSize==0?res.count/res.pageSize:res.count/res.pageSize+1);
		if(total>1){
			//$("#pagelist").html(initpagelist(page,total,res.pageSize));
		}
	},'json');
}



//表单提交
function saveOrderFollow(){
	var content = $("#content").val();
	if(!isNotNull(content)){
		art.dialog.tips("请输入跟进内容！");
		return;
	}else{
		$.post(base + "/ebhouse/order/saveOrderFollow",{orderId: $("#id").val(),content:$("#content").val()},function(data){
			if(data.STATE == 'SUCCESS'){
				var date = new Date();
				var len = $("#dataFollow").find(".quan-tab").length;
				if(len == 0){
					 $("#dataFollow").html("");
				}
				$('<div class="quan-tab">' + content + '<span style="float: right;">' + formate_yyyyMMdd(date) + '</span></div>').appendTo("#dataFollow");
				art.dialog.tips(data.MSG,null,"succeed");
				$("#content").val('');
			} else {
				art.dialog.alert(data.MSG);
			}
		},"json");
	}
}

function toUpdateRecieve(fundDetailId){
	art.dialog.data("flg","");
	var dlg = art.dialog.open(base+"/ebhouse/fundDetail/toOrderRecieveEdit?id=" + fundDetailId,
			{title:"收款修改",
			 lock:true,
			 width:"900px"||'auto',
			 height:'345px',
			 button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
						dlg.iframe.contentWindow.saveEdit(this);
					}
					return false;
				}},{name:'取消',callback:function(){
					flag = false;
					return true;
				}}],
			 close:function(){
				 if(art.dialog.data("flg") == "RELOAD"){
					 location.reload();
				 }
			 }
		});
	
}
function toTurnDeposit(id,depositStatus){
	var title = "确认将该款项转为定金？";
	if(depositStatus == 'TODEPOSIT'){
		title = "确认取消转定金操作？";
	}
	art.dialog({
	    content: title,
	    ok: function () {
	    	var _this=this;
	    	$.post(base+'/ebhouse/fundDetail/turnDepositStatus',{id:id,depositStatus:depositStatus,orderId: $("#id").val()},function(data){
	    		 var state=data.STATE;
	    		 var tipStr='';
	    		 if(state=='SUCCESS'){
	    			 tipStr='保存成功';
	    			 location.reload();
	    		 }else{
	    			 tipStr='保存失败';
	    		 }
	    		 _this.title(tipStr).time(1);
	    	},'json');
	    },
	    cancelVal: '关闭',
	    cancel: true
	});
}




