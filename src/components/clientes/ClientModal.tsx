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
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, X, ArrowLeft, ArrowRight, CheckCircle, AlertCircle, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Funções de formatação
const formatCNPJ = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 14) {
    return numbers
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  return value;
};

const formatCEP = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 8) {
    return numbers.replace(/(\d{5})(\d)/, '$1-$2');
  }
  return value;
};

const formatTelefone = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 11) {
    if (numbers.length <= 10) {
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }
  return value;
};

const formatInscricaoEstadual = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 12) {
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2');
  }
  return value;
};

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
  tipoFaturamento?: string;
  empresaFaturamento?: string;
  status: "Aprovado" | "Análise da IA" | "Reprovado";
  motivoReprovacao?: string;
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
  tipoFaturamento: z.string().min(1, "Tipo de faturamento é obrigatório"),
  empresaFaturamento: z.string().optional(),
  status: z.enum(["Aprovado", "Análise da IA", "Reprovado"]),
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

const tiposFaturamento = [
  { 
    id: "propria-empresa", 
    label: "Faturamento para a Própria Empresa",
    documentos: [
      { id: "cartao-cnpj", name: "Cartão CNPJ", required: true },
      { id: "contrato-social", name: "Contrato Social", required: true },
      { id: "nota-fiscal-1", name: "Nota Fiscal 1", required: true },
      { id: "nota-fiscal-2", name: "Nota Fiscal 2", required: true },
      { id: "nota-fiscal-3", name: "Nota Fiscal 3", required: true },
    ]
  },
  { 
    id: "contrato-obra", 
    label: "Faturamento para Empresa Terceira (Contrato de Obra)",
    documentos: [
      { id: "cartao-cnpj", name: "Cartão CNPJ", required: true },
      { id: "contrato-social", name: "Contrato Social", required: true },
      { id: "nota-fiscal-1", name: "Nota Fiscal 1", required: true },
      { id: "nota-fiscal-2", name: "Nota Fiscal 2", required: true },
      { id: "nota-fiscal-3", name: "Nota Fiscal 3", required: true },
      { id: "contrato-obra", name: "Contrato de Obra", required: true },
    ]
  },
  { 
    id: "carta-autorizacao", 
    label: "Empresa com Carta de Autorização",
    documentos: [
      { id: "cartao-cnpj", name: "Cartão CNPJ", required: true },
      { id: "contrato-social", name: "Contrato Social", required: true },
      { id: "nota-fiscal-1", name: "Nota Fiscal 1", required: true },
      { id: "nota-fiscal-2", name: "Nota Fiscal 2", required: true },
      { id: "nota-fiscal-3", name: "Nota Fiscal 3", required: true },
      { id: "carta-autorizacao", name: "Carta de Autorização", required: true },
    ]
  },
  { 
    id: "mesmos-socios", 
    label: "Empresas com Mesmos Sócios",
    documentos: [
      { id: "cartao-cnpj", name: "Cartão CNPJ", required: true },
      { id: "contrato-social", name: "Contrato Social", required: true },
      { id: "nota-fiscal-1", name: "Nota Fiscal 1", required: true },
      { id: "nota-fiscal-2", name: "Nota Fiscal 2", required: true },
      { id: "nota-fiscal-3", name: "Nota Fiscal 3", required: true },
      { id: "verificacao-socios", name: "Verificação de Sócios em Comum", required: true },
    ]
  },
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
      tipoFaturamento: cliente?.tipoFaturamento || "",
      empresaFaturamento: cliente?.empresaFaturamento || "",
      status: cliente?.status || "Análise da IA",
    },
  });
  
  const watchTipoFaturamento = form.watch("tipoFaturamento");
  const currentDocumentTypes = tiposFaturamento.find(t => t.id === watchTipoFaturamento)?.documentos || [];

  const onSubmit = (data: ClientFormData) => {
    console.log("onSubmit executado", data);
    
    // Só processa o submit na etapa 2 (ou se for edição de cliente existente)
    if (!cliente && currentStep === 1) {
      console.log("Impedindo submit na etapa 1");
      return; // Não faz nada, o botão "Próximo" cuida da navegação
    }
    
    const clienteData: Cliente = {
      ...data,
      id: cliente?.id || Date.now().toString(),
      status: cliente ? data.status : "Análise da IA",
    };
    
    console.log("clienteData criado", clienteData);
    
    if (!cliente) {
      console.log("Novo cliente - exibindo sucesso");
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
      const wasRejected = cliente?.status === "Reprovado" && data.status === "Análise da IA";
      
      onSave(clienteData);
      toast({
        title: wasRejected ? "Cadastro Reenviado!" : "Cliente Atualizado!",
        description: wasRejected 
          ? "O cadastro foi corrigido e reenviado para análise. Você será notificado sobre o novo status."
          : "As informações do cliente foram atualizadas com sucesso.",
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

  const canFinalize = () => {
    const tipoFaturamento = form.getValues("tipoFaturamento");
    return !!tipoFaturamento;
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
            <h3 className="text-lg font-semibold mb-2">Cadastro Finalizado com Sucesso!</h3>
            <p className="text-sm text-muted-foreground mb-4">
              O cadastro do cliente foi finalizado com sucesso e está em análise da IA.
            </p>
            <p className="text-sm text-muted-foreground">
              Status: <span className="font-medium text-blue-600">Análise da IA</span>
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Você será notificado quando a análise for concluída.
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
            {cliente?.status === "Reprovado" ? "Corrigir Cadastro - Cliente Reprovado" : cliente ? "Editar Cliente" : "Novo Cliente"}
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
            {/* Motivo da Reprovação */}
            {cliente?.status === "Reprovado" && cliente.motivoReprovacao && (
              <Card className="border-destructive/20 bg-destructive/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <h4 className="font-semibold text-destructive">Motivo da Reprovação</h4>
                      <p className="text-sm text-foreground">{cliente.motivoReprovacao}</p>
                      <p className="text-xs text-muted-foreground">
                        Corrija as informações abaixo e reenvie para aprovação.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Etapa 1: Dados da Empresa */}
            {(cliente || (!cliente && currentStep === 1)) && (
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
                          <Input 
                            placeholder="00.000.000/0000-00" 
                            {...field}
                            onChange={(e) => {
                              const formatted = formatCNPJ(e.target.value);
                              field.onChange(formatted);
                            }}
                            maxLength={18}
                          />
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
                          <Input 
                            placeholder="000.000.000.000" 
                            {...field}
                            onChange={(e) => {
                              const formatted = formatInscricaoEstadual(e.target.value);
                              field.onChange(formatted);
                            }}
                            maxLength={15}
                          />
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
                          <Input 
                            placeholder="(00) 00000-0000" 
                            {...field}
                            onChange={(e) => {
                              const formatted = formatTelefone(e.target.value);
                              field.onChange(formatted);
                            }}
                            maxLength={15}
                          />
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
                          <Input 
                            placeholder="00000-000" 
                            {...field}
                            onChange={(e) => {
                              const formatted = formatCEP(e.target.value);
                              field.onChange(formatted);
                            }}
                            maxLength={9}
                          />
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
                              <SelectItem value="Aprovado">Aprovado</SelectItem>
                              <SelectItem value="Análise da IA">Análise da IA</SelectItem>
                              <SelectItem value="Reprovado">Reprovado</SelectItem>
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
            {(cliente || (!cliente && currentStep === 2)) && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Tipo de Faturamento</h3>
                  <FormField
                    control={form.control}
                    name="tipoFaturamento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selecione o Tipo de Faturamento *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo de faturamento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tiposFaturamento.map((tipo) => (
                              <SelectItem key={tipo.id} value={tipo.id}>
                                {tipo.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {(watchTipoFaturamento === "contrato-obra" || watchTipoFaturamento === "carta-autorizacao" || watchTipoFaturamento === "mesmos-socios") && (
                    <FormField
                      control={form.control}
                      name="empresaFaturamento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Empresa que será Faturada</FormLabel>
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
                  )}
                </div>

                {/* Anexos - dinâmicos baseados no tipo de faturamento */}
                {watchTipoFaturamento && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Documentos Necessários</h3>
                    <p className="text-sm text-muted-foreground">
                      Faça upload dos documentos necessários para o tipo de faturamento selecionado
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentDocumentTypes.map((docType) => {
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
                )}
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
                  <Button type="submit" disabled={!canFinalize()}>
                    Finalizar
                  </Button>
                )}
                
                {/* Botão especial para clientes reprovados */}
                {cliente?.status === "Reprovado" && (
                  <Button 
                    type="submit" 
                    className="bg-success hover:bg-success/90"
                    onClick={() => {
                      // Muda o status para "Análise da IA" quando reenviar
                      form.setValue("status", "Análise da IA");
                    }}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reenviar para Aprovação
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