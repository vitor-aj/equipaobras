import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, X, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface Cliente {
  id?: string;
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  inscricaoEstadual: string;
  email: string;
  telefone: string;
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  faturamentoTerceiros: boolean;
  situacaoFaturamento?: string;
  empresaFaturamento?: string;
  status: "Liberado" | "Bloqueado" | "Inativo" | "Em aprovação";
}

const clientSchema = z.object({
  nomeFantasia: z.string().min(1, "Nome fantasia é obrigatório"),
  razaoSocial: z.string().min(1, "Razão social é obrigatória"),
  cnpj: z.string().min(14, "CNPJ deve ter pelo menos 14 caracteres"),
  inscricaoEstadual: z.string().min(1, "Inscrição estadual é obrigatória"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone deve ter pelo menos 10 caracteres"),
  cep: z.string().min(8, "CEP é obrigatório"),
  rua: z.string().min(1, "Rua é obrigatória"),
  numero: z.string().min(1, "Número é obrigatório"),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  uf: z.string().min(2, "UF é obrigatória"),
  faturamentoTerceiros: z.boolean(),
  situacaoFaturamento: z.string().optional(),
  empresaFaturamento: z.string().optional(),
  status: z.enum(["Liberado", "Bloqueado", "Inativo", "Em aprovação"]),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cliente: Cliente) => void;
  cliente?: Cliente | null;
}

interface AnexoFile {
  id: string;
  name: string;
  size: number;
  file?: File;
}

const documentTypes = [
  { id: "contrato-social", name: "Contrato Social", required: true },
  { id: "cartao-cnpj", name: "Cartão CNPJ", required: true },
  { id: "nota-fiscal-1", name: "Nota Fiscal 1", required: true },
  { id: "nota-fiscal-2", name: "Nota Fiscal 2", required: true },
  { id: "nota-fiscal-3", name: "Nota Fiscal 3", required: true },
  { id: "autorizacao-terceiros", name: "Autorização/Carta de Terceiros/Contrato", required: false },
];

const situacoesFaturamento = [
  "Contrato entre as duas empresas",
  "Autorização da outra empresa", 
  "Mesmo Socio"
];

const empresasFaturamento = [
  "Empresa A Ltda",
  "Empresa B S.A.",
  "Empresa C ME"
];

export const ClientModal = ({ isOpen, onClose, onSave, cliente }: ClientModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, AnexoFile>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      nomeFantasia: cliente?.nomeFantasia || "",
      razaoSocial: cliente?.razaoSocial || "",
      cnpj: cliente?.cnpj || "",
      inscricaoEstadual: cliente?.inscricaoEstadual || "",
      email: cliente?.email || "",
      telefone: cliente?.telefone || "",
      cep: cliente?.cep || "",
      rua: cliente?.rua || "",
      numero: cliente?.numero || "",
      bairro: cliente?.bairro || "",
      cidade: cliente?.cidade || "",
      uf: cliente?.uf || "",
      faturamentoTerceiros: cliente?.faturamentoTerceiros || false,
      situacaoFaturamento: cliente?.situacaoFaturamento || "",
      empresaFaturamento: cliente?.empresaFaturamento || "",
      status: cliente?.status || "Em aprovação",
    },
  });
  
  const watchFaturamentoTerceiros = form.watch("faturamentoTerceiros");

  const onSubmit = (data: ClientFormData) => {
    const clienteData: Cliente = {
      ...data,
      id: cliente?.id,
      status: cliente ? data.status : "Em aprovação",
    };
    
    if (!cliente) {
      setShowSuccess(true);
      toast({
        title: "Cadastro Enviado!",
        description: "O cadastro do cliente passará por aprovação. Você será notificado sobre o status.",
      });
      setTimeout(() => {
        onSave(clienteData);
        form.reset();
        setUploadedFiles({});
        setCurrentStep(1);
        setShowSuccess(false);
        onClose();
      }, 2500);
    } else {
      onSave(clienteData);
      toast({
        title: "Cliente Atualizado!",
        description: "As informações do cliente foram atualizadas com sucesso.",
      });
      form.reset();
      setUploadedFiles({});
      setCurrentStep(1);
      onClose();
    }
  };

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

  const canProceedToNextStep = () => {
    if (currentStep === 1) {
      const step1Fields = ['nomeFantasia', 'razaoSocial', 'cnpj', 'inscricaoEstadual', 'email', 'telefone', 'cep', 'rua', 'numero', 'bairro', 'cidade', 'uf'];
      return step1Fields.every(field => form.getValues(field as keyof ClientFormData));
    }
    return true;
  };

  const handleFileUpload = (documentId: string, file: File) => {
    const anexo: AnexoFile = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      file,
    };
    setUploadedFiles(prev => ({
      ...prev,
      [documentId]: anexo,
    }));
  };

  const handleRemoveFile = (documentId: string) => {
    setUploadedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[documentId];
      return newFiles;
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Cadastro Enviado!</h3>
            <p className="text-muted-foreground mb-4">
              O cadastro do cliente passará por aprovação.
            </p>
            <p className="text-sm text-muted-foreground">
              Status: <span className="font-medium text-warning">Em aprovação</span>
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Você será notificado quando a aprovação for concluída.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {cliente ? "Editar Cliente" : "Novo Cliente"}
          </DialogTitle>
          {!cliente && (
            <div className="flex items-center justify-center gap-2 mt-4">
              {[1, 2].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === step 
                      ? "bg-primary text-primary-foreground" 
                      : currentStep > step 
                        ? "bg-green-500 text-white" 
                        : "bg-muted text-muted-foreground"
                  }`}>
                    {step}
                  </div>
                  {step < 2 && (
                    <div className={`w-12 h-0.5 ${
                      currentStep > step ? "bg-green-500" : "bg-muted"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          )}
          {!cliente && (
            <div className="text-center mt-2">
              <p className="text-sm text-muted-foreground">
                {currentStep === 1 && "Etapa 1: Dados da Empresa"}
                {currentStep === 2 && "Etapa 2: Faturamento"}
              </p>
            </div>
          )}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Etapa 1: Dados da Empresa */}
            {(cliente || currentStep === 1) && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dados da Empresa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nomeFantasia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Fantasia *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome fantasia da empresa" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="razaoSocial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Razão Social *</FormLabel>
                        <FormControl>
                          <Input placeholder="Razão social da empresa" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cnpj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CNPJ *</FormLabel>
                        <FormControl>
                          <Input placeholder="00.000.000/0000-00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="inscricaoEstadual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inscrição Estadual *</FormLabel>
                        <FormControl>
                          <Input placeholder="000.000.000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email de Contato *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="contato@empresa.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="telefone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone de Contato *</FormLabel>
                        <FormControl>
                          <Input placeholder="(00) 00000-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cep"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP *</FormLabel>
                        <FormControl>
                          <Input placeholder="00000-000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rua"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rua *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome da rua" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="numero"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número *</FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bairro"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bairro *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do bairro" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cidade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome da cidade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="uf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>UF *</FormLabel>
                        <FormControl>
                          <Input placeholder="SP" maxLength={2} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {cliente && (
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Liberado">Liberado</SelectItem>
                              <SelectItem value="Bloqueado">Bloqueado</SelectItem>
                              <SelectItem value="Inativo">Inativo</SelectItem>
                              <SelectItem value="Em aprovação">Em aprovação</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Etapa 2: Faturamento */}
            {(cliente || currentStep === 2) && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Faturamento</h3>
                  <FormField
                    control={form.control}
                    name="faturamentoTerceiros"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Faturamento para empresa terceira?
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  {watchFaturamentoTerceiros && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="situacaoFaturamento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Situação de Faturamento Terceiros *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a situação" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {situacoesFaturamento.map((situacao) => (
                                  <SelectItem key={situacao} value={situacao}>
                                    {situacao}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="empresaFaturamento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Empresa que será Faturada *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a empresa" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {empresasFaturamento.map((empresa) => (
                                  <SelectItem key={empresa} value={empresa}>
                                    {empresa}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                {/* Anexos - sempre visíveis na Etapa 2 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Anexos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documentTypes.map((docType) => {
                      const uploadedFile = uploadedFiles[docType.id];
                      const isRequired = docType.required;
                      
                      return (
                        <Card key={docType.id} className="border-border">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center justify-between">
                              <span className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                {docType.name}
                                {isRequired && <span className="text-destructive">*</span>}
                              </span>
                              {uploadedFile && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveFile(docType.id)}
                                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              )}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {uploadedFile ? (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                      {uploadedFile.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {formatFileSize(uploadedFile.size)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                <span className="text-sm text-muted-foreground text-center">
                                  Clique para enviar<br />
                                  ou arraste o arquivo aqui
                                </span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handleFileUpload(docType.id, file);
                                    }
                                  }}
                                />
                              </label>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Botões de navegação */}
            <div className="flex justify-between pt-6">
              <div>
                {!cliente && currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Anterior
                  </Button>
                )}
              </div>
              
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                >
                  Cancelar
                </Button>
                
                {cliente ? (
                  <Button type="submit">
                    Atualizar
                  </Button>
                ) : currentStep < 2 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!canProceedToNextStep()}
                  >
                    Próximo
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit">
                    Finalizar
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};