$(document).ready(function(){
	getCharts();
	$("#share").bind("click",function(){
		  if (typeof window.shareUtil == 'undefined') {
			  commonTipShow("分享功能仅限于鼎尖浏览器使用！",1000);
		      return false;
		    } else {
			shareTo();}
		});
});

function shareTo(){
	var title="我的成长";
	var content;
	content="我的成长";	
    var url_=window.location.href;
	var url=url_.replace(/growthView/, "growthView4Share")+"?dataCenter="+currdataCenter+"&share=share"+"&currentUserId="+currentUserId;
	window.shareUtil.baiduShare(title,content,url,getPath()+"/default/style/images/mobile/sharexfkb.jpg");
}


function initCharts(categories,seriesData){
	$('#datachart').highcharts({
		
		   title: {
	            text: ' 成长曲线',
	            x: -20 //center
	        },
	        subtitle: {
	            text: '我的成长',
	            x: -20
	        },
        chart: {
        },
        
        tooltip: {
            backgroundColor: {
                linearGradient: [0, 0, 0, 60],
                stops: [
                    [0, '#FFFFFF'],
                    [1, '#E0E0E0']
                ]
            },
            borderWidth: 1,
            borderColor: '#AAA'
        },
        yAxis: {
            title: {
                text: '成长值'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        xAxis: {
        	categories: categories
        },
        
        series: [{
        	 name: '成长值',
        	data: seriesData 
        }]
    });
}
function getCharts(){
	$.post(getPath()+"/weixinapi/mobile/biGrowth/getChartData",{},function(data){
		if(data){
		var categories = [];
		var seriesData =[];
		for(var i = 0 ;i<data.length;i++){
			categories.push(data[i].monthName+"月");
			seriesData.push(data[i].monthValue);
		}
		initCharts(categories,seriesData);
	}},'json');
	}

