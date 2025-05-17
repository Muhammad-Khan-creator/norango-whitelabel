
(function () {
  "use strict";

  // Step 1: Inject custom styling (logo + color override)
  function injectCustomNorangoStyles() {
    const style = document.createElement("style");
    style.textContent = `
      /* Override orange with Norango red */
      .widget-button,
      .chat-header,
      .support-tab,
      .support-tab:hover {
        background-color: #dc2626 !important;
        border-color: #dc2626 !important;
        color: white !important;
      }

      /* Update logo if shown as background or img */
      .chat-logo,
      .support-logo img,
      img[alt='Company Logo'] {
        content: url('https://storage.googleapis.com/msgsndr/51dX8CkgW0zi2Nw1PykKV/media/6827dcdd6671c6146b0370ac2.png') !important;
        max-height: 60px !important;
        display: block !important;
        margin: auto;
      }
    `;
    document.head.appendChild(style);
  }

  // Step 2: Load widget from API (as usual)
  (async function loadWidget() {
    const widgetScript = document.getElementById('support-os-unified-script');
    if (!widgetScript) return;

    const { env, account } = widgetScript.dataset;
    if (!env || !account) return;

    // Fetch widget config
    const res = await fetch(`${env}/v1/unified-script`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({ accountId: account })
    });

    const result = await res.json();
    if (result.errors) return;

    // Inject styles
    for (const href of result.assets.styles) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }

    // Inject scripts
    for (const src of result.assets.scripts) {
      const script = document.createElement("script");
      script.src = src;
      script.defer = true;
      document.body.appendChild(script);
    }

    // Inject Norango brand overrides
    injectCustomNorangoStyles();
  })();
})();
