import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Upload, 
  FileText, 
  Building, 
  CreditCard, 
  Receipt, 
  UserCheck,
  ShoppingCart,
  X,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

interface DocumentType {
  id: string;
  name: string;
  icon: React.ReactNode;
  required: boolean;
  description: string;
}

interface UploadedFile {
  id: string;
  documentId: string;
  name: string;
  size: number;
  type: string;
}

export function DocumentUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const documentTypes: DocumentType[] = [
    {
      id: "ficha-cadastral",
      name: "Ficha Cadastral",
      icon: <UserCheck className="h-5 w-5" />,
      required: true,
      description: "Formulário preenchido com dados da empresa"
    },
    {
      id: "contrato-social",
      name: "Contrato Social",
      icon: <Building className="h-5 w-5" />,
      required: true,
      description: "Contrato social atualizado da empresa"
    },
    {
      id: "cartao-cnpj",
      name: "Cartão CNPJ",
      icon: <CreditCard className="h-5 w-5" />,
      required: true,
      description: "Comprovante de inscrição no CNPJ"
    },
    {
      id: "nota-fiscal-1",
      name: "Nota Fiscal 1",
      icon: <Receipt className="h-5 w-5" />,
      required: true,
      description: "Primeira nota fiscal de referência"
    },
    {
      id: "nota-fiscal-2",
      name: "Nota Fiscal 2", 
      icon: <Receipt className="h-5 w-5" />,
      required: false,
      description: "Segunda nota fiscal (opcional)"
    },
    {
      id: "nota-fiscal-3",
      name: "Nota Fiscal 3",
      icon: <Receipt className="h-5 w-5" />,
      required: false,
      description: "Terceira nota fiscal (opcional)"
    },
    {
      id: "autorizacao-terceiros",
      name: "Autorização/Carta de Terceiros",
      icon: <FileText className="h-5 w-5" />,
      required: true,
      description: "Documento de autorização quando aplicável"
    },
    {
      id: "pedido-compras",
      name: "Pedido de Compras",
      icon: <ShoppingCart className="h-5 w-5" />,
      required: true,
      description: "Pedido oficial de compras da empresa"
    }
  ];

  const handleFileUpload = (documentId: string, file: File) => {
    // Simular upload - seria integrado com Supabase Storage
    const newFile: UploadedFile = {
      id: Math.random().toString(36).substr(2, 9),
      documentId,
      name: file.name,
      size: file.size,
      type: file.type
    };

    setUploadedFiles(prev => [
      ...prev.filter(f => f.documentId !== documentId),
      newFile
    ]);
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getDocumentStatus = (documentId: string) => {
    return uploadedFiles.find(f => f.documentId === documentId);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const requiredDocs = documentTypes.filter(doc => doc.required);
  const uploadedRequiredDocs = requiredDocs.filter(doc => getDocumentStatus(doc.id));
  const completionRate = (uploadedRequiredDocs.length / requiredDocs.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-foreground">
            Progresso do Upload
          </h3>
          <span className="text-sm font-bold text-foreground">
            {uploadedRequiredDocs.length}/{requiredDocs.length}
          </span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2 mb-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        
        <p className="text-xs text-muted-foreground">
          {completionRate === 100 
            ? "Todos os documentos obrigatórios foram enviados"
            : `${requiredDocs.length - uploadedRequiredDocs.length} documentos obrigatórios restantes`
          }
        </p>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documentTypes.map((doc) => {
          const uploadedFile = getDocumentStatus(doc.id);
          const isUploaded = !!uploadedFile;

          return (
            <Card 
              key={doc.id} 
              className={`
                border-2 transition-all duration-200 hover:shadow-custom-md cursor-pointer
                ${isUploaded 
                  ? "border-success/20 bg-success/5" 
                  : doc.required 
                    ? "border-border hover:border-primary/30" 
                    : "border-dashed border-muted-foreground/30 hover:border-muted-foreground/50"
                }
              `}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`
                      h-8 w-8 rounded-lg flex items-center justify-center
                      ${isUploaded ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"}
                    `}>
                      {doc.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-foreground">
                          {doc.name}
                        </h4>
                        {doc.required && (
                          <span className="text-xs bg-destructive/10 text-destructive px-1.5 py-0.5 rounded">
                            Obrigatório
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {isUploaded && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveFile(uploadedFile.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                <p className="text-xs text-muted-foreground mb-3">
                  {doc.description}
                </p>

                {isUploaded ? (
                  <div className="bg-success/10 border border-success/20 rounded p-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-3 w-3 text-success" />
                      <span className="text-xs text-foreground font-medium truncate">
                        {uploadedFile.name}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatFileSize(uploadedFile.size)}
                    </p>
                  </div>
                ) : (
                  <label className="block cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(doc.id, file);
                        }
                      }}
                    />
                    
                    <div className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-muted-foreground/30 rounded-lg hover:border-primary/50 transition-colors">
                      <Upload className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Clique para enviar
                      </span>
                    </div>
                  </label>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Validation Status */}
      {uploadedFiles.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            {completionRate === 100 ? (
              <CheckCircle className="h-5 w-5 text-success" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-warning" />
            )}
            <h3 className="text-sm font-medium text-foreground">
              Status de Validação
            </h3>
          </div>

          {completionRate === 100 ? (
            <p className="text-sm text-success">
              Todos os documentos obrigatórios foram enviados. O pedido está pronto para análise.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Envie todos os documentos obrigatórios para prosseguir com o pedido.
            </p>
          )}
        </div>
      )}
    </div>
  );
}