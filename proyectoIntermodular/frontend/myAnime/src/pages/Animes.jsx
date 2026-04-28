import { useState, useEffect } from "react";
import ListadoHorizontalObras from "../components/ListadoHorizontalObras";
import Footer from "../components/Footer";
import { apiUrl } from "../config.js";

function Animes() {
  const [obras, setObras] = useState([]);

  useEffect(() => {
    async function getObras() {
      const response = await fetch(
        apiUrl + "/obra/getObrasTipo?tipo=anime&orden=titulo"
      );

      if (response.ok) {
        const data = await response.json();
        setObras(data.datos || []);
      }
    }

    getObras();
  }, []);

  return (
    <>
      <div className="main-content">
        <div className="content">
          <ListadoHorizontalObras
            obras={obras}
            modo="grid"
          />
        </div>

      </div>
    </>
  );
}

export default Animes;