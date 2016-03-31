$(function(){
	initPersonData(1);
});

function addTask(){
	initPersonData(1);
}
/**
 * 初始化分页
 * @param page
 */
function initPersonData(page){
	
	//得到分页参数
	var gradeOrder=$("#gradeOrder").val();
	//名称/推广/负责人
	var name=$("#name").val();
	if(name=="名称/职位/工号"){
		name="";
	}
	
	$.post(getPath()+"/interflow/evaluate/listByPage",{currentPage:page,pageSize:18,order:gradeOrder,skey:name},function(data){
		$("#staff-list").html('');
		var currentPage=data.currentPage;
		var pageCount=data.pageCount;
		//遍历显示所有的
		var list=data.items;
		var srcHtml = "" ;
		var trObj = "" ;
		var tdObj = "" ;
		var flag = 0 ;
		$(".default-body div[id!='personDataPage']").remove();
		for(var i=0;i<list.length;i++){
			var p=list[i];
			if(trObj == ""){
				if(i!=0 && i%3 == 0){
					if(flag == 0){
						trObj += '<div class="staff-list nowbg">' ;
						flag = 1 ;
					}else{
						trObj += '<div class="staff-list">' ;
						flag = 0 ;
					}
				}else{
					trObj += '<div class="staff-list">' ;
				}
			}
			//处理头像
			var photo = (p.PPHOTO)?("/images/"+p.PPHOTO):"/default/style/images/home/man_head.gif";
			//处理分数
			var Integer=parseInt(changeTwoDecimal_f(p.AVGSCORE));
			var FloteStr=(changeTwoDecimal_f(p.AVGSCORE));
			var Flote=FloteStr.substring(FloteStr.length-1,FloteStr.length);
			var scoreStr="";
			if(Integer==parseInt(10)){
				scoreStr+='<em>'+Integer+'</em>'
			}else if(Integer==parseInt(0)){
				scoreStr+='<em>--</em>'
			}else{
				scoreStr+='<em>'+Integer+'</em>'+'.'+Flote;
			}
			//处理undefined
			if(!p.ONAME){
				p.ONAME="";
			}
			if(!p.PONAME){
				p.PONAME="";
			}
			tdObj = "" ;
			tdObj += '<div class="staff-listin">';
			tdObj += '<div class="staff-data">'
				+		'<div class="staff-font">'
				+			'<div class="staff-fontin">'
				+				'<a href="javascript:void(0)" onclick="personShow(\''+p.PID+'\');"><p class="mb5 font14 bold bluecolor">'+p.PNAME+'</p></a>'
				+				'<p class="mb5">'+p.ONAME+'-'+p.PONAME+'</p>'
				+				'<p class="color9 arial">'+p.EVALUATENUM+'人 '+p.EVALUATETOTAL+'次评价</p>'
				+				'<span class="staff-bigfont arial orangecolor">'+scoreStr+'</span>'
				+			'</div>'
				+		'</div>'
				+		'<div class="staff-photo"><a href="javascript:void(0)" onclick="personShow(\''+p.PID+'\');"><img src="'+getPath()+photo+'"/></div>'
				+	'</div>' ;
			tdObj += '</div>';
			trObj += tdObj ;
			if((i+1)%3 == 0 || list.length < 3){
				trObj += '</div>';
				srcHtml += trObj ;
				trObj = "" ;
			}
		}
		$(srcHtml).insertBefore("#personDataPage");
		$("#personDataPage").html(initpagelist(currentPage,pageCount));
	},'json');
}
/**
 * 用户显示
 * @param id
 */
function personShow(id){
	var dlg = art.dialog.open(getPath()+"/interflow/evaluate/view?id="+id,{
		title:'员工互评',
		 lock:true,
		 width:'900px',
		 height:'500px',
		 id:"evaluatShow"
	});
}

/**
 * 小数处理
 * @param x
 * @returns
 */
function changeTwoDecimal_f(x) {
	var f_x = parseFloat(x);
	if (isNaN(f_x)) {
		return "0.0";
	}
	f_x = Math.round(f_x * 100) / 100;
	var s_x = f_x.toString();
	var pos_decimal = s_x.indexOf('.');
	if (pos_decimal < 0) {
		pos_decimal = s_x.length;
		s_x += '.';
	}
	while (s_x.length <= pos_decimal + 1) {
		s_x += '0';
	}
	return s_x;
}