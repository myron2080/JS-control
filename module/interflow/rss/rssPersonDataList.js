var curpage = 1;

getData = function(page){
	if(!page) page = 1;
	curpage = page;
	var param = {};
	param.personId = currentId;
	var dataid = $("li.cutnow").find("a").attr("dataid");
	var datatitle = $("li.cutnow").find("a").html();
	param.dataid = dataid;
	param.currentPage = page;
	param.pageSize = 5;
	$.post(getPath()+"/interflow/rsspersondata/getPage",param,function(data){
		$("#bodydiv").html('');	
		$("#bodydiv").html($(data).find("#searchlist").html());	

		$.each($("#bodydiv").find("img"),function(i,item){
			$(item).attr("src",$(this).attr("url"));
		});
		
		$(".sub-page").html('');
		$(".sub-page").html($(data).find("#pagediv").html());
		$("#rightspan").html(datatitle);
		$("#rightDataId").val(dataid);
	});
	
	getseldatalist();
}

function sellist(obj){
	$(obj).parent().parent().find('li').removeClass('cutnow');
	$(obj).parent().addClass("cutnow");
	getData();
}

function pagesearch(num){
	
	getData(num);
}


function viewurl(id,url){
	var hasY = hasScroll(window.parent.document).Y ; 
	if(hasY){
		$(window.parent.document).find('body').css({overflow:"hidden"});    //禁用滚动条
	}
	//if(top==window){
		art.dialog.open(url,{
			title:'查看内容',
			 lock:true,
			 width:'1000px',
			 height:'600px',
			 id:"viewurl",
			 close:function(){
				if(hasY){
					$(window.parent.document).find('body').css({overflow:"scroll"});    //启用滚动条
				}
			 }
		}
		);
	//}
	//if(top!=window){
	//	top.addTabItem(id,url,'查看内容','','yes');
	//}
}


function cancelbook(){
	$.post(getPath()+"/interflow/rssperson/bookData",{'dataId':$("#rightDataId").val()},function(res){
		if(res.STATE == "SUCCESS"){
			art.dialog.tips("操作成功");
			refreshbooklist();
		}else{
			art.dialog.alert(res.MSG);
		}
	},'json');
}

function pagGetBillData(page,id,count){
	if(id=="prev"){
		if(page==1){
			art.dialog.tips('已经是第一页');
			return
		}else{
			pagesearch(page-1);
		}
	}else{
		if(page==count){
			art.dialog.tips('已经是最后一页');
			return
		}else{
			pagesearch(page+1);
		}
	}
}



function getseldatalist(){
	var dataids = "";
	$.each($(".inquiry-more-leftin").find('a[dataid]'),function(i,item){
		dataids += "'"+$(item).attr("dataid")+"',";
	});
	if(dataids.length>0) dataids = dataids.substring(0,dataids.length-1);
		$.post(getPath()+"/interflow/rsspersondata/liststatus",{dataIds:dataids},function(data){
			$.each(data,function(i,item){
				$('a[dataid="'+item.DATAID+'"]').find('span').html('('+item.ITEMCOUNT+')');
			});
		},'json');
}

function openbook(){
	art.dialog.open(getPath()+'/interflow/rssperson/list',{
		title:'添加订阅',
		 lock:true,
		 width:'800px',
		 height:'500px',
		 id:"viewurl",
		 button:[{name:'关闭'}],
		 close:function(){
			 refreshbooklist();
		 }
	}
	);
}

function refreshbooklist(){	
	
	$.post(getPath()+"/interflow/rsspersondata/mybook",{},function(data){
		var h = '';
		$.each(data,function(i,item){		
			h += '<li '+(i==0?'class="cutnow"':'')+'><a dataid="'+item.data.id+'" onclick="sellist(this)" href="javascript:void(0)">'+item.data.title+'<span></span></li>';
		});
		$('#rpul').html('');
		$('#rpul').html(h);
		getData(1);
		
		
	},'json');
}