import { createContext, useContext, useState, ReactNode } from "react";
import { Cliente } from "@/components/clientes/ClientModal";

export interface ClienteAprovacao {
  id: string;
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  inscricaoEstadual: string;
  email: string;
  telefone: string;
  endereco: {
    cep: string;
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    uf: string;
  };
  tipoFaturamento: string;
  empresaFaturamento?: string;
  dataCadastro: string;
  anexos: {
    contratoSocial?: string;
    cartaoCnpj?: string;
    notaFiscal1?: string;
    notaFiscal2?: string;
    notaFiscal3?: string;
    autorizacaoTerceiros?: string;
  };
  analiseIA: {
    status: "aprovado" | "pendente" | "rejeitado";
    observacoes: string;
    dataAnalise?: string;
    pontosAnalisados: string[];
  };
  statusFinanceiro: "pendente" | "aprovado" | "rejeitado";
  status: "Aprovado" | "Análise da IA" | "Reprovado";
  motivoReprovacao?: string;
}

interface ClientesContextData {
  clientes: ClienteAprovacao[];
  addCliente: (cliente: Cliente) => void;
  updateCliente: (cliente: ClienteAprovacao) => void;
  deleteCliente: (id: string) => void;
  approveClienteFinanceiro: (clienteId: string, observacoes: string) => void;
  rejectClienteFinanceiro: (clienteId: string, observacoes: string) => void;
}

const ClientesContext = createContext<ClientesContextData>({} as ClientesContextData);

export const useClientes = () => {
  const context = useContext(ClientesContext);
  if (!context) {
    throw new Error("useClientes must be used within ClientesProvider");
  }
  return context;
};

interface ClientesProviderProps {
  children: ReactNode;
}

