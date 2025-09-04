import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Pedidos from "./pages/Pedidos";
import NovoPedido from "./pages/NovoPedido";
import Financeiro from "./pages/Financeiro";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
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
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold mb-4">Configurações</h1>
                <p className="text-muted-foreground">Em desenvolvimento...</p>
              </div>
            </AppLayout>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
