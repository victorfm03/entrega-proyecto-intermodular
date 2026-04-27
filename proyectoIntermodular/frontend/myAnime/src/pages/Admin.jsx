import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MDBBtn, MDBContainer, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem } from 'mdb-react-ui-kit';

function Admin() {
  const navigate = useNavigate();

  return (
    <MDBContainer className="py-5">
      <div className="mb-4">
        <MDBBtn 
          onClick={() => navigate("/admin/registro")}
          style={{ backgroundColor: '#e3f2fd', color: '#333', border: '1px solid #bbdefb' }}
          className="me-2"
        >
          Crear un Administrador
        </MDBBtn>
</div>
<div className="my-4">
        <MDBBtn 
          onClick={() => navigate("/admin/usuarios")}
          style={{ backgroundColor: '#e3f2fd', color: '#333', border: '1px solid #bbdefb' }}
          className="me-2"
        >
          Listado de Usuarios
        </MDBBtn>
      </div>

      <div className="mb-4">
        <MDBDropdown group className='shadow-0'>
          <MDBDropdownToggle style={{ backgroundColor: '#e3f2fd', color: '#333', border: '1px solid #bbdefb' }} className="w-100">
            Añadir Nueva Obra
          </MDBDropdownToggle>
          <MDBDropdownMenu>
            <MDBDropdownItem link onClick={() => navigate("/admin/crear/anime")}>Anime</MDBDropdownItem>
            <MDBDropdownItem link onClick={() => navigate("/admin/crear/manga")}>Manga</MDBDropdownItem>
          </MDBDropdownMenu>
        </MDBDropdown>
      </div>
      <div>
      <MDBBtn 
          onClick={() => navigate("/admin/obras")}
          style={{ backgroundColor: '#e3f2fd', color: '#333', border: '1px solid #bbdefb' }}
          className="me-2"
        >
          Listado de obras
        </MDBBtn>
      </div>
    </MDBContainer>
  );
}
export default Admin;