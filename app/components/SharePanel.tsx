"use client";

import { toPng } from "html-to-image";
import { Download, Link as LinkIcon } from "lucide-react";
import { useMemo, useState } from "react";

export function SharePanel() {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    const url = new URL(window.location.href);
    url.searchParams.set("utm_source", "portfolio");
    url.searchParams.set("utm_medium", "share");
    url.searchParams.set("utm_campaign", "stats-dashboard");
    return url.toString();
  }, []);

  const embedCode = `<iframe src="${shareUrl}" title="Personal Stats Dashboard" width="100%" height="1000" style="border:0;border-radius:16px;overflow:hidden"></iframe>`;

  async function copyShareLink() {
    if (!shareUrl) {
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  async function exportAsPng() {
    const root = document.getElementById("dashboard-root");
    if (!root) {
      return;
    }

    setExporting(true);
    try {
      const pngDataUrl = await toPng(root, {
        pixelRatio: 2,
        backgroundColor: "#020617",
      });

      const link = document.createElement("a");
      link.download = "personal-stats-dashboard.png";
      link.href = pngDataUrl;
      link.click();
    } finally {
      setExporting(false);
    }
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <h2 className="text-xl font-semibold text-slate-100">Export & Share</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={exportAsPng}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-slate-100 hover:border-sky-300"
          disabled={exporting}
        >
          <Download className="h-4 w-4" />
          {exporting ? "Rendering" : "Download PNG"}
        </button>

        <button
          type="button"
          onClick={copyShareLink}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-slate-100 hover:border-sky-300"
        >
          <LinkIcon className="h-4 w-4" />
          {copied ? "Copied" : "Copy Share Link"}
        </button>
      </div>

      <label htmlFor="embed-code" className="mt-5 block text-sm text-slate-300">
        Embed snippet
      </label>
      <textarea
        id="embed-code"
        readOnly
        value={embedCode}
        className="mt-2 h-24 w-full rounded-xl border border-white/15 bg-slate-950/60 p-3 text-xs text-slate-300"
      />
    </section>
  );
}
