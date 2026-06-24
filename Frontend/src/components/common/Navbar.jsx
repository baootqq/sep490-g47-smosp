/**
 * Navbar.jsx — SMOSP Design System
 *
 * Navbar màu blue #034EA2 — KHÔNG thay đổi.
 * Logo dot màu cam #F37021.
 * Active link màu cam #F37021.
 * CTA button màu cam #F37021.
 *
 * Props:
 *   logo         string
 *   links        array  — [{ label, href, active?, onClick? }]
 *   ctaLabel     string
 *   onCtaClick   fn
 *   user         object — { name, avatarUrl? }
 *   onLogoClick  fn
 */

import React, { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import logoSvg from '../../asset/logo.svg'

/* ── CSS ─────────────────────────────────────────────────── */

const NAVBAR_CSS = `
  .smosp-navbar {
    position: sticky;
    top: 0;
    z-index: 50;
    height: 64px;
    background: #034EA2;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 2px 16px rgba(3, 78, 162, 0.25);
  }
  .smosp-nav-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 48px;
    height: 100%;
    display: flex;
    align-items: center;
    gap: 32px;
  }
  .smosp-logo {
    display: flex;
    align-items: flex-end;
    gap: 3px;
    font-size: 20px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.02em;
    flex-shrink: 0;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font-family: 'Be Vietnam Pro', sans-serif;
  }
  .smosp-logo-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #F37021;
    margin-bottom: 4px;
    flex-shrink: 0;
  }
  .smosp-nav-links {
    display: flex;
    gap: 4px;
    flex: 1;
  }
  .smosp-nav-link {
    color: rgba(255, 255, 255, 0.72);
    font-size: 14px;
    font-weight: 500;
    padding: 6px 14px;
    border-radius: 6px;
    background: none;
    border: none;
    transition: background 150ms ease, color 150ms ease;
    white-space: nowrap;
    cursor: pointer;
    text-decoration: none;
    font-family: 'Be Vietnam Pro', sans-serif;
    line-height: 1;
  }
  .smosp-nav-link:hover {
    background: rgba(255, 255, 255, 0.10);
    color: #fff;
  }
  .smosp-nav-link.active {
    color: #F37021;
    font-weight: 700;
  }
  .smosp-nav-cta {
    background: #F37021;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    height: 38px;
    padding: 0 20px;
    border: none;
    border-radius: 10px;
    transition: background 150ms ease, transform 150ms ease;
    flex-shrink: 0;
    cursor: pointer;
    font-family: 'Be Vietnam Pro', sans-serif;
    white-space: nowrap;
  }
  .smosp-nav-cta:hover {
    background: #D4580A;
    transform: translateY(-1px);
  }
  .smosp-nav-cta:active {
    transform: translateY(0);
  }
  /* Avatar */
  .smosp-nav-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1.5px solid rgba(255, 255, 255, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.15);
  }
  /* Hamburger */
  .smosp-hamburger {
    display: none;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    cursor: pointer;
    color: #fff;
    transition: background 150ms ease;
  }
  .smosp-hamburger:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  /* Mobile menu */
  .smosp-mobile-menu {
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    background: #034EA2;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    padding: 12px 0 16px;
    display: flex;
    flex-direction: column;
    z-index: 49;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
  .smosp-mobile-link {
    font-family: 'Be Vietnam Pro', sans-serif;
    font-size: 15px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.85);
    text-decoration: none;
    padding: 12px 20px;
    border: none;
    background: none;
    cursor: pointer;
    text-align: left;
    transition: background 150ms ease, color 150ms ease;
  }
  .smosp-mobile-link:hover,
  .smosp-mobile-link.active {
    background: rgba(255, 255, 255, 0.10);
    color: #fff;
  }
  @media (max-width: 768px) {
    .smosp-nav-links { display: none !important; }
    .smosp-hamburger { display: flex !important; }
    .smosp-nav-inner { padding: 0 16px; }
  }
  @media (min-width: 769px) {
    .smosp-mobile-menu { display: none !important; }
  }
`

/* ── Component ───────────────────────────────────────────── */

export default function Navbar({
  logo = '',
  links = [],
  ctaLabel = 'Bắt Đầu',
  onCtaClick,
  user = null,
  onLogoClick,
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 769) setMenuOpen(false) }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e) => {
      if (!e.target.closest('.smosp-navbar')) setMenuOpen(false)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [menuOpen])

  return (
    <>
      <style>{NAVBAR_CSS}</style>
      <nav className="smosp-navbar" style={{ position: 'sticky' }}>
        <div className="smosp-nav-inner">

          {/* Logo */}
          <button
            className="smosp-logo"
            onClick={onLogoClick}
            aria-label={`${logo} — về trang chủ`}
          >
            {logo}
            <span className="smosp-logo-dot" aria-hidden="true" />
          </button>

          {/* Desktop links */}
          <div className="smosp-nav-links" role="navigation" aria-label="Điều hướng chính">
            {links.map((link) => (
              <a
                key={link.href || link.label}
                href={link.href || '#'}
                onClick={link.onClick}
                className={`smosp-nav-link${link.active ? ' active' : ''}`}
                aria-current={link.active ? 'page' : undefined}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right area */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>

            {/* Avatar */}
            {user && (
              <div
                className="smosp-nav-avatar"
                aria-label={`Tài khoản: ${user.name}`}
                title={user.name}
                style={user.avatarUrl ? { backgroundImage: `url(${user.avatarUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
              >
                {!user.avatarUrl && (
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            )}

            {/* CTA */}
            {!user && (
              <button className="smosp-nav-cta" onClick={onCtaClick}>
                {ctaLabel}
              </button>
            )}

            {/* Hamburger */}
            <button
              className="smosp-hamburger"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={menuOpen}
              aria-controls="smosp-mobile-nav"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav id="smosp-mobile-nav" className="smosp-mobile-menu" aria-label="Điều hướng mobile">
            {links.map((link) => (
              <a
                key={link.href || link.label}
                href={link.href || '#'}
                onClick={(e) => { link.onClick?.(e); setMenuOpen(false) }}
                className={`smosp-mobile-link${link.active ? ' active' : ''}`}
                aria-current={link.active ? 'page' : undefined}
              >
                {link.label}
              </a>
            ))}
            {!user && (
              <div style={{ padding: '8px 20px 0' }}>
                <button
                  className="smosp-nav-cta"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => { onCtaClick?.(); setMenuOpen(false) }}
                >
                  {ctaLabel}
                </button>
              </div>
            )}
          </nav>
        )}
      </nav>
    </>
  )
}

/* ── Usage Examples ─────────────────────────────────────────
 *
 * import Navbar from '@/shared/components/Navbar'
 *
 * const NAV_LINKS = [
 *   { label: 'Khám Phá Ngành', href: '/explore', active: true },
 *   { label: 'Đánh Giá Holland', href: '/assessment' },
 *   { label: 'Lộ Trình Kỹ Năng', href: '/roadmap' },
 *   { label: 'So Sánh Ngành', href: '/compare' },
 * ]
 *
 * // Chưa đăng nhập
 * <Navbar
 *   logo=""
 *   links={NAV_LINKS}
 *   ctaLabel="Bắt Đầu"
 *   onCtaClick={() => navigate('/register')}
 *   onLogoClick={() => navigate('/')}
 * />
 *
 * // Đã đăng nhập
 * <Navbar
 *   logo=""
 *   links={NAV_LINKS}
 *   user={{ name: 'Nguyễn Văn A' }}
 *   onLogoClick={() => navigate('/')}
 * />
 */