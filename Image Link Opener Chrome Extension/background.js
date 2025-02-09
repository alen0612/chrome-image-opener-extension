chrome.action.onClicked.addListener(async (tab) => {
  try {
    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: findAndOpenImageLinks
    });
    console.log('Script executed successfully:', result);
  } catch (err) {
    console.error('Failed to execute script:', err);
  }
});

function findAndOpenImageLinks() {
  // 定義圖片副檔名
  const imageExtensions = ['.gif', '.jpeg', '.jpg', '.png'];
  
  // 獲取所有的 a 標籤
  const links = document.getElementsByTagName('a');
  let linksFound = 0;
  
  // 遍歷所有連結
  Array.from(links).forEach(link => {
    const href = link.href;
    const text = (link.textContent || '').trim();
    
    // 檢查 href 和文字是否都以圖片副檔名結尾
    const hasImageExtensionInHref = imageExtensions.some(ext => href.endsWith(ext));
    const hasImageExtensionInText = imageExtensions.some(ext => text.endsWith(ext));
    
    // 如果兩個條件都符合，在新分頁中開啟連結
    if (hasImageExtensionInHref && hasImageExtensionInText) {
      console.log("href found: " + href);
      chrome.runtime.sendMessage({
        action: 'openTab',
        url: href
      });
      linksFound++;
    }
  });
  
  return { linksFound };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openTab') {
    chrome.tabs.create({ url: message.url });
  }
});