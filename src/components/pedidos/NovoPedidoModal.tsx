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
import { useClientes } from "@/contexts/ClientesContext";
import { Building2, DollarSign, FileText, Info, MapPin, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const { clientes: todosClientes } = useClientes();
  
  // Apenas clientes aprovados
  const clientesAprovados = todosClientes.filter(c => c.status === "Aprovado");
  const [selectedClienteId, setSelectedClienteId] = useState<string>("");
  
  // Cliente selecionado
  const clienteSelecionado = clientesAprovados.find(c => c.id === selectedClienteId);

  const form = useForm<NovoPedidoData>({
    defaultValues: {
      clienteId: "",
      valor: "",
      observacoes: ""
    }
  });

  const handleClienteChange = (clienteId: string) => {
    setSelectedClienteId(clienteId);
  };

  const handleSubmit = (data: NovoPedidoData) => {
    const cliente = clientesAprovados.find(c => c.id === data.clienteId);
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
    setSelectedClienteId("");
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