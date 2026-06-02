import React, { useState } from "react";
import { Card, Table, Button, Badge, Row, Col, Form, InputGroup, Modal } from "react-bootstrap";
import { HiOutlineUser, HiOutlineSearch, HiOutlineIdentification } from "react-icons/hi";
import { RiAddCircleLine, RiUserFollowLine, RiUserStarLine } from "react-icons/ri";
import { LuUser, LuExternalLink, LuMail, LuPhone } from "react-icons/lu";

const Clientes = ({ theme, darkThemeColors }) => {
  // ESTADO PARA EL MODAL
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  // ESTADÍSTICAS DE CLIENTES
  const stats = [
    { title: 'TOTAL CLIENTES', value: '842', icon: <HiOutlineUser size={24}/>, color: 'primary' },
    { title: 'CLIENTES VIP', value: '124', icon: <RiUserStarLine size={24}/>, color: 'warning' },
    { title: 'NUEVOS (MES)', value: '+28', icon: <RiUserFollowLine size={24}/>, color: 'success' },
  ];

  const listaClientes = [
    { id: 1, nombre: "Carlos Sanchez", doc: "72104452", correo: "carlos.s@email.com", telf: "987 654 321", status: "VIP", color: "warning" },
    { id: 2, nombre: "Ana Gomez", doc: "09223310", correo: "ana.g@email.com", telf: "955 123 444", status: "Frecuente", color: "success" },
  ];

  return (
    <>
      {/* ENCABEZADO Y BOTÓN NUEVO */}
      <div className="mb-4">
        <small className="text-uppercase text-muted fw-bold" style={{ fontSize: '11px', letterSpacing: '1.5px' }}>
          ADMINISTRACIÓN <span className="mx-1 text-secondary">/</span> <span className="text-success">CLIENTES</span>
        </small>
        <div className="d-flex justify-content-between align-items-end mt-2">
          <div>
            <h2 className="fw-bold mb-0">Gestión de Clientes</h2>
            <p className="mb-0" style={{ color: darkThemeColors?.textSecondary || '#6c757d' }}>Base de datos y fidelización.</p>
          </div>

          <Button 
            variant="success" 
            onClick={handleShow}
            className="fw-bold px-4 py-2 d-flex align-items-center border-0 shadow-sm" 
            style={{borderRadius: "10px"}}
          >
            <RiAddCircleLine className="me-2" size={20} /> Nuevo Cliente
          </Button>
        </div>
      </div>

      {/* TARJETAS DE ESTADÍSTICAS */}
      <Row className="g-3 mb-4">
        {stats.map((stat, i) => (
          <Col md={4} key={i}>
            <Card className="border-0 shadow-sm p-3 rounded-4" style={{ 
              backgroundColor: theme === 'light' ? '#fff' : darkThemeColors?.cardBg,
              border: theme === 'dark' ? `1px solid ${darkThemeColors?.border}` : 'none'
            }}>
              <div className="d-flex align-items-center">
                <div className={`bg-${stat.color} bg-opacity-10 p-3 rounded-3 me-3 text-${stat.color}`}>
                  {stat.icon}
                </div>
                <div>
                  <small className="text-muted fw-bold d-block" style={{fontSize: '10px'}}>{stat.title}</small>
                  <h4 className="fw-bold mb-0">{stat.value}</h4>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* BARRA DE BÚSQUEDA */}
      <div className="d-flex gap-2 mb-3">
        <InputGroup className="shadow-sm rounded-3 overflow-hidden" style={{maxWidth: '300px'}}>
          <InputGroup.Text 
            className="border-0" 
            style={{ 
              backgroundColor: theme === 'light' ? '#fff' : '#1c222d', 
              color: theme === 'light' ? '#64748b' : (darkThemeColors?.accent || '#198754') 
            }}
          >
            <HiOutlineSearch size={18} />
          </InputGroup.Text>
          <Form.Control 
            className="border-0 shadow-none" 
            placeholder="Buscar cliente por nombre o DNI..." 
            style={{ 
              backgroundColor: theme === 'light' ? '#fff' : '#1c222d', 
              color: theme === 'light' ? '#000' : '#fff',
              fontSize: '0.9rem'
            }}
          />
        </InputGroup>
      </div>

      {/* TABLA DE CLIENTES */}
      <Card 
        className="border-0 shadow-sm rounded-4 overflow-hidden"
        style={{ 
          backgroundColor: theme === 'light' ? '#fff' : darkThemeColors?.cardBg, 
          border: theme === 'dark' ? `1px solid ${darkThemeColors?.border}` : 'none' 
        }}
      >
        <Table hover responsive className={`mb-0 ${theme === 'dark' ? 'table-dark' : ''}`}>
          <thead>
            <tr className="small text-muted" style={{ borderBottom: `1px solid ${darkThemeColors?.border || '#eee'}` }}>
              <th className="ps-4 py-3 border-0">CLIENTE</th>
              <th className="py-3 border-0">CONTACTO</th>
              <th className="py-3 border-0">ESTADO</th>
              <th className="py-3 border-0 text-end pe-4">ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {listaClientes.map((cli) => (
              <tr key={cli.id} className="align-middle" style={{ borderColor: darkThemeColors?.border || '#eee' }}>
                <td className="ps-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-success bg-opacity-10 p-2 rounded-circle me-3 d-flex align-items-center justify-content-center">
                      <LuUser size={20} className="text-success" />
                    </div>
                    <div>
                      <div className="fw-bold">{cli.nombre}</div>
                      <small className="text-muted" style={{fontSize: '10px'}}>DNI: {cli.doc}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{fontSize: '0.85rem'}}>
                    <div className="text-muted"><LuMail size={12} className="me-1"/> {cli.correo}</div>
                    <div className={theme === 'dark' ? 'text-light' : 'text-dark'}>
                      <LuPhone size={12} className="me-1"/> {cli.telf}
                    </div>
                  </div>
                </td>
                <td>
                  <Badge bg={cli.color} className="bg-opacity-10 fw-bold" style={{ color: cli.color === 'warning' ? '#ffc107' : '#10b981' }}>
                    {cli.status}
                  </Badge>
                </td>
                <td className="text-end pe-4">
                  <Button variant={theme === 'light' ? 'light' : 'dark'} size="sm" className="rounded-3 border-0">
                    <LuExternalLink size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* MODAL PARA NUEVO CLIENTE */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton style={{ backgroundColor: theme === 'dark' ? '#161b26' : '#fff', color: theme === 'dark' ? '#fff' : '#000', borderBottom: theme === 'dark' ? '1px solid #2d3748' : '1px solid #dee2e6' }}>
          <Modal.Title className="fw-bold">Registrar Nuevo Cliente</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ backgroundColor: theme === 'dark' ? '#161b26' : '#fff', color: theme === 'dark' ? '#fff' : '#000' }}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-muted">NOMBRE COMPLETO</Form.Label>
              <Form.Control type="text" placeholder="Ej: Juan Pérez" />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-muted">DNI / DOCUMENTO</Form.Label>
                  <Form.Control type="text" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-muted">TELÉFONO</Form.Label>
                  <Form.Control type="text" placeholder="999 999 999" />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-muted">CORREO ELECTRÓNICO</Form.Label>
              <Form.Control type="email" placeholder="nombre@email.com" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-muted">TIPO DE CLIENTE</Form.Label>
              <Form.Select>
                <option>Regular</option>
                <option>Frecuente</option>
                <option>VIP</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer style={{ backgroundColor: theme === 'dark' ? '#161b26' : '#fff', borderTop: theme === 'dark' ? '1px solid #2d3748' : '1px solid #dee2e6' }}>
          <Button variant="secondary" onClick={handleClose} className="border-0">
            Cancelar
          </Button>
          <Button variant="success" className="fw-bold px-4">
            Registrar Cliente
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Clientes;