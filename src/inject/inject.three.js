chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);

		jQuery(function($){
			// $(document).on('load', ()=>{				
				var chatCheck = setInterval(checkForChat, 10);

				function checkForChat(){
					const frame = document.querySelector('ytd-live-chat-frame');
					if(frame){
						clearInterval(chatCheck);
						enableExtension();
					}
				}
				setTimeout(function(){
					clearInterval(chatCheck);
					console.log('end of chat check');
				}, 10000);

			function enableExtension(){

				chrome.runtime.sendMessage({command: 'asd'});
				
				chrome.runtime.onMessage.addListener(function(message, sender, res){
					// console.log(message)
					var {command} = message;
					
					res(command);
				})
				
				const ytframe = document.querySelector('ytd-live-chat-frame');
				const frame = ytframe.querySelector('iframe');
				
				const rendererCheck = setInterval(getRenderer, 50);
				function getRenderer(){
					const renderer = frame.contentDocument.querySelector('yt-live-chat-renderer')
					if(renderer){
						clearInterval(rendererCheck);
						
						const saved_messages = {}
						// const saved_authors = {}
						console.log('here is renderer', renderer)

						const getMessages = () => {

						// console.log('new data', saved_authors);
						let messages = function(){ return frame.contentDocument.querySelectorAll('yt-live-chat-text-message-renderer'); }
						
						msgs = messages();
						var new_messages = Object.keys(msgs).map(i => msgs[i]).map(el => { 
							const author_img = el.querySelector('#author-photo img').src;
							const src = author_img.replace(/s32/gi, 's128');
							const author = el.querySelector('#author-name').textContent.replace(/[\s,\n]+/gi, '');
							const message = el.querySelector('#message').textContent;
							const authorType = el.querySelector('#author-name').getAttribute('type');
							return {
								id: el.id,
								author: author,
								src: src,
								message: message,
								authorType: authorType
							 }
						});

						new_messages = new_messages.filter(o => !saved_messages[o.id])
						new_messages.forEach(msg => {
							
							if(!saved_authors[msg.author]){
								saved_authors[msg.author] = {
								name: msg.author,
								thumb: msg.src,
								messages: [msg.message]
								}
								saved_authors[msg.author].three = new THREEPERSON(saved_authors[msg.author]); 
								// console.log('author converted', saved_authors[msg.author]);     
							
							}else{
								saved_authors[msg.author].messages.push(msg.message);
							}

							saved_messages[msg.id] = true;
							// message
							saved_authors[msg.author].three.addMessage(msg.message)
						})

							for(i in saved_authors){
								const author = saved_authors[i]; 
								var $person;
								// if($('#yt_chat_extension_div [author="'+author.name+'"]').is('*')){
								// 	$person = $('#yt_chat_extension_div [author="'+author.name+'"]');
								// }else{
								// 	$person = $('<div>'); 
								// 	$person.attr('author', author.name);
								// 	$person.html('<div class="person"> <img src="'+author.thumb+'" /><b>'+ author.name+'</b> </div> <div class="messages"> </div>')
								// 	$('#yt_chat_extension_div').append($person)		
								// }
								
								// const $msgs = $person.find('.messages');
								// $msgs.html('');
								
								
								// author.messages.forEach(msg => {
								// 	$msgs.append('<div class="msg">'+msg+'</div>');
								// })
							}
						// console.log(saved_authors)
						}
						getMessages();
						renderer.addEventListener('data-changed', getMessages);	

					}
				}
				setTimeout(()=>{clearInterval(rendererCheck); console.log('end of renderer check')}, 10000);
				
				
				var $div = $('<div>')
				.attr('id', 'yt_chat_extension_div')
				.css({
					color: '#fff',
					fontSize: '16px',
					position: 'relative'
				})
				$('#columns').before($div);
				
				$div.append(stats.dom).append(renderer.domElement);

				// });
			}

			
			// document.querySelector('yt-navigation-manager').addEventListener('yt-navigate-finish', (e) => {
			// 	// dispose
			// });

			// document.querySelector('yt-navigation-manager').addEventListener('yt-navigate-finish', (e) => {
			// 	// re enable
			// });

		});
	}
	}, 10);
});