import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Scissors,
  Bell,
  Settings,
  Menu,
  X,
  Gift,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/clientes', label: 'Clientes', icon: Users },
  { href: '/prestations', label: 'Prestations', icon: Scissors },
  { href: '/fidelite', label: 'Fidélité', icon: Gift },
  { href: '/rappels', label: 'Rappels', icon: Bell },
  { href: '/campagnes', label: 'Campagnes', icon: MessageSquare },
  { href: '/parametres', label: 'Paramètres', icon: Settings },
];

function NavLink({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  const location = useLocation();
  const isActive = location.pathname === item.href;
  const Icon = item.icon;

  return (
    <Link
      to={item.href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
        'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        isActive && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{item.label}</span>
    </Link>
  );
}

function Sidebar({ className, onItemClick }: { className?: string; onItemClick?: () => void }) {
  return (
    <aside className={cn('flex flex-col h-full bg-sidebar', className)}>
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-sidebar-foreground leading-tight">LeaderBright</h1>
            <p className="text-xs text-muted-foreground">BeautyFlow</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} onClick={onItemClick} />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-muted-foreground text-center">
          © 2025 LeaderBright
        </p>
      </div>
    </aside>
  );
}

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 border-r border-border fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </div>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-card border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-foreground">BeautyFlow</span>
          </Link>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <Sidebar onItemClick={() => setMobileMenuOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        <div className="pt-16 lg:pt-0 min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
