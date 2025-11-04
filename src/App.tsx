import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Pedidos from "./pages/Pedidos";
import NovoPedido from "./pages/NovoPedido";
import Financeiro from "./pages/Financeiro";
import Configuracoes from "./pages/Configuracoes";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import { ClientesProvider } from "./contexts/ClientesContext";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Verificar se usuário está autenticado no localStorage
    const authStatus = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(authStatus === "true");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    setIsAuthenticated(false);
  };

  // Mostrar loading enquanto verifica autenticação
  if (isAuthenticated === null) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Carregando...</p>
            </div>
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // Se não estiver autenticado, mostrar telas de login
  if (!isAuthenticated) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ClientesProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </ClientesProvider>
      </TooltipProvider>
    </QueryClientProvider>
    );
  }

  // Se estiver autenticado, mostrar o sistema
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ClientesProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              } />
              <Route path="/clientes" element={
                <AppLayout>
                  <Clientes />
                </AppLayout>
              } />
              <Route path="/pedidos" element={
                <AppLayout>
                  <Pedidos />
                </AppLayout>
              } />
              <Route path="/pedidos/novo" element={
                <AppLayout>
                  <NovoPedido />
                </AppLayout>
              } />
              <Route path="/financeiro" element={
                <AppLayout>
                  <Financeiro />
                </AppLayout>
              } />
              <Route path="/configuracoes" element={
                <AppLayout>
                  <Configuracoes />
                </AppLayout>
              } />
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/forgot-password" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ClientesProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
