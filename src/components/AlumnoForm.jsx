import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './AlumnoForm.css';

const AlumnoForm = () => {
  const [alumno, setAlumno] = useState({
    nombre: '',
    correo: '',
    edad: '',
    carrera: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const docRef = doc(db, "alumnos", "alumno1");

  useEffect(() => {
    const fetchAlumno = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAlumno(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumno();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlumno(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Usamos setDoc con merge: true para que cree el documento si no existe o lo actualice
      await setDoc(docRef, alumno, { merge: true });
      setMessage({ type: 'success', text: '¡Datos actualizados con éxito!' });
    } catch (error) {
      console.error("Error updating document:", error);
      setMessage({ type: 'error', text: 'Error al actualizar los datos.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Cargando datos...</div>;

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="premium-form">
        <div className="form-header">
          <h2>Gestión de Alumno</h2>
          <p>Proyecto: loginflutter-ba931</p>
        </div>

        <div className="input-group">
          <label htmlFor="nombre">Nombre Completo</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={alumno.nombre || ''}
            onChange={handleChange}
            placeholder="Ej. Juan Pérez"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="correo">Correo Electrónico</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={alumno.correo || ''}
            onChange={handleChange}
            placeholder="ejemplo@correo.com"
            required
          />
        </div>

        <div className="row">
          <div className="input-group">
            <label htmlFor="edad">Edad</label>
            <input
              type="number"
              id="edad"
              name="edad"
              value={alumno.edad || ''}
              onChange={handleChange}
              placeholder="00"
            />
          </div>
          <div className="input-group">
            <label htmlFor="carrera">Carrera</label>
            <input
              type="text"
              id="carrera"
              name="carrera"
              value={alumno.carrera || ''}
              onChange={handleChange}
              placeholder="Ingeniería..."
            />
          </div>
        </div>

        <button type="submit" disabled={saving} className="submit-btn">
          {saving ? 'Guardando...' : 'Actualizar Alumno'}
        </button>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
};

export default AlumnoForm;
