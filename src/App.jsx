import { useState, useEffect } from 'react';
import Estudiante from './components/Estudiante';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [alumnos, setAlumnos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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
      try {
        await addDoc(collection(db, 'alumnos'), { nombre, correo });
        setNombre('');
        setCorreo('');
      } catch (err) {
        console.error('Error guardando alumno', err);
      }
    }
  };

  const editAlumno = alu => {
    setNombre(alu.nombre || '');
    setCorreo(alu.correo || '');
    // could store alu.id for future updates
  };

  const eliminar = async id => {
    try {
      await deleteDoc(doc(db, 'alumnos', id));
    } catch (err) {
      console.error('Error eliminando alumno', err);
    }
  };

  const filtered = alumnos.filter(a =>
    a.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.correo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <section id="center">
        <button className="counter" onClick={() => setCount(c => c + 1)}>
          Count is {count}
        </button>
      </section>

      <div className="ticks" />

      {/* Registro Section */}
      <section className="registro-section" style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
        <h2>Registrar Alumno</h2>
        <form onSubmit={guardar} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} style={{ padding: '10px' }} />
          <input type="email" placeholder="Correo" value={correo} onChange={e => setCorreo(e.target.value)} style={{ padding: '10px' }} />
          <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>Guardar en Firebase</button>
        </form>
      </section>

      <div className="ticks" />

      {/* Firebase Section */}
      <section className="firebase-section" style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Nuevos Alumnos (Firebase)</h2>
        <input
          type="text"
          placeholder="Buscar alumno por nombre o correo"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
          style={{ marginBottom: '1rem', maxWidth: '400px' }}
        />
        {filtered.map(alu => (
          <Estudiante
            key={alu.id}
            id={alu.id}
            nombre={alu.nombre}
            correo={alu.correo}
            onEdit={() => editAlumno(alu)}
            onDelete={() => eliminar(alu.id)}
          />
        ))}
      </section>

      <div className="ticks" />
      <section id="spacer" />
    </>
  );
}

export default App;