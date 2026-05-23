function Estudiante({ id, nombre, correo, matricula, carrera, telefono, onEdit, onDelete, onConsult }) {
  return (
    <div className="card h-100 shadow-sm border-0 hover-shadow transition">
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="badge bg-primary-subtle text-primary border-0 rounded-pill px-3">
            ID: {matricula || (id ? id.substring(0, 6) : '---')}
          </span>
          <small className="text-muted"><i className="bi bi-person-badge"></i></small>
        </div>
        
        <h5 className="card-title fw-bold mb-1 text-dark text-capitalize">
          {nombre}
        </h5>
        
        <p className="card-text text-secondary small mb-3">
          <i className="bi bi-envelope me-2"></i>
          {correo}
        </p>

        {/* Action buttons */}
        <div className="d-flex justify-content-between mt-3 pt-2 border-top gap-1">
          <button 
            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
            onClick={onConsult}
            title="Consultar detalles"
          >
            <i className="bi bi-eye"></i> Ver
          </button>
          <button 
            className="btn btn-sm btn-outline-warning d-flex align-items-center gap-1"
            onClick={onEdit}
            title="Editar alumno"
          >
            <i className="bi bi-pencil"></i> Editar
          </button>
          <button 
            className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
            onClick={onDelete}
            title="Eliminar alumno"
          >
            <i className="bi bi-trash"></i> Borrar
          </button>
        </div>
      </div>
    </div>
  );
}
export default Estudiante;