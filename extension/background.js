const youtubeURL = "https://www.youtube.com/*";
const browser = chrome || browser;
const [runtime, storage] = [browser.runtime, browser.storage.sync];

const extensionSettings = {
  isEnable: true,
  toggleHideVideos: true,
  toggleHideShelf: true,
  toggleHideTabs: true,
};

// https://developer.chrome.com/docs/extensions/reference/runtime/#event-onInstalled
runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install" || reason === "update") {
    storage.set(extensionSettings);
    reloadTabs();
    fetchAllStorage();
  }
});

// https://developer.chrome.com/docs/extensions/reference/runtime/#event-onMessage
// runtime.onMessage.addListener(async (message) => {
//   console.log(message);
//   const tabs = await getTabs();
//   tabs.forEach((tab) => browser.tabs.sendMessage(tab.id, message));
// });

const fetchAllStorage = () => storage.get();
const fetchTabs = () => browser.tabs.query({ url: youtubeURL });

const reloadTabs = async () => {
  const tabs = await fetchTabs();
  tabs.forEach((tab) => browser.tabs.reload(tab.id));
  console.log("Reloaded all tabs");
};
