"use strict";

const navForm = document.getElementById("nav-bar-form");
const navAddress = document.getElementById("nav-bar-address");
const error = document.getElementById("uv-error");
const errorCode = document.getElementById("uv-error-code");

const STORAGE_KEYS = {
  SEARCH_ENGINE: 'madEggBrowser_searchEngine',
  HOME_PAGE: 'madEggBrowser_homePage'
};

var currentTabId = 0;
var currentTab = 0;
var tabIds = [];

document.addEventListener("DOMContentLoaded", function() {
  setupEventListeners();
  universalAdapter();
  setInterval(universalAdapter, 1000);
});

function setupEventListeners() {
  navForm?.addEventListener("submit", async e => {
    e.preventDefault();
    await handleSearch(navAddress, false);
  });
  navAddress?.addEventListener('focus', () => {
    navAddress.select();
  });
  navAddress?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(navAddress, false);
    }
  });
}

async function handleSearch(inputElement, isMainSearch) {
  const query = inputElement.value.trim();
  if (!query) return;
  if (isMainSearch) {
    inputElement.blur();
  }
  try {
    const iframe = getActiveIframe();
    const url = search(query, "https://www.google.com/search?q=%s");
    const prefix = __uv$config.prefix;
    const encUrl = prefix + __uv$config.encodeUrl(url);
    const finalUrl = "https://asphalt967.vercel.app" + encUrl;
    showProxy();
    if (iframe) {
      iframe.src = finalUrl;
    } else {
      newTab(finalUrl);
    }
    if (!isMainSearch) {
      updateAddressBar();
    }
  } catch (err) {
    console.error("Search error:", err);
    if (error) error.textContent = "Failed to process search.";
    if (errorCode) errorCode.textContent = err.toString();
  }
}

function search(input, template) {
  try {
    return new URL(input).toString();
  } catch (err) {
  }

  try {
    const url = new URL(`http://${input}`);
    if (url.hostname.includes(".")) return url.toString();
  } catch (err) {
  }
  return template.replace("%s", encodeURIComponent(input));
}

function updateAddressBar() {
  const f = getActiveIframe();
  if (!f) return;
  if (document.activeElement === navAddress) return;
  let raw;
  try {
    raw = f.contentWindow.location.href;
  } catch {
    raw = f.src;
  }
  const enc = raw.replace(/^.*?__uv$config.prefix/, "");
  const dec = __uv$config.decodeUrl ? __uv$config.decodeUrl(enc) : atob(enc);
  navAddress.value = dec.slice(dec.indexOf("https://"));
}

function getActiveIframe() {
  return document.getElementById("frame" + currentTab);
}

function getTabId() {
  tabIds.push(currentTabId);
  return currentTabId++;
}

function newTab(url) {
  if (!url) {
    const homePage = localStorage.getItem(STORAGE_KEYS.HOME_PAGE) || "https://google.com/";
    url = __uv$config.prefix + __uv$config.encodeUrl(homePage);
    url = "https://asphalt967.vercel.app" + url;
  }
  const el = document.getElementById("tabBarTabs");
  const tabId = getTabId();
  el.innerHTML += `<div class="tabBarTab" id="tab${tabId}" onclick="openTab(${tabId})"><div class="tab-content"><img id="favicon-${tabId}" class="tab-favicon"><span id="title-${tabId}" class="tab-title">New Tab</span><i class="fa-solid fa-xmark tab-close" onclick="event.stopPropagation();closeTab(${tabId})"></i></div></div>`;
  const tab = el.lastElementChild;
  setTimeout(() => tab.style.marginTop = "9px", 1);
  const frame = document.createElement("iframe");
  frame.src = url;
  frame.classList.add("tab");
  frame.id = "frame" + tabId;
  frame.style.cssText = "width:100%;height:100%;border:none;display:none;";
  document.getElementById("frames").append(frame);
  openTab(tabId);
  return frame;
}

