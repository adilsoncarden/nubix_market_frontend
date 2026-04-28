import React, { useState } from "react";
import { Card, Table, Button, Badge, Row, Col, Form, InputGroup, ProgressBar, Modal } from "react-bootstrap";
import { HiOutlineCube, HiOutlineSearch, HiOutlineFilter } from "react-icons/hi";
import { RiAddCircleLine, RiErrorWarningLine, RiMoneyDollarCircleLine } from "react-icons/ri";
import { LuExternalLink, LuArrowDownUp, LuMilk, LuFish, LuCarrot, LuWheat } from "react-icons/lu";

const Productos = ({ theme, darkThemeColors }) => {

  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const stats = [
    { title: 'VALOR INVENTARIO', value: 'S/ 24,500', icon: <RiMoneyDollarCircleLine size={24}/>, color: 'primary' },
    { title: 'ITEMS TOTALES', value: '1,248', icon: <HiOutlineCube size={24}/>, color: 'success' },
    { title: 'STOCK CRÍTICO', value: '12', icon: <RiErrorWarningLine size={24}/>, color: 'danger' },
  ];

  const listaProductos = [
    { id: 1, nombre: "Leche Gloria 1L", sku: "LG-10245", cat: "Lácteos", precio: "4.90", stock: 85, color: "primary", icon: <LuMilk size={20}/> },
    { id: 2, nombre: "Atún Primor (Trozos)", sku: "AT-20331", cat: "Conservas", precio: "6.50", stock: 15, color: "info", icon: <LuFish size={20}/> },
    { id: 3, nombre: "Pack de Espinacas 500g", sku: "VG-55210", cat: "Vegetales", precio: "3.20", stock: 40, color: "success", icon: <LuCarrot size={20}/> },
    { id: 4, nombre: "Arroz Costeño 1kg", sku: "AR-99021", cat: "Abarrotes", precio: "4.10", stock: 95, color: "warning", icon: <LuWheat size={20}/> },
  ];

  return (
    <>
      <div className="mb-4">
        <small className="text-uppercase text-muted fw-bold" style={{ fontSize: '11px', letterSpacing: '1.5px' }}>
          INVENTARIO <span className="mx-1 text-secondary">/</span> <span className="text-success">PRODUCTOS</span>
        </small>
        <div className="d-flex justify-content-between align-items-end mt-2">
          <div>
            <h2 className="fw-bold mb-0">Gestión de Productos</h2>
            <p className="mb-0" style={{ color: darkThemeColors?.textSecondary || '#6c757d' }}>Analítica y control detallado.</p>
          </div>

          <Button 
            variant="success" 
            onClick={handleShow}
            className="fw-bold px-4 py-2 d-flex align-items-center border-0 shadow-sm" 
            style={{borderRadius: "10px"}}
          >
            <RiAddCircleLine className="me-2" size={20} /> Nuevo Producto
          </Button>
        </div>
      </div>

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
            placeholder="Buscar producto..." 
            style={{ 
              backgroundColor: theme === 'light' ? '#fff' : '#1c222d', 
              color: theme === 'light' ? '#000' : '#fff',
              fontSize: '0.9rem'
            }}
          />
        </InputGroup>
      </div>

      <Card 
        className="border-0 shadow-sm rounded-4 overflow-hidden"
        style={{ 
          backgroundColor: theme === 'light' ? '#fff' : darkThemeColors?.cardBg, 
          border: theme === 'dark' ? `1px solid ${darkThemeColors?.border}` : 'none' 
        }}
      >
        <Table hover responsive className={`mb-0 ${theme === 'dark' ? 'table-dark' : ''}`}>
          <thead>
            <tr className="small text-muted">
              <th className="ps-4 py-3 border-0">PRODUCTO <LuArrowDownUp size={12}/></th>
              <th className="py-3 border-0">CATEGORÍA</th>
              <th className="py-3 border-0">PRECIO</th>
              <th className="py-3 border-0">STOCK</th>
              <th className="py-3 border-0 text-end pe-4">ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {listaProductos.map((prod) => (
              <tr className="align-middle" key={prod.id}>
                <td className="ps-4">
                  <div className="d-flex align-items-center">
                    <div className={`bg-${prod.color} bg-opacity-10 p-2 rounded-3 me-3 text-${prod.color}`}>
                      {prod.icon}
                    </div>
                    <div>
                      <div className="fw-bold">{prod.nombre}</div>
                      <small className="text-muted" style={{fontSize: '10px'}}>SKU: {prod.sku}</small>
                    </div>
                  </div>
                </td>
                <td><Badge bg="secondary" className="bg-opacity-10 text-secondary border">{prod.cat}</Badge></td>
                <td className="fw-bold">S/ {prod.precio}</td>
                <td style={{width: '180px'}}>
                  <ProgressBar variant={prod.stock < 30 ? "danger" : "success"} now={prod.stock} style={{height: '6px'}} className="rounded-pill mb-1"/>
                  <small className="fw-bold text-muted">{prod.stock}/100</small>
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

      {/* MODAL */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Producto</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Producto</Form.Label>
              <Form.Control type="text" placeholder="Ej: Aceite 1L" />
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Código de Barras</Form.Label>
                  <Form.Control type="text" />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Select>
                    <option>Abarrotes</option>
                    <option>Lácteos</option>
                    <option>Vegetales</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Precio Compra</Form.Label>
                  <Form.Control type="number" />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Precio Venta</Form.Label>
                  <Form.Control type="number" />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control type="number" />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="success">
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Productos;