import { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { useClientes } from "@/contexts/ClientesContext";
import { Building2, DollarSign, FileText, MapPin, Phone, Mail, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Pedido {
  id: string;
  cliente: string;
  valor: string;
  status: "Pedido Faturado" | "Pendente";
  data: string;
  observacoes?: string;
  notaFiscal?: string;
}

interface EditarPedidoData {
  clienteId: string;
  valor: string;
  observacoes: string;
}

interface EditarPedidoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (pedidoId: string, data: EditarPedidoData & { cliente: string }) => void;
  pedido: Pedido | null;
}

export const EditarPedidoModal = ({ isOpen, onClose, onSubmit, pedido }: EditarPedidoModalProps) => {
  const { toast } = useToast();
  const { clientes: todosClientes } = useClientes();
  
  // Apenas clientes aprovados
  const clientesAprovados = todosClientes.filter(c => c.status === "Aprovado");
  const [selectedClienteId, setSelectedClienteId] = useState<string>("");
  
  // Cliente selecionado
  const clienteSelecionado = clientesAprovados.find(c => c.id === selectedClienteId);

  const form = useForm<EditarPedidoData>({
    defaultValues: {
      clienteId: "",
      valor: "",
      observacoes: "",
    }
  });

  // Preencher o formulário quando o pedido mudar
  useEffect(() => {
    if (pedido && isOpen) {
      const cliente = clientesAprovados.find(c => c.nomeFantasia === pedido.cliente);
      
      form.reset({
        clienteId: cliente?.id || "",
        valor: pedido.valor,
        observacoes: pedido.observacoes || "",
      });
      
      setSelectedClienteId(cliente?.id || "");
    }
  }, [pedido, isOpen, form, clientesAprovados]);

  const handleClienteChange = (clienteId: string) => {
    setSelectedClienteId(clienteId);
  };

  const handleSubmit = (data: EditarPedidoData) => {
    if (!pedido) return;
    
    const cliente = clientesAprovados.find(c => c.id === data.clienteId);
    if (!cliente) return;

    onSubmit(pedido.id, {
      ...data,
      cliente: cliente.nomeFantasia
    });

    toast({
      title: "Pedido Atualizado",
      description: `Pedido ${pedido.id} foi atualizado com sucesso.`,
    });

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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-primary" />
            Editar Pedido {pedido?.id}
          </DialogTitle>
          <DialogDescription>
            Atualize as informações do pedido abaixo.
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
                      {clientesAprovados.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          {cliente.nomeFantasia}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dados do Cliente Selecionado */}
            {clienteSelecionado && (
              <Card className="shadow-sm border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Building2 className="h-4 w-4 text-primary" />
                    Dados do Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Razão Social</p>
                    <p className="font-medium text-foreground">{clienteSelecionado.razaoSocial}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">CNPJ</p>
                    <p className="font-medium text-foreground">{clienteSelecionado.cnpj}</p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Endereço</p>
                      <p className="text-foreground">
                        {clienteSelecionado.endereco.rua}, {clienteSelecionado.endereco.numero}
                      </p>
                      <p className="text-foreground">
                        {clienteSelecionado.endereco.bairro} - {clienteSelecionado.endereco.cidade}/{clienteSelecionado.endereco.uf}
                      </p>
                      <p className="text-foreground">CEP: {clienteSelecionado.endereco.cep}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Telefone</p>
                      <p className="text-foreground">{clienteSelecionado.telefone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">E-mail</p>
                      <p className="text-foreground">{clienteSelecionado.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                      placeholder="Adicione observações sobre o pedido (opcional)"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                Salvar Alterações
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
