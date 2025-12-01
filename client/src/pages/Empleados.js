import React, { useState, useEffect } from 'react';
import { empleadosAPI, conveniosAPI } from '../services/api';
import './Empleados.css';

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [convenios, setConvenios] = useState([]);
  const [categorias, setCategorias] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState(null);
  const [formData, setFormData] = useState({
    legajo: '',
    nombre: '',
    apellido: '',
    dni: '',
    cuil: '',
    fecha_ingreso: '',
    categoria: '',
    convenio_id: '',
    sueldo_basico: '',
    fecha_nacimiento: '',
    domicilio: '',
    telefono: '',
    email: '',
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [empleadosRes, conveniosRes] = await Promise.all([
        empleadosAPI.getAll(),
        conveniosAPI.getAll(),
      ]);

      setEmpleados(empleadosRes.data);
      setConvenios(conveniosRes.data);

      // Cargar categorías para cada convenio
      const categoriasMap = {};
      for (const convenio of conveniosRes.data) {
        const catRes = await conveniosAPI.getCategorias(convenio.id);
        categoriasMap[convenio.id] = catRes.data;
      }
      setCategorias(categoriasMap);
    } catch (error) {
      console.error('Error cargando datos:', error);
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        alert('⚠️ Error: El servidor backend no está corriendo.\n\nPor favor:\n1. Abre una terminal\n2. Ejecuta: cd "/Users/nico/Copia Xubio" && npm run dev\n3. Espera a que el servidor inicie\n4. Recarga esta página');
      } else {
        alert('Error al cargar los datos: ' + (error.response?.data?.error || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Si cambia el convenio, cargar categorías
    if (name === 'convenio_id') {
      cargarCategoriasConvenio(value);
    }
  };

  const cargarCategoriasConvenio = async (convenioId) => {
    if (!convenioId) return;
    try {
      const res = await conveniosAPI.getCategorias(convenioId);
      setCategorias({ ...categorias, [convenioId]: res.data });
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        convenio_id: formData.convenio_id || null,
        sueldo_basico: formData.sueldo_basico ? parseFloat(formData.sueldo_basico) : null,
      };

      if (editingEmpleado) {
        await empleadosAPI.update(editingEmpleado.id, data);
        alert('Empleado actualizado exitosamente');
      } else {
        await empleadosAPI.create(data);
        alert('Empleado creado exitosamente');
      }

      setShowModal(false);
      resetForm();
      cargarDatos();
    } catch (error) {
      console.error('Error guardando empleado:', error);
      alert('Error al guardar el empleado');
    }
  };

  const handleEdit = (empleado) => {
    setEditingEmpleado(empleado);
    setFormData({
      legajo: empleado.legajo || '',
      nombre: empleado.nombre || '',
      apellido: empleado.apellido || '',
      dni: empleado.dni || '',
      cuil: empleado.cuil || '',
      fecha_ingreso: empleado.fecha_ingreso || '',
      categoria: empleado.categoria || '',
      convenio_id: empleado.convenio_id || '',
      sueldo_basico: empleado.sueldo_basico || '',
      fecha_nacimiento: empleado.fecha_nacimiento || '',
      domicilio: empleado.domicilio || '',
      telefono: empleado.telefono || '',
      email: empleado.email || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de que desea desactivar este empleado?')) {
      return;
    }

    try {
      await empleadosAPI.delete(id);
      alert('Empleado desactivado exitosamente');
      cargarDatos();
    } catch (error) {
      console.error('Error eliminando empleado:', error);
      alert('Error al desactivar el empleado');
    }
  };

  const resetForm = () => {
    setFormData({
      legajo: '',
      nombre: '',
      apellido: '',
      dni: '',
      cuil: '',
      fecha_ingreso: '',
      categoria: '',
      convenio_id: '',
      sueldo_basico: '',
      fecha_nacimiento: '',
      domicilio: '',
      telefono: '',
      email: '',
    });
    setEditingEmpleado(null);
  };

  const categoriasDisponibles = formData.convenio_id ? (categorias[formData.convenio_id] || []) : [];

  if (loading) {
    return (
      <div className="empleados">
        <h1>Gestión de Empleados</h1>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="empleados">
      <div className="empleados-header">
        <h1>Gestión de Empleados</h1>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          ➕ Nuevo Empleado
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Legajo</th>
              <th>Nombre Completo</th>
              <th>DNI</th>
              <th>Convenio</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                  No hay empleados registrados. Haga clic en "Nuevo Empleado" para agregar uno.
                </td>
              </tr>
            ) : (
              empleados.map((empleado) => (
                <tr key={empleado.id}>
                  <td>{empleado.legajo}</td>
                  <td>{empleado.nombre} {empleado.apellido}</td>
                  <td>{empleado.dni}</td>
                  <td>{empleado.convenio_nombre || '-'}</td>
                  <td>{empleado.categoria_nombre || empleado.categoria || '-'}</td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleEdit(empleado)}
                      style={{ marginRight: '0.5rem' }}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(empleado.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingEmpleado ? 'Editar Empleado' : 'Nuevo Empleado'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="empleado-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Legajo *</label>
                  <input
                    type="text"
                    name="legajo"
                    className="input"
                    value={formData.legajo}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>DNI *</label>
                  <input
                    type="text"
                    name="dni"
                    className="input"
                    value={formData.dni}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    className="input"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Apellido *</label>
                  <input
                    type="text"
                    name="apellido"
                    className="input"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>CUIL</label>
                  <input
                    type="text"
                    name="cuil"
                    className="input"
                    value={formData.cuil}
                    onChange={handleInputChange}
                    placeholder="XX-XXXXXXXX-X"
                  />
                </div>
                <div className="form-group">
                  <label>Fecha de Ingreso</label>
                  <input
                    type="date"
                    name="fecha_ingreso"
                    className="input"
                    value={formData.fecha_ingreso}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Convenio</label>
                  <select
                    name="convenio_id"
                    className="input"
                    value={formData.convenio_id}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccione un convenio</option>
                    {convenios.map((convenio) => (
                      <option key={convenio.id} value={convenio.id}>
                        {convenio.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Categoría</label>
                  <select
                    name="categoria"
                    className="input"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    disabled={!formData.convenio_id}
                  >
                    <option value="">Seleccione una categoría</option>
                    {categoriasDisponibles.map((cat) => (
                      <option key={cat.id} value={cat.codigo}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Sueldo Básico</label>
                  <input
                    type="number"
                    name="sueldo_basico"
                    className="input"
                    value={formData.sueldo_basico}
                    onChange={handleInputChange}
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                <div className="form-group">
                  <label>Fecha de Nacimiento</label>
                  <input
                    type="date"
                    name="fecha_nacimiento"
                    className="input"
                    value={formData.fecha_nacimiento}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Domicilio</label>
                <input
                  type="text"
                  name="domicilio"
                  className="input"
                  value={formData.domicilio}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    className="input"
                    value={formData.telefono}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    className="input"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingEmpleado ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Empleados;

