import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Library, Upload, User, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';

export default function Layout({ children }) {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/library', icon: Library, label: 'Library' },
    { path: '/upload', icon: Upload, label: 'Upload' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];
  
  return (
    <div className="min-h-screen bg-black text-white">
      <style>{`
        :root {
          --background: 0 0% 0%;
          --foreground: 0 0% 100%;
          --card: 0 0% 7%;
          --card-foreground: 0 0% 100%;
          --popover: 0 0% 7%;
          --popover-foreground: 0 0% 100%;
          --primary: 120 100% 45%;
          --primary-foreground: 0 0% 0%;
          --secondary: 0 0% 14%;
          --secondary-foreground: 0 0% 100%;
          --muted: 0 0% 14%;
          --muted-foreground: 0 0% 64%;
          --accent: 0 0% 14%;
          --accent-foreground: 0 0% 100%;
          --destructive: 0 62% 30%;
          --destructive-foreground: 0 0% 100%;
          --border: 0 0% 20%;
          --input: 0 0% 20%;
          --ring: 120 100% 45%;
          --radius: 0.5rem;
        }
      `}</style>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:shadow-green-500/40 transition-shadow">
              <Radio className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">THIRTY ONE</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Records Radio</p>
            </div>
          </Link>
          
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navItems.map(({ path, label }) => (
                <NavigationMenuItem key={path}>
                  <Link to={path}>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        'text-sm font-medium transition bg-transparent',
                        isActive(path) 
                          ? 'text-green-500' 
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                      )}
                    >
                      {label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
              <Link to="/login">Log In</Link>
            </Button>
            <Button asChild size="sm" className="bg-green-500 hover:bg-green-600 text-black font-medium">
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="pt-16 pb-32">
        {children}
      </main>
      
      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950 border-t border-zinc-900">
        <div className="flex items-center justify-around h-16">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 transition',
                isActive(path) ? 'text-green-500' : 'text-zinc-400'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
