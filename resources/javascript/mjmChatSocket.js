$(function(){
	// get user
	var mjmChatUser = mjmChatConfig.user;
	var mjmChatConnect = false;
	
	// connect to socket
	var mjmChatHostPort = mjmChatConfig.host+':'+mjmChatConfig.port;
	var socket = io.connect(mjmChatHostPort);
	
  
	socket.on('connect', function()
	{
		socket.on('mjmChatMessage', function(username, data)
		{
			/* view message */
			$("#mjmChatMessages").append('<li><strong>' + username + ':</strong> ' + data + '</li>');
			mjmChatScrollDown();
		});

		socket.on('mjmChatStatusUser', function (data)
		{
			// show connect & disconnect User
			$("#mjmChatMessages").append('<li class=\'mjmChatEvent\'>' + data + '</li>');
			mjmChatScrollDown();
		});
		
		socket.on('mjmChatUsers', function(users) {
			$('#mjmChatUsersList').empty();
			$.each(users, function(key, value)
			{
				var my = '';
				if(value == mjmChatUser) my = ' class=\'mjmChatMyUser\' ';
				$("#mjmChatUsersList").append('<li'+my+'>' + value + '</li>');
			});
		});
	});
	
	$("#mjmChatRooms li").click(function()
	{	
		if(mjmChatConnect)
			socket.emit('mjmChatEnterRoom', $(this).attr('title'));
		else
			socket.emit('mjmChatAddUser', mjmChatUser, $(this).attr('title'));
		
		$('#mjmChatMessages').empty();
		mjmChatConnect = true;
	});
	
	// sent message to socket
	$("#mjmChatSend").click(function() {
		if($('#mjmChatMessage').val() != '')
		{
			socket.emit('mjmChatMessage', $('#mjmChatMessage').val());
			$('#mjmChatMessage').val('');
		}
		$('#mjmChatMessage').focus();
	});
	
	$('#mjmChatMessage').keypress(function(e) {
		if(e.which == 13) {
			$('#mjmChatSend').focus().click();
			e.preventDefault();
		}
	});
	
	function mjmChatScrollDown()
	{
		var height = $('#mjmChatMessages')[0].scrollHeight;
		$('#mjmChatMessages').scrollTop(height);
	}
});