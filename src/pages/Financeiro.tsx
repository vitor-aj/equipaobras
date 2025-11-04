import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Eye, 
  Building2,
  Users,
  CheckCircle2,
  X,
  Clock,
  Calendar,
  AlertTriangle
} from "lucide-react";
import { ClientApprovalModal, ClienteAprovacao } from "@/components/financeiro/ClientApprovalModal";
import { useClientes } from "@/contexts/ClientesContext";
import { useToast } from "@/hooks/use-toast";

const Financeiro = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCliente, setSelectedCliente] = useState<ClienteAprovacao | null>(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const { clientes, approveClienteFinanceiro, rejectClienteFinanceiro } = useClientes();
  const { toast } = useToast();

  // Filtra apenas clientes pendentes de aprovação financeira
  const clientesPendentes = clientes.filter(c => c.statusFinanceiro === "pendente");

  const filteredClientes = clientesPendentes.filter(cliente =>
    (cliente.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
     cliente.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
     cliente.cnpj.includes(searchTerm))
  );

  const handleClientAction = (clienteId: string, observacoes: string, action: "aprovar" | "rejeitar") => {
    if (action === "aprovar") {
      approveClienteFinanceiro(clienteId, observacoes);
      toast({
        title: "Cliente Aprovado",
        description: "O cliente foi aprovado com sucesso pelo financeiro.",
      });
    } else {
      rejectClienteFinanceiro(clienteId, observacoes);
      toast({
        title: "Cliente Rejeitado",
        description: "O cliente foi rejeitado. O motivo foi registrado.",
        variant: "destructive",
      });
    }
    setShowClientModal(false);
    setSelectedCliente(null);
  };

  const pendingClientsCount = filteredClientes.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Aprovação de Clientes
          </h1>
          <p className="text-muted-foreground mt-1">
            Revisar e aprovar cadastros de novos clientes
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="px-3 py-2">
            <Clock className="h-4 w-4 mr-2" />
            {pendingClientsCount} Pendentes
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-custom-md border-border gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Pendentes Aprovação</p>
                <p className="text-xl font-bold text-foreground">{pendingClientsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-custom-md border-border gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Hoje Aprovados</p>
                <p className="text-xl font-bold text-foreground">5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-custom-md border-border gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <X className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Hoje Rejeitados</p>
                <p className="text-xl font-bold text-foreground">1</p>
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
              placeholder="Buscar clientes por ID, nome ou CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
        </CardContent>
      </Card>

      {/* Clientes List */}
      <div className="space-y-4">
        {filteredClientes.map((cliente) => (
          <Card key={cliente.id} className="shadow-custom-md border-border hover:shadow-custom-lg transition-fast gradient-card">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">
                        {cliente.nomeFantasia}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                          {cliente.id}
                        </Badge>
                        {cliente.analiseIA.status === "aprovado" && (
                          <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                            IA Aprovada
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2 truncate">
                      {cliente.cnpj} • {cliente.razaoSocial}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Cadastro: {new Date(cliente.dataCadastro).toLocaleDateString('pt-BR')}
                      </span>
                      {cliente.tipoFaturamento !== "propria-empresa" && (
                        <span className="flex items-center gap-1 text-amber-600">
                          <AlertTriangle className="h-3 w-3" />
                          Faturamento Especial
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2 w-full sm:w-auto"
                    onClick={() => {
                      setSelectedCliente(cliente);
                      setShowClientModal(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                    Analisar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClientes.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Nenhum cliente para aprovação
          </h3>
          <p className="text-muted-foreground">
            {searchTerm 
              ? "Tente ajustar sua busca." 
              : "Todos os clientes foram processados."}
          </p>
        </div>
      )}

      {/* Modal de Aprovação de Cliente */}
      <ClientApprovalModal
        isOpen={showClientModal}
        onClose={() => {
          setShowClientModal(false);
          setSelectedCliente(null);
        }}
        cliente={selectedCliente}
        onApprove={(clienteId, observacoes) => handleClientAction(clienteId, observacoes, "aprovar")}
        onReject={(clienteId, observacoes) => handleClientAction(clienteId, observacoes, "rejeitar")}
      />
    </div>
  );
};

export default Financeiro;