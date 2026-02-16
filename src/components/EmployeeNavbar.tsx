import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Package, LogOut, Store, User } from 'lucide-react';

export function EmployeeNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 gradient-hero border-b border-sidebar-border shadow-elevated">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-secondary" />
            <h1 className="text-lg font-display font-bold text-sidebar-foreground">
              M.S. <span className="text-secondary">Garments</span>
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/employee" end
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body text-sidebar-foreground/70 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-colors"
              activeClassName="text-sidebar-accent-foreground bg-sidebar-accent font-medium"
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </NavLink>
            <NavLink to="/employee/inventory"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body text-sidebar-foreground/70 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-colors"
              activeClassName="text-sidebar-accent-foreground bg-sidebar-accent font-medium"
            >
              <Package className="h-4 w-4" /> Inventory
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end gap-0.5">
            <div className="flex items-center gap-2 text-sm text-sidebar-foreground/80">
              <User className="h-4 w-4" />
              <span className="font-body font-medium">{user?.name}</span>
            </div>
            <span className="text-xs text-sidebar-foreground/60 capitalize">
              {user?.department} • {user?.employeeId}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
