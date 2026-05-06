import CardObra from "./CardObra";
import getTituloPorIdioma from "../utils/getTituloPorIdioma";

function ListadoHorizontalObras({ obras, titulo, modo = "scroll" }) {
  return (
    <>
      <h2 style={{ marginLeft: "2rem", marginTop: "1rem" }}>{titulo}</h2>

      <div className={modo === "grid" ? "listado-grid-obras" : "listado-horizontal-obras"}>
        {obras.map((obra) => (
          <CardObra
            key={obra.idobra}
            titulo={getTituloPorIdioma(obra)}
            id={obra.idobra}
            obra={obra}
          />
        ))}
      </div>
    </>
  );
}

export default ListadoHorizontalObras;