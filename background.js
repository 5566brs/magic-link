chrome.webRequest.onBeforeRequest.addListener(function(details) {
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs){

    const url = new URL(details.url);
    const key = url.searchParams.get('keyFile');
    const link = url.origin + "/send-file/file/" + key + "/view";
    
    if(details.tabId==tabs[0].id){
      chrome.tabs.executeScript(tabs[0].id, {
        code: `var dd = document.getElementById("link-file-div"); dd.hidden=false; document.getElementById("link-file").innerHTML = "${link}"; document.getElementById("link-file").href = "${link}";`
      });
    }
  });
}, {urls: ["*://send.magicode.me/send-file/data-upload*"]});