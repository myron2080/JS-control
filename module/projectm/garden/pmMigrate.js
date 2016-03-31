$(document).ready(function(){
	$("#index").val("1");
	$( "#garden" ).autocomplete({
		minLength: 1,
		source:function( request, response ) {
			var searchval = request.term.replace(/'/g, "");
			$.ajax({
				url:getPath()+"/projectm/pmGarden/getGardensByKey?cityId="+cityId,
				dataType: "json",
				data: {
					featureClass: "P",
					style: "full",
					maxRows: 12,
					term: searchval
				},
				type:"POST",
				success: function( data ) {
					var propertyTypeNames = eval(data.propertyTypeName);  
					response( $.map( data.items, function( item ) {
						var propertyTypes = item.propertyTypes.split("#");
						 
						var pdata = new Array();
						$.each(propertyTypes,function(index,temp){
							$.each(propertyTypeNames,function(nameIndex,nameTemp){
								 if(temp == nameTemp.id){
									 pdata.push(nameTemp);
								 }
							}) 
						});
						return {
							propertyTypeList:pdata, 
							name:item.name,
							label: item.name + (item.registerName ? ", " + item.registerName : "") + " (" + (item.geographyArea ? item.geographyArea.name : "")+")",
							value: item.id,		
							propertyTypes:item.propertyTypes,
							noCustom:item.noCustom							}
					}));
				} 
			});
		},
		focus: function( event, ui ) { 
			return false;
		},
		select: function( event, ui ) {
			getGardenInfo(ui.item);
			return false;
		}
	});
});
function getGardenInfo(obj){
	
	
	$.post(base+'/projectm/pmBuilding/getBuil',{gardenId:obj.value,cityId:cityId},function(date){
		var buildingList = date.buildingList;
		var str = "";
		for (var i = 0; i < buildingList.length; i++){
			str +="<option value='"+buildingList[i].id+"'>"+buildingList[i].name+"</option>";
		}
		$("#builId").append(str);
		$( "#garden" ).val( obj.name ); 
		$( "#gardenId" ).val( obj.value );
	},'json');
}

function clickRadio1(obj){
	$("#index").val("1");
	$("#unit1").hide();
	$("#unit2").hide();
}

function clickRadio2(obj){
	$("#index").val("2");
	$("#unit1").show();
	$("#unit2").show();
}