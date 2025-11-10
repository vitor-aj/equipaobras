import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ClienteAprovacao } from "@/contexts/ClientesContext";
import { 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Paperclip,
  Info
} from "lucide-react";

interface ClientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: ClienteAprovacao | null;
}

export const ClientDetailModal = ({ isOpen, onClose, cliente }: ClientDetailModalProps) => {
  if (!cliente) return null;

  const getStatusBadge = (status: ClienteAprovacao["status"]) => {
    const variants = {
      "Análise da IA": { 
        icon: Clock, 
        className: "bg-blue-50 text-blue-700 border-blue-200" 
      },
      "Aprovado": { 
        icon: CheckCircle, 
        className: "bg-success/10 text-success border-success/20" 
      },
      "Reprovado": { 
        icon: XCircle, 
        className: "bg-destructive/10 text-destructive border-destructive/20" 
      }
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

  const getTipoFaturamentoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      "propria-empresa": "Própria Empresa",
      "contrato-obra": "Contrato de Obra",
      "carta-autorizacao": "Carta de Autorização",
      "mesmos-socios": "Mesmos Sócios"
    };
    return labels[tipo] || tipo;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" />
            Detalhes do Cliente
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status e Info Básica */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Informações Básicas</span>
                {getStatusBadge(cliente.status)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nome Fantasia</label>
                  <p className="text-base font-semibold">{cliente.nomeFantasia}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Razão Social</label>
                  <p className="text-base">{cliente.razaoSocial}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">CNPJ</label>
                  <p className="text-base font-mono">{cliente.cnpj}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Inscrição Estadual</label>
                  <p className="text-base font-mono">{cliente.inscricaoEstadual}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data de Cadastro</label>
                  <p className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(cliente.dataCadastro).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Informações de Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    E-mail
                  </label>
                  <p className="text-base">{cliente.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    Telefone
                  </label>
                  <p className="text-base">{cliente.telefone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">CEP</label>
                  <p className="text-base font-mono">{cliente.endereco.cep}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Rua</label>
                  <p className="text-base">{cliente.endereco.rua}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Número</label>
                  <p className="text-base">{cliente.endereco.numero}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Bairro</label>
                  <p className="text-base">{cliente.endereco.bairro}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cidade</label>
                  <p className="text-base">{cliente.endereco.cidade}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">UF</label>
                  <p className="text-base">{cliente.endereco.uf}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Faturamento */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informações de Faturamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tipo de Faturamento</label>
                  <p className="text-base">{getTipoFaturamentoLabel(cliente.tipoFaturamento)}</p>
                </div>
                {cliente.empresaFaturamento && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Empresa de Faturamento</label>
                    <p className="text-base">{cliente.empresaFaturamento}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Análise da IA */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-5 w-5" />
                Análise da IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status da Análise</label>
                <Badge 
                  className={
                    cliente.analiseIA.status === "aprovado" 
                      ? "bg-success/10 text-success border-success/20 mt-2" 
                      : cliente.analiseIA.status === "rejeitado"
                      ? "bg-destructive/10 text-destructive border-destructive/20 mt-2"
                      : "bg-blue-50 text-blue-700 border-blue-200 mt-2"
                  }
                >
                  {cliente.analiseIA.status === "aprovado" && <CheckCircle className="h-3 w-3 mr-1" />}
                  {cliente.analiseIA.status === "rejeitado" && <XCircle className="h-3 w-3 mr-1" />}
                  {cliente.analiseIA.status === "pendente" && <Clock className="h-3 w-3 mr-1" />}
                  {cliente.analiseIA.status.charAt(0).toUpperCase() + cliente.analiseIA.status.slice(1)}
                </Badge>
              </div>
              
              {cliente.analiseIA.dataAnalise && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data da Análise</label>
                  <p className="text-base">
                    {new Date(cliente.analiseIA.dataAnalise).toLocaleDateString('pt-BR')} às{' '}
                    {new Date(cliente.analiseIA.dataAnalise).toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground">Observações</label>
                <p className="text-base mt-1">{cliente.analiseIA.observacoes}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Pontos Analisados</label>
                <ul className="mt-2 space-y-2">
                  {cliente.analiseIA.pontosAnalisados.map((ponto, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>{ponto}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Motivo de Reprovação */}
          {cliente.motivoReprovacao && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Motivo da Reprovação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base">{cliente.motivoReprovacao}</p>
              </CardContent>
            </Card>
          )}

          {/* Anexos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Paperclip className="h-5 w-5" />
                Documentos Anexados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(cliente.anexos).map(([key, value]) => {
                  if (!value) return null;
                  
                  const labels: Record<string, string> = {
                    contratoSocial: "Contrato Social",
                    cartaoCnpj: "Cartão CNPJ",
                    notaFiscal1: "Nota Fiscal 1",
                    notaFiscal2: "Nota Fiscal 2",
                    notaFiscal3: "Nota Fiscal 3",
                    autorizacaoTerceiros: "Autorização de Terceiros"
                  };

                  return (
                    <div 
                      key={key} 
                      className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border"
                    >
                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{labels[key]}</p>
                        <p className="text-xs text-muted-foreground truncate">{value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