function openTab(tabId) {
  document.querySelectorAll(".tabBarTab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".tab").forEach(f => f.style.display = "none");
  currentTab = tabId;
  const tabEl = document.getElementById("tab" + tabId);
  const frameEl = document.getElementById("frame" + tabId);
  if (tabEl && frameEl) {
    tabEl.classList.add("active");
    frameEl.style.display = "block";
    updateAddressBar();
  }
}

function closeTab(tabId) {
  const tabEl = document.getElementById("tab" + tabId);
  const frameEl = document.getElementById("frame" + tabId);
  if (tabEl) tabEl.remove();
  if (frameEl) frameEl.remove();
  const idx = tabIds.indexOf(tabId);
  if (idx > -1) tabIds.splice(idx, 1);
  if (currentTab === tabId) {
    if (tabIds.length) {
      openTab(tabIds[tabIds.length - 1]);
    } else {
      newTab();
    }
  }
}

function closeAllTabs() {
  document.getElementById("frames").innerHTML = "";
  document.getElementById("tabBarTabs").innerHTML = "";
  tabIds = [];
  currentTab = 0;
  newTab();
}

function showProxy() {
  document.getElementById("proxy-div").className = "show-proxy-div";
}

function hideProxy() {
  document.getElementById("proxy-div").className = "hide-proxy-div";
}

function goHome() {
  closeAllTabs();
  hideProxy();
}

function goBack() {
  const f = getActiveIframe();
  f && f.contentWindow.history.back();
}

function goForward() {
  const f = getActiveIframe();
  f && f.contentWindow.history.forward();
}

function reloadPage() {
  const f = getActiveIframe();
  f && f.contentWindow.location.reload();
}

function proxyFullscreen() {
  const f = getActiveIframe();
  f && (f.requestFullscreen?.() || f.webkitRequestFullscreen?.() || f.msRequestFullscreen?.());
}

function windowPopout() {
  const popup = open("about:blank", "_blank");
  if (!popup || popup.closed) {
    alert("Window blocked. Please allow popups for this site.");
    return false;
  }
  const f = getActiveIframe();
  if (!f) return;
  const iframe = popup.document.createElement("iframe");
  iframe.src = f.src;
  iframe.style.position = "fixed";
  iframe.style.top = iframe.style.bottom = iframe.style.left = iframe.style.right = "0";
  iframe.style.border = iframe.style.outline = "none";
  iframe.style.width = iframe.style.height = "100%";
  popup.document.body.innerHTML = "";
  popup.document.body.appendChild(iframe);
  return true;
}

function universalAdapter() {
  const savedHome = localStorage.getItem(STORAGE_KEYS.HOME_PAGE) || '';
  const dropdownBtn = document.querySelector(`.search-engine-dropdownaa`);
  const statusMsg = document.getElementById(`statusMessage-0`);
  for (let id of tabIds) {
    const frame = document.getElementById("frame" + id);
    if (!frame) continue;
    let raw;
    try {
      raw = frame.contentWindow.location.href;
    } catch {
      raw = frame.src;
    }
    const enc = raw.replace(/^.*?__uv$config.prefix/, "");
    const dec = __uv$config.decodeUrl ? __uv$config.decodeUrl(enc) : atob(enc);
    const url = dec.slice(dec.indexOf("http"));
    const titleElement = document.getElementById(`title-${id}`);
    if (titleElement) {
      titleElement.textContent = (frame.contentDocument && frame.contentDocument.title) || url.split("/").pop() || "untitled";
    }
    const faviconElement = document.getElementById(`favicon-${id}`);
    if (faviconElement) {
      faviconElement.src = `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(url)}&size=256`;
    }
    if (id === currentTab && document.activeElement !== navAddress) {
      navAddress.value = url;
      if (url === savedHome) {
        const savedIcon = localStorage.getItem(STORAGE_KEYS.SEARCH_ICON);
        dropdownBtn.querySelector("img").src = savedIcon;
        statusMsg.textContent = `Home Page`;
      }
    }
  }
}

newTab();
