$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:300,allowLeftResize:false,allowRightResize:false});
	$("#toolBar").ligerToolBar({
		items:[
				{id:'add',text:'部署流程',click:deployee,icon:'add'}
		]
	});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend({},$list_defaultGridParam,{
        columns: [ 
            {display: '编码', name: 'key', align: 'left', width: 120},
            {display: '名称', name: 'name', align: 'left', width: 120},
            {display: '版本号', name: 'version', align: 'right', width: 50},
            {display: '流程资源', name: 'resourceName', align: 'left', width: 150,render:function(data){
            	return '<a href="javascript:void(0)" onclick="viewResource(\''+data.id+'\',\'xml\')">'+data['resourceName']+'</a>';
            }},
            {display: '流程图', name: 'diagramResourceName', align: 'left', width: 150,render:function(data){
            	return '<a href="javascript:void(0)" onclick="viewResource(\''+data.id+'\',\'image\')">'+data['diagramResourceName']+'</a>';
            }},
            {display: '备注', name: 'description', align: 'left', width: 250}
        ],
        url:getPath()+'/workflow/repository/listData'
    }));
});

function viewResource(id,type){
	if(type == 'image'){
		art.dialog.open(getPath()+"/workflow/repository/resource?id="+id+"&type="+type,{
			title:'流程资源',
			lock:true,
			width:"800px",
			height:"560px",
			id:"definitionResource",
			button:[
			        {
			        	name:'关闭'
			        }
			]
		});
	}else{
		window.open('','_self'); 
		var newWin = window.open(getPath()+"/workflow/repository/resource?id="+id+"&type="+type,'流程资源','top=0,left=0,scrollbars=no,resizable=no,toolbar=no,location=no');
		var width = '800px';
		var height = '600px';
		newWin.resizeTo(width,height);
		newWin.focus();
	}
}

function deployee(){
	var dlg = art.dialog.open(getPath() + "/workflow/repository/deploy",{
		title:'部署流程',
		lock:true,
		id:"deployProcess",
		width:'400px',
		height:'100px',
		button:[
		        {
		        	name:"确定",
		        	callback:function(){
		        		if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.deploy){
							dlg.iframe.contentWindow.deploy(this);
						}
						return false;
		        	}
		        },
		        {
		        	name:'关闭'
		        }
		],
		close:function(){
			resetList();
		}
	});
}