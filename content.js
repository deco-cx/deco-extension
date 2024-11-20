
function getDecoSegmentCookie(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const tab = tabs[0];
        const url = tab.url;

        if (url) {
          chrome.cookies.get({ url, name: 'deco_segment' }, (cookie) => {
            if (cookie) {
              const decodedData = JSON.parse(decodeURIComponent(atob(cookie.value)));
              callback(decodedData);
            } else {
              console.warn("Cookie 'deco_segment' não encontrado.");
              callback(null);
            }
          });
        }
      }
    });
  }
  
  getDecoSegmentCookie((data) => {
    if (data) {
      const segmentsContainer = document.querySelector('.space-y-4');
      data.active.forEach(segment => {
        const segmentDiv = document.createElement('div');
        segmentDiv.className = 'segment';
        segmentDiv.innerHTML = `
          <span class="segment-text">${segment}</span>
          <span class="status-true">True</span>
        `;
        segmentsContainer.appendChild(segmentDiv);
      });
  
      data.inactiveDrawn.forEach(segment => {
        const segmentDiv = document.createElement('div');
        segmentDiv.className = 'segment';
        segmentDiv.innerHTML = `
          <span class="segment-text">${segment}</span>
          <span class="status-false">False</span>
        `;
        segmentsContainer.appendChild(segmentDiv);
      });
    }
  });

async function fillSiteInfo(){
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    if (tabs.length > 0) {
      const tab = tabs[0];
      const url = tab.url;
      const newUrl = new URL(url)

      if (url) {
        const siteInfo = await fetch(newUrl.origin + "/live/_meta");
        const siteData = await siteInfo.json();
        document.querySelector("#infra").innerHTML = siteData.platform;
        document.querySelector("#sitename").innerHTML = siteData.site;
        document.querySelector("#sitename").href = `https://github.com/deco-sites/${siteData.site}`;
        document.querySelector("#deco").innerHTML = siteData.version;
        document.querySelector("#apps").innerHTML = "";
        Object.entries(siteData.manifest.blocks.apps).forEach(([key, value]) => {
          document.querySelector("#apps").innerHTML += `<li>${sanitizeAppName(key)}</li>`;
        })
        
      }
    }
  });

}

sanitizeAppName = (appName) => {
  return appName.replace(".ts", "").replace("site/apps/deco/", "").replace("site/apps/", "")
}

fillSiteInfo()

document.getElementById('general').addEventListener('click', function(){
  document.getElementById('general-content').classList.remove('hide');
  document.getElementById('more-info-content').classList.add('hide');
  document.getElementById('general').classList.add('selected');
  document.getElementById('more-info').classList.remove('selected');
});
document.getElementById('more-info').addEventListener('click', function(){
  document.getElementById('general-content').classList.add('hide');
  document.getElementById('more-info-content').classList.remove('hide');
  document.getElementById('general').classList.remove('selected');
  document.getElementById('more-info').classList.add('selected');
});