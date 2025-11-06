import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useClientes } from "@/contexts/ClientesContext";
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
import { 
  Plus, 
  Search, 
  Users, 
  Edit, 
  Trash2, 
  Building, 
  Mail, 
  CheckCircle,
  XCircle,
  MinusCircle,
  Clock,
  Eye,
  AlertTriangle
} from "lucide-react";
import { ClientModal, Cliente } from "@/components/clientes/ClientModal";

const Clientes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const { clientes, addCliente, updateCliente, deleteCliente } = useClientes();

  const filteredClientes = clientes.filter(cliente =>
    cliente.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cnpj.includes(searchTerm) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveCliente = (clienteData: Cliente) => {
    if (clienteData.id) {
      // Para atualização, convertemos Cliente para ClienteAprovacao mantendo campos existentes
      const clienteExistente = clientes.find(c => c.id === clienteData.id);
      if (clienteExistente) {
        const clienteAtualizado = {
          ...clienteExistente,
          nomeFantasia: clienteData.nomeFantasia,
          razaoSocial: clienteData.razaoSocial,
          cnpj: clienteData.cnpj,
          inscricaoEstadual: clienteData.inscricaoEstadual,
          email: clienteData.email,
          telefone: clienteData.telefone,
          endereco: {
            cep: clienteData.cep,
            rua: clienteData.rua,
            numero: clienteData.numero,
            bairro: clienteData.bairro,
            cidade: clienteData.cidade,
            uf: clienteData.uf,
          },
          tipoFaturamento: clienteData.tipoFaturamento || "propria-empresa",
          empresaFaturamento: clienteData.empresaFaturamento,
          status: clienteData.status,
          motivoReprovacao: clienteData.motivoReprovacao,
        };
        updateCliente(clienteAtualizado);
      }
    } else {
      addCliente(clienteData);
    }
    setEditingCliente(null);
  };

  const handleEditCliente = (clienteAprovacao: any) => {
    // Converter ClienteAprovacao para Cliente
    const clienteEdit: Cliente = {
      id: clienteAprovacao.id,
      nomeFantasia: clienteAprovacao.nomeFantasia,
      razaoSocial: clienteAprovacao.razaoSocial,
      cnpj: clienteAprovacao.cnpj,
      inscricaoEstadual: clienteAprovacao.inscricaoEstadual,
      email: clienteAprovacao.email,
      telefone: clienteAprovacao.telefone,
      cep: clienteAprovacao.endereco.cep,
      rua: clienteAprovacao.endereco.rua,
      numero: clienteAprovacao.endereco.numero,
      bairro: clienteAprovacao.endereco.bairro,
      cidade: clienteAprovacao.endereco.cidade,
      uf: clienteAprovacao.endereco.uf,
      tipoFaturamento: clienteAprovacao.tipoFaturamento,
      empresaFaturamento: clienteAprovacao.empresaFaturamento,
      status: clienteAprovacao.status,
      motivoReprovacao: clienteAprovacao.motivoReprovacao,
    };
    setEditingCliente(clienteEdit);
    setIsModalOpen(true);
  };

  const handleDeleteCliente = (id: string) => {
    deleteCliente(id);
  };

  const getStatusBadge = (status: Cliente["status"]) => {
    const variants = {
      "Análise da IA": { variant: "secondary" as const, icon: Clock, className: "bg-blue-50 text-blue-700 border-blue-200 whitespace-nowrap text-xs px-2.5 py-1" },
      "Aprovado": { variant: "default" as const, icon: CheckCircle, className: "bg-success/10 text-success border-success/20 whitespace-nowrap text-xs px-2.5 py-1" },
      "Reprovado": { variant: "destructive" as const, icon: XCircle, className: "bg-destructive/10 text-destructive border-destructive/20 whitespace-nowrap text-xs px-2.5 py-1" }
    };
    
    const config = variants[status];
    const Icon = config.icon;
    
    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1 flex-shrink-0" />
        <span>{status}</span>
      </Badge>
    );
  };

  const clientesAnaliseIA = clientes.filter(c => c.status === "Análise da IA").length;
  const clientesReprovados = clientes.filter(c => c.status === "Reprovado").length;
  const clientesAprovados = clientes.filter(c => c.status === "Aprovado").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Gestão de Clientes
          </h1>
          <p className="text-muted-foreground mt-1">
            Analise de cadastro de clientes
          </p>
        </div>
        
        <Button 
          className="flex items-center gap-2 shadow-custom-md w-full sm:w-auto"
          onClick={() => {
            setEditingCliente(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          <span className="sm:inline">Novo Cliente</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        <Card className="shadow-custom-md border-border gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Análise da IA
                </p>
                <h3 className="text-2xl font-bold text-foreground mt-1">
                  {clientesAnaliseIA}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-custom-md border-border gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-destructive/10 rounded-xl flex items-center justify-center">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Clientes Reprovados
                </p>
                <h3 className="text-2xl font-bold text-foreground mt-1">
                  {clientesReprovados}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-custom-md border-border gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-success/10 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Clientes Aprovados
                </p>
                <h3 className="text-2xl font-bold text-foreground mt-1">
                  {clientesAprovados}
                </h3>
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
              placeholder="Buscar clientes por nome fantasia, razão social, CNPJ ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
        </CardContent>
      </Card>

      {/* Clients Table - Desktop */}
      <Card className="shadow-custom-md border-border hidden lg:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome Fantasia</TableHead>
                <TableHead>Razão Social</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Building className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{cliente.nomeFantasia}</p>
                        <p className="text-xs text-muted-foreground">{cliente.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{cliente.razaoSocial}</TableCell>
                  <TableCell className="font-mono text-sm whitespace-nowrap">{cliente.cnpj}</TableCell>
                  <TableCell>
                    {getStatusBadge(cliente.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      {cliente.status === "Reprovado" && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-blue-600 hover:text-blue-600 hover:bg-blue-50"
                          onClick={() => handleEditCliente(cliente)}
                          title="Visualizar detalhes e corrigir"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleEditCliente(cliente)}
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
                              Tem certeza que deseja excluir o cliente "{cliente.nomeFantasia}"? 
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteCliente(cliente.id!)}
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

      {/* Clients Cards - Mobile */}
      <div className="space-y-4 lg:hidden">
        {filteredClientes.map((cliente) => (
          <Card key={cliente.id} className="shadow-custom-md border-border">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground truncate">{cliente.nomeFantasia}</h3>
                    <p className="text-sm text-muted-foreground truncate">{cliente.email}</p>
                  </div>
                </div>
                {getStatusBadge(cliente.status)}
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Razão Social:</span> {cliente.razaoSocial}
                </p>
                <p className="text-sm text-muted-foreground font-mono">
                  <span className="font-medium font-sans">CNPJ:</span> {cliente.cnpj}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {cliente.status === "Reprovado" && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-blue-600 hover:text-blue-600 hover:bg-blue-50"
                    onClick={() => handleEditCliente(cliente)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Visualizar
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleEditCliente(cliente)}
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
                        Tem certeza que deseja excluir o cliente "{cliente.nomeFantasia}"? 
                        Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                      <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDeleteCliente(cliente.id!)}
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

      {filteredClientes.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Nenhum cliente encontrado
          </h3>
          <p className="text-muted-foreground">
            Tente ajustar os termos da sua busca ou cadastre um novo cliente.
          </p>
        </div>
      )}

      {/* Modal */}
      <ClientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCliente(null);
        }}
        onSave={handleSaveCliente}
        cliente={editingCliente}
      />
    </div>
  );
};

export default Clientes;