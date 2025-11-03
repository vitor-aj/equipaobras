import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  const [clientes, setClientes] = useState<Cliente[]>([
    {
      id: "1",
      nomeFantasia: "ABC Construtora",
      razaoSocial: "ABC Construtora Ltda",
      cnpj: "12.345.678/0001-90",
      inscricaoEstadual: "123.456.789.012",
      cep: "01000-000",
      rua: "Rua das Obras",
      numero: "123",
      bairro: "Centro",
      cidade: "São Paulo",
      uf: "SP",
      email: "contato@abcconstrutora.com.br",
      telefone: "(11) 99999-8888",
      tipoFaturamento: "propria-empresa",
      status: "Aprovado" as const
    },
    {
      id: "2", 
      nomeFantasia: "Obras & Cia",
      razaoSocial: "Obras e Companhia S.A.",
      cnpj: "98.765.432/0001-10",
      inscricaoEstadual: "987.654.321.098",
      cep: "01400-000",
      rua: "Av. dos Engenheiros",
      numero: "456",
      bairro: "Jardins",
      cidade: "São Paulo",
      uf: "SP",
      email: "obras@obrasecia.com.br",
      telefone: "(11) 88888-7777",
      tipoFaturamento: "contrato-obra",
      empresaFaturamento: "Empresa A Ltda",
      status: "Análise da IA" as const
    },
    {
      id: "3",
      nomeFantasia: "Edificações Norte",
      razaoSocial: "Norte Edificações Ltda ME",
      cnpj: "11.222.333/0001-44",
      inscricaoEstadual: "111.222.333.444",
      cep: "02000-000",
      rua: "Rua Norte",
      numero: "789",
      bairro: "Vila Nova",
      cidade: "São Paulo",
      uf: "SP",
      email: "contato@edificacoesnorte.com",
      telefone: "(11) 77777-6666",
      tipoFaturamento: "carta-autorizacao",
      status: "Reprovado" as const,
      motivoReprovacao: "Documentos com assinaturas ilegíveis. Por favor, reenvie com assinaturas claras."
    },
    {
      id: "4",
      nomeFantasia: "Reforma Total",
      razaoSocial: "Reforma Total Construções Ltda",
      cnpj: "44.555.666/0001-77",
      inscricaoEstadual: "444.555.666.777",
      cep: "01200-000",
      rua: "Rua das Reformas",
      numero: "321",
      bairro: "Centro",
      cidade: "São Paulo",
      uf: "SP",
      email: "contato@reformatotal.com.br",
      telefone: "(11) 66666-5555",
      tipoFaturamento: "mesmos-socios",
      status: "Aprovado" as const
    },
    {
      id: "5",
      nomeFantasia: "Mega Construções",
      razaoSocial: "Mega Construções e Incorporações S.A.",
      cnpj: "22.333.444/0001-55",
      inscricaoEstadual: "222.333.444.555",
      cep: "03000-000",
      rua: "Av. das Américas",
      numero: "1000",
      bairro: "Barra Funda",
      cidade: "São Paulo",
      uf: "SP",
      email: "contato@megaconstrucoes.com.br",
      telefone: "(11) 99999-1111",
      tipoFaturamento: "propria-empresa",
      status: "Análise da IA" as const
    },
    {
      id: "6",
      nomeFantasia: "Construtora Horizonte",
      razaoSocial: "Horizonte Engenharia e Construções Ltda",
      cnpj: "33.444.555/0001-66",
      inscricaoEstadual: "333.444.555.666",
      cep: "04000-000",
      rua: "Rua do Progresso",
      numero: "500",
      bairro: "Vila Mariana",
      cidade: "São Paulo",
      uf: "SP",
      email: "financeiro@horizonteconstrucoes.com.br",
      telefone: "(11) 98888-2222",
      tipoFaturamento: "contrato-obra",
      empresaFaturamento: "Empresa B S.A.",
      status: "Reprovado" as const,
      motivoReprovacao: "Contrato de obra sem data de vigência. Favor incluir período de validade."
    },
    {
      id: "7",
      nomeFantasia: "Obras Primas Ltda",
      razaoSocial: "Obras Primas Construções e Reformas Ltda",
      cnpj: "55.666.777/0001-88",
      inscricaoEstadual: "555.666.777.888",
      cep: "05000-000",
      rua: "Rua das Palmeiras",
      numero: "250",
      bairro: "Lapa",
      cidade: "São Paulo",
      uf: "SP",
      email: "obras@obrasprimas.com.br",
      telefone: "(11) 97777-3333",
      tipoFaturamento: "carta-autorizacao",
      empresaFaturamento: "Empresa C ME",
      status: "Aprovado" as const
    },
    {
      id: "8",
      nomeFantasia: "Steel Engenharia",
      razaoSocial: "Steel Engenharia e Construções S.A.",
      cnpj: "66.777.888/0001-99",
      inscricaoEstadual: "666.777.888.999",
      cep: "06000-000",
      rua: "Av. Industrial",
      numero: "1500",
      bairro: "Zona Leste",
      cidade: "São Paulo",
      uf: "SP",
      email: "contato@steeleng.com.br",
      telefone: "(11) 96666-4444",
      tipoFaturamento: "mesmos-socios",
      empresaFaturamento: "Steel Faturamento Ltda",
      status: "Análise da IA" as const
    },
    {
      id: "9",
      nomeFantasia: "Construtora Alfa",
      razaoSocial: "Alfa Construções e Empreendimentos Ltda",
      cnpj: "77.888.999/0001-00",
      inscricaoEstadual: "777.888.999.000",
      cep: "07000-000",
      rua: "Rua Alfa",
      numero: "777",
      bairro: "Jardim Paulista",
      cidade: "São Paulo",
      uf: "SP",
      email: "alfa@alfaconstrucoes.com.br",
      telefone: "(11) 95555-5555",
      tipoFaturamento: "propria-empresa",
      status: "Aprovado" as const
    },
    {
      id: "10",
      nomeFantasia: "Beta Reformas",
      razaoSocial: "Beta Reformas e Acabamentos Ltda",
      cnpj: "88.999.000/0001-11",
      inscricaoEstadual: "888.999.000.111",
      cep: "08000-000",
      rua: "Rua Beta",
      numero: "888",
      bairro: "Mooca",
      cidade: "São Paulo",
      uf: "SP",
      email: "contato@betareformas.com.br",
      telefone: "(11) 94444-6666",
      tipoFaturamento: "contrato-obra",
      empresaFaturamento: "Empresa D Ltda",
      status: "Reprovado" as const,
      motivoReprovacao: "Notas fiscais com valores divergentes do cadastro. Favor revisar e reenviar."
    }
  ]);

  const filteredClientes = clientes.filter(cliente =>
    cliente.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cnpj.includes(searchTerm) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveCliente = (clienteData: Cliente) => {
    if (clienteData.id) {
      setClientes(prev => prev.map(c => c.id === clienteData.id ? clienteData : c));
    } else {
      const newCliente = {
        ...clienteData,
        id: Date.now().toString(),
      };
      setClientes(prev => [...prev, newCliente]);
    }
    setEditingCliente(null);
  };

  const handleEditCliente = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setIsModalOpen(true);
  };

  const handleDeleteCliente = (id: string) => {
    setClientes(prev => prev.filter(c => c.id !== id));
  };

  const getStatusBadge = (status: Cliente["status"]) => {
    const variants = {
      "Análise da IA": { variant: "secondary" as const, icon: Clock, className: "bg-blue-50 text-blue-700 border-blue-200" },
      "Aprovado": { variant: "default" as const, icon: CheckCircle, className: "bg-success/10 text-success border-success/20" },
      "Reprovado": { variant: "destructive" as const, icon: XCircle, className: "bg-destructive/10 text-destructive border-destructive/20" }
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
            Cadastre e gerencie informações dos clientes
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
                  <TableCell className="font-mono text-sm">{cliente.cnpj}</TableCell>
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