function addNotice(){
	art.dialog.data("result",null);
	var dlg = art.dialog.open(getPath()+"/interflow/notice/addNotice",{
			title:'发布公告',
			 lock:true,
			 width:'750px',
			 height:'425px',
			 id:"addBill",
			 close:function(){
				 return true;
				
			 },
			 button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.valiNoticeForm){
						dlg.iframe.contentWindow.valiNoticeForm(dlg);
					}
					
					return false;
				}},{name:'取消',callback:function(){
					
					return true;
				}}]
		});
}

viewNotice = function(id){
	var hasY = hasScroll(window.parent.document).Y ; 
	if(hasY){
		$(window.parent.document).find('body').css({overflow:"hidden"});    //禁用滚动条
	}
	art.dialog.open(getPath()+'/interflow/notice/selectById?id='+id,
		{title:"查看公告",
			lock:true,
			width:830,
			height:450,
			id:'NOTICE-VIEW',
			button:[{name:'关闭'}],
			close:function(){
				if(hasY){
					$(window.parent.document).find('body').css({overflow:"scroll"});    //启用滚动条
				}
			}
		}
	);
}
