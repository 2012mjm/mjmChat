$(function()
{
	var mjmChatItemSeleted;
	
	$('#mjmChatIcon').toggle(function() {
		$(this).animate({marginLeft: "0"}, 'fast', function() {
			$("#mjmChatRooms").slideDown('fast');
		});
		$(this).attr('title', 'Close chatroom');
	},
	function() {
		$("#mjmChatRooms").slideUp('fast', function() {
			$("#mjmChatIcon").animate({marginLeft: "-124px"}, 'fast');
		});
		$(this).attr('title', 'Open chatroom');
		
		//close room
		if(mjmChatItemSeleted) {
			$("#mjmChatRoom").animate({bottom: "-410px"}, 'fast');
			mjmChatItemSeleted.removeClass('mjmChatRoomSelect');
			mjmChatItemSeleted = null;
		}
	});
	
	$("#mjmChatRooms li").click(function() {
		if($(this).attr('class') != 'mjmChatRoomSelect')
		{
			if(mjmChatItemSeleted)
			{
				// close old, opne new
				$("#mjmChatRoom").animate({bottom: "-410px"}, 'fast', function() {
					$("#mjmChatRoom").animate({bottom: "0"}, 'slow');
				});
				
				// add class new, remove class old
				mjmChatItemSeleted.removeClass('mjmChatRoomSelect');
				$(this).addClass('mjmChatRoomSelect');
			}
			else {
				// open new
				$("#mjmChatRoom").animate({bottom: "0"}, 'slow');
				
				// add class new
				$(this).addClass('mjmChatRoomSelect');
			}
			
			// set title
			$('#mjmChatRoomTitle').text($(this).text());
			
			// save item seleced
			mjmChatItemSeleted = $(this);
		}
	});
	
	// Close room
	/*$("#mjmChatRoomClose").click(function()
	{
		$("#mjmChatRoom").animate({bottom: "-410px"}, 'fast');
		mjmChatItemSeleted.removeClass('mjmChatRoomSelect');
		mjmChatItemSeleted = null;
	});*/
	
	// Miminize room
	$("#mjmChatRoomMinimize, #mjmChatRoomTitle").click(function()
	{
		if($("#mjmChatRoom").css('bottom') == '0px') {
			$("#mjmChatRoom").animate({bottom: "-380px"}, 'fast');
		}
		else {
			$("#mjmChatRoom").animate({bottom: "0"}, 'fast');
		}
	});
});