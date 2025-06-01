
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "cleanEcommerceLink",
    title: "Get Clean Link",
    contexts: ["page"],
    documentUrlPatterns: [
      "*://*.mercadolivre.com.br/*",
      "*://*.mercadolibre.com/*",
      "*://*.amazon.com/*",
      "*://*.amazon.com.br/*",
      "*://*.amazon.ca/*",
      "*://*.amazon.co.uk/*",
      "*://*.amazon.de/*",
      "*://*.amazon.fr/*",
      "*://*.amazon.it/*",
      "*://*.amazon.es/*"
    ]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "cleanEcommerceLink") {
    chrome.tabs.sendMessage(tab.id, {
      action: "cleanCurrentUrl"
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "copyToClipboard") {
    copyToClipboard(request.url);
    
    chrome.tabs.executeScript(sender.tab.id, {
      code: `
        const notification = document.createElement('div');
        notification.textContent = 'Clean link copied to clipboard!';
        notification.style.cssText = \`
          position: fixed;
          top: 20px;
          right: 20px;
          background: #00a650;
          color: white;
          padding: 12px 20px;
          border-radius: 4px;
          font-family: Arial, sans-serif;
          font-size: 14px;
          z-index: 10000;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        \`;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
      `
    });
  }
});

function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}