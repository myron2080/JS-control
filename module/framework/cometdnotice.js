
    var cometd = $.cometd;

    $(document).ready(function()
    {
        function _connectionEstablished()
        {
            $('#cometdiv').append('<div>CometD Connection Established</div>');
        }

        function _connectionBroken()
        {
            $('#cometdiv').append('<div>CometD Connection Broken</div>');
        }

        function _connectionClosed()
        {
            $('#cometdiv').append('<div>CometD Connection Closed</div>');
        }

        // Function that manages the connection status with the Bayeux server
        var _connected = false;
        function _metaConnect(message)
        {
            if (cometd.isDisconnected())
            {
                _connected = false;
                _connectionClosed();
                return;
            }

            var wasConnected = _connected;
            _connected = message.successful === true;
            if (!wasConnected && _connected)
            {
                _connectionEstablished();
            }
            else if (wasConnected && !_connected)
            {
                _connectionBroken();
            }
        }

        // Function invoked when first contacting the server and
        // when the server has lost the state of this client
        function _metaHandshake(handshake)
        {
            if (handshake.successful === true)
            {
            	 cometd.subscribe('/hello', function(message)
                         {
                         	
            		 		//实际编码当中，这里就是你接收到的消息，然后动态修改HTML,让数据动态显示在前台页面。
            		 var ds = message.data.ds;
            		 if(ds == currentDataSource){
            		 $("#sysMessage").html(message.data.content);      		 		
            		 $("#systemMessage").show();
            		 }
                         });
                         // Publish on a service channel since the message is for the server only
            	/* cometd.subscribe('/eventinfo/'+currentId, function(message)
                         {
            		 $("#systemMessage").show();
                         });*/
            	 // cometd.publish('/service/hello', { name: 'World' });
            	
            }
        }

        // Disconnect when the page unloads
        $(window).unload(function()
        {
            cometd.disconnect(true);
        });

        var cometURL = base + "/cometd";
        cometd.configure({
            url: cometURL,
            logLevel: 'debug'
        });

        cometd.addListener('/meta/handshake', _metaHandshake);
        cometd.addListener('/meta/connect', _metaConnect);

        cometd.handshake();
    });
    
    function sendmsg(){
    	var h = $("#comettextarea").val();
    	$.post(getPath()+"/publishInfo",{content: h,ds:currentDataSource},function(res){
    		if(res.STATE == "SUCCESS"){
    			$("#cometip").html(res.MSG);
    		}else{
    			$("#cometip").html("操作失败");
    		}
    	},'json');
    }
    
    function publishNotice(){
    	$("#comettextarea").val('');
    	$("#cometdiv").show();
    }
    
    function closecometdiv(){
    	$("#cometdiv").hide();
    }

