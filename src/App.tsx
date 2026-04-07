import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "./pages/Dashboard";
import Sites from "./pages/Sites";
import Indexing from "./pages/Indexing";
import SearchPage from "./pages/SearchPage";
import Stats from "./pages/Stats";
import DatabasePage from "./pages/DatabasePage";
import Account from "./pages/Account";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sites" element={<Sites />} />
          <Route path="/indexing" element={<Indexing />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/database" element={<DatabasePage />} />
          <Route path="/account" element={<Account />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
