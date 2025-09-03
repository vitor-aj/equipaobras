import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { WorkflowStatus } from "./WorkflowStatus";
import { 
  FileText, 
  Building2, 
  Calendar, 
  DollarSign,
  MessageSquare,
  Download,
  X
} from "lucide-react";

interface PedidoDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  pedido: {
    id: string;
    cliente: string;
    valor: string;
    status: "Em Análise da IA" | "Análise do Faturista" | "Aprovado" | "Devolvido para Ajuste";
    data: string;
    observacoes?: string;
  } | null;
}

export function PedidoDetailModal({ isOpen, onClose, pedido }: PedidoDetailModalProps) {
  if (!pedido) return null;

  const getCurrentStep = () => {
    switch (pedido.status) {
      case "Em Análise da IA":
        return 1;
      case "Análise do Faturista":
        return 2;
      case "Aprovado":
        return 3;
      default:
        return 1;
    }
  };

  const hasError = pedido.status === "Devolvido para Ajuste";
  const errorMessage = hasError ? pedido.observacoes || "Documentos precisam ser revisados" : undefined;

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

          {/* Documentos */}
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

          {/* Ações */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button onClick={onClose} className="flex-1">
              Fechar
            </Button>
            {hasError && (
              <Button variant="outline" className="flex-1">
                Editar Pedido
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}