(function () {
  "use strict";

  // Inject Norango Styles AFTER widget loads
  function injectCustomNorangoStyles() {
    setTimeout(() => {
      const style = document.createElement("style");
      style.textContent = `
        .widget-button,
        .chat-header,
        .support-tab,
        .support-tab:hover {
          background-color: #dc2626 !important;
          border-color: #dc2626 !important;
          color: white !important;
        }

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
    }, 500); // Wait half a second AFTER widget loads
  }

  // Load the widget first
  (async function loadWidget() {
    const widgetScript = document.getElementById('support-os-unified-script');
    if (!widgetScript) return;

    const { env, account } = widgetScript.dataset;
    if (!env || !account) return;

    const res = await fetch(`${env}/v1/unified-script`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ accountId: account })
    });

    const result = await res.json();
    if (result.errors) return;

    for (const href of result.assets.styles) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }

    for (const src of result.assets.scripts) {
      const script = document.createElement("script");
      script.src = src;
      script.defer = true;
      document.body.appendChild(script);
    }

    injectCustomNorangoStyles();
  })();
})();
