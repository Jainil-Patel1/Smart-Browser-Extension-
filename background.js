let lastSessionId = '';

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      let currentTab = tabs[0];
      let currentUrl = currentTab.url;

      chrome.storage.local.get('visitHistory', (data) => {
        let visitHistory = data.visitHistory || {};
        let currentSessionId = `${currentUrl}_${tabId}`;

        if (!visitHistory[currentUrl]) {
          visitHistory[currentUrl] = { count: 0, lastVisit: null, secondLastVisit: null, lastSessionId: null };
        }

        if (lastSessionId !== currentSessionId) {
          // Update the visit history
          visitHistory[currentUrl].count += 1;
          visitHistory[currentUrl].secondLastVisit = visitHistory[currentUrl].lastVisit;
          visitHistory[currentUrl].lastVisit = new Date().toISOString();
          visitHistory[currentUrl].lastSessionId = currentSessionId;
          lastSessionId = currentSessionId;

          chrome.storage.local.set({ visitHistory });
        }
      });
    });
  }
});
