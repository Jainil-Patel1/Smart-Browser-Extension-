document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let currentTab = tabs[0];
    let currentUrl = currentTab.url;

    chrome.storage.local.get('visitHistory', (data) => {
      let visitHistory = data.visitHistory || {};
      let visitInfo = visitHistory[currentUrl] || { count: 0, lastVisit: null, secondLastVisit: null };
      let messageElement = document.getElementById('message');

      if (visitInfo.count > 0 && visitInfo.secondLastVisit) {
        let lastVisitDate = new Date(visitInfo.lastVisit);
        let secondLastVisitDate = new Date(visitInfo.secondLastVisit);
        let timeDifference = Math.abs(lastVisitDate - secondLastVisitDate);
        let timeDifferenceText = formatTimeDifference(timeDifference);

        let message = `You have visited this site ${visitInfo.count} times.<br>`;
        message += `Current visit on ${lastVisitDate.toLocaleString()}.<br>`;
        message += `Last visit on ${secondLastVisitDate.toLocaleString()} (${timeDifferenceText}).`;

        messageElement.innerHTML = message;
      } else if (visitInfo.count > 0) {
        let lastVisitDate = new Date(visitInfo.lastVisit);
        let message = `You have visited this site ${visitInfo.count} times.<br>`;
        message += `Current visit on ${lastVisitDate.toLocaleString()}.`;

        messageElement.innerHTML = message;
      } else {
        messageElement.textContent = 'You have not visited this site before.';
      }
    });
  });
});

function formatTimeDifference(timeDifference) {
  let seconds = Math.floor(timeDifference / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }
}
