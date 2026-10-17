"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ChevronDown, CreditCard, Menu, Phone, X } from "lucide-react";
import type { CTA, GlobalSettings } from "@/types/cms";

// Grace period before a hover-opened menu closes. Long enough to cross the
// small gap between trigger and panel without flicker, short enough that
// the menu doesn't linger after the pointer has clearly left.
const CLOSE_DELAY_MS = 140;

export function Header({ settings }: { settings: GlobalSettings }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const mobilePanelId = useId();

  // Any navigation closes the mobile sheet.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // While the mobile sheet is open: lock background scroll, close on Escape.
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        mobileButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  // Close the sheet if the viewport grows into the desktop layout.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1100px)");
    const onChange = () => query.matches && setMobileOpen(false);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const tel = `tel:${settings.phone.replace(/[^\d+]/g, "")}`;

  return (
    <header className="site-header">
      <div className="utility-bar">
        <div className="container utility-inner">
          <span>Locally owned waste collection, recycling, and rentals</span>
          <span className="utility-hours">{settings.businessHours}</span>
        </div>
      </div>
      <div className="header-main">
        <div className="container header-inner">
          <Link className="brand" href="/" aria-label="NDS Environmental Solutions home">
            <Image className="brand-logo" src="/nds-assets/nds-logo-primary.png" alt="" width={600} height={373} priority sizes="84px" />
          </Link>

          <DesktopNav items={settings.navigation} pathname={pathname} />

          <div className="header-actions">
            <a className="header-phone" href={tel}>
              <Phone size={17} aria-hidden />
              <span>{settings.phone}</span>
            </a>
            <Link className="btn btn-outline btn-sm" href="/contact">Get a Quote</Link>
            <Link className="btn btn-primary btn-sm" href="/make-a-payment">
              <CreditCard size={16} aria-hidden /> Pay Bill
            </Link>
          </div>

          <button
            aria-controls={mobilePanelId}
            aria-expanded={mobileOpen}
            className="menu-toggle"
            onClick={() => setMobileOpen((open) => !open)}
            ref={mobileButtonRef}
            type="button"
          >
            {mobileOpen ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
            <span>{mobileOpen ? "Close" : "Menu"}</span>
          </button>
        </div>
      </div>

      <MobileNav
        id={mobilePanelId}
        items={settings.navigation}
        onNavigate={() => setMobileOpen(false)}
        open={mobileOpen}
        pathname={pathname}
        phone={settings.phone}
        tel={tel}
      />
    </header>
  );
}

function isActive(item: CTA, pathname: string) {
  const paths = [item.href, ...(item.children ?? []).map((child) => child.href)].map((href) => href.split("#")[0]);
  return paths.some((path) => (path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`)));
}

function DesktopNav({ items, pathname }: { items: CTA[]; pathname: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const lastPointer = useRef<string>("");
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const cancelClose = () => window.clearTimeout(closeTimer.current);
  const close = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    setOpenIndex(null);
  }, []);

  // Route changes close any open menu.
  useEffect(() => close(), [pathname, close]);

  // Click/tap outside or Escape anywhere closes the open menu.
  useEffect(() => {
    if (openIndex === null) return;
    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) close();
    };
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        triggerRefs.current[openIndex]?.focus();
        close();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openIndex, close]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  // Hover only applies to real mouse pointers; touch and pen use tap.
  const onEnter = (index: number) => (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    cancelClose();
    setOpenIndex(index);
  };
  const onLeave = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpenIndex(null), CLOSE_DELAY_MS);
  };

  const focusLink = (index: number, which: "first" | "last") => {
    requestAnimationFrame(() => {
      const links = navRef.current?.querySelectorAll<HTMLAnchorElement>(`[data-menu="${index}"] a`);
      if (!links?.length) return;
      (which === "first" ? links[0] : links[links.length - 1]).focus();
    });
  };

  const onTriggerKey = (index: number) => (event: KeyboardEvent<HTMLButtonElement>) => {
    lastPointer.current = "keyboard";
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpenIndex(index);
      focusLink(index, "first");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpenIndex(index);
      focusLink(index, "last");
    } else if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const triggers = triggerRefs.current.filter(Boolean) as HTMLButtonElement[];
      const current = triggers.indexOf(event.currentTarget);
      const next = triggers[(current + (event.key === "ArrowRight" ? 1 : -1) + triggers.length) % triggers.length];
      next?.focus();
      if (openIndex !== null) setOpenIndex(Number(next?.dataset.index));
    }
  };

  const onMenuKey = (index: number) => (event: KeyboardEvent<HTMLDivElement>) => {
    const links = [...event.currentTarget.querySelectorAll<HTMLAnchorElement>("a")];
    const current = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      links[(current + step + links.length) % links.length]?.focus();
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      links[event.key === "Home" ? 0 : links.length - 1]?.focus();
    } else if (event.key === "Tab" && !event.shiftKey && current === links.length - 1) {
      close();
    } else if (event.key === "Tab" && event.shiftKey && current === 0) {
      event.preventDefault();
      triggerRefs.current[index]?.focus();
    }
  };

  return (
    <nav
      aria-label="Primary"
      className="desktop-nav"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) close();
      }}
      ref={navRef}
    >
      <ul className="desktop-nav-list">
        {items.map((item, index) => {
          const active = isActive(item, pathname);
          if (!item.children?.length) {
            return (
              <li key={item.href}>
                <Link aria-current={active ? "page" : undefined} className="nav-trigger" href={item.href}>{item.label}</Link>
              </li>
            );
          }
          const open = openIndex === index;
          const menuId = `nav-menu-${index}`;
          return (
            <li className="nav-item" key={item.href} onPointerEnter={onEnter(index)} onPointerLeave={onLeave}>
              <button
                aria-controls={menuId}
                aria-expanded={open}
                className={`nav-trigger${active ? " is-active" : ""}`}
                data-index={index}
                // A mouse already opened the menu on hover, so its click
                // keeps it open; touch, pen, and keyboard clicks toggle.
                onClick={() => setOpenIndex(lastPointer.current === "mouse" ? index : open ? null : index)}
                onKeyDown={onTriggerKey(index)}
                onPointerDown={(event) => {
                  lastPointer.current = event.pointerType;
                }}
                ref={(el) => {
                  triggerRefs.current[index] = el;
                }}
                type="button"
              >
                {item.label}
                <ChevronDown className="nav-caret" size={15} aria-hidden />
              </button>
              <div className="nav-panel" data-menu={index} hidden={!open} id={menuId} onKeyDown={onMenuKey(index)}>
                {item.description ? <p className="nav-panel-intro">{item.description}</p> : null}
                <ul className="nav-panel-links">
                  {item.children.map((child) => (
                    <li key={`${item.href}-${child.label}`}>
                      <Link aria-current={pathname === child.href ? "page" : undefined} href={child.href} onClick={close}>
                        <strong>{child.label}</strong>
                        {child.description ? <span>{child.description}</span> : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function MobileNav({
  id,
  items,
  onNavigate,
  open,
  pathname,
  phone,
  tel
}: {
  id: string;
  items: CTA[];
  onNavigate: () => void;
  open: boolean;
  pathname: string;
  phone: string;
  tel: string;
}) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Start each opening with the current section expanded and focus inside.
  useEffect(() => {
    if (!open) return;
    const current = items.findIndex((item) => item.children?.length && isActive(item, pathname));
    setExpanded(current >= 0 ? current : null);
    requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>("a, button")?.focus());
  }, [open, items, pathname]);

  return (
    <div className="mobile-nav" hidden={!open} id={id} ref={panelRef}>
      <nav aria-label="Mobile">
        <ul className="mobile-nav-list">
          {items.map((item, index) => {
            if (!item.children?.length) {
              return (
                <li key={item.href}>
                  <Link className="mobile-nav-link" href={item.href} onClick={onNavigate}>{item.label}</Link>
                </li>
              );
            }
            const isOpen = expanded === index;
            const groupId = `${id}-group-${index}`;
            return (
              <li key={item.href}>
                <button
                  aria-controls={groupId}
                  aria-expanded={isOpen}
                  className="mobile-nav-group"
                  onClick={() => setExpanded(isOpen ? null : index)}
                  type="button"
                >
                  {item.label}
                  <ChevronDown size={18} aria-hidden />
                </button>
                <ul className="mobile-nav-sub" hidden={!isOpen} id={groupId}>
                  {item.children.map((child) => (
                    <li key={`${item.href}-${child.label}`}>
                      <Link aria-current={pathname === child.href ? "page" : undefined} href={child.href} onClick={onNavigate}>
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mobile-nav-actions">
        <a className="btn btn-outline" href={tel}>
          <Phone size={17} aria-hidden /> Call {phone}
        </a>
        <Link className="btn btn-outline" href="/contact" onClick={onNavigate}>Get a Quote</Link>
        <Link className="btn btn-primary" href="/make-a-payment" onClick={onNavigate}>
          <CreditCard size={17} aria-hidden /> Pay Bill
        </Link>
      </div>
    </div>
  );
}
