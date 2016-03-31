	function appendata(type,cur,total,dataType){
		if(type=='prev'){
			if(cur>1) pagesearch(cur-1,dataType);
		}else if(type=='next'){
			if(cur<total)pagesearch(cur+1,dataType);
		}else if(type=='now'){
			pagesearch(cur,dataType);
		}
	}
	
	//js引入
	function initpagelist(curpage,totalpage,dataType){
		var pagediv = '<div class="pagelist">';
		if(totalpage>1){
			
			if(curpage>1){
				pagediv += '<a href="javascript:void(0)" class="pagebtn"  onclick=appendata("prev",'+curpage+','+totalpage+','+dataType+')>上一页</a>';
			}
			
			pagediv +='<b class="noselect '+(curpage==1?'selected':'')+'"><a href="javascript:void(0)" onclick=appendata("now",1,'+totalpage+','+dataType+')>1</a></b>';
			
			if(curpage<5){
				var e = totalpage>6?6:(totalpage-1);
				for(var i=2;i<=(totalpage>6?6:(totalpage-1));i++){
					pagediv +='<b class="noselect '+(curpage==i?'selected':'')+'"><a href="javascript:void(0)" onclick=appendata("now",'+i+','+totalpage+','+dataType+')>'+i+'</a></b>';
					if(i==e&&(e+1)<totalpage) pagediv +='<span class="smallsize">...</span>';
				}
			}
			else{
				var b = (totalpage-curpage)>3?(curpage-2):(totalpage-5>2?totalpage-5:2);
				var e = (totalpage-curpage)>3?(curpage+2):(totalpage-1);
				for(var i=b;i<=e;i++){
					if(i==b&&b>2) pagediv +='<span class="smallsize">...</span>';
					pagediv +='<b class="noselect '+(curpage==i?'selected':'')+'"><a href="javascript:void(0)" onclick=appendata("now",'+i+','+totalpage+','+dataType+')>'+i+'</a></b>';
					if(i==e&&(e+1)<totalpage) pagediv +='<span class="smallsize">...</span>';
				}
				
			}
			
			pagediv +='<b class="noselect '+(curpage==totalpage?'selected':'')+'"><a href="javascript:void(0)" onclick=appendata("now",'+totalpage+','+totalpage+','+dataType+')>'+totalpage+'</a></b>';
			
			if(curpage<totalpage){
				pagediv += '<a href="javascript:void(0)" class="pagebtn" onclick=appendata("next",'+curpage+','+totalpage+','+dataType+')>下一页</a>';
			}
			
		}
		pagediv += '</div>';
		return pagediv;
	}
	
	
	/**
	 * @param curpage 当前页
	 * @param recordCount 总数量
	 * @param pageSize 每页数量
	 * @param exceSql 显示sql
	 * @param exceTime 加载时间
	 */
	function initPageLigerUiList(curpage,recordCount,pageSize,exceTime,exceSql){
		var totalPage = recordCount % pageSize == 0 ?(recordCount/pageSize): Math.floor(recordCount/pageSize)+1;
		totalPage = totalPage==0?1:totalPage;
		var pagediv = '<div class="Paging">';
			if(exceTime){
				pagediv +='<div style="color:#74c0f9;"><a style="color:#74c0f9;" href="javascript:void(0);" '+(exceSql?"onclick=showTestExceSql()":"")+'>'+exceTime+'</a></div>';
			}
			if(exceSql){
				pagediv+='<span id="exceSql" style="display:none;">'+exceSql+'</span>';
			}
			pagediv += '<div class="Pagingright">显示从'+((curpage-1)*pageSize+1)+'到'+(curpage*pageSize>recordCount?recordCount:curpage*pageSize)+'，总 '+recordCount+' 条。每页显示：'+pageSize+'条</div>';
			pagediv += 		'<ul class="Pagingleft">';
			pagediv += 			'<li><a href="javascript:void(0);" onclick=appendLigerUiData("first",'+curpage+','+(curpage==1?false:true)+');><img src="'+getPath()+'/default/styleBlue/images/ico/'+(curpage==1?"Pagingico-no.png":"Pagingico.png")+'" title="第一页"/></a><a href="javascript:void(0);" onclick=appendLigerUiData("prev",'+curpage+','+(curpage==1?false:true)+');><img src="'+getPath()+'/default/styleBlue/images/ico/'+(curpage==1?"Pagingico3-no.png":"Pagingico3.png")+'" title="上一页"/></a></li>';
			pagediv += 			'<li><input onkeyup=checkPage(this); type="text" curpage value='+curpage+' /> / <span totalPage>'+totalPage+'</span></li>';
			pagediv +=			'<li><a href="javascript:void(0);" onclick=appendLigerUiData("next",'+curpage+','+(curpage==totalPage?false:true)+');><img src="'+getPath()+'/default/styleBlue/images/ico/'+(curpage==totalPage?"Pagingico4-no.png":"Pagingico4.png")+'" title="下一页"/></a><a href="javascript:void(0);" onclick=appendLigerUiData("last",'+totalPage+','+(curpage==totalPage?false:true)+');><img src="'+getPath()+'/default/styleBlue/images/ico/'+(curpage==totalPage?"Pagingico2-no.png":"Pagingico2.png")+'" title="最后一页"/></a></li>';
			pagediv +=			'<li><a href="javascript:void(0);" onclick=appendLigerUiData("refresh","",true);><img src="'+getPath()+'/default/styleBlue/images/ico/Pagingico5.png" title="刷新"/></a></li>';
			pagediv +=		'</ul>';
			pagediv +=	'</div>';
		return pagediv;
	}

	function appendLigerUiData(type,cur,flag){
		if(!flag){
			return false;
		}
		if(type=='first'){
			 pagesearch(1);
		}else if(type=='prev'){
			pagesearch(cur-1);
		}else if(type=='next'){
			pagesearch(cur+1);
		}else if(type=='last'){
			pagesearch(cur);
		}else if(type=='refresh'){
			pagesearch($('[curpage]').val());
		}
	}

	function checkPage(obj){
		 var re = /^[1-9]+[0-9]*]*$/;
	     if(!re.test($(obj).val())) {  
	    	$(obj).focus();  
	        $(obj).val(1);
	        return false;
	     }
	     if($(obj).val()>parseInt($('[totalPage]').text())){
	    	 $(obj).val($('[totalPage]').text());
	    	 return false;
	     }
	}
	
		
	/**
	 * 点击查看执行的脚本语句  ,用于测试库用
	 * @param data
	 */
	function showTestExceSql(data){
		var content = '密码:<input type="password" id="mangerPass" />';
		var sqlDialog = art.dialog({
				title:"数据库脚本",
				icon:"",
			    content:'<div><textarea  cols="75" rows="30">'+$("#exceSql").html()+'</textarea></div>',
			    id: "ajaxExceSql",
			    lock:true,
			    width:500,
			    height:300,
			    button:[{name:"关闭",callback:closeSQLDialog}]
			});
			return false;
//		});
		
		function closeSQLDialog(){
			sqlDialog.close();
		}
		sqlDialog.show();
	}
		 
		    //用正则，还是别的什么方式，看你习惯了
			var src=$("script:last").attr("src");//此处已取出
			var args = "";
		    var argsary=(/type=([^#&]+).*/i.exec(src));
		    if(argsary&&argsary.length>0) args = argsary[1];
		    var cssname = "commonpag"+(args?("_"+args):"");
		    document.write('<link href="'+base+'/default/style/css/'+cssname+'.css" rel="stylesheet" type="text/css" />');
		
	