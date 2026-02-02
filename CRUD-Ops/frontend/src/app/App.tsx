import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router";
import { AuthProvider } from "../auth/AuthContext";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
    </AuthProvider>
  );  
}

export default App;
