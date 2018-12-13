
document.getElementById('select_el').onclick = sendMessage;

var selecting = false;
function sendMessage (){
  chrome.extension.sendMessage({command: 'asd'});

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    console.log(tabs[0])
    chrome.tabs.sendMessage(tabs[0].id ,{ command: (selecting ? 'stop_selecting' : 'start_selecting' )}, function(response){
        selecting = (response == 'start_selecting');
    });
  })
}