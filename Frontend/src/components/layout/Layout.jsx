/**
 * Layout.jsx — SMOSP App Shell
 *
 * Props:
 *   role          'student' | 'cm' | 'admin'
 *   user          { name, avatarUrl? }
 *   breadcrumbs   [{ label, href? }]   — cuối mảng là trang hiện tại (no href)
 *   notifications [{ id, message, time, read? }]
 *   onLogoClick   fn
 *   onLogout      fn
 *   onGoHome      fn  — chỉ dùng cho student
 *   children      ReactNode
 */

import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logoSvg from '../../asset/logo.svg'
import './Layout.css'

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconBell = () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
)

const IconChevron = ({ open }) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms ease' }}>
        <polyline points="6 9 12 15 18 9" />
    </svg>
)

const IconHome = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
)

const IconLogout = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
)

const IconSettings = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
)

const IconUser = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
)

// ─── Sidebar config per role ───────────────────────────────────────────────────

const SIDEBAR_MENUS = {
    student: [
        {
            label: 'Tổng quan',
            items: [
                { label: 'Dashboard', href: '/student/dashboard' },
                { label: 'Hồ sơ cá nhân', href: '/student/profile' },
            ],
        },
        {
            label: 'Khám phá',
            items: [
                { label: 'Danh mục ngành', href: '/catalog' },
                { label: 'Gợi ý chuyên ngành', href: '/student/recommendation' },
            ],
        },
        {
            label: 'Học tập',
            items: [
                { label: 'Lộ trình học tập', href: '/student/roadmap' },
                { label: 'Phân tích chuyển ngành', href: '/student/transfer' },
                { label: 'Đánh giá Holland', href: '/student/holland' },
            ],
        },
    ],
    cm: [
        {
            label: 'Quản lý nội dung',
            items: [
                { label: 'Dashboard', href: '/cm/dashboard' },
                { label: 'Danh mục ngành học', href: '/cm/catalog' },
                { label: 'Kỹ năng & Sở thích', href: '/cm/skills' },
                { label: 'Ngân hàng câu hỏi', href: '/cm/questions' },
                { label: 'Chương trình học', href: '/cm/curriculum' },
            ],
        },
        {
            label: 'Dữ liệu tuyển dụng',
            items: [
                { label: 'Trending Weight', href: '/cm/trending-weight' },
                { label: 'Log crawl', href: '/cm/crawl-logs' },
            ],
        },
        {
            label: 'Thông báo',
            items: [
                { label: 'Báo cáo lỗi nội dung', href: '/cm/error-reports' },
            ],
        },
    ],
    admin: [
        {
            label: 'Hệ thống',
            items: [
                { label: 'Dashboard', href: '/admin/dashboard' },
                { label: 'Quản lý người dùng', href: '/admin/users' },
            ],
        },
        {
            label: 'Cấu hình',
            items: [
                { label: 'Cấu hình hệ thống', href: '/admin/system-config' },
                { label: 'Crawler & Adapter', href: '/admin/crawler' },
                { label: 'AI & Token Usage', href: '/admin/ai-config' },
                { label: 'Transcript Mapping', href: '/admin/transcript-preset' },
            ],
        },
    ],
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Layout({
    role = 'student',
    user = { name: 'Người dùng' },
    breadcrumbs = [],
    notifications = [],
    onLogoClick,
    onLogout,
    onGoHome,
    children,
}) {
    const [bellOpen, setBellOpen] = useState(false)
    const [avatarOpen, setAvatarOpen] = useState(false)
    const [notifList, setNotifList] = useState(notifications)

    const bellRef = useRef(null)
    const avatarRef = useRef(null)
    const location = useLocation()

    const unreadCount = notifList.filter((n) => !n.read).length

    useEffect(() => {
        const handler = (e) => {
            if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false)
            if (avatarRef.current && !avatarRef.current.contains(e.target)) setAvatarOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const markAllRead = () => setNotifList((prev) => prev.map((n) => ({ ...n, read: true })))
    const markRead = (id) => setNotifList((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n))

    const menus = SIDEBAR_MENUS[role] || SIDEBAR_MENUS.student

    const roleLabel = { student: 'Sinh viên', cm: 'Content Manager', admin: 'Quản trị viên' }[role]

    return (
        <div className="smosp-layout">

            {/* ── TOPBAR ── */}
            <header className="smosp-topbar">
                <button className="smosp-topbar-logo" onClick={onLogoClick} aria-label="SMOSP — về trang chủ">
                    <img src={logoSvg} alt="SMOSP" className="smosp-topbar-logo-img" />
                    <span className="smosp-topbar-logo-text">SMOSP</span>
                </button>

                <div className="smosp-topbar-right">

                    {/* Bell */}
                    <div className="smosp-topbar-bell-wrap" ref={bellRef}>
                        <button
                            className="smosp-topbar-icon-btn"
                            onClick={() => { setBellOpen((v) => !v); setAvatarOpen(false) }}
                            aria-label="Thông báo"
                            aria-expanded={bellOpen}
                        >
                            <IconBell />
                            {unreadCount > 0 && (
                                <span className="smosp-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                            )}
                        </button>

                        {bellOpen && (
                            <div className="smosp-notif-dropdown" role="dialog" aria-label="Danh sách thông báo">
                                <div className="smosp-notif-header">
                                    <span className="smosp-notif-title">Thông báo</span>
                                    {unreadCount > 0 && (
                                        <button className="smosp-notif-mark-all" onClick={markAllRead}>
                                            Đánh dấu tất cả đã đọc
                                        </button>
                                    )}
                                </div>
                                <div className="smosp-notif-list">
                                    {notifList.length === 0 ? (
                                        <div className="smosp-notif-empty">Không có thông báo nào</div>
                                    ) : (
                                        notifList.map((n) => (
                                            <div
                                                key={n.id}
                                                className={`smosp-notif-item${n.read ? '' : ' unread'}`}
                                                onClick={() => markRead(n.id)}
                                            >
                                                {!n.read && <span className="smosp-notif-dot" />}
                                                <div className="smosp-notif-body">
                                                    <p className="smosp-notif-msg">{n.message}</p>
                                                    <span className="smosp-notif-time">{n.time}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Avatar */}
                    <div className="smosp-topbar-avatar-wrap" ref={avatarRef}>
                        <button
                            className="smosp-topbar-avatar-btn"
                            onClick={() => { setAvatarOpen((v) => !v); setBellOpen(false) }}
                            aria-label={`Tài khoản: ${user.name}`}
                            aria-expanded={avatarOpen}
                        >
                            {user.avatarUrl
                                ? <img src={user.avatarUrl} alt={user.name} className="smosp-avatar-img" />
                                : <span className="smosp-avatar-initials">{user.name.charAt(0).toUpperCase()}</span>
                            }
                            <IconChevron open={avatarOpen} />
                        </button>

                        {avatarOpen && (
                            <div className="smosp-avatar-dropdown" role="menu">
                                <div className="smosp-avatar-dropdown-header">
                                    <div className="smosp-avatar-dropdown-avatar">
                                        {user.avatarUrl
                                            ? <img src={user.avatarUrl} alt={user.name} className="smosp-avatar-img" />
                                            : <span className="smosp-avatar-initials">{user.name.charAt(0).toUpperCase()}</span>
                                        }
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <p className="smosp-avatar-name">{user.name}</p>
                                        <p className="smosp-avatar-role">{roleLabel}</p>
                                    </div>
                                </div>
                                <div className="smosp-avatar-dropdown-divider" />
                                <Link to="/settings/account" className="smosp-avatar-menu-item" role="menuitem">
                                    <IconUser /> Tài khoản
                                </Link>
                                <Link to="/settings" className="smosp-avatar-menu-item" role="menuitem">
                                    <IconSettings /> Cài đặt
                                </Link>
                                <div className="smosp-avatar-dropdown-divider" />
                                <button className="smosp-avatar-menu-item danger" role="menuitem" onClick={onLogout}>
                                    <IconLogout /> Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* ── BODY ── */}
            <div className="smosp-body">

                {/* Sidebar */}
                <aside className="smosp-sidebar">
                    <nav className="smosp-sidebar-nav">
                        {menus.map((group) => (
                            <div key={group.label} className="smosp-sidebar-group">
                                <span className="smosp-sidebar-group-label">{group.label}</span>
                                {group.items.map((item) => (
                                    <Link
                                        key={item.href}
                                        to={item.href}
                                        className={`smosp-sidebar-item${location.pathname === item.href ? ' active' : ''}`}
                                    >
                                        <span className="smosp-sidebar-item-text">{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </nav>

                    <div className="smosp-sidebar-bottom">
                        {role === 'student' && (
                            <button className="smosp-sidebar-home-btn" onClick={onGoHome}>
                                <IconHome />
                                <span className="smosp-sidebar-home-btn-text">Về trang chủ</span>
                            </button>
                        )}
                        <button className="smosp-sidebar-logout-btn" onClick={onLogout}>
                            <IconLogout />
                            <span className="smosp-sidebar-logout-btn-text">Đăng xuất</span>
                        </button>
                    </div>
                </aside>

                {/* Main */}
                <main className="smosp-main">
                    {breadcrumbs.length > 0 && (
                        <nav className="smosp-breadcrumb" aria-label="Breadcrumb">
                            {breadcrumbs.map((crumb, idx) => (
                                <React.Fragment key={idx}>
                                    {idx > 0 && <span className="smosp-breadcrumb-sep">›</span>}
                                    {crumb.href && idx < breadcrumbs.length - 1
                                        ? <Link to={crumb.href} className="smosp-breadcrumb-link">{crumb.label}</Link>
                                        : <span className="smosp-breadcrumb-current">{crumb.label}</span>
                                    }
                                </React.Fragment>
                            ))}
                        </nav>
                    )}

                    <div className="smosp-content">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}

/* ── Usage ───────────────────────────────────────────────────────
 *
 * import Layout from '@/shared/components/Layout/Layout'
 *
 * <Layout
 *   role="student"
 *   user={{ name: 'Nguyễn Văn A' }}
 *   breadcrumbs={[
 *     { label: 'Dashboard', href: '/student/dashboard' },
 *     { label: 'Gợi ý chuyên ngành' },
 *   ]}
 *   notifications={[
 *     { id: '1', message: 'Lộ trình của bạn đã được cập nhật', time: '2 phút trước', read: false },
 *   ]}
 *   onLogoClick={() => navigate('/')}
 *   onLogout={() => { logout(); navigate('/login') }}
 *   onGoHome={() => navigate('/')}
 * >
 *   <YourPage />
 * </Layout>
 */