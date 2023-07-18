const ytDataKey = "shortsSetting";
const browser = chrome || browser;
const runtime = browser.runtime;
const storage = browser.storage.sync;

// for testing
// const oldSettings = {
//   homePage: true,
//   channelPage: true,
// };

const settings = {
  hideTab: true, // Hide Tabs that named "SHORT"
  homePage: true,
  channelPage: true,
  watchPage: true,
  searchPage: true,
  hashtagPage: true,
};

const supportHas = CSS.supports("selector(:has(*))");
const config = { childList: true, subtree: true, attributes: true };
const selectors = {
  tabs: {
    parent: "tp-yt-paper-tab",
    element: "tp-yt-paper-tab .tab-title",
  },
  navbar: {
    collapse: 'a.ytd-mini-guide-entry-renderer[title="Shorts"]',
    expanded: `
      #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[title="Shorts"],
      a.ytd-mini-guide-entry-renderer[title="Shorts"]
    `,
  },
  filterBar: {
    parent: "yt-chip-cloud-chip-renderer",
    element: "yt-chip-cloud-chip-renderer #text[title='Shorts']",
  },
  searchPage: {
    reel: "ytd-search ytd-reel-shelf-renderer",
    videos: {
      parent: "ytd-video-renderer[is-search]",
      element: "ytd-search #thumbnail[href^='/shorts/']",
    },
  },
  homePage: {
    reel: {
      parent: "ytd-rich-section-renderer",
      element: "[page-subtype='home'] ytd-rich-shelf-renderer[is-shorts]",
    },
  },
  subscriptionPage: {
    reel: {
      parent: "ytd-rich-section-renderer",
      element:
        "[page-subtype='subscriptions'] ytd-rich-shelf-renderer[is-shorts]",
    },
    videos: {
      parent: "ytd-grid-video-renderer, ytd-rich-item-renderer",
      element: "[page-subtype='subscriptions'] #thumbnail[href^='/shorts/']",
    },
  },
  channelPage: {
    reel: {
      parent: "ytd-item-section-renderer",
      element: '[page-subtype="channels"] ytd-reel-shelf-renderer',
    },
    feed: {
      element:
        "[page-subtype='channels'] ytd-rich-grid-renderer[is-shorts-grid]",
    },
  },
  watchPage: {
    reel: "ytd-watch-flexy ytd-reel-shelf-renderer",
  },
  hashtagPage: {
    video: {
      parent: "ytd-rich-item-renderer",
      element:
        "[page-subtype='hashtag-landing-page'] #thumbnail[href^='/shorts/']",
    },
  },
};

// Stolen from AdashimaaTube
const styles = {
  tabs: `
  #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[title="Shorts"] {
    display: none;
  }

  a.ytd-mini-guide-entry-renderer[title="Shorts"] {
    display: none;
  }
  `,
  homePage: `
  [page-subtype='home'] ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts]) {
    display: none;
  }
  `,
  searchPage: `
  ytd-search ytd-reel-shelf-renderer {
    display: none;
  }
  ytd-search ytd-video-renderer[is-search]:has(#thumbnail[href^='/shorts/']) {
    display: none;
  }
  `,
  channelPage: `
  [page-subtype="channels"] ytd-item-section-renderer:has(ytd-reel-shelf-renderer) {
    display: none;
  }

  [page-subtype='channels'] ytd-rich-grid-renderer[is-shorts-grid] {
    display: none;
  }
  `,
  watchPage: `
  ytd-watch-flexy ytd-reel-shelf-renderer {
    display: none;
  }
  `,
  hashtagePage: `
  [page-subtype='hashtag-landing-page'] ytd-rich-item-renderer:has(#thumbnail[href^='/shorts/']) {
    display: none;
  }
  `,
};

const tab = selectors.tabs;
const tabNav = selectors.navbar;
const filterBar = selectors.filterBar;

const sp = selectors.searchPage;
const hp = selectors.homePage;
const subp = selectors.subscriptionPage;
const wp = selectors.watchPage;
const chp = selectors.channelPage;
const hashP = selectors.hashtagePage;