export const ClientesProvider = ({ children }: ClientesProviderProps) => {
  const [clientes, setClientes] = useState<ClienteAprovacao[]>([
    {
      id: "1",
      nomeFantasia: "ABC Construtora",
      razaoSocial: "ABC Construtora Ltda",
      cnpj: "12.345.678/0001-90",
      inscricaoEstadual: "123.456.789.012",
      email: "contato@abcconstrutora.com.br",
      telefone: "(11) 99999-8888",
      endereco: {
        cep: "01000-000",
        rua: "Rua das Obras",
        numero: "123",
        bairro: "Centro",
        cidade: "São Paulo",
        uf: "SP",
      },
      tipoFaturamento: "propria-empresa",
      dataCadastro: "2024-01-10",
      anexos: {
        contratoSocial: "contrato_social_abc.pdf",
        cartaoCnpj: "cartao_cnpj_abc.pdf",
        notaFiscal1: "nf_001_abc.pdf",
        notaFiscal2: "nf_002_abc.pdf",
        notaFiscal3: "nf_003_abc.pdf",
      },
      analiseIA: {
        status: "aprovado",
        observacoes: "Todos os documentos estão em conformidade.",
        dataAnalise: "2024-01-10T10:00:00",
        pontosAnalisados: [
          "CNPJ válido e ativo",
          "Documentos em ordem",
          "Notas fiscais regulares"
        ],
      },
      statusFinanceiro: "aprovado",
      status: "Aprovado",
    },
    {
      id: "2",
      nomeFantasia: "Obras & Cia",
      razaoSocial: "Obras e Companhia S.A.",
      cnpj: "98.765.432/0001-10",
      inscricaoEstadual: "987.654.321.098",
      email: "obras@obrasecia.com.br",
      telefone: "(11) 88888-7777",
      endereco: {
        cep: "01400-000",
        rua: "Av. dos Engenheiros",
        numero: "456",
        bairro: "Jardins",
        cidade: "São Paulo",
        uf: "SP",
      },
      tipoFaturamento: "contrato-obra",
      empresaFaturamento: "Empresa A Ltda",
      dataCadastro: "2024-01-14",
      anexos: {
        contratoSocial: "contrato_social_obras.pdf",
        cartaoCnpj: "cartao_cnpj_obras.pdf",
        notaFiscal1: "nf_001_obras.pdf",
        notaFiscal2: "nf_002_obras.pdf",
        notaFiscal3: "nf_003_obras.pdf",
        autorizacaoTerceiros: "autorizacao_terceiros.pdf",
      },
      analiseIA: {
        status: "pendente",
        observacoes: "Documentação completa incluindo autorização para faturamento de terceiros. Aguardando análise do financeiro.",
        pontosAnalisados: [
          "CNPJ válido e situação regular",
          "Autorização de terceiros válida",
          "Contrato entre empresas formalizado",
          "Notas fiscais regulares"
        ],
      },
      statusFinanceiro: "pendente",
      status: "Análise da IA",
    },
    {
      id: "3",
      nomeFantasia: "Edificações Norte",
      razaoSocial: "Norte Edificações Ltda ME",
      cnpj: "11.222.333/0001-44",
      inscricaoEstadual: "111.222.333.444",
      email: "contato@edificacoesnorte.com",
      telefone: "(11) 77777-6666",
      endereco: {
        cep: "02000-000",
        rua: "Rua Norte",
        numero: "789",
        bairro: "Vila Nova",
        cidade: "São Paulo",
        uf: "SP",
      },
      tipoFaturamento: "carta-autorizacao",
      dataCadastro: "2024-01-12",
      anexos: {
        contratoSocial: "contrato_social_norte.pdf",
        cartaoCnpj: "cartao_cnpj_norte.pdf",
        notaFiscal1: "nf_001_norte.pdf",
        notaFiscal2: "nf_002_norte.pdf",
        notaFiscal3: "nf_003_norte.pdf",
      },
      analiseIA: {
        status: "rejeitado",
        observacoes: "Documentos com assinaturas ilegíveis.",
        dataAnalise: "2024-01-12T16:30:00",
        pontosAnalisados: [
          "CNPJ válido",
          "Documentos com problemas de legibilidade"
        ],
      },
      statusFinanceiro: "rejeitado",
      status: "Reprovado",
      motivoReprovacao: "Documentos com assinaturas ilegíveis. Por favor, reenvie com assinaturas claras.",
    },
    {
      id: "4",
      nomeFantasia: "Reforma Total",
      razaoSocial: "Reforma Total Construções Ltda",
      cnpj: "44.555.666/0001-77",
      inscricaoEstadual: "444.555.666.777",
      email: "contato@reformatotal.com.br",
      telefone: "(11) 66666-5555",
      endereco: {
        cep: "01200-000",
        rua: "Rua das Reformas",
        numero: "321",
        bairro: "Centro",
        cidade: "São Paulo",
        uf: "SP",
      },
      tipoFaturamento: "mesmos-socios",
      dataCadastro: "2024-01-11",
      anexos: {
        contratoSocial: "contrato_social_reforma.pdf",
        cartaoCnpj: "cartao_cnpj_reforma.pdf",
        notaFiscal1: "nf_001_reforma.pdf",
        notaFiscal2: "nf_002_reforma.pdf",
        notaFiscal3: "nf_003_reforma.pdf",
      },
      analiseIA: {
        status: "aprovado",
        observacoes: "Empresa com sócios em comum devidamente verificados.",
        dataAnalise: "2024-01-11T11:00:00",
        pontosAnalisados: [
          "CNPJ válido",
          "Sócios em comum verificados",
          "Documentação regular"
        ],
      },
      statusFinanceiro: "aprovado",
      status: "Aprovado",
    },
    {
      id: "5",
      nomeFantasia: "Mega Construções",
      razaoSocial: "Mega Construções e Incorporações S.A.",
      cnpj: "22.333.444/0001-55",
      inscricaoEstadual: "222.333.444.555",
      email: "contato@megaconstrucoes.com.br",
      telefone: "(11) 99999-1111",
      endereco: {
        cep: "03000-000",
        rua: "Av. das Américas",
        numero: "1000",
        bairro: "Barra Funda",
        cidade: "São Paulo",
        uf: "SP",
      },
      tipoFaturamento: "propria-empresa",
      dataCadastro: "2024-01-15",
      anexos: {
        contratoSocial: "contrato_social_mega.pdf",
        cartaoCnpj: "cartao_cnpj_mega.pdf",
        notaFiscal1: "nf_001_mega.pdf",
        notaFiscal2: "nf_002_mega.pdf",
        notaFiscal3: "nf_003_mega.pdf",
      },
      analiseIA: {
        status: "pendente",
        observacoes: "Documentação completa e em ordem. Aguardando análise do financeiro.",
        pontosAnalisados: [
          "CNPJ ativo",
          "Documentos válidos",
          "Notas fiscais regulares"
        ],
      },
      statusFinanceiro: "pendente",
      status: "Análise da IA",
    },
    {
      id: "6",
      nomeFantasia: "Construtora Horizonte",
      razaoSocial: "Horizonte Engenharia e Construções Ltda",
      cnpj: "33.444.555/0001-66",
      inscricaoEstadual: "333.444.555.666",
      email: "financeiro@horizonteconstrucoes.com.br",
      telefone: "(11) 98888-2222",
      endereco: {
        cep: "04000-000",
        rua: "Rua do Progresso",
        numero: "500",
        bairro: "Vila Mariana",
        cidade: "São Paulo",
        uf: "SP",
      },
      tipoFaturamento: "contrato-obra",
      empresaFaturamento: "Empresa B S.A.",
      dataCadastro: "2024-01-13",
      anexos: {
        contratoSocial: "contrato_social_horizonte.pdf",
        cartaoCnpj: "cartao_cnpj_horizonte.pdf",
        notaFiscal1: "nf_001_horizonte.pdf",
        notaFiscal2: "nf_002_horizonte.pdf",
        notaFiscal3: "nf_003_horizonte.pdf",
      },
      analiseIA: {
        status: "rejeitado",
        observacoes: "Contrato de obra sem data de vigência.",
        dataAnalise: "2024-01-13T15:00:00",
        pontosAnalisados: [
          "CNPJ válido",
          "Contrato sem período de validade"
        ],
      },
      statusFinanceiro: "rejeitado",
      status: "Reprovado",
      motivoReprovacao: "Contrato de obra sem data de vigência. Favor incluir período de validade.",
    },
    {
      id: "7",
      nomeFantasia: "Obras Primas Ltda",
      razaoSocial: "Obras Primas Construções e Reformas Ltda",
      cnpj: "55.666.777/0001-88",
      inscricaoEstadual: "555.666.777.888",
      email: "obras@obrasprimas.com.br",
      telefone: "(11) 97777-3333",
      endereco: {
        cep: "05000-000",
        rua: "Rua das Palmeiras",
        numero: "250",
        bairro: "Lapa",
        cidade: "São Paulo",
        uf: "SP",
      },
      tipoFaturamento: "carta-autorizacao",
      empresaFaturamento: "Empresa C ME",
      dataCadastro: "2024-01-09",
      anexos: {
        contratoSocial: "contrato_social_primas.pdf",
        cartaoCnpj: "cartao_cnpj_primas.pdf",
        notaFiscal1: "nf_001_primas.pdf",
        notaFiscal2: "nf_002_primas.pdf",
        notaFiscal3: "nf_003_primas.pdf",
      },
      analiseIA: {
        status: "aprovado",
        observacoes: "Carta de autorização válida e documentos em ordem.",
        dataAnalise: "2024-01-09T12:00:00",
        pontosAnalisados: [
          "CNPJ válido",
          "Carta de autorização assinada",
          "Documentação completa"
        ],
      },
      statusFinanceiro: "aprovado",
      status: "Aprovado",
    },
    {
      id: "8",
      nomeFantasia: "Steel Engenharia",
      razaoSocial: "Steel Engenharia e Construções S.A.",
      cnpj: "66.777.888/0001-99",
      inscricaoEstadual: "666.777.888.999",
      email: "contato@steeleng.com.br",
      telefone: "(11) 96666-4444",
      endereco: {
        cep: "06000-000",
        rua: "Av. Industrial",
        numero: "1500",
        bairro: "Zona Leste",
        cidade: "São Paulo",
        uf: "SP",
      },
      tipoFaturamento: "mesmos-socios",
      empresaFaturamento: "Steel Faturamento Ltda",
      dataCadastro: "2024-01-16",
      anexos: {
        contratoSocial: "contrato_social_steel.pdf",
        cartaoCnpj: "cartao_cnpj_steel.pdf",
        notaFiscal1: "nf_001_steel.pdf",
        notaFiscal2: "nf_002_steel.pdf",
        notaFiscal3: "nf_003_steel.pdf",
      },
      analiseIA: {
        status: "pendente",
        observacoes: "Mesmos sócios verificados e documentação regular. Aguardando análise do financeiro.",
        pontosAnalisados: [
          "CNPJ válido",
          "Sócios em comum confirmados",
          "Documentos em ordem"
        ],
      },
      statusFinanceiro: "pendente",
      status: "Análise da IA",
    },
    {
      id: "9",
      nomeFantasia: "Construtora Alfa",
      razaoSocial: "Alfa Construções e Empreendimentos Ltda",
      cnpj: "77.888.999/0001-00",
      inscricaoEstadual: "777.888.999.000",
      email: "alfa@alfaconstrucoes.com.br",
      telefone: "(11) 95555-5555",
      endereco: {
        cep: "07000-000",
        rua: "Rua Alfa",
        numero: "777",
        bairro: "Jardim Paulista",
        cidade: "São Paulo",
        uf: "SP",
      },
      tipoFaturamento: "propria-empresa",
      dataCadastro: "2024-01-08",
      anexos: {
        contratoSocial: "contrato_social_alfa.pdf",
        cartaoCnpj: "cartao_cnpj_alfa.pdf",
        notaFiscal1: "nf_001_alfa.pdf",
        notaFiscal2: "nf_002_alfa.pdf",
        notaFiscal3: "nf_003_alfa.pdf",
      },
      analiseIA: {
        status: "aprovado",
        observacoes: "Documentação completa e regular.",
        dataAnalise: "2024-01-08T14:00:00",
        pontosAnalisados: [
          "CNPJ válido",
          "Documentos em ordem",
          "Notas fiscais regulares"
        ],
      },
      statusFinanceiro: "aprovado",
      status: "Aprovado",
    },
    {
      id: "10",
      nomeFantasia: "Beta Reformas",
      razaoSocial: "Beta Reformas e Acabamentos Ltda",
      cnpj: "88.999.000/0001-11",
      inscricaoEstadual: "888.999.000.111",
      email: "contato@betareformas.com.br",
      telefone: "(11) 94444-6666",
      endereco: {
        cep: "08000-000",
        rua: "Rua Beta",
        numero: "888",
        bairro: "Mooca",
        cidade: "São Paulo",
        uf: "SP",
      },
      tipoFaturamento: "contrato-obra",
      empresaFaturamento: "Empresa D Ltda",
      dataCadastro: "2024-01-17",
      anexos: {
        contratoSocial: "contrato_social_beta.pdf",
        cartaoCnpj: "cartao_cnpj_beta.pdf",
        notaFiscal1: "nf_001_beta.pdf",
        notaFiscal2: "nf_002_beta.pdf",
        notaFiscal3: "nf_003_beta.pdf",
      },
      analiseIA: {
        status: "rejeitado",
        observacoes: "Notas fiscais com valores divergentes.",
        dataAnalise: "2024-01-17T11:00:00",
        pontosAnalisados: [
          "CNPJ válido",
          "Divergências em notas fiscais"
        ],
      },
      statusFinanceiro: "rejeitado",
      status: "Reprovado",
      motivoReprovacao: "Notas fiscais com valores divergentes do cadastro. Favor revisar e reenviar.",
    },
  ]);

  const addCliente = (cliente: Cliente) => {
    const novoCliente: ClienteAprovacao = {
      id: Date.now().toString(),
      nomeFantasia: cliente.nomeFantasia,
      razaoSocial: cliente.razaoSocial,
      cnpj: cliente.cnpj,
      inscricaoEstadual: cliente.inscricaoEstadual,
      email: cliente.email,
      telefone: cliente.telefone,
      endereco: {
        cep: cliente.cep,
        rua: cliente.rua,
        numero: cliente.numero,
        bairro: cliente.bairro,
        cidade: cliente.cidade,
        uf: cliente.uf,
      },
      tipoFaturamento: cliente.tipoFaturamento || "propria-empresa",
      empresaFaturamento: cliente.empresaFaturamento,
      dataCadastro: new Date().toISOString().split('T')[0],
      anexos: {
        contratoSocial: "contrato_social.pdf",
        cartaoCnpj: "cartao_cnpj.pdf",
        notaFiscal1: "nf_001.pdf",
        notaFiscal2: "nf_002.pdf",
        notaFiscal3: "nf_003.pdf",
      },
      analiseIA: {
        status: "pendente",
        observacoes: "Análise inicial concluída. Aguardando aprovação do financeiro.",
        pontosAnalisados: [
          "CNPJ válido",
          "Documentação recebida",
          "Dados cadastrais completos"
        ],
      },
      statusFinanceiro: "pendente",
      status: cliente.status,
      motivoReprovacao: cliente.motivoReprovacao,
    };

    setClientes(prev => [...prev, novoCliente]);
  };

  const updateCliente = (cliente: ClienteAprovacao) => {
    setClientes(prev => prev.map(c => c.id === cliente.id ? cliente : c));
  };

  const deleteCliente = (id: string) => {
    setClientes(prev => prev.filter(c => c.id !== id));
  };

  const approveClienteFinanceiro = (clienteId: string, observacoes: string) => {
    setClientes(prev => prev.map(c => {
      if (c.id === clienteId) {
        return {
          ...c,
          statusFinanceiro: "aprovado" as const,
          status: "Aprovado" as const,
          analiseIA: {
            ...c.analiseIA,
            observacoes: observacoes || c.analiseIA.observacoes,
          },
        };
      }
      return c;
    }));
  };

  const rejectClienteFinanceiro = (clienteId: string, observacoes: string) => {
    setClientes(prev => prev.map(c => {
      if (c.id === clienteId) {
        return {
          ...c,
          statusFinanceiro: "rejeitado" as const,
          status: "Reprovado" as const,
          motivoReprovacao: observacoes,
        };
      }
      return c;
    }));
  };

  return (
    <ClientesContext.Provider
      value={{
        clientes,
        addCliente,
        updateCliente,
        deleteCliente,
        approveClienteFinanceiro,
        rejectClienteFinanceiro,
      }}
    >
      {children}
    </ClientesContext.Provider>
  );
};