import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Clientes from "@/pages/Clientes";
import Prestations from "@/pages/Prestations";
import RendezVousPage from "@/pages/RendezVous";
import Fidelite from "@/pages/Fidelite";
import Rappels from "@/pages/Rappels";
import Campagnes from "@/pages/Campagnes";
import Parametres from "@/pages/Parametres";
import Stock from "@/pages/Stock";
import Finances from "@/pages/Finances";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/prestations" element={<Prestations />} />
            <Route path="/rendez-vous" element={<RendezVousPage />} />
            <Route path="/fidelite" element={<Fidelite />} />
            <Route path="/rappels" element={<Rappels />} />
            <Route path="/campagnes" element={<Campagnes />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/finances" element={<Finances />} />
            <Route path="/parametres" element={<Parametres />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
