function initWeatherAuto(obj){
	$( "#"+obj ).autocomplete({
		minLength: 1,
		source:function( request, response ) {
			var searchval = request.term.replace(/'/g, "");
			$.ajax({
				url:getPath()+"/weather/getCityByKey",
				dataType: "json",
				data: {
					featureClass: "P",
					style: "full",
					maxRows: 12,
					term: searchval
				},
				type:"POST",
				success: function( data ) {
					 
					response( $.map( data.items, function( item ) {
						return {						
							name:item.name,
							label: item.name,
							value: item.id	
					}}));
				
			}});
		},
		focus: function( event, ui ) { 
			return false;
		},
		select: function( event, ui ) {
			return false;
		}
	});
}

function getWeatherinfo(){
	$.post(getPath()+"/weather/listData",{citynum:citynum},function(res){
		if(res.STATE=='SUCCESS'){
			data = res.info;
			var curdesc =tempFacade(data.temp1)+"<br />"+data.weather1+"<br/>"+data.wind1;
			var tomdesc =tempFacade(data.temp2)+"<br />"+data.weather2+"<br/>"+data.wind2;
			var trddesc =tempFacade(data.temp3)+"<br />"+data.weather3+"<br/>"+data.wind3;
			$("#curday").find("span[key='info']").html(curdesc);
			$("#tomday").find("span[key='info']").html(tomdesc);
			$("#thirdday").find("span[key='info']").html(trddesc);
			$("#bigdiv").find("span[key='weatherspan']").html(data.weather1);
			var bclass = $("#bigicon").find("b").attr("class");
			$("#bigicon").find("b").removeClass(bclass).addClass("big-weatherico-"+weatherFacade(data.weather1));
			var iclass = $("#curday").find("i[key='iconi']").attr("class");
			$("#curday").find("i[key='iconi']").removeClass(iclass).addClass("medium-weatherico-"+weatherFacade(data.weather1));
			iclass = $("#tomday").find("i[key='iconi']").attr("class");
			$("#tomday").find("i[key='iconi']").removeClass(iclass).addClass("medium-weatherico-"+weatherFacade(data.weather2));
			iclass = $("#thirdday").find("i[key='iconi']").attr("class");
			$("#thirdday").find("i[key='iconi']").removeClass(iclass).addClass("medium-weatherico-"+weatherFacade(data.weather3));
			if(top.getTopWeather)
				top.getTopWeather({weather:weatherFacade(data.weather1)});
			
		}else{
			art.dialog.tips(res.msg);
		}
		
	},'json');
	
	$.post(getPath()+"/weather/nowInfo",{citynum:citynum},function(res){
		if(res.STATE=='SUCCESS'){
			data = res.info;
			$("#bigdiv").find("span[key='curtmp']").html(data.curTemp+"℃");
			$("#bigdiv").find("span[key='cityspan']").html(data.cityname);
			$("#bigdiv").find("span[key='windspan']").html(data.curWind);
			if(top.getTopWeather)
				top.getTopWeather({temp:(data.curTemp+"℃")});
		}else{
			art.dialog.tips(res.msg);
		}
	},'json');
}

function tempFacade(temp){
	var tary = temp.split('~');
	if(tary.length==2) return tary[1]+"/"+tary[0];
	return temp;
}

function weatherFacade(w){
	if(w=='晴') return "qing";
	else if(w=='多云') return "duoy";
	else if(w=='阴') return "ying";
	else if(w=='阵雨') return "zheny";
	else if(w=='雷阵雨') return "leizy";
	else if(w=='小雨') return "xiaoy";
	else if(w=='中雨') return "zhongy";
	else if(w=='大雨') return "day";
	else if(w=='暴雨') return "baoy";
	else if(w=='小雪') return "xiaox";
	else if(w=='中雪') return "zhongx";
	else if(w=='大雪') return "dax";
	else if(w=='雾') return "wu";
	else if(w=='晴转多云') return "duoy";
	else if(w=='多云转晴') return "duoy";
	else if(w=='阴转多云') return "duoy";
	else if(w=='晴转阴') return "duoy";
	else if(w=='阴转晴') return "qing";
	else if(w.indexOf('霾')>-1) return "yangs";
	else if(w.indexOf('雪')>-1) return "xiaox";
	else if(w.indexOf('多云')>-1) return "duoy";
	else if(w.indexOf('雨')>-1) return "zhongy";
}

function changeCity(){
	$(".weather-select").show();
	$(".weather-wd").hide();
}

function getcitylist(){
	
	//top.showWeather();
	var pid = $("#provincesel").val();
	$.post(getPath()+"/weather/getChildCity",{parentId:pid},function(res){
		if(res.STATE=='SUCCESS'){
			data = res.info;
		
		var html = "";
		for(var i=0;i<data.length;i++){
			html +="<option value='"+data[i].FID+"'>"+data[i].FNAME+"</option>";
		}
		$("#citysel").html(html);
		}else{
			art.dialog.tips(res.msg);
		}
	},'json');
}

function initcitylist(){
	var pid = MenuManager.menus["proviceLi"].getValue();
	
	$.post(getPath()+"/weather/getChildCity",{parentId:pid},function(res){
		if(res.STATE=='SUCCESS'){
			data = res.info;
			
			var pvary = [];
			for(var i=0;i<data.length;i++){
				var obj = {};
				obj.id = data[i].FID;
				obj.name = data[i].FNAME;
				pvary[i] = obj;
			}
			
			var para = {};
			para.data = pvary;
			MenuManager.menus["cityLi"].loaddata(para);
		}else{
			art.dialog.tips(res.msg);
		}
	},'json');
}

function selcity(){
	//top.showWeather();
}

function setCity(){
	var cityval = MenuManager.menus["cityLi"].getValue();
	if(!cityval){art.dialog.tips("请选择城市");return;}
	$.post(getPath()+"/weather/saveCity",{cityId:cityval},function(res){
		if(res.STATE == "SUCCESS"){
			
			art.dialog.tips('操作成功');
			window.location.reload();
			
		}else{
			art.dialog.tips(res.MSG);
		}
	},'json');
}

function back(){
	$(".weather-select").hide();
	$(".weather-wd").show();
}
