import { LayoutDashboard, Package, ShoppingCart, LogOut, Store, TrendingUp } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const navItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Products', url: '/admin/products', icon: Package },
  { title: 'Orders', url: '/admin/orders', icon: ShoppingCart },
  { title: 'Predictions', url: '/admin/predictions', icon: TrendingUp },
];

export function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="w-64 min-h-screen gradient-hero flex flex-col border-r border-sidebar-border">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <Store className="h-6 w-6 text-secondary" />
          <h1 className="text-xl font-display font-bold text-sidebar-foreground">
            M.S. <span className="text-secondary">Garments</span>
          </h1>
        </div>
        <p className="text-xs text-sidebar-foreground/60 mt-1 font-body">Admin Panel • Wholesale</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            end={item.url === '/admin'}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      {/* Shop Info */}
      <div className="px-4 pb-2">
        <div className="p-3 rounded-lg bg-sidebar-accent/50 text-xs text-sidebar-foreground/60 font-body space-y-1">
          <p className="font-medium text-sidebar-foreground/80">📍 M.S. Garments</p>
          <p>24/181, PTS Complex, 1st Floor</p>
          <p>Sai Southern (opp) Brinda Street</p>
          <p>Erode - 638 001</p>
          <p className="mt-1">📞 96778-05533 / 86088-85389</p>
        </div>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent font-body"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
