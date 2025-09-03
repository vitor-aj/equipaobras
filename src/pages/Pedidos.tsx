import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PedidoDetailModal } from "@/components/pedidos/PedidoDetailModal";
import { 
  Plus, 
  Search, 
  FileText, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Filter
} from "lucide-react";

interface Pedido {
  id: string;
  cliente: string;
  valor: string;
  status: "Em Análise da IA" | "Análise do Faturista" | "Aprovado" | "Devolvido para Ajuste";
  data: string;
  observacoes?: string;
}

const Pedidos = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Mock data - seria conectado ao banco via Supabase
  const pedidos: Pedido[] = [
    {
      id: "PED-001",
      cliente: "Construtora ABC Ltda",
      valor: "R$ 45.890,00",
      status: "Em Análise da IA",
      data: "2024-01-15",
      observacoes: "Pedido urgente para obra do shopping"
    },
    {
      id: "PED-002", 
      cliente: "Obras & Cia",
      valor: "R$ 23.450,00",
      status: "Análise do Faturista",
      data: "2024-01-14"
    },
    {
      id: "PED-003",
      cliente: "Edificações Norte",
      valor: "R$ 67.230,00", 
      status: "Aprovado",
      data: "2024-01-13"
    },
    {
      id: "PED-004",
      cliente: "Reformas Sul",
      valor: "R$ 12.670,00",
      status: "Devolvido para Ajuste",
      data: "2024-01-12",
      observacoes: "Documentos em falta: Contrato Social atualizado"
    },
    {
      id: "PED-005",
      cliente: "Construtora ABC Ltda", 
      valor: "R$ 89.450,00",
      status: "Aprovado",
      data: "2024-01-10"
    }
  ];

  const filteredPedidos = pedidos.filter(pedido => {
    const matchesSearch = pedido.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pedido.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || pedido.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Em Análise da IA":
        return <Clock className="h-4 w-4" />;
      case "Análise do Faturista":
        return <AlertTriangle className="h-4 w-4" />;
      case "Aprovado":
        return <CheckCircle className="h-4 w-4" />;
      case "Devolvido para Ajuste":
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const statusCounts = {
    total: pedidos.length,
    analiseIA: pedidos.filter(p => p.status === "Em Análise da IA").length,
    analiseFaturista: pedidos.filter(p => p.status === "Análise do Faturista").length,
    aprovados: pedidos.filter(p => p.status === "Aprovado").length,
    devolvidos: pedidos.filter(p => p.status === "Devolvido para Ajuste").length
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestão de Pedidos
          </h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe o workflow de aprovação dos pedidos
          </p>
        </div>
        
        <Button className="flex items-center gap-2 shadow-custom-md" onClick={() => navigate("/pedidos/novo")}>
          <Plus className="h-4 w-4" />
          Novo Pedido
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="shadow-custom-md border-border gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Total</p>
                <p className="text-xl font-bold text-foreground">{statusCounts.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-custom-md border-border gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Análise IA</p>
                <p className="text-xl font-bold text-foreground">{statusCounts.analiseIA}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-custom-md border-border gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Faturista</p>
                <p className="text-xl font-bold text-foreground">{statusCounts.analiseFaturista}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-custom-md border-border gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Aprovados</p>
                <p className="text-xl font-bold text-foreground">{statusCounts.aprovados}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-custom-md border-border gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Devolvidos</p>
                <p className="text-xl font-bold text-foreground">{statusCounts.devolvidos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-custom-md border-border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar pedidos por ID ou cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="todos">Todos os Status</option>
                <option value="Em Análise da IA">Em Análise da IA</option>
                <option value="Análise do Faturista">Análise do Faturista</option>
                <option value="Aprovado">Aprovados</option>
                <option value="Devolvido para Ajuste">Devolvidos</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pedidos List */}
      <div className="space-y-4">
        {filteredPedidos.map((pedido) => (
          <Card key={pedido.id} className="shadow-custom-md border-border hover:shadow-custom-lg transition-fast gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {pedido.id}
                      </h3>
                      <span className="text-lg font-bold text-foreground">
                        {pedido.valor}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-1">
                      {pedido.cliente}
                    </p>
                    
                    <div className="flex items-center gap-3">
                      <span 
                        className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border font-medium ${getStatusColor(pedido.status)}`}
                      >
                        {getStatusIcon(pedido.status)}
                        {pedido.status}
                      </span>
                      
                      <span className="text-xs text-muted-foreground">
                        {new Date(pedido.data).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    
                    {pedido.observacoes && (
                      <p className="text-sm text-muted-foreground mt-2 italic">
                        "{pedido.observacoes}"
                      </p>
                    )}
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2 ml-4"
                  onClick={() => {
                    setSelectedPedido(pedido);
                    setIsDetailModalOpen(true);
                  }}
                >
                  <Eye className="h-4 w-4" />
                  Visualizar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPedidos.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Nenhum pedido encontrado
          </h3>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== "todos" 
              ? "Tente ajustar os filtros da sua busca ou crie um novo pedido." 
              : "Comece criando seu primeiro pedido de aprovação."}
          </p>
        </div>
      )}

      {/* Modal de Detalhes */}
      <PedidoDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedPedido(null);
        }}
        pedido={selectedPedido}
      />
    </div>
  );
};

export default Pedidos;