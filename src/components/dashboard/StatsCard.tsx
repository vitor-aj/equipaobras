interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({ title, value, subtitle, icon, trend }: StatsCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-custom-md p-6 gradient-card">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </p>
          <div className="mt-2">
            <h3 className="text-2xl font-bold text-foreground">
              {value}
            </h3>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">
                {subtitle}
              </p>
            )}
          </div>
          
          {trend && (
            <div className="flex items-center gap-1 mt-3">
              <span 
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  trend.isPositive 
                    ? 'bg-success/10 text-success' 
                    : 'bg-destructive/10 text-destructive'
                }`}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">
                vs. mês anterior
              </span>
            </div>
          )}
        </div>
        
        <div className="ml-4">
          <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}