
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  TrendingUp, 
  TrendingDown,
  Circle
} from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeText?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

const StatsCard = ({
  title,
  value,
  change,
  changeText,
  icon,
  trend,
  className,
}: StatsCardProps) => {
  return (
    <div className={cn("stats-card", className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h4 className="text-2xl font-bold">{value}</h4>
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      
      {(change !== undefined || changeText) && (
        <div className="mt-4 flex items-center">
          {trend && (
            <span className={cn(
              "mr-1.5",
              trend === 'up' && "text-success",
              trend === 'down' && "text-danger",
              trend === 'neutral' && "text-warning"
            )}>
              {trend === 'up' && <TrendingUp size={16} />}
              {trend === 'down' && <TrendingDown size={16} />}
              {trend === 'neutral' && <Circle size={16} />}
            </span>
          )}
          {change !== undefined && (
            <span className={cn(
              "text-sm font-medium",
              trend === 'up' && "text-success",
              trend === 'down' && "text-danger",
              trend === 'neutral' && "text-warning"
            )}>
              {change > 0 && '+'}
              {change}%
            </span>
          )}
          {changeText && (
            <span className="text-sm text-muted-foreground ml-1">
              {changeText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatsCard;
