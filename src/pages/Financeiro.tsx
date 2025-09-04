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

const Financeiro = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCliente, setSelectedCliente] = useState<ClienteAprovacao | null>(null);
  const [showClientModal, setShowClientModal] = useState(false);

  // Mock data para clientes pendentes de aprovação
  const clientesPendentes: ClienteAprovacao[] = [
    {
      id: "CLI-001",
      nomeFantasia: "Tech Solutions Ltda",
      razaoSocial: "Tech Solutions Tecnologia Ltda",
      cnpj: "12.345.678/0001-90",
      inscricaoEstadual: "123.456.789.012",
      email: "contato@techsolutions.com",
      telefone: "(11) 99999-8888",
      endereco: {
        cep: "01234-567",
        rua: "Rua das Tecnologias",
        numero: "123",
        bairro: "Centro",
        cidade: "São Paulo",
        uf: "SP"
      },
      faturamentoTerceiros: false,
      dataCadastro: "2024-01-15",
      anexos: {
        contratoSocial: "contrato_social_tech.pdf",
        cartaoCnpj: "cartao_cnpj_tech.pdf",
        notaFiscal1: "nf_001_tech.pdf",
        notaFiscal2: "nf_002_tech.pdf",
        notaFiscal3: "nf_003_tech.pdf"
      },
      analiseIA: {
        status: "aprovado",
        observacoes: "Todos os documentos estão em conformidade. CNPJ ativo na Receita Federal, inscrição estadual válida, notas fiscais com numeração sequencial e sem divergências. Empresa regularizada junto aos órgãos competentes.",
        dataAnalise: "2024-01-15T10:30:00",
        pontosAnalisados: [
          "CNPJ válido e ativo na Receita Federal",
          "Inscrição Estadual conferida e aprovada",
          "Contrato social atualizado e registrado",
          "Notas fiscais em ordem sequencial",
          "Dados cadastrais consistentes",
          "Documentos em formato adequado e legíveis"
        ]
      },
      statusFinanceiro: "pendente"
    },
    {
      id: "CLI-002", 
      nomeFantasia: "Construções ABC",
      razaoSocial: "ABC Construções e Engenharia Ltda",
      cnpj: "98.765.432/0001-10",
      inscricaoEstadual: "987.654.321.001",
      email: "financeiro@construcoesabc.com",
      telefone: "(11) 88888-7777",
      endereco: {
        cep: "04567-890",
        rua: "Av. das Construções",
        numero: "456",
        bairro: "Industrial",
        cidade: "São Paulo", 
        uf: "SP"
      },
      faturamentoTerceiros: true,
      situacaoFaturamento: "Contrato entre as duas empresas",
      empresaFaturamento: "Empresa A Ltda",
      dataCadastro: "2024-01-14",
      anexos: {
        contratoSocial: "contrato_social_abc.pdf",
        cartaoCnpj: "cartao_cnpj_abc.pdf", 
        notaFiscal1: "nf_001_abc.pdf",
        notaFiscal2: "nf_002_abc.pdf",
        notaFiscal3: "nf_003_abc.pdf",
        autorizacaoTerceiros: "autorizacao_terceiros_abc.pdf"
      },
      analiseIA: {
        status: "aprovado",
        observacoes: "Documentação completa incluindo autorização para faturamento de terceiros. Todas as validações foram aprovadas com sucesso.",
        dataAnalise: "2024-01-14T14:20:00",
        pontosAnalisados: [
          "CNPJ válido e situação regular",
          "Autorização de terceiros válida e assinada",
          "Contrato entre empresas devidamente formalizado",
          "Notas fiscais regulares",
          "Inscrição estadual ativa"
        ]
      },
      statusFinanceiro: "pendente"
    }
  ];

  const filteredClientes = clientesPendentes.filter(cliente =>
    cliente.statusFinanceiro === "pendente" &&
    (cliente.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
     cliente.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
     cliente.cnpj.includes(searchTerm))
  );

  const handleClientAction = (clienteId: string, observacoes: string, action: "aprovar" | "rejeitar") => {
    console.log(`${action === "aprovar" ? "Aprovando" : "Rejeitando"} cliente ${clienteId}`);
    console.log("Observações:", observacoes);
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
                      {cliente.faturamentoTerceiros && (
                        <span className="flex items-center gap-1 text-amber-600">
                          <AlertTriangle className="h-3 w-3" />
                          Faturamento Terceiros
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