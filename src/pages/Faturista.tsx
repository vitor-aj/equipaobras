import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  FileText, 
  Eye, 
  Check, 
  X,
  AlertTriangle,
  Clock,
  MessageSquare,
  Building2,
  DollarSign,
  Calendar
} from "lucide-react";

interface PedidoFaturista {
  id: string;
  cliente: string;
  valor: string;
  status: "Análise do Faturista" | "Aprovado" | "Devolvido para Ajuste";
  data: string;
  observacoes?: string;
  prioridade: "alta" | "normal" | "baixa";
  tempoAnalise?: string;
}

const Faturista = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPedido, setSelectedPedido] = useState<PedidoFaturista | null>(null);
  const [actionType, setActionType] = useState<"aprovar" | "devolver" | null>(null);
  const [observacoes, setObservacoes] = useState("");

  // Mock data - seria conectado ao banco via Supabase
  const pedidos: PedidoFaturista[] = [
    {
      id: "PED-001",
      cliente: "Construtora ABC Ltda",
      valor: "R$ 45.890,00",
      status: "Análise do Faturista",
      data: "2024-01-15",
      prioridade: "alta",
      tempoAnalise: "2h 30min",
      observacoes: "Pedido urgente para obra do shopping"
    },
    {
      id: "PED-002", 
      cliente: "Obras & Cia",
      valor: "R$ 23.450,00",
      status: "Análise do Faturista",
      data: "2024-01-14",
      prioridade: "normal",
      tempoAnalise: "1h 45min"
    },
    {
      id: "PED-006",
      cliente: "Construtora Norte",
      valor: "R$ 78.900,00",
      status: "Análise do Faturista", 
      data: "2024-01-16",
      prioridade: "alta",
      tempoAnalise: "30min"
    },
    {
      id: "PED-007",
      cliente: "Reformas Express",
      valor: "R$ 15.600,00",
      status: "Análise do Faturista",
      data: "2024-01-13",
      prioridade: "baixa",
      tempoAnalise: "4h 15min"
    }
  ];

  const filteredPedidos = pedidos.filter(pedido => 
    pedido.status === "Análise do Faturista" &&
    (pedido.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
     pedido.cliente.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case "alta":
        return "bg-red-100 text-red-800 border-red-200";
      case "normal":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "baixa":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleAction = (pedido: PedidoFaturista, type: "aprovar" | "devolver") => {
    setSelectedPedido(pedido);
    setActionType(type);
    setObservacoes(type === "devolver" ? "" : "Pedido aprovado pelo faturista");
  };

  const confirmarAcao = () => {
    if (!selectedPedido || !actionType) return;
    
    // Aqui seria feita a integração com o backend
    console.log(`${actionType === "aprovar" ? "Aprovando" : "Devolvendo"} pedido ${selectedPedido.id}`);
    console.log("Observações:", observacoes);
    
    // Reset
    setSelectedPedido(null);
    setActionType(null);
    setObservacoes("");
  };

  const cancelarAcao = () => {
    setSelectedPedido(null);
    setActionType(null);
    setObservacoes("");
  };

  const pendingCount = filteredPedidos.length;
  const highPriorityCount = filteredPedidos.filter(p => p.prioridade === "alta").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Análise de Faturista
          </h1>
          <p className="text-muted-foreground mt-1">
            Revisar e aprovar pedidos validados pela IA
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="px-3 py-2">
            <Clock className="h-4 w-4 mr-2" />
            {pendingCount} Pendentes
          </Badge>
          {highPriorityCount > 0 && (
            <Badge variant="destructive" className="px-3 py-2">
              <AlertTriangle className="h-4 w-4 mr-2" />
              {highPriorityCount} Urgentes
            </Badge>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-custom-md border-border gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Pendentes</p>
                <p className="text-xl font-bold text-foreground">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-custom-md border-border gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Alta Prioridade</p>
                <p className="text-xl font-bold text-foreground">{highPriorityCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-custom-md border-border gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Check className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Hoje Aprovados</p>
                <p className="text-xl font-bold text-foreground">8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-custom-md border-border gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <X className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Hoje Devolvidos</p>
                <p className="text-xl font-bold text-foreground">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="shadow-custom-md border-border">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar pedidos por ID ou cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11"
            />
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
                      <Badge className={`text-xs px-2 py-1 rounded-full border font-medium ${getPriorityColor(pedido.prioridade)}`}>
                        {pedido.prioridade.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {pedido.cliente}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(pedido.data).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Aguardando há {pedido.tempoAnalise}
                      </span>
                    </div>
                    
                    {pedido.observacoes && (
                      <p className="text-sm text-muted-foreground mt-2 italic">
                        "{pedido.observacoes}"
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Visualizar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleAction(pedido, "devolver")}
                  >
                    <X className="h-4 w-4" />
                    Devolver
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    onClick={() => handleAction(pedido, "aprovar")}
                  >
                    <Check className="h-4 w-4" />
                    Aprovar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPedidos.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Nenhum pedido para análise
          </h3>
          <p className="text-muted-foreground">
            {searchTerm 
              ? "Tente ajustar sua busca." 
              : "Todos os pedidos foram processados."}
          </p>
        </div>
      )}

      {/* Modal de Confirmação de Ação */}
      {selectedPedido && actionType && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border border-border rounded-lg p-6 max-w-md w-full mx-4 shadow-custom-lg">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {actionType === "aprovar" ? "Aprovar Pedido" : "Devolver Pedido"}
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{selectedPedido.id}</span>
                </div>
                <p className="text-sm text-muted-foreground">{selectedPedido.cliente}</p>
                <p className="text-sm font-medium text-foreground">{selectedPedido.valor}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {actionType === "aprovar" ? "Observações (opcional)" : "Motivo da devolução *"}
                </label>
                <Textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder={actionType === "aprovar" 
                    ? "Adicione observações sobre a aprovação..." 
                    : "Descreva o motivo da devolução..."}
                  className="min-h-20"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={cancelarAcao} className="flex-1">
                Cancelar
              </Button>
              <Button 
                onClick={confirmarAcao}
                className={actionType === "aprovar" 
                  ? "flex-1 bg-green-600 hover:bg-green-700" 
                  : "flex-1 bg-red-600 hover:bg-red-700"}
                disabled={actionType === "devolver" && !observacoes.trim()}
              >
                {actionType === "aprovar" ? "Aprovar" : "Devolver"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Faturista;