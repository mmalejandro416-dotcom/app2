import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import './App.css';

function App() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [carrera, setCarrera] = useState('');
  const [edad, setEdad] = useState('');
  const [matricula, setMatricula] = useState('');
  const [telefono, setTelefono] = useState('');
  const [alumnos, setAlumnos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);

  // Load alumnos from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'alumnos'), snapshot => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setAlumnos(docs);
    });
    return () => unsub();
  }, []);

  const guardar = async e => {
    e.preventDefault();
    if (nombre && correo) {
      setSaving(true);
      const studentData = {
        nombre,
        correo,
        carrera: carrera || '',
        edad: edad || '',
        matricula: matricula || '',
        telefono: telefono || ''
      };
      
      try {
        if (editId) {
          // Update existing student
          await updateDoc(doc(db, 'alumnos', editId), studentData);
          setEditId(null);
        } else {
          // Create new student
          await addDoc(collection(db, 'alumnos'), studentData);
        }
        
        // Reset form fields
        setNombre('');
        setCorreo('');
        setCarrera('');
        setEdad('');
        setMatricula('');
        setTelefono('');
      } catch (err) {
        console.error('Error guardando alumno', err);
      } finally {
        setSaving(false);
      }
    }
  };

  const editAlumno = alu => {
    setEditId(alu.id);
    setNombre(alu.nombre || '');
    setCorreo(alu.correo || '');
    setCarrera(alu.carrera || '');
    setEdad(alu.edad || '');
    setMatricula(alu.matricula || '');
    setTelefono(alu.telefono || '');
  };

  const cancelarEdicion = () => {
    setEditId(null);
    setNombre('');
    setCorreo('');
    setCarrera('');
    setEdad('');
    setMatricula('');
    setTelefono('');
  };

  const eliminar = async id => {
    if (window.confirm('¿Está seguro de que desea eliminar este alumno?')) {
      try {
        await deleteDoc(doc(db, 'alumnos', id));
        // If we are currently editing the deleted student, cancel editing
        if (editId === id) {
          cancelarEdicion();
        }
      } catch (err) {
        console.error('Error eliminando alumno', err);
      }
    }
  };

  // Filter students based on search term
  const filtered = alumnos.filter(a =>
    a.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.carrera?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.matricula?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper for rendering student initials avatar
  const getInitials = (name) => {
    if (!name) return 'A';
    const parts = name.trim().split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  return (
    <main className="main-content">
      {/* Side-by-Side View */}
      <div className="row g-4 align-items-start">
        
        {/* COLUMN 1: FORM */}
        <div className="col-12 col-lg-4 col-xl-4">
          <div className="card card-raised">
            <div className={`card-raised-header ${editId ? 'warning' : 'info'}`}>
              <h5 className="card-raised-title">
                {editId ? 'Editar Alumno' : 'Registrar Alumno'}
              </h5>
              <p className="card-raised-subtitle">
                {editId ? 'Modificando alumno en Firestore' : 'Añadir nuevo registro a Firebase'}
              </p>
            </div>

            <div className="card-body p-4">
              <form onSubmit={guardar}>
                <div className="row g-3">
                  {/* Name */}
                  <div className="col-12">
                    <label htmlFor="nombre" className="form-label-material">Nombre Completo</label>
                    <input 
                      type="text" 
                      id="nombre"
                      placeholder="" 
                      value={nombre} 
                      onChange={e => setNombre(e.target.value)} 
                      className={`form-input-material ${editId ? 'warning' : 'info'}`}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="col-12">
                    <label htmlFor="correo" className="form-label-material">Correo Electrónico</label>
                    <input 
                      type="email" 
                      id="correo"
                      placeholder="" 
                      value={correo} 
                      onChange={e => setCorreo(e.target.value)} 
                      className={`form-input-material ${editId ? 'warning' : 'info'}`}
                      required
                    />
                  </div>

                  {/* Career */}
                  <div className="col-12">
                    <label htmlFor="carrera" className="form-label-material">Carrera</label>
                    <input 
                      type="text" 
                      id="carrera"
                      placeholder="" 
                      value={carrera} 
                      onChange={e => setCarrera(e.target.value)} 
                      className={`form-input-material ${editId ? 'warning' : 'info'}`}
                    />
                  </div>

                  {/* Age */}
                  <div className="col-6">
                    <label htmlFor="edad" className="form-label-material">Edad</label>
                    <input 
                      type="number" 
                      id="edad"
                      placeholder="" 
                      value={edad} 
                      onChange={e => setEdad(e.target.value)} 
                      className={`form-input-material ${editId ? 'warning' : 'info'}`}
                      min="15"
                      max="100"
                    />
                  </div>

                  {/* Roll number */}
                  <div className="col-6">
                    <label htmlFor="matricula" className="form-label-material">Matrícula</label>
                    <input 
                      type="text" 
                      id="matricula"
                      placeholder="" 
                      value={matricula} 
                      onChange={e => setMatricula(e.target.value)} 
                      className={`form-input-material ${editId ? 'warning' : 'info'}`}
                    />
                  </div>

                  {/* Phone */}
                  <div className="col-12">
                    <label htmlFor="telefono" className="form-label-material">Teléfono</label>
                    <input 
                      type="tel" 
                      id="telefono"
                      placeholder="" 
                      value={telefono} 
                      onChange={e => setTelefono(e.target.value)} 
                      className={`form-input-material ${editId ? 'warning' : 'info'}`}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                  {editId && (
                    <button 
                      type="button" 
                      className="btn btn-material btn-material-outline text-secondary border-secondary"
                      onClick={cancelarEdicion}
                      disabled={saving}
                    >
                      Cancelar
                    </button>
                  )}
                  <button 
                    type="submit" 
                    className={`btn btn-material ${editId ? 'btn-material-warning' : 'btn-material-info'}`}
                    disabled={saving}
                    style={editId ? { background: 'var(--bg-gradient-warning)', color: 'white', border: 'none', boxShadow: 'var(--shadow-warning)' } : {}}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Guardando...
                      </>
                    ) : editId ? 'Actualizar' : 'Registrar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* COLUMN 2: TABLE LIST */}
        <div className="col-12 col-lg-8 col-xl-8">
          <div className="card card-raised">
            <div className="card-raised-header primary">
              <h5 className="card-raised-title">Tabla de Alumnos</h5>
              <p className="card-raised-subtitle">Lista de alumnos activos y registrados en Firestore</p>
            </div>

            <div className="card-body px-0 pb-2">
              {/* Search Bar inside card */}
              <div className="px-4 pt-2 pb-3">
                <div className="position-relative">
                  <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-secondary">
                    <i className="bi bi-search" style={{ fontSize: '0.9rem' }}></i>
                  </span>
                  <input 
                    type="text" 
                    placeholder="Buscar alumnos por nombre, correo, carrera o matrícula..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ 
                      background: '#f8f9fa', 
                      borderRadius: '0.5rem',
                      border: '1px solid #e9ecef',
                      fontSize: '0.9rem',
                      width: '100%',
                      padding: '0.65rem 1rem 0.65rem 2.5rem',
                      outline: 'none',
                      color: '#495057'
                    }}
                  />
                </div>
              </div>
              {/* Table list */}
              <div className="table-responsive">
                <table className="table table-clean align-items-center mb-0">
                  <thead>
                    <tr>
                      <th>Alumno</th>
                      <th>Carrera</th>
                      <th>Edad</th>
                      <th>Matrícula / ID</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length > 0 ? (
                      filtered.map(alu => (
                        <tr key={alu.id}>
                          <td>
                            <div className="d-flex align-items-center px-2 py-1">
                              {/* Avatar initials */}
                              <div 
                                className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3 text-primary fw-bold"
                                style={{ width: '36px', height: '36px', minWidth: '36px', fontSize: '0.85rem', border: '1px solid rgba(26, 115, 232, 0.1)' }}
                              >
                                {getInitials(alu.nombre)}
                              </div>
                              <div className="d-flex flex-column justify-content-center">
                                <h6 className="table-name">{alu.nombre}</h6>
                                <p className="table-sub">{alu.correo}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="text-xs fw-semibold text-dark text-capitalize">
                              {alu.carrera || 'No registrada'}
                            </span>
                          </td>
                          <td>
                            <span className="text-xs font-weight-bold">
                              {alu.edad ? `${alu.edad} años` : '---'}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-light text-secondary border rounded-pill px-2 py-1" style={{ fontSize: '0.75rem' }}>
                              {alu.matricula || alu.id?.substring(0, 8)}
                            </span>
                          </td>
                          <td className="align-middle">
                            <div className="d-flex justify-content-center gap-2">
                              <button 
                                className="btn btn-link text-warning p-1 border-0"
                                onClick={() => editAlumno(alu)}
                                title="Editar"
                                aria-label={`Editar ${alu.nombre}`}
                              >
                                <i className="bi bi-pencil-square" style={{ fontSize: '1.1rem' }}></i>
                              </button>
                              <button 
                                className="btn btn-link text-danger p-1 border-0"
                                onClick={() => eliminar(alu.id)}
                                title="Eliminar"
                                aria-label={`Eliminar ${alu.nombre}`}
                              >
                                <i className="bi bi-trash3" style={{ fontSize: '1.1rem' }}></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          <div className="text-muted">
                            <i className="bi bi-inbox d-block mb-2" style={{ fontSize: '2rem' }}></i>
                            No se encontraron alumnos registrados.
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

export default App;