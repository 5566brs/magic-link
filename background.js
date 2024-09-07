chrome.webRequest.onBeforeRequest.addListener(handleWebRequest, { urls: ["https://send.magicode.me/send-file/data-upload*"] });

function handleWebRequest(requestDetails) {
    chrome.tabs.query({ currentWindow: true, active: true }, function (activeTabs) {
        if (activeTabs.length === 0) return; // No active tab found, exit

        const activeTabId = activeTabs[0].id;
        if (requestDetails.tabId !== activeTabId) return; // Request not from the active tab, exit

        const linkUrl = constructFileLink(requestDetails.url);
        injectLinkScript(requestDetails.tabId, linkUrl);
    });
}

function constructFileLink(requestUrl) {
    const url = new URL(requestUrl);
    const keyFile = url.searchParams.get('keyFile');
    return `${url.origin}/send-file/file/${keyFile}/view`;
}

function injectLinkScript(tabId, link) {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: createLinkElement,
        args: [link]
    });
}

function createLinkElement(link) {
    if (Object.hasOwn(window, 'modified')) return;
    window.modified = true;

    const clickToCopyText = 'לחץ כדי להעתיק את הלינק ללוח';
    const copiedText = 'הלינק הועתק ללוח';

    const linkFileDiv = document.getElementById("link-file-div");
    if (!linkFileDiv) return; // Exit if the target element is not found

    const linkElement = document.createElement('a');
    const linkWrapper = document.createElement('h3');
    linkWrapper.appendChild(linkElement);
    linkFileDiv.parentNode.insertBefore(linkWrapper, linkFileDiv.nextSibling);

    linkElement.innerHTML = clickToCopyText;
    linkElement.href = link;
    linkElement.addEventListener('click', (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(link).then(() => {
            linkElement.innerHTML = copiedText;
        });
    }, false);
}