(function (global) {
  "use strict";

  const CONTACT_EMAIL = "793679928@qq.com";

  function value(formData, name) {
    return String(formData.get(name) || "").trim();
  }

  function buildInquiryText(fields) {
    return [
      "你好，我想咨询 AETHER 广告合作。",
      "",
      `产品名称：${fields.product}`,
      `产品网址：${fields.website || "未填写"}`,
      `联系方式：${fields.contact}`,
      `意向套餐：${fields.package}`,
      `希望上线时间：${fields.launchTime || "未填写"}`,
      `补充说明：${fields.note || "未填写"}`,
      "",
      "我已了解广告会明确标注，且展示不承诺点击、成交或排名。",
    ].join("\n");
  }

  function buildMailto(email, subject, body) {
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function fieldsFromForm(form) {
    const formData = new FormData(form);
    return {
      product: value(formData, "product"),
      website: value(formData, "website"),
      contact: value(formData, "contact"),
      package: value(formData, "package"),
      launchTime: value(formData, "launchTime"),
      note: value(formData, "note"),
    };
  }

  function showStatus(message) {
    const status = document.querySelector("#ad-inquiry-status");
    if (status) status.textContent = message;
  }

  function track(name, fields) {
    if (!global.AETHER_TRACK || typeof global.AETHER_TRACK.event !== "function") return;
    global.AETHER_TRACK.event(name, {
      package: fields.package,
      hasWebsite: Boolean(fields.website),
      hasLaunchTime: Boolean(fields.launchTime),
    });
  }

  function init() {
    const form = document.querySelector("#ad-inquiry-form");
    const copyButton = document.querySelector("#copy-ad-inquiry");
    if (!form || !copyButton) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const fields = fieldsFromForm(form);
      const body = buildInquiryText(fields);
      track("ad_inquiry_email", fields);
      showStatus("已生成邮件窗口；如果没有弹出，请复制咨询内容后手动发送。");
      global.location.href = buildMailto(CONTACT_EMAIL, "AETHER 广告合作咨询", body);
    });

    copyButton.addEventListener("click", async () => {
      const fields = fieldsFromForm(form);
      const body = buildInquiryText(fields);
      try {
        await navigator.clipboard.writeText(body);
        track("ad_inquiry_copy", fields);
        showStatus("咨询内容已复制，可以粘贴到微信或邮件发送。");
      } catch {
        showStatus("当前浏览器无法自动复制，请手动复制表单内容。");
      }
    });
  }

  global.AETHER_ADVERTISE = {
    buildInquiryText,
    buildMailto,
  };

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  }
})(typeof window !== "undefined" ? window : globalThis);
