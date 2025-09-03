import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DocumentUpload } from "@/components/pedidos/DocumentUpload";
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Building, 
  DollarSign, 
  FileText,
  ChevronDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const NovoPedido = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cliente: "",
    valor: "",
    observacoes: ""
  });

  // Mock data - seria conectado ao banco via Supabase
  const clientes = [
    { id: "1", nome: "Construtora ABC Ltda" },
    { id: "2", nome: "Obras & Cia" },
    { id: "3", nome: "Edificações Norte" },
    { id: "4", nome: "Reformas Sul" }
  ];

  const handleSubmit = (action: "save" | "send") => {
    // Aqui seria integrado com Supabase para salvar/enviar o pedido
    console.log("Action:", action, "Data:", formData);
    
    if (action === "send") {
      // Simular envio para análise
      alert("Pedido enviado para análise com sucesso!");
      navigate("/pedidos");
    } else {
      alert("Pedido salvo como rascunho!");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate("/pedidos")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Novo Pedido de Aprovação
          </h1>
          <p className="text-muted-foreground mt-1">
            Preencha os dados e envie os documentos para análise
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-custom-md border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cliente Select */}
              <div className="space-y-2">
                <Label htmlFor="cliente" className="text-sm font-medium">
                  Cliente *
                </Label>
                <div className="relative">
                  <select
                    id="cliente"
                    value={formData.cliente}
                    onChange={(e) => setFormData(prev => ({...prev, cliente: e.target.value}))}
                    className="w-full h-10 px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
                  >
                    <option value="">Selecione um cliente...</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nome}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Valor */}
              <div className="space-y-2">
                <Label htmlFor="valor" className="text-sm font-medium">
                  Valor do Pedido *
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="valor"
                    type="text"
                    placeholder="0,00"
                    value={formData.valor}
                    onChange={(e) => setFormData(prev => ({...prev, valor: e.target.value}))}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Observações */}
              <div className="space-y-2">
                <Label htmlFor="observacoes" className="text-sm font-medium">
                  Observações
                </Label>
                <Textarea
                  id="observacoes"
                  placeholder="Adicione informações adicionais sobre o pedido..."
                  value={formData.observacoes}
                  onChange={(e) => setFormData(prev => ({...prev, observacoes: e.target.value}))}
                  rows={4}
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2"
                  onClick={() => handleSubmit("save")}
                >
                  <Save className="h-4 w-4" />
                  Salvar como Rascunho
                </Button>
                
                <Button 
                  className="w-full flex items-center gap-2"
                  onClick={() => handleSubmit("send")}
                  disabled={!formData.cliente || !formData.valor}
                >
                  <Send className="h-4 w-4" />
                  Enviar para Análise
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card className="shadow-custom-md border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Status do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <span className="text-sm font-medium text-muted-foreground">
                    Rascunho
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Criado em:</span>
                  <span className="text-sm font-medium text-foreground">
                    {new Date().toLocaleDateString('pt-BR')}
                  </span>
                </div>
                
                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Preencha os dados e envie todos os documentos obrigatórios para prosseguir com a análise.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documents Section */}
        <div className="lg:col-span-2">
          <Card className="shadow-custom-md border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Upload de Documentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentUpload />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NovoPedido;