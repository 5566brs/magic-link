chrome.webRequest.onBeforeRequest.addListener(function(req) {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {

    const url = new URL(req.url);
    const key = url.searchParams.get('keyFile');
    const link = `${url.origin}/send-file/file/${key}/view`;


    if (req.tabId == tabs[0].id) {
      chrome.tabs.executeScript(tabs[0].id, {
        code: `(()=>{if (window.hasOwnProperty('modified')) return;
               window.modified = true;
               const clicktocptxt = 'לחץ כדי להעתיק את הלינק ללוח';
               const copiedtxt = 'הלינק הועתק ללוח'
               let linkfilediv = document.getElementById("link-file-div")
               let linkelemnt = document.createElement('a');
               let linkwrap = document.createElement('h3');
               linkwrap.appendChild(linkelemnt);
               linkfilediv.parentNode.insertBefore(linkwrap, linkfilediv.nextSibling);
               linkelemnt.innerHTML!==copiedtxt?linkelemnt.innerHTML=clicktocptxt:false;
               linkelemnt.href = "${link}";
               linkelemnt.addEventListener('click',(e)=>{navigator.clipboard.writeText(e.target.href).then(e.target.innerHTML=copiedtxt); e.preventDefault()}, false);})()`
      });
    }
  });
}, { urls: ["*://send.magicode.me/send-file/data-upload*"] });