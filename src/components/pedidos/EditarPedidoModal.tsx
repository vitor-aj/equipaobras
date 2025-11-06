import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Building2, DollarSign, Edit, MapPin, Phone, Mail, Package, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Materiais de construção com unidades padronizadas e preços reais de mercado
const MATERIAIS = [
  { nome: "Cimento", unidade: "kg", precoUnitario: 0.65 },
  { nome: "Areia", unidade: "m³", precoUnitario: 95.00 },
  { nome: "Brita", unidade: "m³", precoUnitario: 130.00 },
  { nome: "Tijolo", unidade: "unidade", precoUnitario: 0.85 },
  { nome: "Bloco de Concreto", unidade: "unidade", precoUnitario: 4.20 },
  { nome: "Ferro 6mm", unidade: "kg", precoUnitario: 7.50 },
  { nome: "Ferro 8mm", unidade: "kg", precoUnitario: 7.80 },
  { nome: "Ferro 10mm", unidade: "kg", precoUnitario: 8.20 },
  { nome: "Cal", unidade: "kg", precoUnitario: 0.55 },
  { nome: "Telha Cerâmica", unidade: "unidade", precoUnitario: 5.20 },
  { nome: "Madeira", unidade: "m³", precoUnitario: 1200.00 },
  { nome: "Tinta", unidade: "litros", precoUnitario: 92.00 },
  { nome: "Argamassa", unidade: "kg", precoUnitario: 1.10 },
  { nome: "Piso Cerâmico", unidade: "m²", precoUnitario: 38.50 },
];

interface Material {
  material: string;
  quantidade: string;
  valorUnitario: string;
}

interface Pedido {
  id: string;
  cliente: string;
  valor: string;
  status: "Pedido Faturado" | "Pendente";
  data: string;
  observacoes?: string;
  notaFiscal?: string;
  materiais?: Material[];
}

interface EditarPedidoData {
  clienteId: string;
  valor: string;
  observacoes: string;
  materiais: Material[];
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
      materiais: [{ material: "", quantidade: "", valorUnitario: "" }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "materiais"
  });

  // Preencher o formulário quando o pedido mudar
  useEffect(() => {
    if (pedido && isOpen) {
      const cliente = clientesAprovados.find(c => c.nomeFantasia === pedido.cliente);
      
      form.reset({
        clienteId: cliente?.id || "",
        valor: pedido.valor,
        observacoes: pedido.observacoes || "",
        materiais: pedido.materiais && pedido.materiais.length > 0 
          ? pedido.materiais 
          : [{ material: "", quantidade: "", valorUnitario: "" }]
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
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

            {/* Materiais */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel className="flex items-center gap-2 text-base">
                  <Package className="h-4 w-4" />
                  Materiais
                </FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ material: "", quantidade: "", valorUnitario: "" })}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Material
                </Button>
              </div>

              {fields.map((field, index) => {
                const materialSelecionado = MATERIAIS.find(m => m.nome === form.watch(`materiais.${index}.material`));

                return (
                  <Card key={field.id} className="shadow-sm border-border">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 space-y-4">
                          <FormField
                            control={form.control}
                            name={`materiais.${index}.material`}
                            rules={{ required: "Selecione um material" }}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Material</FormLabel>
                                <Select 
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    const material = MATERIAIS.find(m => m.nome === value);
                                    if (material) {
                                      const precoFormatado = new Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                      }).format(material.precoUnitario);
                                      form.setValue(`materiais.${index}.valorUnitario`, precoFormatado);
                                    }
                                  }} 
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione o material" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {MATERIAIS.map((material) => (
                                      <SelectItem key={material.nome} value={material.nome}>
                                        {material.nome} ({material.unidade})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-3">
                            <FormField
                              control={form.control}
                              name={`materiais.${index}.quantidade`}
                              rules={{ required: "Digite a quantidade" }}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    {materialSelecionado ? (
                                      <>Quantidade em {materialSelecionado.unidade}</>
                                    ) : (
                                      <>Quantidade</>
                                    )}
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      placeholder={materialSelecionado ? `0 ${materialSelecionado.unidade}` : "0"}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`materiais.${index}.valorUnitario`}
                              rules={{ required: "Digite o valor unitário" }}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    {materialSelecionado ? (
                                      <>Valor por {materialSelecionado.unidade}</>
                                    ) : (
                                      <>Valor Unitário</>
                                    )}
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="R$ 0,00"
                                      {...field}
                                      readOnly
                                      className="bg-muted"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => remove(index)}
                            className="flex-shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Valor Total do Pedido - Calculado Automaticamente */}
            <FormField
              control={form.control}
              name="valor"
              rules={{ required: "Digite o valor do pedido" }}
              render={({ field }) => {
                // Calcular total automaticamente
                const totalCalculado = fields.reduce((acc, _, index) => {
                  const quantidade = parseFloat(form.watch(`materiais.${index}.quantidade`)) || 0;
                  const valorUnitario = parseFloat(form.watch(`materiais.${index}.valorUnitario`)?.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
                  return acc + (quantidade * valorUnitario);
                }, 0);

                const valorFormatado = new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(totalCalculado);

                // Atualizar o campo automaticamente
                if (field.value !== valorFormatado && totalCalculado > 0) {
                  form.setValue('valor', valorFormatado);
                }

                return (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Valor Total do Pedido
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="R$ 0,00"
                        {...field}
                        value={valorFormatado}
                        readOnly
                        className="bg-muted font-semibold text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
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
