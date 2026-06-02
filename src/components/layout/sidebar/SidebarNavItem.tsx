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
        "group w-full flex items-center rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden whitespace-nowrap",
        "py-3 px-3 lg:px-0 lg:justify-center lg:group-hover/sidebar:px-3 lg:group-hover/sidebar:justify-start",
        isActive
          ? 'bg-[var(--accent-orange-light)] text-[var(--accent-orange)]'
          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
      )}
      data-nav-item="true"
      data-active={isActive}
    >
      <div className={cn(
        "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200",
        isActive
          ? 'bg-[var(--accent-orange)] shadow-[var(--shadow-orange)]'
          : 'bg-[var(--bg-secondary)] group-hover:bg-[var(--accent-orange-light)]'
      )}>
        <item.icon className={cn(
          "h-4 w-4 transition-colors duration-200",
          isActive ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-[var(--accent-orange)]'
        )} />
      </div>
      <div className={cn(
        "overflow-hidden text-left ml-3 lg:ml-0 lg:group-hover/sidebar:ml-3 transition-all duration-200 lg:w-0 lg:group-hover/sidebar:w-auto",
        isSidebarOpen
          ? "opacity-100 w-auto"
          : "opacity-0 group-hover/sidebar:opacity-100 group-hover/sidebar:w-auto"
      )}>
        <div className={cn("font-semibold text-sm truncate", isActive ? 'text-[var(--accent-orange)]' : '')}>{item.name}</div>
        <div className={cn("text-xs truncate mt-0.5", isActive ? 'text-[var(--accent-orange)]/70' : 'text-[var(--text-muted)]')}>{item.description}</div>
      </div>

      {/* Tooltip for collapsed sidebar */}
      <div className="hidden lg:block lg:group-hover/sidebar:hidden absolute left-14 bg-[var(--bg-card)] text-[var(--text-primary)] text-xs px-2.5 py-1.5 rounded-lg shadow-[var(--shadow-md)] opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap border border-[var(--border-primary)]">
        {item.name}
      </div>
    </button>
  );
}
