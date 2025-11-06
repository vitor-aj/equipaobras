import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { PedidoDetailModal } from "@/components/pedidos/PedidoDetailModal";
import { NovoPedidoModal } from "@/components/pedidos/NovoPedidoModal";
import { EditarPedidoModal } from "@/components/pedidos/EditarPedidoModal";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Search, 
  FileText, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Filter,
  Edit,
  Trash2
} from "lucide-react";

interface Pedido {
  id: string;
  cliente: string;
  valor: string;
  status: "Pedido Faturado" | "Pendente";
  data: string;
  observacoes?: string;
  notaFiscal?: string;
}

const Pedidos = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isNovoPedidoModalOpen, setIsNovoPedidoModalOpen] = useState(false);
  const [isEditarPedidoModalOpen, setIsEditarPedidoModalOpen] = useState(false);
  const [pedidos, setPedidos] = useState<Pedido[]>([
    {
      id: "PED-001",
      cliente: "Construtora ABC Ltda",
      valor: "R$ 45.890,00",
      status: "Pendente",
      data: "2024-01-15",
      observacoes: "Pedido urgente para obra do shopping"
    },
    {
      id: "PED-002", 
      cliente: "Obras & Cia",
      valor: "R$ 23.450,00",
      status: "Pendente",
      data: "2024-01-14"
    },
    {
      id: "PED-003",
      cliente: "Edificações Norte",
      valor: "R$ 67.230,00", 
      status: "Pedido Faturado",
      data: "2024-01-13",
      notaFiscal: "123456789"
    },
    {
      id: "PED-004",
      cliente: "Reformas Sul",
      valor: "R$ 12.670,00",
      status: "Pendente",
      data: "2024-01-12",
      observacoes: "Documentos em falta: Contrato Social atualizado"
    },
    {
      id: "PED-005",
      cliente: "Construtora ABC Ltda", 
      valor: "R$ 89.450,00",
      status: "Pedido Faturado",
      data: "2024-01-10",
      notaFiscal: "987654321"
    }
  ]);

  const filteredPedidos = pedidos.filter(pedido => {
    const matchesSearch = pedido.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pedido.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || pedido.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Pedido["status"]) => {
    const variants = {
      "Pendente": { variant: "secondary" as const, icon: Clock, className: "bg-orange-500/10 text-orange-700 border-orange-500/20" },
      "Pedido Faturado": { variant: "default" as const, icon: CheckCircle, className: "bg-success/10 text-success border-success/20" }
    };
    
    const config = variants[status];
    const Icon = config.icon;
    
    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const handleEditPedido = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setIsEditarPedidoModalOpen(true);
  };

  const handleUpdatePedido = (pedidoId: string, data: { clienteId: string; valor: string; observacoes: string; cliente: string }) => {
    setPedidos(prev => 
      prev.map(pedido => 
        pedido.id === pedidoId 
          ? { ...pedido, cliente: data.cliente, valor: data.valor, observacoes: data.observacoes }
          : pedido
      )
    );
  };

  const handleDeletePedido = (id: string) => {
    setPedidos(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Pedido Excluído",
      description: "O pedido foi excluído com sucesso.",
    });
  };

  const handleNovoPedido = (data: { clienteId: string; valor: string; observacoes: string; cliente: string }) => {
    const novoPedido: Pedido = {
      id: `PED-${String(Date.now()).slice(-3)}`,
      cliente: data.cliente,
      valor: data.valor,
      status: "Pendente",
      data: new Date().toISOString().split('T')[0],
      observacoes: data.observacoes || undefined
    };

    setPedidos(prev => [novoPedido, ...prev]);
  };

  const handleUpdateStatus = (pedidoId: string, novoStatus: "Pedido Faturado" | "Pendente", notaFiscal: string) => {
    setPedidos(prev => 
      prev.map(pedido => 
        pedido.id === pedidoId 
          ? { ...pedido, status: novoStatus, notaFiscal }
          : pedido
      )
    );
  };

  const statusCounts = {
    total: pedidos.length,
    pendentes: pedidos.filter(p => p.status === "Pendente").length,
    concluidos: pedidos.filter(p => p.status === "Pedido Faturado").length
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Gestão de Pedidos
          </h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe o workflow de aprovação dos pedidos
          </p>
        </div>
        
        <Button className="flex items-center gap-2 shadow-custom-md w-full sm:w-auto" onClick={() => setIsNovoPedidoModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Novo Pedido
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Pendentes</p>
                <p className="text-xl font-bold text-foreground">{statusCounts.pendentes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-custom-md border-border gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Faturados</p>
                <p className="text-xl font-bold text-foreground">{statusCounts.concluidos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-custom-md border-border">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
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
                className="h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring w-full sm:w-auto"
              >
                <option value="todos">Todos os Status</option>
                <option value="Pendente">Pendentes</option>
                <option value="Pedido Faturado">Faturados</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Pedidos - Desktop */}
      <Card className="shadow-custom-md border-border hidden lg:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número do Pedido</TableHead>
                <TableHead>Data do Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor do Pedido</TableHead>
                <TableHead>Status do Pedido</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPedidos.map((pedido) => (
                <TableRow key={pedido.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-semibold">{pedido.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(pedido.data).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>{pedido.cliente}</TableCell>
                  <TableCell className="font-semibold">{pedido.valor}</TableCell>
                  <TableCell>
                    {getStatusBadge(pedido.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          setSelectedPedido(pedido);
                          setIsDetailModalOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleEditPedido(pedido)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o pedido "{pedido.id}"? 
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeletePedido(pedido.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pedidos Cards - Mobile */}
      <div className="space-y-4 lg:hidden">
        {filteredPedidos.map((pedido) => (
          <Card key={pedido.id} className="shadow-custom-md border-border">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground">{pedido.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(pedido.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                {getStatusBadge(pedido.status)}
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Cliente:</span> {pedido.cliente}
                </p>
                <p className="text-lg font-semibold text-foreground">
                  {pedido.valor}
                </p>
                {pedido.observacoes && (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Observações:</span> {pedido.observacoes}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    setSelectedPedido(pedido);
                    setIsDetailModalOpen(true);
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalhes
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleEditPedido(pedido)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="px-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="mx-4 max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir o pedido "{pedido.id}"? 
                        Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                      <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDeletePedido(pedido.id)}
                        className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
        onUpdateStatus={handleUpdateStatus}
        pedido={selectedPedido}
      />

      {/* Modal de Novo Pedido */}
      <NovoPedidoModal
        isOpen={isNovoPedidoModalOpen}
        onClose={() => setIsNovoPedidoModalOpen(false)}
        onSubmit={handleNovoPedido}
      />

      {/* Modal de Editar Pedido */}
      <EditarPedidoModal
        isOpen={isEditarPedidoModalOpen}
        onClose={() => {
          setIsEditarPedidoModalOpen(false);
          setSelectedPedido(null);
        }}
        onSubmit={handleUpdatePedido}
        pedido={selectedPedido}
      />
    </div>
  );
};

export default Pedidos;