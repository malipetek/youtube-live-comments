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
					console.log(message)
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
						const saved_authors = {}
						console.log('here is renderer', renderer)

						const getMessages = () => {
						
						console.log('new data');
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
								messages: [msg.message],
								data_id: addPerson(msg.author, msg.src) 
							}
							saved_authors[msg.author].data_message_id = addFirstMessage(saved_authors[msg.author], msg.message);
							}else{
								saved_authors[msg.author].messages.push(msg.message);
							}

							saved_messages[msg.id] = true;
							// message
							addMessage(saved_authors[msg.author], msg.message);
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
					fontSize: '16px'
				})
				$('#columns').before($div);

				var chart = echarts.init($div.get(0), 'dark');

				var data = [{ /* point in the center */
					fixed: true,
					x: chart.getWidth() / 2,
					y: chart.getHeight() / 2,
					symbolSize: 100,
					itemStyle: {
						color: '#cccccc'
					},
					id: '-1'
				}];
				
				option = {
					series: [{
							type: 'graph',
							layout: 'force',
							animation: false,
							force: {
									initLayout: 'circular',
									gravity: 0.1,
									edgeLength: 1,
									repulsion: 400,
									draggable: true,
									roam: true
							},
							label: {show: true, position: 'bottom'},
							data: data,
					}]
				};

				chart.setOption(option);	

				const edges = [];
				function addPerson(name, thumb){
						data.push({
								name: name,
								id: data.length,
								symbol: 'image://'+ thumb,
								symbolSize: 50
						});
					
						 
						// edges.push({
						// 	source: 0,
						// 	target: data.length - 1
						// });
						
						chart.setOption({
								series: [{
										roam: true,
										draggable: true,
										data: data,
										edges: edges
									}]
						});
						return data.length - 1;
				}

				function addFirstMessage(author, msg){
						data.push({
							name: msg,
							id: data.length,
							symbol: 'rect',
							label: {
								show: true,
								position: 'insideTopLeft',
								backgroundColor: '#777777',
								borderColor: '#777777',
								borderWidth: 10,
								borderType: 'solid'
							},
							symbolSize: [1, 1]
							});
			
							edges.push({
									source: author.data_id,
									target: data.length - 1
							});
			
						chart.setOption({
							series: [{
									roam: true,
									data: data,
									edges: edges
							}]
						});
						return data.length - 1;
				}

				function addMessage(author, msg){
					data[author.data_message_id].name = author.messages.reverse().slice(0,3).map(str => str.slice(0, 80).replace(/\s(?=[^\n][^\s]{9,})/gi, '\n') ).join('\n ►') + '\n ...';

					edges.push({
						source: 0,
						target: author.data_id
					});
					
					chart.setOption({
						series: [{
								roam: true,
								data: data,
								edges: edges
							}]
					});

					edges.pop();
				}
				console.log('injecting', chart);

				chart.on('dataviewchanged', function(e){ console.log('zoom', e)})
				// });
			}

			
			document.querySelector('yt-navigation-manager').addEventListener('yt-navigate-finish', (e) => {
				// dispose
			});

			document.querySelector('yt-navigation-manager').addEventListener('yt-navigate-finish', (e) => {
				// re enable
			});

		});
	}
	}, 10);
});