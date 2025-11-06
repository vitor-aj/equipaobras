import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WorkflowStatus } from "./WorkflowStatus";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Building2, 
  Calendar, 
  DollarSign,
  MessageSquare,
  Download,
  X,
  Receipt
} from "lucide-react";

interface PedidoDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (pedidoId: string, novoStatus: "Pedido Faturado" | "Pendente", notaFiscal: string) => void;
  pedido: {
    id: string;
    cliente: string;
    valor: string;
    status: "Pedido Faturado" | "Pendente";
    data: string;
    observacoes?: string;
  } | null;
}

export function PedidoDetailModal({ isOpen, onClose, onUpdateStatus, pedido }: PedidoDetailModalProps) {
  const { toast } = useToast();
  const [showFaturamentoForm, setShowFaturamentoForm] = useState(false);
  const [notaFiscal, setNotaFiscal] = useState("");

  if (!pedido) return null;

  const getCurrentStep = () => {
    switch (pedido.status) {
      case "Pendente":
        return 1;
      case "Pedido Faturado":
        return 2;
      default:
        return 1;
    }
  };

  const formatNotaFiscal = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 9 dígitos (padrão NF-e)
    const limited = numbers.slice(0, 9);
    
    // Formata com separadores de milhar
    if (limited.length === 0) return '';
    
    const formatted = limited.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return formatted;
  };

  const handleNotaFiscalChange = (value: string) => {
    const formatted = formatNotaFiscal(value);
    setNotaFiscal(formatted);
  };

  const handleFaturar = () => {
    const numeroLimpo = notaFiscal.replace(/\D/g, '');
    
    if (!numeroLimpo) {
      toast({
        title: "Erro",
        description: "Por favor, informe o número da nota fiscal.",
        variant: "destructive"
      });
      return;
    }

    if (numeroLimpo.length < 4) {
      toast({
        title: "Erro",
        description: "O número da nota fiscal deve ter no mínimo 4 dígitos.",
        variant: "destructive"
      });
      return;
    }

    if (onUpdateStatus) {
      onUpdateStatus(pedido.id, "Pedido Faturado", numeroLimpo);
    }

    toast({
      title: "Pedido Faturado",
      description: `Pedido ${pedido.id} foi faturado com sucesso. NF: ${notaFiscal}`,
    });

    setShowFaturamentoForm(false);
    setNotaFiscal("");
    onClose();
  };

  const hasError = false;
  const errorMessage = undefined;

  const documents = [
    "Ficha Cadastral",
    "Contrato Social", 
    "Cartão CNPJ",
    "Nota Fiscal 1",
    "Nota Fiscal 2",
    "Nota Fiscal 3",
    "Autorização/Carta de Terceiros",
    "Pedido de Compras"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-foreground">
              Detalhes do Pedido
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-8">
          {/* Informações Gerais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Número do Pedido</p>
                  <p className="text-lg font-semibold text-foreground">{pedido.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="text-lg font-semibold text-foreground">{pedido.cliente}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor do Pedido</p>
                  <p className="text-lg font-semibold text-foreground">{pedido.valor}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data de Criação</p>
                  <p className="text-lg font-semibold text-foreground">
                    {new Date(pedido.data).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Observações */}
          {pedido.observacoes && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-foreground">Observações</h3>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg border">
                <p className="text-sm text-foreground">{pedido.observacoes}</p>
              </div>
            </div>
          )}

          <Separator />

          {/* Workflow Status */}
          <WorkflowStatus 
            currentStep={getCurrentStep()}
            hasError={hasError}
            errorMessage={errorMessage}
          />

          <Separator />

          {/* Documentos ou Faturamento */}
          {pedido.status === "Pedido Faturado" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Documentos Anexados</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((document, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:bg-muted/30 transition-fast"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{document}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pedido.status === "Pendente" && (
            <div className="space-y-4">
              {!showFaturamentoForm ? (
                <div className="flex flex-col items-center gap-4 p-6 bg-muted/30 rounded-lg border border-border">
                  <Receipt className="h-12 w-12 text-primary" />
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Faturar Pedido
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Clique no botão abaixo para informar o número da nota fiscal e faturar este pedido.
                    </p>
                  </div>
                  <Button 
                    onClick={() => setShowFaturamentoForm(true)}
                    className="w-full max-w-xs"
                  >
                    <Receipt className="h-4 w-4 mr-2" />
                    Faturar Pedido
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 p-6 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <Receipt className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">
                      Informações de Faturamento
                    </h3>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notaFiscal" className="text-sm font-medium">
                      Número da Nota Fiscal
                    </Label>
                    <Input
                      id="notaFiscal"
                      type="text"
                      placeholder="000.000.000"
                      value={notaFiscal}
                      onChange={(e) => handleNotaFiscalChange(e.target.value)}
                      maxLength={11}
                      className="text-lg font-mono"
                      autoComplete="off"
                    />
                    <p className="text-xs text-muted-foreground">
                      Informe de 4 a 9 dígitos • Apenas números
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowFaturamentoForm(false);
                        setNotaFiscal("");
                      }}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleFaturar}
                      className="flex-1"
                    >
                      Confirmar Faturamento
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}