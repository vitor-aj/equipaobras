import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  Building2, 
  Mail, 
  Phone, 
  MapPin,
  Download,
  Eye,
  Check,
  X,
  ArrowLeft,
  ArrowRight,
  AlertTriangle
} from "lucide-react";

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
}

interface ClientApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: ClienteAprovacao | null;
  onApprove: (clienteId: string, observacoes: string) => void;
  onReject: (clienteId: string, observacoes: string) => void;
}

export const ClientApprovalModal = ({ 
  isOpen, 
  onClose, 
  cliente, 
  onApprove, 
  onReject 
}: ClientApprovalModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [observacoes, setObservacoes] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionType, setActionType] = useState<"aprovar" | "rejeitar" | null>(null);

  if (!cliente) return null;

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAction = (type: "aprovar" | "rejeitar") => {
    setActionType(type);
    setObservacoes(type === "aprovar" ? "Cliente aprovado pelo financeiro" : "");
    setShowConfirmation(true);
  };

  const confirmarAcao = () => {
    if (!actionType) return;
    
    if (actionType === "aprovar") {
      onApprove(cliente.id, observacoes);
    } else {
      onReject(cliente.id, observacoes);
    }
    
    setShowConfirmation(false);
    setActionType(null);
    setObservacoes("");
    setCurrentStep(1);
    onClose();
  };

  const cancelarAcao = () => {
    setShowConfirmation(false);
    setActionType(null);
    setObservacoes("");
  };

  const documentLabels = {
    contratoSocial: "Contrato Social",
    cartaoCnpj: "Cartão CNPJ", 
    notaFiscal1: "Nota Fiscal 1",
    notaFiscal2: "Nota Fiscal 2",
    notaFiscal3: "Nota Fiscal 3",
    autorizacaoTerceiros: "Autorização/Carta de Terceiros"
  };

  if (showConfirmation) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {actionType === "aprovar" ? "Aprovar Cliente" : "Rejeitar Cliente"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{cliente.nomeFantasia}</span>
              </div>
              <p className="text-sm text-muted-foreground">{cliente.cnpj}</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {actionType === "aprovar" ? "Observações (opcional)" : "Motivo da rejeição *"}
              </label>
              <Textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder={actionType === "aprovar" 
                  ? "Adicione observações sobre a aprovação..." 
                  : "Descreva o motivo da rejeição..."}
                className="min-h-20"
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={cancelarAcao} className="flex-1">
              Cancelar
            </Button>
            <Button 
              onClick={confirmarAcao}
              className={actionType === "aprovar" 
                ? "flex-1 bg-green-600 hover:bg-green-700" 
                : "flex-1 bg-red-600 hover:bg-red-700"}
              disabled={actionType === "rejeitar" && !observacoes.trim()}
            >
              {actionType === "aprovar" ? "Aprovar" : "Rejeitar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Análise de Cliente - {cliente.nomeFantasia}
          </DialogTitle>
          
          {/* Steps */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === step 
                    ? "bg-primary text-primary-foreground" 
                    : step === 1 && cliente.analiseIA.status === "aprovado"
                      ? "bg-green-500 text-white"
                      : step === 1 && cliente.analiseIA.status === "rejeitado"
                        ? "bg-red-500 text-white"
                        : currentStep > step 
                          ? "bg-green-500 text-white" 
                          : "bg-muted text-muted-foreground"
                }`}>
                  {step === 1 && cliente.analiseIA.status === "aprovado" && currentStep !== 1 ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : step === 1 && cliente.analiseIA.status === "rejeitado" ? (
                    <AlertTriangle className="h-5 w-5" />
                  ) : (
                    step
                  )}
                </div>
                {step < 2 && (
                  <div className={`w-16 h-0.5 ${
                    cliente.analiseIA.status === "aprovado" || currentStep > step ? "bg-green-500" : "bg-muted"
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center mt-2">
            <p className="text-sm text-muted-foreground">
              {currentStep === 1 && "Etapa 1: Análise da IA"}
              {currentStep === 2 && "Etapa 2: Análise do Financeiro"}
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Etapa 1: Análise da IA */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Análise da IA - {cliente.analiseIA.status === "aprovado" ? "Aprovado" : "Pendente"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Pontos Analisados:</h4>
                    <ul className="space-y-1">
                      {cliente.analiseIA.pontosAnalisados.map((ponto, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          {ponto}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Observações da IA:</h4>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                      {cliente.analiseIA.observacoes}
                    </p>
                  </div>
                  
                  {cliente.analiseIA.dataAnalise && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Analisado em {new Date(cliente.analiseIA.dataAnalise).toLocaleString('pt-BR')}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Dados da Empresa
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Nome Fantasia</label>
                      <p className="text-sm">{cliente.nomeFantasia}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Razão Social</label>
                      <p className="text-sm">{cliente.razaoSocial}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">CNPJ</label>
                      <p className="text-sm font-mono">{cliente.cnpj}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Inscrição Estadual</label>
                      <p className="text-sm">{cliente.inscricaoEstadual}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="text-sm flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {cliente.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Telefone</label>
                      <p className="text-sm flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        {cliente.telefone}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Endereço</label>
                    <p className="text-sm flex items-start gap-2">
                      <MapPin className="h-3 w-3 mt-0.5" />
                      {cliente.endereco.rua}, {cliente.endereco.numero} - {cliente.endereco.bairro}<br/>
                      {cliente.endereco.cidade}/{cliente.endereco.uf} - CEP: {cliente.endereco.cep}
                    </p>
                  </div>

                  {cliente.tipoFaturamento !== "propria-empresa" && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <h4 className="font-medium text-amber-800 mb-2">Informações de Faturamento</h4>
                      <div className="space-y-1 text-sm text-amber-700">
                        <p><strong>Tipo:</strong> {
                          cliente.tipoFaturamento === "contrato-obra" ? "Faturamento para Empresa Terceira (Contrato de Obra)" :
                          cliente.tipoFaturamento === "carta-autorizacao" ? "Empresa com Carta de Autorização" :
                          cliente.tipoFaturamento === "mesmos-socios" ? "Empresas com Mesmos Sócios" :
                          cliente.tipoFaturamento
                        }</p>
                        {cliente.empresaFaturamento && (
                          <p><strong>Empresa:</strong> {cliente.empresaFaturamento}</p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Etapa 2: Análise do Financeiro */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documentos Anexados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(cliente.anexos).map(([key, value]) => {
                      if (!value) return null;
                      const label = documentLabels[key as keyof typeof documentLabels];
                      
                      return (
                        <div key={key} className="p-3 border border-border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm">{label}</h4>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">{value}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Decisão do Financeiro</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline"
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleAction("rejeitar")}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Rejeitar Cliente
                    </Button>
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleAction("aprovar")}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Aprovar Cliente
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <div>
            {currentStep > 1 && (
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            
            {currentStep < 2 && (
              <Button onClick={nextStep}>
                Próximo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};