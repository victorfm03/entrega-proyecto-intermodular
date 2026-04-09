import { MDBCard, MDBCardBody, MDBCardImage, MDBCardText } from "mdb-react-ui-kit";
import { apiUrl } from "../config.js";
import { useNavigate } from "react-router-dom";

function CardObra({ titulo, id }) {
  const url = `${apiUrl}/obra/${id}/imagen`;
  const navigate = useNavigate();

  return (
    <MDBCard
      className="card-obra"
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/obra/${id}`)}
    >
      <MDBCardImage src={url} alt={titulo} position="top" style={{ height: "250px", objectFit: "cover" }} />
      <MDBCardBody>
        <MDBCardText style={{ textAlign: "center" }}>{titulo}</MDBCardText>
      </MDBCardBody>
    </MDBCard>
  );
}

export default CardObra;