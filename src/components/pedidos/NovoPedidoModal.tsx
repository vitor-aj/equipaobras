import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Building2, DollarSign, FileText, Info } from "lucide-react";

interface Cliente {
  id: string;
  nomeFantasia: string;
  razaoSocial: string;
  status: "Aprovado" | "Análise da IA" | "Reprovado";
  empresaFaturamento?: string;
}

interface NovoPedidoData {
  clienteId: string;
  valor: string;
  observacoes: string;
}

interface NovoPedidoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NovoPedidoData & { cliente: string }) => void;
}

export const NovoPedidoModal = ({ isOpen, onClose, onSubmit }: NovoPedidoModalProps) => {
  const { toast } = useToast();
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  // Mock de clientes aprovados - em produção viria de uma API
  const clientesAtivos: Cliente[] = [
    {
      id: "1",
      nomeFantasia: "ABC Construtora",
      razaoSocial: "ABC Construtora Ltda",
      status: "Aprovado"
    },
    {
      id: "4", 
      nomeFantasia: "Reforma Total",
      razaoSocial: "Reforma Total Construções Ltda",
      status: "Aprovado"
    },
    {
      id: "7",
      nomeFantasia: "Obras Primas Ltda",
      razaoSocial: "Obras Primas Construções e Reformas Ltda",
      status: "Aprovado",
      empresaFaturamento: "Empresa C ME"
    },
    {
      id: "9",
      nomeFantasia: "Construtora Alfa",
      razaoSocial: "Alfa Construções e Empreendimentos Ltda",
      status: "Aprovado"
    }
  ];

  const form = useForm<NovoPedidoData>({
    defaultValues: {
      clienteId: "",
      valor: "",
      observacoes: ""
    }
  });

  const handleClienteChange = (clienteId: string) => {
    const cliente = clientesAtivos.find(c => c.id === clienteId);
    setSelectedCliente(cliente || null);
  };

  const handleSubmit = (data: NovoPedidoData) => {
    const cliente = clientesAtivos.find(c => c.id === data.clienteId);
    if (!cliente) return;

    // Gerar ID único para o pedido
    const novoPedidoId = `PED-${String(Date.now()).slice(-3)}`;
    
    onSubmit({
      ...data,
      cliente: cliente.nomeFantasia
    });

    toast({
      title: "Pedido Criado",
      description: `Pedido ${novoPedidoId} criado com sucesso e enviado para análise.`,
    });

    // Reset form and close modal
    form.reset();
    setSelectedCliente(null);
    onClose();
  };

  const formatCurrency = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Converte para formato de moeda
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Number(numbers) / 100);
    
    return formatted;
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    form.setValue('valor', formatted);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Novo Pedido
          </DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para criar um novo pedido de aprovação.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Cliente */}
            <FormField
              control={form.control}
              name="clienteId"
              rules={{ required: "Selecione um cliente" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Cliente
                  </FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleClienteChange(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clientesAtivos.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{cliente.nomeFantasia}</span>
                            <span className="text-xs text-muted-foreground">{cliente.razaoSocial}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Informações de Faturamento */}
            {selectedCliente?.empresaFaturamento && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Faturamento:</strong> O faturamento será realizado para a empresa{" "}
                  <span className="font-semibold text-primary">
                    {selectedCliente.empresaFaturamento}
                  </span>
                </AlertDescription>
              </Alert>
            )}

            {/* Valor do Pedido */}
            <FormField
              control={form.control}
              name="valor"
              rules={{ required: "Digite o valor do pedido" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Valor do Pedido
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="R$ 0,00"
                      {...field}
                      onChange={handleValueChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Observações */}
            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Adicione observações relevantes sobre este pedido..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                Enviar Pedido
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};