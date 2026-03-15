/**
 * Supra-wall EU AI Act Countdown Widget
 * Embeddable countdown to EU AI Act enforcement deadline.
 *
 * Usage:
 *   <script src="https://suprawall.ai/api/widget/countdown.js" defer></script>
 *   <div data-suprawall-countdown data-theme="dark" data-style="badge"></div>
 */

const ENFORCEMENT_DATE = new Date("2026-08-02T00:00:00Z");
const BASE_URL = "https://suprawall.ai";

function getDaysRemaining(): number {
    const now = new Date();
    const diff = ENFORCEMENT_DATE.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function getUrgencyColor(days: number): string {
    if (days > 180) return "#f59e0b"; // amber
    if (days > 90) return "#f97316";  // orange
    if (days > 30) return "#ef4444";  // red
    return "#dc2626";                  // dark red
}

function renderBadge(el: HTMLElement, days: number, theme: string): void {
    const urgencyColor = getUrgencyColor(days);
    const isDark = theme === "dark";
    const bg = isDark ? "#111827" : "#f9fafb";
    const text = isDark ? "#e5e7eb" : "#1f2937";
    const border = isDark ? "#1f2937" : "#e5e7eb";
    const label = days > 0 ? `enforcement` : `is now enforced`;

    el.innerHTML = `<a href="${BASE_URL}/eu-ai-act?ref=countdown-widget"
       target="_blank" rel="noopener noreferrer"
       style="display:inline-flex;align-items:center;gap:8px;padding:7px 14px;
              border-radius:8px;font-size:13px;line-height:1;
              font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
              text-decoration:none;background:${bg};color:${text};
              border:1px solid ${border};box-shadow:0 1px 3px rgba(0,0,0,.08);">
      <span style="font-size:15px;">⏰</span>
      <span>${days > 0
        ? `<strong style="color:${urgencyColor}">${days.toLocaleString()}</strong> days until EU AI Act ${label}`
        : `EU AI Act ${label}`
      }</span>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" opacity="0.4"><path d="M2.5 7.5l5-5M7.5 7.5V2.5H2.5"/></svg>
    </a>`;
}

function renderBanner(el: HTMLElement, days: number, theme: string): void {
    const urgencyColor = getUrgencyColor(days);
    const isDark = theme === "dark";

    el.innerHTML = `<div style="padding:16px 20px;border-radius:10px;
            background:${isDark ? "linear-gradient(135deg,#111827,#1f2937)" : "linear-gradient(135deg,#f0fdf4,#ecfdf5)"};
            color:${isDark ? "#f9fafb" : "#1f2937"};
            font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
            display:flex;justify-content:space-between;align-items:center;
            border:1px solid ${isDark ? "#1f2937" : "#d1fae5"};
            box-shadow:0 4px 16px rgba(0,0,0,.06);">
      <div>
        <div style="font-size:36px;font-weight:800;color:${urgencyColor};line-height:1">${days > 0 ? days.toLocaleString() : "0"}</div>
        <div style="font-size:12px;opacity:0.6;margin-top:3px">
          ${days > 0 ? "days until EU AI Act enforcement" : "EU AI Act is now enforced"} (Aug 2, 2026)
        </div>
      </div>
      <a href="${BASE_URL}/eu-ai-act?ref=countdown-widget"
         target="_blank" rel="noopener noreferrer"
         style="padding:9px 18px;background:#10b981;color:white;border-radius:8px;
                text-decoration:none;font-size:13px;font-weight:600;
                white-space:nowrap;box-shadow:0 2px 8px rgba(16,185,129,.3);">
        Check Compliance →
      </a>
    </div>`;
}

function renderMinimal(el: HTMLElement, days: number): void {
    const urgencyColor = getUrgencyColor(days);
    el.innerHTML = `<a href="${BASE_URL}/eu-ai-act?ref=countdown-widget"
       target="_blank" rel="noopener noreferrer"
       style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
              font-size:13px;text-decoration:none;color:inherit;">
      <strong style="color:${urgencyColor}">${days > 0 ? `${days.toLocaleString()} days` : "Now enforced"}</strong>
      until EU AI Act enforcement ↗
    </a>`;
}

function initCountdown(): void {
    const containers = document.querySelectorAll<HTMLElement>("[data-suprawall-countdown]");
    const days = getDaysRemaining();

    containers.forEach((el) => {
        const theme = el.dataset.theme || "dark";
        const style = el.dataset.style || "badge";

        switch (style) {
            case "banner":
                renderBanner(el, days, theme);
                break;
            case "minimal":
                renderMinimal(el, days);
                break;
            default:
                renderBadge(el, days, theme);
        }
    });
}

if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initCountdown);
    } else {
        initCountdown();
    }
}

export { initCountdown, getDaysRemaining };
