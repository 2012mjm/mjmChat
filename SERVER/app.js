var io = require('socket.io').listen(3000);

var mjmChatUsernames = [];

io.sockets.on('connection', function(client)
{
	client.on('mjmChatAddUser', function(user, room)
	{
		// Guest
		if(user == null)
			user = mjmChatCreateGuestName();

		// Convert special characters to HTML entities
		user = htmlEntities(user);
		room = htmlEntities(room);
		
		client.username = user;
		client.room = room;
		mjmChatUsernames.push(user);
		client.join(room);
		
		client.emit('mjmChatStatusUser', 'you have joined to '+ room +' room');
		
		client.broadcast.to(room).emit('mjmChatStatusUser', user +' has joined to this room');
		client.emit('mjmChatRooms', room);

		io.sockets.to(room).emit('mjmChatUsers', mjmChatGetUsersRoom(room));
	});
	
	client.on('mjmChatEnterRoom', function(newRoom)
	{
		// Convert special characters to HTML entities
		newRoom = htmlEntities(newRoom);
		
		var oldRoom = client.room;
		
		client.leave(client.room);
		client.join(newRoom);
		client.emit('mjmChatStatusUser', 'you have joined to '+ newRoom +' room');
		client.broadcast.to(client.room).emit('mjmChatStatusUser', client.username +' has left this room');
		client.room = newRoom;
		client.broadcast.to(newRoom).emit('mjmChatStatusUser', client.username +' has joined this room');
		client.emit('mjmChatRooms', newRoom);
		
		io.sockets.to(oldRoom).emit('mjmChatUsers', mjmChatGetUsersRoom(oldRoom));
		io.sockets.to(newRoom).emit('mjmChatUsers', mjmChatGetUsersRoom(newRoom));
	});

    client.on('mjmChatMessage', function(data)
	{
		// Convert special characters to HTML entities
		data = nl2br(htmlEntities(data));
		
		io.sockets.to(client.room).emit('mjmChatMessage', client.username, data);
    });
	
	client.on('disconnect', function()
	{
		var oldRoom = client.room;
		mjmChatUsernames.splice(mjmChatUsernames.indexOf(client.username), 1);
		client.broadcast.emit('mjmChatStatusUser', client.username + ' has left this room');
		client.leave(client.room);
		
		io.sockets.to(oldRoom).emit('mjmChatUsers', mjmChatGetUsersRoom(oldRoom));
	});
});

function mjmChatCreateGuestName()
{
	var i = 0;
	do {
		i++;
		var checkExist = mjmChatUsernames.indexOf('Guest'+i.toString());
	}
	while(checkExist != -1);
	
	return 'Guest'+i.toString();
}

function mjmChatChangeUserIfExist(user)
{
	var i = 1;
	do {
		i++;
		var checkExist = mjmChatUsernames.indexOf(user+i.toString());
	}
	while(checkExist != -1);
	
	return 'Guest'+i.toString();
}

function mjmChatGetUsersRoom(room)
{
	var users = [];
	io.sockets.clients(room).forEach(function(user) {
			users.push(user.username);
	});
	return users;
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// phpjs.org/functions/nl2br
function nl2br(str, is_xhtml)
{
	var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'; // Adjust comment to avoid issue on phpjs.org display
	return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}
