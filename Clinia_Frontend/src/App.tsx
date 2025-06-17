
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SearchResultsPage from "./pages/SearchResults";
import BusinessDetail from "./pages/BusinessDetail";
import AjouterStructure from "./pages/AjouterStructure";
import NotFound from "./pages/NotFound";
import ConnexionUser from "./pages/ConnexionUser";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/recherche" element={<SearchResultsPage />} />
          <Route path="/centre/:id" element={<BusinessDetail />} />
          <Route path="/ajouter-centre" element={<AjouterStructure />} />
            <Route path="/gerer-connexion" element={<ConnexionUser />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
