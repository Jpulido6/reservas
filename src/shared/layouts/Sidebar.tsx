import { NavLink } from 'react-router';
import { useAppStore } from '../../core/store/app-store';
import { useAuthStore } from '../../core/store/auth-store';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  ShieldCheck, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { cn } from '../utils/cn';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/reservas', label: 'Reservas', icon: CalendarDays },
  { path: '/usuarios', label: 'Usuarios', icon: Users },
  { path: '/seguridad', label: 'Seguridad', icon: ShieldCheck },
  { path: '/configuracion', label: 'Configuración', icon: Settings },
];

export const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useAppStore();
  const { logout } = useAuthStore();

  return (
    <aside 
      className={cn(
        "bg-surface border-border flex h-screen flex-col border-r transition-all duration-300 relative",
        isSidebarOpen ? "w-64" : "w-20"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        {isSidebarOpen ? (
          <span className="text-xl font-bold text-primary truncate">ReservasApp</span>
        ) : (
          <span className="text-xl font-bold text-primary mx-auto">RA</span>
        )}
        <button 
          onClick={toggleSidebar}
          className="p-1 rounded-full hover:bg-elevated transition-colors absolute -right-3 top-5 border border-border bg-surface text-secondary hover:text-primary z-10"
        >
          {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      <nav className="flex-1 py-4 flex flex-col gap-2 px-3 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
              isActive 
                ? "bg-accent/10 text-accent font-medium" 
                : "text-secondary hover:bg-elevated hover:text-primary"
            )}
          >
            <item.icon size={20} className="shrink-0" />
            {isSidebarOpen && (
              <span className="truncate">{item.label}</span>
            )}
            
            {/* Tooltip for collapsed state */}
            {!isSidebarOpen && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-elevated border border-border text-primary text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <button 
          onClick={() => logout()}
          className={cn(
            "flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-danger hover:bg-danger/10 transition-colors group",
            !isSidebarOpen && "justify-center"
          )}
        >
          <LogOut size={20} className="shrink-0" />
          {isSidebarOpen && <span>Cerrar sesión</span>}
          
          {!isSidebarOpen && (
            <div className="absolute left-full ml-4 px-2 py-1 bg-elevated border border-border text-danger text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
              Cerrar sesión
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
