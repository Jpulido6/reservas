import { useAppStore } from '../../core/store/app-store';
import { useAuthStore } from '../../core/store/auth-store';
import { Menu as MenuIcon, Moon as MoonIcon, Sun as SunIcon, User as UserIcon } from 'lucide-react';

export const Topbar = () => {
  const { theme, toggleTheme, toggleSidebar } = useAppStore();
  const { nombreCompleto, documento } = useAuthStore();

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-md text-secondary hover:bg-elevated hover:text-primary transition-colors"
        >
          <MenuIcon size={24} />
        </button>
        {/* Placeholder for Breadcrumbs if needed later */}
        <h2 className="text-lg font-semibold text-primary hidden md:block">
          Bienvenido, {nombreCompleto.split(' ')[0] || 'Usuario'}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-secondary hover:bg-elevated hover:text-primary transition-colors"
          title="Toggle theme"
        >
          {theme === 'dark' ? <SunIcon size={20} /> : <MoonIcon size={20} />}
        </button>

        <div className="flex items-center gap-3 border-l border-border pl-4">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-medium text-primary">{nombreCompleto || 'Usuario'}</span>
            <span className="text-xs text-secondary">{documento || 'admin'}</span>
          </div>
          <div className="h-9 w-9 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold">
            {nombreCompleto ? nombreCompleto.charAt(0).toUpperCase() : <UserIcon size={18} />}
          </div>
        </div>
      </div>
    </header>
  );
};
