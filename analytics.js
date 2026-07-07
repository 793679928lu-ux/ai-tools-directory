(function (global) {
  "use strict";

  const STORAGE_KEY = "aether-analytics-events";
  const MAX_LOCAL_EVENTS = 100;
  const VERCEL_SCRIPT_SRC = "/_vercel/insights/script.js";

  function safeText(value) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 120);
  }

  function sanitizeData(data) {
    const result = {};
    Object.entries(data || {}).forEach(([key, value]) => {
      if (typeof value === "number" || typeof value === "boolean") {
        result[key] = value;
      } else if (typeof value === "string") {
        result[key] = safeText(value);
      }
    });
    return result;
  }

  function readLocalEvents() {
    try {
      const parsed = JSON.parse(global.localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function writeLocalEvent(name, data) {
    try {
      const events = readLocalEvents();
      events.unshift({
        name,
        data,
        path: global.location ? global.location.pathname : "",
        createdAt: new Date().toISOString(),
      });
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(0, MAX_LOCAL_EVENTS)));
    } catch {
      // Ignore browsers that block localStorage.
    }
  }

  function shouldLoadVercelScript() {
    if (!global.location || global.location.protocol !== "https:") return false;
    return !/^(localhost|127\.0\.0\.1|\[::1\])$/i.test(global.location.hostname);
  }

  function loadVercelScript() {
    if (!shouldLoadVercelScript() || !global.document) return;
    if (document.querySelector(`script[src="${VERCEL_SCRIPT_SRC}"]`)) return;

    global.va =
      global.va ||
      function () {
        (global.vaq = global.vaq || []).push(arguments);
      };

    const script = document.createElement("script");
    script.defer = true;
    script.src = VERCEL_SCRIPT_SRC;
    document.head.append(script);
  }

  function event(name, data) {
    const eventName = safeText(name);
    if (!eventName) return;

    const payload = sanitizeData(data);
    writeLocalEvent(eventName, payload);

    if (typeof global.va === "function") {
      global.va("event", { name: eventName, data: payload });
    }
  }

  function dataFromLink(link) {
    const payload = {
      label: link.dataset.trackLabel || link.textContent,
      group: link.dataset.trackGroup || "",
    };

    if (link.href) {
      try {
        const url = new URL(link.href, global.location.href);
        payload.hrefHost = url.hostname;
        payload.hrefPath = url.pathname;
      } catch {
        payload.hrefPath = link.getAttribute("href") || "";
      }
    }

    return payload;
  }

  function bindTrackedClicks() {
    if (!global.document) return;

    document.addEventListener("click", (clickEvent) => {
      const target = clickEvent.target.closest("[data-track]");
      if (!target) return;

      event(target.dataset.track, dataFromLink(target));
    });
  }

  global.AETHER_TRACK = {
    event,
    readLocalEvents,
  };

  loadVercelScript();
  bindTrackedClicks();
})(typeof window !== "undefined" ? window : globalThis);
