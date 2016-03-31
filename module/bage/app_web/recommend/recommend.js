
//定义几个全局变量
var currPage = 1;
var currPageSize = 10;
var recordCount = 0;

$(function(){
	init();
	//点击样式绑定
	if(type=='accumulate'){//累积样式
		$(".line[key='accumulate']").addClass("now");
	}else if(type=='this_week'){//周
		$(".line[key='this_week']").addClass("now");
	}else if(type=='this_month'){//月
		$(".line[key='this_month']").addClass("now");
	}else{
		$(".line[key='accumulate']").addClass("now");
	}
});


function init(){
	var para={};
	//默认加载第一页
	dataBody(para);
	if(currPage==1){
		//清空数据
		$(".recommendlist").html('');
	}
	$(window).scroll(function(){//滚动从第二页开始
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if(scrollTop + windowHeight == scrollHeight && ((currPage-1)*currPageSize < recordCount)){
            dataBody(para);
       }
	 });
}

/**
 * 加载数据的方法
 */
function dataBody(para){
	
	para.currentPage = currPage;//这里值是变的
	para.pageSize = currPageSize;
	para.pid = pid;//后台传入的pid---->root;
	para.type = type;//后台传入的类型
	var div='';
	/*
		 这里本来是要后台去数据的，我这里就不取了；其实一样的，
		这里取出来的后台的数据，同时需要取出总记录数； recordCount = res.recordCount ;
		 如果不清楚的加好友QQ6190660780；希望和大家共同提高
	 */
	/*$.post('',para,function(res){},'json');*/
	$.ajaxSetup({
		  async: false
	});
	$.post(base+'/app_web/recommend/recommendDetailDataList',para,function(res){
		//遍历Rows
		var items=res.Rows;
		var colorVal='';
		for(var i=0;i<items.length;i++){
			var currentItem=items[i];
			var currentParentUserName = currentItem.userName;
			if(currentParentUserName && currentParentUserName!=''){
				// not do something...
			}else{
				currentParentUserName = currentItem.plaintext;//解密手机号
			}
			//二级结点
			var childrenDiv='';
			var children=currentItem.children;//孩子结点，遍历
			if(children){
				for(var j=0;j<children.length;j++){
					var currentChildrenItem=children[j];
					var currentChildrenUserName = currentChildrenItem.userName;
					if(currentChildrenUserName && currentChildrenUserName!=''){
						// not do something...
					}else{
						currentChildrenUserName = currentChildrenItem.plaintext;//解密手机号
					}
					if(j>2){
						childrenDiv+='<li class="myExpand"><span>'+transform(currentChildrenItem.presentationMinute)+'</span>'+currentChildrenUserName+'</li>';
					}else{
						childrenDiv+='<li><span>'+transform(currentChildrenItem.presentationMinute)+'</span>'+currentChildrenUserName+'</li>';
					}
				}
			}
			if(i==0){
				colorVal='style="background:#ffb54c;"';
			}else if(i==1){
				colorVal='style="background:#59c6d3;"';
			}else if(i==2){
				colorVal='style="background:#8fcc52;"';
			}else{
				colorVal='';
			}
			div+='<dl>'+
					'<dt><span>'+transform(currentItem.presentationMinute)+'</span><b '+colorVal+'>'+(i+1)+'</b>'+currentParentUserName+'</dt>'+
					'<dd>'+
						'<ul>'+
							childrenDiv +
						'</ul>'+
							((children && children.length>2)?'<div class="more expand" onclick="expandFun(this);"><a href="javascript:void(0);"><span><img src="'+base+'/default/style/images/app_web/more1.png" alt=""/></span>展开全部</a></div>':'')
							+
					'</dd>'+
				'</dl>';
		}
		recordCount = res.recordCount ;
	},'json');
	$.ajaxSetup({
		  async: true
	});
	console.info(div);
	$(".recommendlist").append(div);
	//让页码向下走一个
	currPage+=1;
}
/**
 * 展开
 */
function expandFun(obj){
	//2、收缩其他的已经展开的操作
	$(".shrink").parent().find(".myExpand").hide();//收缩其他的展开的
	//改变图片
	$(".shrink").parent().append('<div class="more expand" onclick="expandFun(this);"><a href="javascript:void(0);"><span><img src="'+base+'/default/style/images/app_web/more1.png" alt=""/></span>展开全部</a></div>');
	$(".shrink").remove();//删除自己
	
	var _parent=$(obj).parent();
	$(obj).remove();//删除原有的状态
	//改变操作类型
	_parent.append('<div class="more shrink" onclick="shrinkFun(this);"><a href="javascript:void(0);"><span><img src="'+base+'/default/style/images/app_web/more2.png" alt=""/></span>点击收起</a></div>');//更新新的状态
	_parent.find(".myExpand").show();
}
/**
 * 收缩
 */
function shrinkFun(obj){
	var _parent=$(obj).parent();
	//影藏自己
	_parent.find(".myExpand").hide();
	//改变操作
	_parent.append('<div class="more expand" onclick="expandFun(this);"><a href="javascript:void(0);"><span><img src="'+base+'/default/style/images/app_web/more1.png" alt=""/></span>展开全部</a></div>');//更新新的状态
	$(obj).remove();
}

/**
 * 完成分钟转换小时分钟的格式
 * @param val	传入分钟
 */
function transform(val){
	var dd,mm;
	dd=val/60 | 0;
	mm=val%60 | 0;
	console.info(dd+' '+mm);
	return dd+"小时"+mm+"分钟";
}
