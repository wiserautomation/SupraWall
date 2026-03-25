// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from "next/server";

/**
 * Serves the countdown widget JavaScript.
 * Embed with: <script src="https://www.supra-wall.com/api/widget/countdown.js" defer></script>
 */
export async function GET(_req: NextRequest) {
    const ENFORCEMENT_DATE = "2026-08-02T00:00:00Z";
    const BASE_URL = "https://www.supra-wall.com";

    const script = `(function(){
var E=new Date("${ENFORCEMENT_DATE}"),B="${BASE_URL}";
function d(){return Math.max(0,Math.ceil((E.getTime()-Date.now())/(864e5)))}
function c(n){return n>180?"#f59e0b":n>90?"#f97316":n>30?"#ef4444":"#dc2626"}
function b(el,n,t){var u=c(n),dk=t==="dark",bg=dk?"#111827":"#f9fafb",tx=dk?"#e5e7eb":"#1f2937",br=dk?"#1f2937":"#e5e7eb",lbl=n>0?"enforcement":"is now enforced";el.innerHTML='<a href="'+B+'/eu-ai-act?ref=countdown-widget" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:8px;padding:7px 14px;border-radius:8px;font-size:13px;line-height:1;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;text-decoration:none;background:'+bg+';color:'+tx+';border:1px solid '+br+';box-shadow:0 1px 3px rgba(0,0,0,.08);">⏰ '+(n>0?'<strong style="color:'+u+'">'+n.toLocaleString()+'</strong> days until EU AI Act '+lbl:'EU AI Act '+lbl)+'<svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" opacity="0.4"><path d="M2.5 7.5l5-5M7.5 7.5V2.5H2.5"/></svg></a>'}
function r(el,n,t){var u=c(n),dk=t==="dark";el.innerHTML='<div style="padding:16px 20px;border-radius:10px;background:'+(dk?"linear-gradient(135deg,#111827,#1f2937)":"linear-gradient(135deg,#f0fdf4,#ecfdf5)")+';color:'+(dk?"#f9fafb":"#1f2937")+';font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;display:flex;justify-content:space-between;align-items:center;border:1px solid '+(dk?"#1f2937":"#d1fae5")+';"><div><div style="font-size:36px;font-weight:800;color:'+u+';line-height:1">'+(n>0?n.toLocaleString():"0")+'</div><div style="font-size:12px;opacity:0.6;margin-top:3px">'+(n>0?"days until EU AI Act enforcement":"EU AI Act is now enforced")+' (Aug 2, 2026)</div></div><a href="'+B+'/eu-ai-act?ref=countdown-widget" target="_blank" rel="noopener noreferrer" style="padding:9px 18px;background:#10b981;color:white;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;">Check Compliance →</a></div>'}
function m(el,n){var u=c(n);el.innerHTML='<a href="'+B+'/eu-ai-act?ref=countdown-widget" target="_blank" rel="noopener noreferrer" style="font-family:-apple-system,sans-serif;font-size:13px;text-decoration:none;color:inherit;"><strong style="color:'+u+'">'+(n>0?n.toLocaleString()+" days":"Now enforced")+'</strong> until EU AI Act enforcement ↗</a>'}
function init(){var els=document.querySelectorAll("[data-suprawall-countdown]"),n=d();els.forEach(function(el){var t=el.dataset.theme||"dark",s=el.dataset.style||"badge";if(s==="banner")r(el,n,t);else if(s==="minimal")m(el,n);else b(el,n,t)})}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();`;

    return new NextResponse(script, {
        headers: {
            "Content-Type": "application/javascript",
            "Cache-Control": "public, max-age=86400, s-maxage=86400",
            "Access-Control-Allow-Origin": "*",
        },
    });
}
