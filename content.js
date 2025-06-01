
function cleanUrl(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    if (hostname.includes('mercadolivre') || hostname.includes('mercadolibre')) {
      return cleanMercadoLivreUrl(urlObj);
    } else if (hostname.includes('amazon')) {
      return cleanAmazonUrl(urlObj);
    }
    
    return url; 
  } catch (error) {
    console.error('Error cleaning URL:', error);
    return url;
  }
}


function cleanMercadoLivreUrl(urlObj) {
  
  urlObj.search = '';
  urlObj.hash = '';
  return urlObj.toString();
}


function cleanAmazonUrl(urlObj) {
  const pathname = urlObj.pathname;
  
  
  if (pathname.includes('/dp/')) {
    const dpMatch = pathname.match(/\/dp\/([A-Z0-9]{10})/i);
    if (dpMatch) {
      urlObj.pathname = `/dp/${dpMatch[1]}`;
      urlObj.search = '';
      urlObj.hash = '';
      return urlObj.toString();
    }
  }
  
  if (pathname.includes('/gp/product/')) {
    const productMatch = pathname.match(/\/gp\/product\/([A-Z0-9]{10})/i);
    if (productMatch) {
      urlObj.pathname = `/dp/${productMatch[1]}`;
      urlObj.search = '';
      urlObj.hash = '';
      return urlObj.toString();
    }
  }
  
  
  if (pathname.includes('/s') || urlObj.search.includes('k=')) {
    const searchParams = new URLSearchParams(urlObj.search);
    const cleanParams = new URLSearchParams();
    
    
    const keepParams = ['k', 'i', 'node', 'rh'];
    keepParams.forEach(param => {
      if (searchParams.has(param)) {
        cleanParams.set(param, searchParams.get(param));
      }
    });
    
    urlObj.search = cleanParams.toString();
    urlObj.hash = '';
    return urlObj.toString();
  }
  
  
  urlObj.search = '';
  urlObj.hash = '';
  return urlObj.toString();
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "cleanCurrentUrl") {
    const currentUrl = window.location.href;
    const cleanedUrl = cleanUrl(currentUrl);
    
    
    chrome.runtime.sendMessage({
      action: "copyToClipboard",
      url: cleanedUrl
    });
  }
});

document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.shiftKey && event.code === 'KeyC') {
    event.preventDefault();
    const currentUrl = window.location.href;
    const cleanedUrl = cleanUrl(currentUrl);
    
    chrome.runtime.sendMessage({
      action: "copyToClipboard",
      url: cleanedUrl
    });
  }
});