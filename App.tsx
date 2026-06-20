import RootNavigation from "./src/navigation/rootNavigation";
import { I18nextProvider } from 'react-i18next';
import i18n, { loadLanguage } from "./src/utils/i18n";
import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./src/utils/queryClient"; 

export default function App() {
  useEffect(() => {
    loadLanguage();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <RootNavigation />
      </I18nextProvider>
    </QueryClientProvider>
  );
}