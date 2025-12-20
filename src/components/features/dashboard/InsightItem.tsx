import { LucideIcon } from 'lucide-react';
import React from 'react';

interface InsightItemProps {
    icon: LucideIcon;
    title: string;
    description: string;
    variant: 'green' | 'blue' | 'yellow' | 'purple' | 'red' | 'indigo';
}

export const InsightItem: React.FC<InsightItemProps> = ({ icon: Icon, title, description, variant }) => {
    
    // In the original file:
    // colors used: green, blue, yellow, purple.
    // The "Consistency Score" used 'indigo' but in a StatCard, not the insights list.
    // The insights list (lines 245-285) uses: green, blue, yellow, purple.
    
    const getColorVar = (v: string) => {
        switch (v) {
            case 'green': return 'var(--accent-green)';
            case 'blue': return 'var(--accent-blue)';
            case 'yellow': return 'var(--accent-yellow)';
            case 'purple': return 'var(--accent-purple)';
            default: return 'var(--text-primary)';
        }
    }
    
    const colorVar = getColorVar(variant);

    return (
        <div 
            className="flex items-start space-x-3 p-4 rounded-lg border transition-colors"
            style={{ 
                backgroundColor: `color-mix(in srgb, ${colorVar} 5%, transparent)`,
                borderColor: `color-mix(in srgb, ${colorVar} 20%, transparent)`
            }}
        >
            <div 
                className="p-1  bg-[var(--accent-green)]/10 rounded-full"
                style={{ backgroundColor: `color-mix(in srgb, ${colorVar} 10%, transparent)` }}
            >
                <Icon className="h-4 w-4 text-[var(--accent-green)]" style={{ color: colorVar }} />
            </div>
            <div>
                <p className="font-medium text-[var(--text-primary)]">{title}</p>
                <p className="text-sm text-[var(--text-secondary)]">{description}</p>
            </div>
        
        </div>
    );
};
