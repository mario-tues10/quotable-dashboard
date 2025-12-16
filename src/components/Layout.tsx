import React from 'react';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  title: string;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  const { userEmail, logout } = useAuth();

  return (
    <div className="layout">
      <header className="layout-header">
        <h1>{title}</h1>
        <div className="layout-header-right">
          {userEmail && <span className="layout-user">{userEmail}</span>}
          <button className="btn-secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </header>
      <main className="layout-main">{children}</main>
    </div>
  );
};
