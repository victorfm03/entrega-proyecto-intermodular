import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from './pages/Home.jsx';
import Animes from './pages/Animes.jsx';
import "./globalStyle.css";
import { ThemeProviderWrapper } from "./ThemeProvider.jsx";
import Mangas from './pages/Mangas.jsx';
import DetalleObra from './pages/DetalleObra.jsx';
import Register from './pages/Registro.jsx';
import Login from './pages/Logind.jsx';
import Perfil from './pages/Perfil.jsx';

let router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      { path: "animes", element: <Animes /> },
      { path: "mangas", element: <Mangas /> },
      { path: "register", element: <Register /> },
      {path: "login", element: <Login />},
      {path: "perfil", element: <Perfil />},
      { path: "/obra/:idobra", element: <DetalleObra /> } // <-- nueva ruta
    ]
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProviderWrapper>
      <RouterProvider router={router} />
    </ThemeProviderWrapper>
  </StrictMode>
);