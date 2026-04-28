import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Form, InputGroup, Button, Badge } from "react-bootstrap";
import { FiSearch, FiBell, FiSettings, FiDownload } from "react-icons/fi";
import { HiOutlineCube, HiOutlineCreditCard, HiOutlineShoppingCart, HiOutlineBookOpen, HiOutlineShieldCheck, HiOutlineTag } from "react-icons/hi";
import { MdOutlineInventory2, MdChevronRight, MdOutlineMoreHoriz } from "react-icons/md";
import { LuMilk, LuShoppingBasket, LuSparkles, LuCupSoda, LuCookie, LuExternalLink } from "react-icons/lu"; 
import { RiAddCircleLine } from "react-icons/ri";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { FaUserTie } from "react-icons/fa";

// IMPORTACIÓN DEL NUEVO ARCHIVO (Asegúrate de que Productos.jsx exista en la misma carpeta)
import Productos from "./Productos";

const Categorias = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("nubix-theme") || "light";
  });

  const [activeModule, setActiveModule] = useState('cat');
  const [hoveredBtn, setHoveredBtn] = useState(null);

  useEffect(() => {
    document.body.setAttribute("data-bs-theme", theme);
    localStorage.setItem("nubix-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"));
  };

  const categories = [
    { id: '#CAT-001', icon: <LuMilk size={20}/>, name: 'Lácteos', popularity: 60, pColor: 'success' },
    { id: '#CAT-002', icon: <LuShoppingBasket size={20}/>, name: 'Abarrotes', popularity: 80, pColor: 'primary' },
    { id: '#CAT-003', icon: <LuSparkles size={20}/>, name: 'Limpieza', popularity: 50, pColor: 'info' },
    { id: '#CAT-004', icon: <LuCupSoda size={20}/>, name: 'Bebidas', popularity: 90, pColor: 'warning' },
    { id: '#CAT-005', icon: <LuCookie size={20}/>, name: 'Snacks', popularity: 70, pColor: 'danger' },
  ];

  const darkThemeColors = {
    bodyBg: "#0b0e14",
    sidebarBg: "#11141d",
    cardBg: "#161b26",
    headerBg: "rgba(11, 14, 20, 0.8)", 
    textPrimary: "#ffffff",
    textSecondary: "#94a3b8",
    border: "rgba(255, 255, 255, 0.06)",
    accent: "#10b981"
  };

  const getSidebarBtnStyle = (id) => ({
    backgroundColor: hoveredBtn === id ? "rgba(16, 185, 129, 0.12)" : (activeModule === id ? "rgba(16, 185, 129, 0.08)" : "transparent"),
    color: (hoveredBtn === id || activeModule === id) ? darkThemeColors.accent : "#94a3b8",
    transition: "all 0.3s ease",
    borderRadius: "8px",
    margin: "6px 0",
    border: "none",
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    padding: "0.9rem 1.1rem",
    cursor: "pointer",
    fontWeight: activeModule === id ? "600" : "500",
    fontSize: "0.95rem"
  });

  const getSwitchStyle = () => ({
    width: "48px",
    height: "26px",
    borderRadius: "13px",
    padding: "3px",
    transition: "all 0.3s ease",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    position: "relative",
    backgroundColor: theme === "light" ? "#e2e8f0" : darkThemeColors.accent,
    border: `1px solid ${theme === "light" ? "#cbd5e1" : darkThemeColors.accent}`,
    boxShadow: theme === "dark" ? `0 0 10px rgba(16, 185, 129, 0.4)` : "none"
  });

  const getSwitchHandleStyle = () => ({
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor: "white",
    transition: "transform 0.3s ease",
    position: "absolute",
    left: "3px",
    transform: theme === "dark" ? "translateX(22px)" : "translateX(0px)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
  });

  return (
    <div 
        className="d-flex" 
        style={{ 
            minHeight: "100vh", 
            backgroundColor: theme === 'light' ? "#f1f5f9" : darkThemeColors.bodyBg, 
            fontFamily: "'Inter', sans-serif",
            color: theme === 'light' ? '#000' : darkThemeColors.textPrimary
        }}
    >
      
      {/* SIDEBAR */}
      <div 
          className="d-flex flex-column flex-shrink-0 p-3 text-white d-none d-lg-flex" 
          style={{ 
              width: "280px", 
              backgroundColor: theme === 'light' ? "#0f172a" : darkThemeColors.sidebarBg,
              borderRight: theme === 'dark' ? `1px solid ${darkThemeColors.border}` : "none",
              transition: "background-color 0.4s ease"
          }}
      >
        <div className="d-flex align-items-center mb-5 mt-2 ps-2">
          <div className="bg-success rounded-3 p-2 me-3 d-flex align-items-center justify-content-center shadow-sm">
            <MdOutlineInventory2 size={24} className="text-white" />
          </div>
          <div>
            <h6 className="mb-0 fw-bold text-white">Nubix Market</h6>
            <small style={{ color: "#64748b", fontSize: "10px", letterSpacing: "1px", fontWeight: '700' }}>ADMIN CONSOLE</small>
          </div>
        </div>

        <nav className="nav flex-column mb-auto">
          {[
            { id: 'cat', name: 'Categorias', icon: <HiOutlineTag size={20} /> },
            { id: 'prod', name: 'Productos', icon: <HiOutlineCube size={20} /> },
            { id: 'cred', name: 'Clientes', icon: <HiOutlineCreditCard size={20} /> },
            { id: 'ped', name: 'Proveedores', icon: <HiOutlineShoppingCart size={20} /> },
            { id: 'cata', name: 'Compras', icon: <HiOutlineBookOpen size={20} /> },
            { id: 'seg', name: 'Ventas', icon: <HiOutlineShieldCheck size={20} /> },
          ].map((item) => (
            <button key={item.id} style={getSidebarBtnStyle(item.id)} onMouseEnter={() => setHoveredBtn(item.id)} onMouseLeave={() => setHoveredBtn(null)} onClick={() => setActiveModule(item.id)} className="w-100">
              <span className="me-3 d-flex align-items-center">{item.icon}</span> {item.name}
            </button>
          ))}
        </nav>

        <div className="mt-auto p-4 rounded-4 text-center shadow-sm" style={{ backgroundColor: theme === 'light' ? "#1e293b" : "rgba(255,255,255,0.03)", marginBottom: '10px', border: theme === 'dark' ? `1px solid ${darkThemeColors.border}` : "none" }}>
          <div className="mx-auto bg-dark rounded-circle d-flex align-items-center justify-content-center text-white mb-3" style={{ width: "64px", height: "64px", border: "2px solid #334155" }}>
              <FaUserTie size={36} />
          </div>
          <h6 className="mb-1 fw-bold text-white">Admin Nubix</h6>
          <small style={{ color: "#94a3b8", display: "block", fontSize: "12px" }}>Gerente General</small>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-grow-1 overflow-auto">
        
        <header 
            className={`p-3 border-bottom d-flex justify-content-between align-items-center sticky-top ${theme === 'light' ? 'bg-white shadow-sm' : ''}`}
            style={{ 
                backgroundColor: theme === 'light' ? '#fff' : darkThemeColors.bodyBg, 
                borderColor: theme === 'light' ? '#e2e8f0' : darkThemeColors.border,
                backdropFilter: "blur(10px)",
                zIndex: 1000
            }}
        >
          <InputGroup className="w-50 ms-4" style={{maxWidth: '400px'}}>
            <InputGroup.Text 
                className="border-0"
                style={{ backgroundColor: theme === 'light' ? '#f1f5f9' : '#1c222d', color: '#64748b' }}
            >
                <FiSearch />
            </InputGroup.Text>
            <Form.Control 
                className="border-0 shadow-none" 
                style={{ backgroundColor: theme === 'light' ? '#f1f5f9' : '#1c222d', color: theme === 'dark' ? '#fff' : '#000', fontSize: '0.9rem' }}
                placeholder="Buscar algo..." 
            />
          </InputGroup>
          
          <div className={`d-flex align-items-center gap-3 pe-4 ${theme === 'light' ? 'text-muted' : 'text-white'}`}>
            <div className="d-flex align-items-center me-2" onClick={toggleTheme} style={{cursor: 'pointer'}}>
                <div style={getSwitchStyle()}>
                    <div style={getSwitchHandleStyle()} />
                </div>
            </div>

            <FiBell size={20} style={{cursor: 'pointer', color: theme === 'dark' ? darkThemeColors.textSecondary : ''}} />
            <FiSettings size={20} style={{cursor: 'pointer', color: theme === 'dark' ? darkThemeColors.textSecondary : ''}} />
            <div className="d-flex align-items-center gap-2"> 
                <small className="fw-bold">Nubix Market</small>
                <Badge bg="success" pill style={{padding: '5px 10px'}}>NM</Badge>
            </div>
          </div>
        </header>

        <main className="p-4 p-lg-5">
          {/* LÓGICA DE NAVEGACIÓN ENTRE CATEGORÍAS Y PRODUCTOS */}
          {activeModule === 'cat' ? (
            <>
              <div className="mb-5">
                <small className="text-uppercase text-muted fw-bold" style={{ fontSize: '11px', letterSpacing: '1.5px' }}>
                  INVENTARIO <span className="mx-1 text-secondary">/</span> <span className="text-success">CATEGORÍAS</span>
                </small>
                <h2 className="fw-bold mt-2">Módulo de Categorías</h2>
                <p style={{ color: darkThemeColors.textSecondary }}>Gestión centralizada del catálogo de productos.</p>
              </div>

              <div className="d-flex justify-content-end mb-4">
                <Button variant="success" className="fw-bold px-4 py-2 d-flex align-items-center border-0 shadow-sm" style={{borderRadius: "10px"}}>
                  <RiAddCircleLine className="me-2" size={20} /> Nueva Categoría
                </Button>
              </div>

              <Row className="g-4 mb-5">
                {[
                  { title: 'TOTAL CATEGORÍAS', value: '32', sub: '+4 este mes', sColor: 'success' },
                  { title: 'PRODUCTOS ACTIVOS', value: '1,248', sub: 'Actualizado hace 2h', sColor: 'muted' },
                  { title: 'MAS VENDIDA', value: 'Bebidas', sub: '24% del volumen total', vColor: 'success' },
                  { title: 'ESTADO SISTEMA', value: 'Optimizado', sub: '🟢 Activo', vColor: 'success' }
                ].map((card, i) => (
                  <Col md={3} key={i}>
                    <Card 
                        className="border-0 shadow-sm p-4 rounded-4 h-100"
                        style={{ 
                            backgroundColor: theme === 'light' ? '#fff' : darkThemeColors.cardBg, 
                            border: theme === 'dark' ? `1px solid ${darkThemeColors.border}` : 'none',
                            transition: 'transform 0.3s ease'
                        }}
                    >
                      <small className="text-muted fw-bold mb-3 d-block small" style={{ fontSize: '11px' }}>{card.title}</small>
                      <h3 className={`fw-bold mb-1 ${card.vColor ? 'text-' + card.vColor : ''}`}>{card.value}</h3>
                      <small className={`text-${card.sColor || 'muted'}`}>{card.sub}</small>
                    </Card>
                  </Col>
                ))}
              </Row>

              <Card 
                  className="border-0 shadow-sm rounded-4 overflow-hidden"
                  style={{ 
                      backgroundColor: theme === 'light' ? '#fff' : darkThemeColors.cardBg, 
                      border: theme === 'dark' ? `1px solid ${darkThemeColors.border}` : 'none' 
                  }}
              >
                <Card.Body className="p-0">
                  <div className="p-4 d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0">Listado de Categorías</h5>
                    <div className="d-flex gap-3 text-muted">
                        <AiOutlineUnorderedList style={{cursor: 'pointer'}} size={18} />
                        <FiDownload style={{cursor: 'pointer'}} size={18} />
                    </div>
                  </div>
                  <Table hover responsive className={`mb-0 ${theme === 'dark' ? 'table-dark' : ''}`}>
                    <thead>
                      <tr className="small" style={{ borderBottom: `1px solid ${theme === 'light' ? '#f1f5f9' : darkThemeColors.border}` }}>
                        <th className="ps-4 py-3 border-0 text-muted">ID</th>
                        <th className="py-3 border-0 text-muted">NOMBRE DE CATEGORÍA</th>
                        <th className="py-3 border-0 text-muted">POPULARIDAD</th>
                        <th className="py-3 border-0 text-end pe-4 text-muted">ACCIONES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((cat, i) => (
                        <tr key={i} className="align-middle" style={{ borderColor: theme === 'light' ? '#f1f5f9' : darkThemeColors.border }}>
                          <td className="ps-4 text-muted small fw-medium">{cat.id}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className={`bg-${cat.pColor} bg-opacity-10 p-2 rounded-3 me-3 text-${cat.pColor}`}>
                                {cat.icon}
                              </div>
                              <span className="fw-bold">{cat.name}</span>
                            </div>
                          </td>
                          <td style={{width: "250px"}}>
                            <div className="d-flex align-items-center gap-2">
                                <div className="progress flex-grow-1" style={{height: "6px", borderRadius: '10px', backgroundColor: theme === 'dark' ? '#1c222d' : '#f1f5f9'}}>
                                    <div className={`progress-bar bg-${cat.pColor}`} style={{width: `${cat.popularity}%`}}></div>
                                </div>
                                <small className="text-muted fw-bold" style={{fontSize: '11px'}}>{cat.popularity}%</small>
                            </div>
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
                </Card.Body>
              </Card>
            </>
          ) : activeModule === 'prod' ? (
            /* LLAMADA AL COMPONENTE EXTERNO PRODUCTOS */
            <Productos theme={theme} darkThemeColors={darkThemeColors} />
          ) : (
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
                <h3 className="fw-bold mb-0 text-muted" style={{ opacity: '0.4' }}>Módulo en construcción</h3>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Categorias;