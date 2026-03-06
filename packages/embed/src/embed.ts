const BASE_URL = "https://app.agentgate.io";

function initEmbeds() {
    const widgets = document.querySelectorAll<HTMLElement>("[data-agentgate-widget]");

    widgets.forEach((container) => {
        // Prevent double mounting
        if (container.dataset.mounted === "true") return;

        const type = container.dataset.agentgateWidget;
        const agentId = container.dataset.agentId;
        const apiKey = container.dataset.apiKey;
        const theme = container.dataset.theme || "dark";

        if (!agentId || !apiKey) {
            console.error("agentgate Embed: Missing data-agent-id or data-api-key");
            return;
        }

        const iframe = document.createElement("iframe");
        // We use pseudo-routes here that the Next.js dashboard will interpret for iframe layouts
        iframe.src = `${BASE_URL}/embed/${type}?agentId=${agentId}&apiKey=${apiKey}&theme=${theme}`;

        iframe.style.width = "100%";
        iframe.style.height = type === "audit-logs" ? "400px" : "300px";
        iframe.style.border = "none";
        iframe.style.borderRadius = "8px";
        iframe.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
        iframe.style.overflow = "hidden";

        container.appendChild(iframe);
        container.dataset.mounted = "true";
    });
}

// Auto-run on load
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEmbeds);
} else {
    initEmbeds();
}

// Expose to window for single page applications to re-trigger manually
(window as any).agentgateEmbeds = {
    init: initEmbeds
};
