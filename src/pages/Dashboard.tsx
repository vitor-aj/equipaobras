import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  FileText, 
  Users, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  BarChart3
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Total de Pedidos",
      value: 247,
      subtitle: "Este mês",
      icon: <FileText className="h-6 w-6 text-primary" />,
      trend: { value: 12, isPositive: true }
    },
    {
      title: "Clientes Ativos",
      value: 89,
      subtitle: "Cadastrados",
      icon: <Users className="h-6 w-6 text-primary" />,
      trend: { value: 5, isPositive: true }
    },
    {
      title: "Em Análise",
      value: 23,
      subtitle: "Aguardando aprovação",
      icon: <Clock className="h-6 w-6 text-warning" />,
    },
    {
      title: "Aprovados",
      value: 184,
      subtitle: "Finalizados com sucesso",
      icon: <CheckCircle className="h-6 w-6 text-success" />,
      trend: { value: 8, isPositive: true }
    }
  ];

  const recentOrders = [
    {
      id: "PED-001",
      client: "Construtora ABC Ltda",
      value: "R$ 45.890,00"
    },
    {
      id: "PED-002", 
      client: "Obras & Cia",
      value: "R$ 23.450,00"
    },
    {
      id: "PED-003",
      client: "Edificações Norte",
      value: "R$ 67.230,00"
    },
    {
      id: "PED-004",
      client: "Reformas Sul",
      value: "R$ 12.670,00"
    },
    {
      id: "PED-005",
      client: "Construções Centro",
      value: "R$ 89.120,00"
    }
  ];

  const revenueData = [
    { month: "Jan", revenue: 145000 },
    { month: "Fev", revenue: 158000 },
    { month: "Mar", revenue: 172000 },
    { month: "Abr", revenue: 165000 },
    { month: "Mai", revenue: 189000 },
    { month: "Jun", revenue: 203000 },
    { month: "Jul", revenue: 195000 },
    { month: "Ago", revenue: 218000 },
    { month: "Set", revenue: 235000 }
  ];

  const chartConfig = {
    revenue: {
      label: "Receita",
      color: "hsl(var(--primary))"
    }
  };


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Visão geral dos pedidos e clientes
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm">Atualizado há 5 minutos</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimos Pedidos */}
        <Card className="shadow-custom-md border-border">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Últimos Pedidos
            </CardTitle>
            <CardDescription>
              Pedidos mais recentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div 
                  key={order.id} 
                  className="flex items-center justify-between p-3 border border-border rounded-lg bg-card/50 hover:bg-card transition-fast"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-foreground">
                        {order.id}
                      </h4>
                      <span className="text-sm font-medium text-foreground">
                        {order.value}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {order.client}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card className="shadow-custom-md border-border">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Receita Mensal
            </CardTitle>
            <CardDescription>
              Evolução da receita nos últimos meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="month" 
                    className="text-muted-foreground"
                    fontSize={12}
                  />
                  <YAxis 
                    className="text-muted-foreground"
                    fontSize={12}
                    tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                  />
                  <ChartTooltip 
                    content={
                      <ChartTooltipContent 
                        formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, "Receita"]}
                      />
                    }
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))" 
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;