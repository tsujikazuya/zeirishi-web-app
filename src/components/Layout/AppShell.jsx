import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, CheckSquare, Settings, LogOut, Menu } from 'lucide-react';
import './AppShell.css';

const NavItem = ({ to, icon: Icon, children }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `nav-item ${isActive ? 'active' : ''}`
        }
    >
        <Icon size={20} />
        <span className="nav-label">{children}</span>
    </NavLink>
);

export const AppShell = () => {
    return (
        <div className="app-shell">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo">
                        <span className="logo-icon">⚖️</span>
                        <span className="logo-text">TaxPartner</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <NavItem to="/" icon={LayoutDashboard}>ダッシュボード</NavItem>
                    <NavItem to="/clients" icon={Users}>顧問先一覧</NavItem>
                    <NavItem to="/tasks" icon={CheckSquare}>タスク管理</NavItem>
                    <NavItem to="/settings" icon={Settings}>設定</NavItem>
                </nav>

                <div className="sidebar-footer">
                    <button className="nav-item logout-btn">
                        <LogOut size={20} />
                        <span className="nav-label">ログアウト</span>
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <header className="top-bar">
                    <h2 className="page-title">ダッシュボード</h2> {/* TODO: Dynamic Title */}
                    <div className="user-profile">
                        <div className="avatar">AD</div>
                        <span className="username">Admin User</span>
                    </div>
                </header>
                <div className="page-body">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
