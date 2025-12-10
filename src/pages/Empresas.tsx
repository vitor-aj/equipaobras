import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Building2, Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useClientes } from "@/contexts/ClientesContext";
import { useToast } from "@/hooks/use-toast";

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

const Empresas = () => {
  const { empresasFornecedoras, addEmpresaFornecedora, updateEmpresaFornecedora, deleteEmpresaFornecedora } = useClientes();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState<{ id: string; nome: string; cnpj?: string } | null>(null);
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");

  const filteredEmpresas = empresasFornecedoras.filter(
    (empresa) =>
      empresa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (empresa.cnpj && empresa.cnpj.includes(searchTerm))
  );

  const handleOpenModal = (empresa?: { id: string; nome: string; cnpj?: string }) => {
    if (empresa) {
      setEditingEmpresa(empresa);
      setNome(empresa.nome);
      setCnpj(empresa.cnpj || "");
    } else {
      setEditingEmpresa(null);
      setNome("");
      setCnpj("");
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmpresa(null);
    setNome("");
    setCnpj("");
  };

  const handleSave = () => {
    if (!nome.trim()) {
      toast({
        title: "Erro",
        description: "O nome da empresa é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    if (editingEmpresa) {
      updateEmpresaFornecedora(editingEmpresa.id, {
        nome: nome.trim(),
        cnpj: cnpj.trim() || undefined,
      });
      toast({
        title: "Empresa Atualizada",
        description: "Os dados da empresa foram atualizados com sucesso.",
      });
    } else {
      addEmpresaFornecedora({
        nome: nome.trim(),
        cnpj: cnpj.trim() || undefined,
      });
      toast({
        title: "Empresa Cadastrada",
        description: "A empresa fornecedora foi cadastrada com sucesso.",
      });
    }
    handleCloseModal();
  };

  const handleDelete = (id: string, empresaNome: string) => {
    deleteEmpresaFornecedora(id);
    toast({
      title: "Empresa Removida",
      description: `A empresa "${empresaNome}" foi removida com sucesso.`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Empresas Fornecedoras</h1>
          <p className="text-muted-foreground">
            Gerencie as empresas disponíveis para faturamento
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenModal()}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Empresa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingEmpresa ? "Editar Empresa" : "Nova Empresa Fornecedora"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Empresa *</Label>
                <Input
                  id="nome"
                  placeholder="Nome da empresa fornecedora"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ (opcional)</Label>
                <Input
                  id="cnpj"
                  placeholder="00.000.000/0000-00"
                  value={cnpj}
                  onChange={(e) => setCnpj(formatCNPJ(e.target.value))}
                  maxLength={18}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={handleCloseModal} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleSave} className="flex-1">
                  {editingEmpresa ? "Salvar Alterações" : "Cadastrar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Lista de Empresas
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredEmpresas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma empresa encontrada</p>
              <p className="text-sm">Clique em "Nova Empresa" para cadastrar</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmpresas.map((empresa) => (
                  <TableRow key={empresa.id}>
                    <TableCell className="font-medium">{empresa.nome}</TableCell>
                    <TableCell>{empresa.cnpj || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenModal(empresa)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(empresa.id, empresa.nome)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Empresas;
