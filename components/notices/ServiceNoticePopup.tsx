"use client";

import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ServiceNotice } from "@/types/cms";
import { shouldShowPopup, storePopupDismissal } from "@/lib/notices";

export function ServiceNoticePopup({ notice }: { notice: ServiceNotice }) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    storePopupDismissal(notice);
    setOpen(false);
  }, [notice]);

  useEffect(() => {
    const timer = window.setTimeout(() => setOpen(shouldShowPopup(notice)), notice.popup.delayMs);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && notice.popup.dismissible && !notice.popup.requiresAcknowledgment) close();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input:not([disabled])"));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus();
    };
  }, [close, open, notice.popup.dismissible, notice.popup.requiresAcknowledgment]);

  if (!open) return null;

  return (
    <div className="dialog-backdrop">
      <div aria-describedby="service-notice-popup-description" aria-labelledby="service-notice-popup-title" aria-modal="true" className="dialog" ref={dialogRef} role="dialog">
        <div className="dialog-header">
          <div>
            <span className="badge">{notice.priority}</span>
            <h2 className="stack-top-sm" id="service-notice-popup-title">{notice.popup.heading || notice.title}</h2>
          </div>
          {notice.popup.dismissible ? (
            <button aria-label="Close notice" className="tab" onClick={close} ref={closeButtonRef} type="button"><X size={18} /></button>
          ) : null}
        </div>
        <p id="service-notice-popup-description">{notice.popup.message || notice.summary}</p>
        <div className="button-row">
          {notice.popup.href ? <a className="btn primary" href={notice.popup.href}>{notice.popup.label || "View details"}</a> : null}
          {notice.popup.requiresAcknowledgment ? <button className="btn warning" onClick={close} type="button">{notice.popup.acknowledgmentLabel}</button> : null}
          {notice.popup.dismissible && !notice.popup.requiresAcknowledgment ? <button className="btn secondary" onClick={close} type="button">Dismiss</button> : null}
        </div>
      </div>
    </div>
  );
}
