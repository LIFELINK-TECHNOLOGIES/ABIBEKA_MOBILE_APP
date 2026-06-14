import RootNavigation from "./src/navigation/rootNavigation";
import { I18nextProvider } from 'react-i18next';
import i18n, { loadLanguage }  from "./src/utils/i18n"
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";



export default function App() {
  const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60 * 1000, // 1 minute
    },
  },
});


   useEffect(() => { loadLanguage(); }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
       <RootNavigation />
      </I18nextProvider> 
     </QueryClientProvider>
      
  )
 
}

