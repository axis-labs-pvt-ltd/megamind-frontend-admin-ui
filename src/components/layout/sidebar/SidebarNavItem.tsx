import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface NavigationItem {
  name: string;
  page: string;
  icon: LucideIcon;
  description: string;
}

interface SidebarNavItemProps {
  item: NavigationItem;
  isActive: boolean;
  isSidebarOpen: boolean;
  onClick: (page: string) => void;
}

export function SidebarNavItem({ item, isActive, isSidebarOpen, onClick }: SidebarNavItemProps) {
  return (
    <button
      onClick={() => onClick(item.page)}
      className={cn(
        "group w-full flex items-center rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden whitespace-nowrap",
        "py-3.5 px-3 lg:px-0 lg:justify-center lg:group-hover/sidebar:px-3 lg:group-hover/sidebar:justify-start",
        isActive
          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
      )}
      data-nav-item="true"
      data-active={isActive}
    >
      <div className={cn(
        "p-2 rounded-lg transition-all duration-300 flex-shrink-0",
        isActive
          ? 'bg-[var(--text-primary)]/10'
          : 'bg-[var(--bg-secondary)] group-hover:bg-[var(--accent-blue-light)] group-hover:text-[var(--accent-blue)]'
      )}>
        <item.icon className={cn(
          "h-5 w-5 transition-colors duration-300",
          isActive ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-[var(--accent-blue)]'
        )} />
      </div>
      <div className={cn(
        "overflow-hidden text-left ml-4 lg:ml-0 lg:group-hover/sidebar:ml-4 transition-all duration-300 -translate-x-5 lg:w-0 lg:group-hover/sidebar:w-auto",
        isSidebarOpen 
          ? "opacity-100 translate-x-0 w-auto" 
          : "opacity-0 group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0 group-hover/sidebar:w-auto"
      )}>
        <div className="font-semibold truncate">
          {item.name}
        </div>
        <div className={cn(
          "text-xs truncate",
          isActive ? 'text-blue-100' : 'text-[var(--text-muted)]'
        )}>
          {item.description}
        </div>
      </div>
      
      {/* Tooltip for collapsed state */}
      <div className="hidden lg:block lg:group-hover/sidebar:hidden absolute left-14 bg-[var(--bg-card)] text-[var(--text-primary)] text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap">
        {item.name}
      </div>
    </button>
  );
}
