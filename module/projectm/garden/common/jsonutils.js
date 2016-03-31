function getJsonStr($arr){
	var unitJsonStr='[';
	$arr.each(function(){
		unitJsonStr+='{';
		$(this).find('input,select').each(function(){
			var val=$(this).val();
			var type=$(this).attr('type');
			if(type=='checkbox'){
				var checStr=$(this).attr('checked');
				var bootype=$(this).attr('bootype');
				if(checStr){
					if(bootype=='number'){
						unitJsonStr+=$(this).attr('name')+':1,';
					}else{
						unitJsonStr+=$(this).attr('name')+':true,';
					}
				}
			}else{
				if(val){
					unitJsonStr+=$(this).attr('name')+':"'+val+'",';
				}
				
			}
		});
		if(unitJsonStr!='[{'){
			unitJsonStr=unitJsonStr.substring(0,unitJsonStr.length-1);
		}
		unitJsonStr+='},';
	});
	if(unitJsonStr!='['){
		unitJsonStr=unitJsonStr.substring(0,unitJsonStr.length-1);
	}
	unitJsonStr+=']'
	return unitJsonStr;
}