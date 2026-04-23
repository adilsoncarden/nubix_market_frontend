import React from "react";
import { Container, Row, Col, Card, Table, Form, InputGroup, Button, Pagination, Badge } from "react-bootstrap";
// Importamos iconos más formales y originales
import { FiSearch, FiBell, FiSettings, FiDownload } from "react-icons/fi";
import { HiOutlineViewGrid, HiOutlineCube, HiOutlineCreditCard, HiOutlineShoppingCart } from "react-icons/hi";
import { MdOutlineAdminPanelSettings, MdOutlineCategory } from "react-icons/md";
import { RiAddCircleLine } from "react-icons/ri";
import { AiOutlineUnorderedList } from "react-icons/ai";

const Dashboard = () => {
  const categories = [
    { id: '#CAT-001', icon: '🥚', name: 'Lácteos', popularity: 60, pColor: 'success' },
    { id: '#CAT-002', icon: '📦', name: 'Abarrotes', popularity: 80, pColor: 'primary' },
    { id: '#CAT-003', icon: '🧹', name: 'Limpieza', popularity: 50, pColor: 'info' },
    { id: '#CAT-004', icon: '🍹', name: 'Bebidas', popularity: 90, pColor: 'warning' },
    { id: '#CAT-005', icon: '🍪', name: 'Snacks', popularity: 70, pColor: 'danger' },
  ];

  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f4f6f9", fontFamily: "'Inter', sans-serif" }}>
      
      {/* SIDEBAR IZQUIERDA */}
      <div className="d-flex flex-column flex-shrink-0 p-3 text-white d-none d-lg-flex" style={{ width: "280px", backgroundColor: "#111827" }}>
        <div className="d-flex align-items-center mb-4 ps-2">
          <div>
            <h6 className="mb-0 fw-bold text-white">Nubix Market</h6>
            <small style={{ color: "#4b5563", fontSize: "10px", letterSpacing: "1px" }}>ADMIN CONSOLE</small>
          </div>
        </div>

        <nav className="nav nav-pills flex-column mb-auto">
          <button className="nav-link text-white-50 w-100 text-start py-3 bg-transparent border-0 d-flex align-items-center">
            <HiOutlineViewGrid className="me-3" size={20} /> Dashboard
          </button>
          <button className="nav-link active w-100 text-start py-3 border-start border-white border-4 rounded-0 shadow-none d-flex align-items-center" style={{backgroundColor: "#10b981"}}>
            <HiOutlineCube className="me-3" size={20} /> Inventario
          </button>
          <button className="nav-link text-white-50 w-100 text-start py-3 bg-transparent border-0 d-flex align-items-center">
            <HiOutlineCreditCard className="me-3" size={20} /> Créditos
          </button>
          <button className="nav-link text-white-50 w-100 text-start py-3 bg-transparent border-0 d-flex align-items-center">
            <HiOutlineShoppingCart className="me-3" size={20} /> Pedidos
          </button>
        </nav>

        {/* PERFIL CORREGIDO CON ICONO Y CONTRASTE */}
        <div className="mt-auto p-3 rounded-3 d-flex align-items-center" style={{ backgroundColor: "#1f2937" }}>
          <div className="bg-secondary rounded-circle me-3 d-flex align-items-center justify-content-center text-white" style={{ width: "40px", height: "40px" }}>
             <MdOutlineAdminPanelSettings size={24} />
          </div>
          <div style={{ fontSize: "12px" }}>
            <p className="mb-0 fw-bold text-white">Admin Nubix</p>
            <div className="d-flex align-items-center" style={{ color: "#9ca3af" }}>
               <MdOutlineAdminPanelSettings className="me-1" size={14} />
               <span className="fw-medium">Gerente General</span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-grow-1 overflow-auto">
        <header className="bg-white p-3 border-bottom d-flex justify-content-between align-items-center sticky-top shadow-sm">
          <InputGroup className="w-50 ms-4">
            <InputGroup.Text className="bg-light border-0"><FiSearch /></InputGroup.Text>
            <Form.Control className="bg-light border-0 shadow-none" placeholder="Buscar categorías..." />
          </InputGroup>
          <div className="d-flex align-items-center gap-3 pe-4 text-muted">
            <FiBell style={{cursor: 'pointer'}} />
            <FiSettings style={{cursor: 'pointer'}} />
            <div className="d-flex align-items-center gap-2">
                <small className="fw-bold text-dark">Nubix Market</small>
                <Badge bg="success" pill>NM</Badge>
            </div>
          </div>
        </header>

        <main className="p-4 p-lg-5">
          <div className="mb-4">
            <small className="text-uppercase text-muted fw-bold" style={{ fontSize: '10px' }}>
              INVENTARIO <span className="mx-1">›</span> <span className="text-success">CATEGORÍAS</span>
            </small>
            <h2 className="fw-bold text-dark mt-2">Módulo de Categorías</h2>
            <p className="text-muted">Gestión centralizada del catálogo de productos.</p>
          </div>

          <div className="d-flex justify-content-end mb-4">
            <Button variant="success" className="fw-bold px-4 py-2 d-flex align-items-center" style={{borderRadius: "10px"}}>
              <RiAddCircleLine className="me-2" size={20} /> Nueva Categoría
            </Button>
          </div>

          <Row className="g-4 mb-5">
            {[
              { title: 'TOTAL CATEGORÍAS', value: '32', sub: '+4 este mes', sColor: 'success' },
              { title: 'PRODUCTOS ACTIVOS', value: '1,248', sub: 'Actualizado hace 2h', sColor: 'muted' },
              { title: 'MAS VENDIDA', value: 'Bebidas', sub: '24% del volumen total', vColor: 'success' },
              { title: 'ESTADO SISTEMA', value: 'Optimizado', sub: '🟢 Activo', vColor: 'dark' }
            ].map((card, i) => (
              <Col md={3} key={i}>
                <Card className="border-0 shadow-sm p-4 rounded-4 h-100">
                  <small className="text-muted fw-bold mb-3 d-block small">{card.title}</small>
                  <h3 className={`fw-bold mb-1 text-${card.vColor || 'dark'}`}>{card.value}</h3>
                  <small className={`text-${card.sColor || 'muted'}`}>{card.sub}</small>
                </Card>
              </Col>
            ))}
          </Row>

          <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
            <Card.Body className="p-0">
              <div className="p-4 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">Listado de Categorías</h5>
                <div className="text-muted d-flex gap-3">
                    <AiOutlineUnorderedList style={{cursor: 'pointer'}} />
                    <FiDownload style={{cursor: 'pointer'}} />
                </div>
              </div>
              <Table hover responsive className="mb-0">
                <thead className="bg-light border-0">
                  <tr className="text-muted small">
                    <th className="ps-4 py-3 border-0">ID</th>
                    <th className="py-3 border-0">NOMBRE DE CATEGORÍA</th>
                    <th className="py-3 border-0">POPULARIDAD</th>
                    <th className="py-3 border-0 text-end pe-4">ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, i) => (
                    <tr key={i} className="align-middle">
                      <td className="ps-4 text-muted small">{cat.id}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className={`bg-${cat.pColor} bg-opacity-10 p-2 rounded-3 me-3 text-${cat.pColor}`}>
                            {cat.name === 'Lácteos' ? <MdOutlineCategory size={20}/> : cat.icon}
                          </div>
                          <span className="fw-bold">{cat.name}</span>
                        </div>
                      </td>
                      <td style={{width: "250px"}}>
                        <div className="d-flex align-items-center gap-2">
                            <div className="progress flex-grow-1" style={{height: "6px"}}>
                                <div className={`progress-bar bg-${cat.pColor}`} style={{width: `${cat.popularity}%`}}></div>
                            </div>
                            <small className="text-muted">{cat.popularity}%</small>
                        </div>
                      </td>
                      <td className="text-end pe-4">
                        <Button variant="link" className="text-muted p-0 text-decoration-none">...</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="p-4 d-flex justify-content-between align-items-center">
                <small className="text-muted">Mostrando 5 de 32 categorías encontradas</small>
                <Pagination size="sm" className="mb-0">
                    <Pagination.Item active>{1}</Pagination.Item>
                    <Pagination.Item>{2}</Pagination.Item>
                    <Pagination.Item>{3}</Pagination.Item>
                </Pagination>
              </div>
            </Card.Body>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;