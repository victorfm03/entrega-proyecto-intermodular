import { MDBCard, MDBCardBody, MDBCardImage, MDBCardText } from "mdb-react-ui-kit";
import { apiUrl } from "../config.js";
import { useNavigate } from "react-router-dom";

function CardObra({ titulo, id, obra }) { 
  const url = `${apiUrl}/obra/${id}/imagen`;
  const navigate = useNavigate();

  return (
    <MDBCard
      className="card-obra"
      style={{ cursor: "pointer", width: "280px" }}
      onClick={() => navigate(`/obra/${id}`)}
    >
      <MDBCardImage src={url} alt={titulo} position="top" style={{ height: "250px", objectFit: "cover" }} />
      <MDBCardBody>
        {obra.estado === "proximamente" && obra.fechalanzamiento ? obra.fechalanzamiento : null}
        <MDBCardText style={{ textAlign: "center" }}>{titulo}</MDBCardText>
      </MDBCardBody>
    </MDBCard>
  );
}

export default CardObra;