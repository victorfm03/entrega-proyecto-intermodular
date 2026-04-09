import { useState, useEffect } from "react";
import ListadoHorizontalObras from "../components/ListadoHorizontalObras";
import Footer from "../components/Footer";
import { apiUrl } from "../config.js";

function Mangas() {
  const [titulo, setTitulo] = useState([]);

  useEffect(() => {

    async function getObras() {

      let response = await fetch(apiUrl + "/obra/getObrasTipo?tipo=manga&orden=titulo"); 
      if (response.ok) { 
        let data = await response.json(); 
        setTitulo(data.datos); 
      }

    }

    getObras();
  }, []);


return (
    <>
      
        <div className="main-content">

          <div className="content">

              <>
                <ListadoHorizontalObras obras={titulo} modo="grid"/>
              </>

          </div>

           <Footer />

        </div>
      
    </>
  );
}

export default Mangas;