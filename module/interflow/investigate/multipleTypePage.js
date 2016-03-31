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
				pagediv += '<a href="javascript:void(0)" class="pagebtn"  onclick=appendata("prev",'+curpage+','+totalpage+',"'+dataType+'")>上一页</a>';
			}
			
			pagediv +='<b class="noselect '+(curpage==1?'selected':'')+'"><a href="javascript:void(0)" onclick=appendata("now",1,'+totalpage+',"'+dataType+'")>1</a></b>';
			
			if(curpage<5){
				var e = totalpage>6?6:(totalpage-1);
				for(var i=2;i<=(totalpage>6?6:(totalpage-1));i++){
					pagediv +='<b class="noselect '+(curpage==i?'selected':'')+'"><a href="javascript:void(0)" onclick=appendata("now",'+i+','+totalpage+',"'+dataType+'")>'+i+'</a></b>';
					if(i==e&&(e+1)<totalpage) pagediv +='<span class="smallsize">...</span>';
				}
			}
			else{
				var b = (totalpage-curpage)>3?(curpage-2):(totalpage-5>2?totalpage-5:2);
				var e = (totalpage-curpage)>3?(curpage+2):(totalpage-1);
				for(var i=b;i<=e;i++){
					if(i==b&&b>2) pagediv +='<span class="smallsize">...</span>';
					pagediv +='<b class="noselect '+(curpage==i?'selected':'')+'"><a href="javascript:void(0)" onclick=appendata("now",'+i+','+totalpage+',"'+dataType+'")>'+i+'</a></b>';
					if(i==e&&(e+1)<totalpage) pagediv +='<span class="smallsize">...</span>';
				}
				
			}
			
			pagediv +='<b class="noselect '+(curpage==totalpage?'selected':'')+'"><a href="javascript:void(0)" onclick=appendata("now",'+totalpage+','+totalpage+',"'+dataType+'")>'+totalpage+'</a></b>';
			if(curpage<totalpage){
				pagediv += '<a href="javascript:void(0)" class="pagebtn" onclick=appendata("next",'+curpage+','+totalpage+',"'+dataType+'")>下一页</a>';
			}
			
		}
		pagediv += '</div>';
		return pagediv;
	}
	
		
		 
		    //用正则，还是别的什么方式，看你习惯了
			var src=$("script:last").attr("src");//此处已取出
			var args = "";
		    var argsary=(/type=([^#&]+).*/i.exec(src));
		    if(argsary&&argsary.length>0) args = argsary[1];
		    var cssname = "commonpag"+(args?("_"+args):"");
		    document.write('<link href="'+base+'/default/style/css/'+cssname+'.css" rel="stylesheet" type="text/css" />');
		
	