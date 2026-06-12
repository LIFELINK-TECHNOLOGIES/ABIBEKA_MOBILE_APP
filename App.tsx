import RootNavigation from "./src/navigation/rootNavigation";
import { I18nextProvider } from 'react-i18next';
import i18n, { loadLanguage }  from "./src/utils/i18n"
import { useEffect } from "react";


export default function App() {
   useEffect(() => { loadLanguage(); }, []);
  return (
      <I18nextProvider i18n={i18n}>
       <RootNavigation />
      </I18nextProvider> 
  )
 
}

