import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import { createBrowserRouter, RouterProvider } from "react-router";

import Home from "./pages/Home.jsx";
import Animes from "./pages/Animes.jsx";
import "./globalStyle.css";
import { ThemeProviderWrapper } from "./ThemeProvider.jsx";
import Mangas from "./pages/Mangas.jsx";
import DetalleObra from "./pages/DetalleObra.jsx";
import Register from "./pages/Registro.jsx";
import Login from "./pages/Logind.jsx";
import Perfil from "./pages/Perfil.jsx";
import { FavoritesProvider } from "./components/FavoritesContext.jsx";
import Admin from "./pages/Admin.jsx";
import RegisterAdmin from "./pages/RegistroAdmin.jsx";
import ListadoUsuarios from "./pages/ListadoUsuarios.jsx";
import ModificarUsuario from "./pages/ModificarUsuario.jsx";
import CrearObra from "./pages/CrearObra.jsx";
import ModificarObra from "./pages/ModificarObra.jsx";
import ListadoObras from "./pages/ListadoObras.jsx";
import Quiz from "./pages/Quiz.jsx";
import Search from "./pages/Search.jsx";



let router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      { path: "animes", element: <Animes /> },
      { path: "mangas", element: <Mangas /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "perfil", element: <Perfil /> },
      { path: "admin", element: <Admin /> },
      { path: "admin/registro", element: <RegisterAdmin /> },
      { path: "admin/usuarios", element: <ListadoUsuarios /> },
      {
        path: "admin/usuarios/modificar/:idUsuario",
        element: <ModificarUsuario />,
      },
      { path: "admin/obras", element: <ListadoObras /> },
      {
        path: "admin/obras/modificar/:idObra",
        element: <ModificarObra />,
      },
      { path: "admin/crear/:tipo", element: <CrearObra /> },
      { path: "quiz", element: <Quiz /> },
      {
        path: "/obra/:idobra",
        element: <DetalleObra />,
      },
      { path: "search", element: <Search />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>

    <ThemeProviderWrapper>
      <FavoritesProvider>
        <RouterProvider router={router} />
      </FavoritesProvider>
    </ThemeProviderWrapper>
  </StrictMode>
);