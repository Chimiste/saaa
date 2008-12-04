var saaa_notifier_win = 
{
	main_win: null,
	currrent_message_index: 0,
	showed: false,
	notifier: null,
	notify: function()
	{
		this.main_win.win_handle.visible = true;
		if (!saaa_notifier_win.showed)
			saaa_notifier_win.show_message();
		else
			saaa_notifier_win.update_message_info();
		
	},
	update_message_info: function()
	{
		$("#message_info").html((saaa_notifier_win.currrent_message_index + 1) + "/" + this.notifier.message_list.length);
	},
	show_message: function()
	{
		saaa_notifier_win.showed = true;
		saaa_notifier_win.update_message_info();
		saaa_notifier_win.hide_message_button();		
		$("#message-box").hide();
		$("#message-box").html(this.notifier.message_list[saaa_notifier_win.currrent_message_index].message);
		$("#message-box").inner_slide("#content", 'left', {duration: 'fast'}, function(){saaa_notifier_win.show_message_button();});				
	},
	init_main_win: function(parent_win, notifier)
	{
		this.notifier = notifier;
		saaa_notifier_win.main_win = new air_win(parent_win, "notify", $("#layout"));
		saaa_notifier_win.notifier = notifier;
		saaa_notifier_win.parent_win = parent_win;

		win = saaa_notifier_win.main_win;
		win.win_handle.visible = false;
		win.buttons.close = $("#close-btn");
		win.init();
		var self = this;
		win.add_event_listener("close",  function(){
				air.trace("close notifybox");
				self.notifier.delay();
				self.notifier.close();
			}
		);

		
		//win.add_event_listener("close",  function(){});
		win.show(function(layout){
			layout.slideDown(function(){$(this).fadeIn('slow');});
			$("#prev-msg-btn").click(function(){
				if (saaa_notifier_win.currrent_message_index > 0){
					saaa_notifier_win.currrent_message_index--;
					saaa_notifier_win.show_message();
				}
			});
			$("#next-msg-btn").click(function(){
				if (self.currrent_message_index < self.notifier.message_list.length - 1)
				{
					self.currrent_message_index++;
					self.show_message();				
				}			
			});
		});		
		
	},
	show_message_button: function()
	{
		$("#message-controller").show();
	},
	hide_message_button: function()
	{		
		$("#message-controller").hide();
	}	
	
}
