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
  MinusCircle
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
      inscricaoEstadual: "123.456.789",
      cep: "01000-000",
      rua: "Rua das Obras",
      numero: "123",
      bairro: "Centro",
      cidade: "São Paulo",
      uf: "SP",
      email: "contato@abcconstrutora.com.br",
      telefone: "(11) 99999-8888",
      faturamentoTerceiros: false,
      status: "Liberado" as const
    },
    {
      id: "2", 
      nomeFantasia: "Obras & Cia",
      razaoSocial: "Obras e Companhia S.A.",
      cnpj: "98.765.432/0001-10",
      inscricaoEstadual: "987.654.321",
      cep: "01400-000",
      rua: "Av. dos Engenheiros",
      numero: "456",
      bairro: "Jardins",
      cidade: "São Paulo",
      uf: "SP",
      email: "obras@obrasecia.com.br",
      telefone: "(11) 88888-7777",
      faturamentoTerceiros: true,
      situacaoFaturamento: "Contrato entre as duas empresas",
      empresaFaturamento: "Empresa A Ltda",
      status: "Liberado" as const
    },
    {
      id: "3",
      nomeFantasia: "Edificações Norte",
      razaoSocial: "Norte Edificações Ltda ME",
      cnpj: "11.222.333/0001-44",
      inscricaoEstadual: "111.222.333",
      cep: "02000-000",
      rua: "Rua Norte",
      numero: "789",
      bairro: "Vila Nova",
      cidade: "São Paulo",
      uf: "SP",
      email: "contato@edificacoesnorte.com",
      telefone: "(11) 77777-6666",
      faturamentoTerceiros: false,
      status: "Bloqueado" as const
    },
    {
      id: "4",
      nomeFantasia: "Reforma Total",
      razaoSocial: "Reforma Total Construções Ltda",
      cnpj: "44.555.666/0001-77",
      inscricaoEstadual: "444.555.666",
      cep: "01200-000",
      rua: "Rua das Reformas",
      numero: "321",
      bairro: "Centro",
      cidade: "São Paulo",
      uf: "SP",
      email: "contato@reformatotal.com.br",
      telefone: "(11) 66666-5555",
      faturamentoTerceiros: false,
      status: "Inativo" as const
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
      Liberado: { variant: "default" as const, icon: CheckCircle, className: "bg-success/10 text-success border-success/20" },
      Bloqueado: { variant: "destructive" as const, icon: XCircle, className: "bg-destructive/10 text-destructive border-destructive/20" },
      Inativo: { variant: "secondary" as const, icon: MinusCircle, className: "bg-muted text-muted-foreground" },
      "Em aprovação": { variant: "secondary" as const, icon: MinusCircle, className: "bg-warning/10 text-warning border-warning/20" }
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

  const activeClientes = clientes.filter(c => c.status === "Liberado").length;
  const newClientes = Math.floor(clientes.length * 0.3); // Mock data

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestão de Clientes
          </h1>
          <p className="text-muted-foreground mt-1">
            Cadastre e gerencie informações dos clientes
          </p>
        </div>
        
        <Button 
          className="flex items-center gap-2 shadow-custom-md"
          onClick={() => {
            setEditingCliente(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-custom-md border-border gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Total de Clientes
                </p>
                <h3 className="text-2xl font-bold text-foreground mt-1">
                  {clientes.length}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-custom-md border-border gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-success/10 rounded-xl flex items-center justify-center">
                <Building className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Clientes Liberados
                </p>
                <h3 className="text-2xl font-bold text-foreground mt-1">
                  {activeClientes}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-custom-md border-border gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-warning/10 rounded-xl flex items-center justify-center">
                <Mail className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Novos Este Mês
                </p>
                <h3 className="text-2xl font-bold text-foreground mt-1">
                  {newClientes}
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

      {/* Clients Table */}
      <Card className="shadow-custom-md border-border">
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