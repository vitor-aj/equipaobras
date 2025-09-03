import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  TrendingUp 
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
      value: "R$ 45.890,00",
      status: "Em Análise da IA",
      date: "Hoje, 14:30"
    },
    {
      id: "PED-002", 
      client: "Obras & Cia",
      value: "R$ 23.450,00",
      status: "Análise do Faturista",
      date: "Hoje, 11:15"
    },
    {
      id: "PED-003",
      client: "Edificações Norte",
      value: "R$ 67.230,00", 
      status: "Aprovado",
      date: "Ontem, 16:45"
    },
    {
      id: "PED-004",
      client: "Reformas Sul",
      value: "R$ 12.670,00",
      status: "Devolvido para Ajuste",
      date: "Ontem, 14:20"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em Análise da IA":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Análise do Faturista":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Aprovado":
        return "bg-green-50 text-green-700 border-green-200";
      case "Devolvido para Ajuste":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
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
        {/* Recent Orders */}
        <Card className="shadow-custom-md border-border">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Pedidos Recentes
            </CardTitle>
            <CardDescription>
              Últimos pedidos enviados para aprovação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div 
                  key={order.id} 
                  className="flex items-center justify-between p-4 border border-border rounded-lg bg-card/50 hover:bg-card transition-fast"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-foreground">
                        {order.id}
                      </h4>
                      <span className="text-sm font-medium text-foreground">
                        {order.value}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {order.client}
                    </p>
                    <div className="flex items-center justify-between">
                      <span 
                        className={`text-xs px-2 py-1 rounded-full border font-medium ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {order.date}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="shadow-custom-md border-border">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Status dos Pedidos
            </CardTitle>
            <CardDescription>
              Distribuição por etapa do workflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Em Análise da IA</span>
                </div>
                <span className="text-sm font-bold">23</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium">Análise do Faturista</span>
                </div>
                <span className="text-sm font-bold">15</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Aprovados</span>
                </div>
                <span className="text-sm font-bold">184</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">Devolvidos</span>
                </div>
                <span className="text-sm font-bold">9</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;