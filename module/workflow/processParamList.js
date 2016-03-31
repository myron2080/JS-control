$(document).ready(function(){
	var columns=[];
	if(processSort=='WORKFLOW'){
		 columns=[ 
		            {display: '名称', name: 'NAME_', align: 'left', width: 150,height:40},
		            {display: '类型', name: 'TYPE_', align: 'left', width: 70,height:40},
		            {display: '值', name: 'TYPE_', align: 'left', width: 250,height:40,render:vlueRender} 
		        ];
	}else{
		columns=[ 
		            {display: '名称', name: 'name', align: 'left', width: 150,height:40},
		            {display: '类型', name: 'type', align: 'left', width: 70,height:40},
		            {display: '值', name: 'value', align: 'left', width: 250,height:40},
		            {display: '说明', name: 'description', align: 'left', width: 200,height:40}   
		        ];
	}
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		 columns: columns,
         delayLoad:false,
         url:getPath()+'/workflow/processView/queryProcessParam?processId='+processId+"&processSort="+processSort
   }));
});
 
function vlueRender(data){
	if(data.DOUBLE_){
		return data.DOUBLE_;
	}else if(data.LONG_){
		return data.LONG_;
	}else if(data.TEXT_){
		return data.TEXT_;
	}else if(data.TEXT2_){
		return data.TEXT2_;
	}
}