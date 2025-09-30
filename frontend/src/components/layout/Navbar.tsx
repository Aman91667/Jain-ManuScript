import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Menu, User } from 'lucide-react';
import ahimsaHand from '@/assets/ahimsa-hand.png';
import ThemeToggle from '@/components/common/ThemeToggle';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // ✅ CORRECTED: Change label to "Admin Dashboard" if the user is an admin
  const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/browse', label: 'Browse Manuscripts' },
  ...(isAuthenticated
    ? [{
        path: '/dashboard',
        label: user?.role === 'admin' ? 'Admin Dashboard' : 'Dashboard',
      }]
    : []),
];


  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={ahimsaHand} 
              alt="Ahimsa Hand" 
              className="h-8 w-8 ahimsa-hand"
            />
            <span className="font-serif text-xl font-semibold text-foreground">
               SHRUT GYAN KOSH
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`link-hover text-sm font-medium transition-colors ${
                  isActive(path) 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* User Menu and Theme Toggle */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {user?.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild variant="hero" size="sm">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
            
            {/* The ThemeToggle is intentionally placed outside of the conditional rendering */}
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;