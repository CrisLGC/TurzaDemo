import { useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Factory,
  FileText,
  Gauge,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  PackageCheck,
  PackageOpen,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  ThermometerSnowflake,
  Truck,
  Users,
  Warehouse,
  X,
} from "lucide-react";

type Page =
  | "resumen"
  | "produccion"
  | "inventario"
  | "pedidos"
  | "calidad"
  | "despachos";

type NavItem = {
  id: Page;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string;
};

const navigation: NavItem[] = [
  { id: "resumen", label: "Resumen", icon: LayoutDashboard },
  { id: "produccion", label: "Producción", icon: Factory, badge: "4" },
  { id: "inventario", label: "Inventario y lotes", icon: Boxes },
  { id: "pedidos", label: "Pedidos", icon: ShoppingCart, badge: "12" },
  { id: "calidad", label: "Control de calidad", icon: ShieldCheck },
  { id: "despachos", label: "Despachos", icon: Truck, badge: "3" },
];

const products = [
  { name: "Jamón cocido estándar", presentation: "Pieza 5 kg", stock: 342, unit: "pzas", status: "Óptimo", tone: "green" },
  { name: "Pechuga ahumada", presentation: "Pieza 1 kg", stock: 86, unit: "pzas", status: "Bajo", tone: "amber" },
  { name: "Salchicha de pollo", presentation: "Paquete x 10", stock: 528, unit: "paq", status: "Óptimo", tone: "green" },
  { name: "Mortadela de pollo", presentation: "Pieza 900 g", stock: 214, unit: "pzas", status: "Óptimo", tone: "green" },
];

const batches = [
  { code: "PEA-241104", product: "Pechuga ahumada 1 kg", qty: "48 pzas", expiry: "8 días", status: "Atención", tone: "amber" },
  { code: "MOR-241101", product: "Mortadela de pollo 900 g", qty: "72 pzas", expiry: "12 días", status: "Próximo", tone: "amber" },
  { code: "JCE-241102", product: "Jamón cocido 500 g", qty: "120 pzas", expiry: "24 días", status: "Vigente", tone: "green" },
  { code: "SAL-241103", product: "Salchicha pollo al vacío", qty: "180 paq", expiry: "31 días", status: "Vigente", tone: "green" },
];

const productionOrders = [
  { id: "OP-1048", product: "Jamón cocido estándar", batch: "JCE-241104", target: "420 kg", progress: 72, stage: "Cocción", time: "Finaliza 3:40 PM", color: "forest" },
  { id: "OP-1049", product: "Salchicha de pollo", batch: "SAL-241104", target: "250 kg", progress: 46, stage: "Embutido", time: "Finaliza 5:15 PM", color: "gold" },
  { id: "OP-1050", product: "Pechuga ahumada", batch: "PEA-241104", target: "180 kg", progress: 18, stage: "Preparación", time: "Finaliza mañana", color: "slate" },
];

const orders = [
  { id: "PV-2841", client: "Distribuidora Centro Norte", value: "$4.860", items: "18 bultos", status: "Por preparar", when: "Entrega hoy" },
  { id: "PV-2840", client: "Charcutería La Estancia", value: "$2.340", items: "11 bultos", status: "En picking", when: "Entrega hoy" },
  { id: "PV-2838", client: "Mercado San Diego", value: "$6.120", items: "26 bultos", status: "Verificado", when: "Sale 2:30 PM" },
  { id: "PV-2837", client: "Suministros Valencia", value: "$3.780", items: "15 bultos", status: "Facturado", when: "Ruta norte" },
  { id: "PV-2835", client: "Bodegón El Portal", value: "$1.950", items: "8 bultos", status: "Entregado", when: "10:42 AM" },
];

const routes = [
  { id: "R-014", name: "Valencia Norte", driver: "Carlos Mendoza", vehicle: "Furgón 07", stops: 8, delivered: 5, load: "1.840 kg", status: "En ruta" },
  { id: "R-015", name: "San Diego · Guacara", driver: "Luis Herrera", vehicle: "Furgón 03", stops: 6, delivered: 0, load: "1.260 kg", status: "Cargando" },
  { id: "R-016", name: "Centro · Naguanagua", driver: "José Perdomo", vehicle: "Furgón 11", stops: 9, delivered: 0, load: "2.120 kg", status: "Programada" },
];

function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: string }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="page-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-description">{description}</p>
      </div>
      {action}
    </div>
  );
}

function Metric({ label, value, note, trend, icon: Icon, tone = "forest" }: { label: string; value: string; note: string; trend?: "up" | "down"; icon: typeof Gauge; tone?: string }) {
  return (
    <article className="metric-card">
      <div className={`metric-icon metric-${tone}`}><Icon size={20} /></div>
      <div className="metric-copy">
        <span>{label}</span>
        <strong>{value}</strong>
        <small className={trend ? `trend-${trend}` : ""}>
          {trend === "up" && <ArrowUpRight size={13} />}
          {trend === "down" && <ArrowDownRight size={13} />}
          {note}
        </small>
      </div>
    </article>
  );
}

function Overview({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <>
      <PageHeader
        eyebrow="Jueves, 5 de noviembre"
        title="Buen día, equipo Turza"
        description="Así avanza la operación de planta y distribución hoy."
        action={<button className="primary-button" onClick={() => onNavigate("produccion")}><Plus size={17} /> Nueva producción</button>}
      />

      <div className="notice-strip">
        <div className="notice-icon"><AlertTriangle size={18} /></div>
        <div><strong>2 lotes requieren atención</strong><span>La pechuga ahumada PEA-241104 vence en 8 días.</span></div>
        <button onClick={() => onNavigate("inventario")}>Revisar lotes <ArrowRight size={15} /></button>
      </div>

      <section className="metric-grid">
        <Metric label="Producción de hoy" value="1.248 kg" note="8,4% sobre el plan" trend="up" icon={Factory} />
        <Metric label="Pedidos abiertos" value="12" note="5 salen hoy" icon={ShoppingCart} tone="gold" />
        <Metric label="Eficiencia de planta" value="94,2%" note="2,1% vs. ayer" trend="up" icon={Gauge} tone="blue" />
        <Metric label="Ventas del mes" value="$84.620" note="68% de la meta" icon={ArrowUpRight} tone="rose" />
      </section>

      <section className="dashboard-grid">
        <article className="panel production-panel">
          <div className="panel-heading"><div><p className="eyebrow">EN TIEMPO REAL</p><h2>Producción en curso</h2></div><button className="text-button" onClick={() => onNavigate("produccion")}>Ver planta <ChevronRight size={16} /></button></div>
          <div className="production-list">
            {productionOrders.map((order) => (
              <div className="production-row" key={order.id}>
                <div className={`product-mark product-mark-${order.color}`}><Factory size={19} /></div>
                <div className="production-main">
                  <div className="row-top"><strong>{order.product}</strong><span>{order.progress}%</span></div>
                  <div className="progress"><i style={{ width: `${order.progress}%` }} /></div>
                  <div className="row-meta"><span>{order.id} · {order.batch}</span><span>{order.stage} · {order.time}</span></div>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel target-panel">
          <div className="panel-heading"><div><p className="eyebrow">NOVIEMBRE</p><h2>Meta de producción</h2></div><button className="icon-button"><MoreHorizontal size={19} /></button></div>
          <div className="donut-wrap">
            <div className="donut"><div><strong>68%</strong><span>completado</span></div></div>
            <div className="target-stats"><div><span>Producido</span><strong>18.420 kg</strong></div><div><span>Meta mensual</span><strong>27.000 kg</strong></div><div><span>Proyección</span><strong className="positive">28.160 kg</strong></div></div>
          </div>
        </article>

        <article className="panel orders-panel">
          <div className="panel-heading"><div><p className="eyebrow">COMERCIAL</p><h2>Pedidos recientes</h2></div><button className="text-button" onClick={() => onNavigate("pedidos")}>Ver todos <ChevronRight size={16} /></button></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Pedido</th><th>Cliente</th><th>Estado</th><th>Total</th><th>Entrega</th></tr></thead>
              <tbody>{orders.slice(0, 4).map((order) => <tr key={order.id}><td><strong>{order.id}</strong></td><td>{order.client}</td><td><Badge tone={order.status === "Verificado" ? "green" : order.status === "En picking" ? "blue" : "amber"}>{order.status}</Badge></td><td><strong>{order.value}</strong></td><td>{order.when}</td></tr>)}</tbody>
            </table>
          </div>
        </article>
      </section>
    </>
  );
}

function Production({ openModal }: { openModal: () => void }) {
  return (
    <>
      <PageHeader eyebrow="OPERACIÓN DE PLANTA" title="Producción" description="Planifica, ejecuta y mide cada lote desde la fórmula hasta el empaque." action={<button className="primary-button" onClick={openModal}><Plus size={17} /> Crear orden</button>} />
      <section className="metric-grid compact">
        <Metric label="Plan del día" value="1.340 kg" note="3 órdenes activas" icon={CalendarDays} />
        <Metric label="Producido" value="1.248 kg" note="93,1% completado" icon={PackageCheck} tone="blue" />
        <Metric label="Merma promedio" value="2,8%" note="0,6% mejor que meta" trend="up" icon={ArrowDownRight} tone="gold" />
        <Metric label="Tiempo detenido" value="18 min" note="Dentro del objetivo" icon={Clock3} tone="rose" />
      </section>
      <article className="panel page-panel">
        <div className="panel-heading"><div><p className="eyebrow">TURNO A · 7:00 AM — 3:00 PM</p><h2>Órdenes activas</h2></div><div className="segmented"><button className="active">En proceso</button><button>Programadas</button><button>Finalizadas</button></div></div>
        <div className="order-cards">
          {productionOrders.map((order, index) => (
            <div className="order-card" key={order.id}>
              <div className="order-card-head"><div className={`product-mark product-mark-${order.color}`}><Factory size={21} /></div><div><span>{order.id}</span><h3>{order.product}</h3></div><Badge tone={index === 0 ? "green" : index === 1 ? "blue" : "neutral"}>{order.stage}</Badge></div>
              <div className="order-data"><div><span>Lote</span><strong>{order.batch}</strong></div><div><span>Meta</span><strong>{order.target}</strong></div><div><span>Responsable</span><strong>{["M. Rincones", "A. Suárez", "J. García"][index]}</strong></div></div>
              <div className="row-top"><span>Avance del lote</span><strong>{order.progress}%</strong></div>
              <div className="progress large"><i style={{ width: `${order.progress}%` }} /></div>
              <div className="timeline"><span className="done"><Check size={12} /> Pesaje</span><i /><span className={index < 2 ? "done" : "active"}><Check size={12} /> Mezcla</span><i /><span className={index === 0 ? "active" : ""}>Proceso</span><i /><span>Empaque</span></div>
              <button className="secondary-button">Abrir orden <ArrowRight size={15} /></button>
            </div>
          ))}
        </div>
      </article>
    </>
  );
}

function Inventory() {
  const [filter, setFilter] = useState("");
  const filtered = products.filter((item) => item.name.toLowerCase().includes(filter.toLowerCase()));
  return (
    <>
      <PageHeader eyebrow="TRAZABILIDAD FEFO" title="Inventario y lotes" description="Existencias disponibles, ubicaciones y vencimientos bajo control." action={<button className="secondary-button"><FileText size={17} /> Exportar reporte</button>} />
      <div className="inventory-summary">
        <div><Warehouse size={22} /><span>Producto terminado</span><strong>9.842 kg</strong></div>
        <div><PackageOpen size={22} /><span>Materia prima</span><strong>14.260 kg</strong></div>
        <div><ThermometerSnowflake size={22} /><span>En cámara fría</span><strong>8.914 kg</strong></div>
        <div className="attention"><AlertTriangle size={22} /><span>Por vencer</span><strong>120 pzas</strong></div>
      </div>
      <article className="panel page-panel">
        <div className="panel-heading"><div><p className="eyebrow">PRODUCTO TERMINADO</p><h2>Disponibilidad por presentación</h2></div><label className="inline-search"><Search size={16} /><input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Buscar producto" /></label></div>
        <div className="product-grid">
          {filtered.map((product, index) => <div className="stock-card" key={product.name}><div className={`pack-visual pack-${index + 1}`}><span>TURZA</span><small>{product.presentation}</small></div><div className="stock-content"><Badge tone={product.tone}>{product.status}</Badge><h3>{product.name}</h3><p>{product.presentation}</p><div><strong>{product.stock}</strong><span>{product.unit} disponibles</span></div></div></div>)}
        </div>
      </article>
      <article className="panel page-panel">
        <div className="panel-heading"><div><p className="eyebrow">PRÓXIMAS SALIDAS FEFO</p><h2>Lotes y vencimientos</h2></div><button className="text-button">Ver trazabilidad <ChevronRight size={16} /></button></div>
        <div className="table-wrap"><table><thead><tr><th>Lote</th><th>Producto</th><th>Disponible</th><th>Vencimiento</th><th>Estado</th></tr></thead><tbody>{batches.map((batch) => <tr key={batch.code}><td><strong>{batch.code}</strong></td><td>{batch.product}</td><td>{batch.qty}</td><td>{batch.expiry}</td><td><Badge tone={batch.tone}>{batch.status}</Badge></td></tr>)}</tbody></table></div>
      </article>
    </>
  );
}

function Orders() {
  const groups = ["Por preparar", "En picking", "Verificado", "Facturado"];
  return (
    <>
      <PageHeader eyebrow="VENTAS AL MAYOR" title="Pedidos" description="Del pedido comercial a la carga, con precios y presentaciones por cliente." action={<button className="primary-button"><Plus size={17} /> Nuevo pedido</button>} />
      <section className="metric-grid compact">
        <Metric label="Venta abierta" value="$18.950" note="12 pedidos" icon={ShoppingCart} />
        <Metric label="Para entregar hoy" value="5" note="$11.320 facturados" icon={Truck} tone="blue" />
        <Metric label="Crédito utilizado" value="42%" note="$36.800 disponible" icon={Gauge} tone="gold" />
        <Metric label="Ticket promedio" value="$2.840" note="12,5% este mes" trend="up" icon={ArrowUpRight} tone="rose" />
      </section>
      <div className="kanban">
        {groups.map((group) => {
          const groupOrders = orders.filter((order) => order.status === group);
          return <div className="kanban-column" key={group}><div className="kanban-head"><span><i className={`dot dot-${group.replace(" ", "-").toLowerCase()}`} />{group}</span><Badge>{groupOrders.length}</Badge></div>{groupOrders.map((order) => <article className="kanban-card" key={order.id}><div><Badge tone="neutral">{order.id}</Badge><button><MoreHorizontal size={17} /></button></div><h3>{order.client}</h3><p>{order.items} · {order.when}</p><footer><strong>{order.value}</strong><span>Ver detalle <ChevronRight size={14} /></span></footer></article>)}<button className="add-card"><Plus size={15} /> Agregar pedido</button></div>;
        })}
      </div>
    </>
  );
}

function Quality() {
  const checks = [
    { title: "Recepción de materia prima", detail: "Pollo · Proveedor Avícola Central", code: "RC-2481", checks: "12/12", status: "Aprobado" },
    { title: "Control de cocción", detail: "Jamón estándar · Lote JCE-241104", code: "CC-1938", checks: "8/8", status: "Conforme" },
    { title: "Liberación de producto", detail: "Mortadela 900 g · Lote MOR-241103", code: "LP-0847", checks: "9/10", status: "Pendiente" },
  ];
  return (
    <>
      <PageHeader eyebrow="INOCUIDAD Y CUMPLIMIENTO" title="Control de calidad" description="Evidencia cada control y libera únicamente los lotes conformes." action={<button className="primary-button"><Plus size={17} /> Nueva inspección</button>} />
      <div className="quality-hero">
        <div><span className="quality-seal"><ShieldCheck size={31} /></span><div><p className="eyebrow">ÍNDICE DE CALIDAD · NOVIEMBRE</p><h2>98,6%</h2><p>Todos los lotes liberados mantienen su trazabilidad completa.</p></div></div>
        <div className="quality-mini"><div><strong>42</strong><span>Inspecciones</span></div><div><strong>0</strong><span>Lotes rechazados</span></div><div><strong>1</strong><span>Acción abierta</span></div></div>
      </div>
      <article className="panel page-panel">
        <div className="panel-heading"><div><p className="eyebrow">HOY</p><h2>Controles recientes</h2></div><div className="segmented"><button className="active">Todos</button><button>Pendientes</button><button>Cerrados</button></div></div>
        <div className="check-list">{checks.map((check) => <div className="check-row" key={check.code}><span className={`check-icon ${check.status === "Pendiente" ? "pending" : ""}`}>{check.status === "Pendiente" ? <Clock3 size={20} /> : <CheckCircle2 size={20} />}</span><div className="check-main"><strong>{check.title}</strong><span>{check.detail}</span></div><div><span>Registro</span><strong>{check.code}</strong></div><div><span>Verificaciones</span><strong>{check.checks}</strong></div><Badge tone={check.status === "Pendiente" ? "amber" : "green"}>{check.status}</Badge><button className="icon-button"><ChevronRight size={18} /></button></div>)}</div>
      </article>
      <div className="quality-grid"><article className="panel"><div className="panel-heading"><div><p className="eyebrow">TEMPERATURA</p><h2>Cámaras frías</h2></div><ThermometerSnowflake size={22} /></div><div className="temperature-list"><div><span>Cámara 01 · Producto terminado</span><strong>2,4 °C</strong><Badge tone="green">Normal</Badge></div><div><span>Cámara 02 · Materia prima</span><strong>1,8 °C</strong><Badge tone="green">Normal</Badge></div><div><span>Congelación</span><strong>-18,2 °C</strong><Badge tone="green">Normal</Badge></div></div></article><article className="panel"><div className="panel-heading"><div><p className="eyebrow">DOCUMENTACIÓN</p><h2>Próximos vencimientos</h2></div><ClipboardCheck size={22} /></div><div className="document-list"><div><span>Calibración · Balanza B-04</span><strong>12 nov</strong></div><div><span>Certificado sanitario · Planta</span><strong>28 nov</strong></div><div><span>Mantenimiento · Termógrafo 02</span><strong>02 dic</strong></div></div></article></div>
    </>
  );
}

function Dispatches() {
  return (
    <>
      <PageHeader eyebrow="LOGÍSTICA Y CADENA DE FRÍO" title="Despachos" description="Planifica cargas, recorridos y entregas desde un solo lugar." action={<button className="primary-button"><Plus size={17} /> Planificar ruta</button>} />
      <div className="dispatch-banner"><div><Truck size={27} /><div><strong>3 rutas programadas para hoy</strong><span>17 de 23 entregas aún están en curso.</span></div></div><div><strong>5.220 kg</strong><span>Carga total despachada</span></div></div>
      <div className="route-grid">
        {routes.map((route, index) => <article className="route-card" key={route.id}><header><div><Badge tone={index === 0 ? "green" : index === 1 ? "blue" : "neutral"}>{route.status}</Badge><h2>{route.name}</h2><p>{route.id} · {route.vehicle}</p></div><button className="icon-button"><MoreHorizontal size={18} /></button></header><div className="route-progress"><div className="row-top"><span>Progreso de entregas</span><strong>{route.delivered}/{route.stops}</strong></div><div className="progress large"><i style={{ width: `${(route.delivered / route.stops) * 100}%` }} /></div></div><div className="route-info"><div><Users size={17} /><span>Conductor</span><strong>{route.driver}</strong></div><div><Boxes size={17} /><span>Carga</span><strong>{route.load}</strong></div><div><PackageCheck size={17} /><span>Paradas</span><strong>{route.stops}</strong></div></div><button className="secondary-button">Ver hoja de ruta <ArrowRight size={15} /></button></article>)}
      </div>
      <article className="panel page-panel"><div className="panel-heading"><div><p className="eyebrow">ÚLTIMAS ENTREGAS</p><h2>Actividad de ruta</h2></div><button className="text-button">Historial <ChevronRight size={16} /></button></div><div className="activity-list"><div><span className="activity-icon"><Check size={16} /></span><div><strong>Pedido PV-2835 entregado</strong><span>Bodegón El Portal · Recibido por M. Salazar</span></div><time>10:42 AM</time></div><div><span className="activity-icon"><Check size={16} /></span><div><strong>Pedido PV-2832 entregado</strong><span>Charcutería La Montaña · Sin novedades</span></div><time>10:18 AM</time></div><div><span className="activity-icon blue"><Truck size={16} /></span><div><strong>Ruta R-015 inició proceso de carga</strong><span>Andén 02 · Temperatura 2,1 °C</span></div><time>9:55 AM</time></div></div></article>
    </>
  );
}

function NewProductionModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" onMouseDown={(event) => event.stopPropagation()}><header><div><p className="eyebrow">PLAN DE PLANTA</p><h2>Nueva orden de producción</h2></div><button className="icon-button" onClick={onClose}><X size={20} /></button></header><div className="form-grid"><label><span>Producto</span><select defaultValue="Jamón cocido estándar"><option>Jamón cocido estándar</option><option>Salchicha de pollo</option><option>Pechuga ahumada</option><option>Mortadela de pollo</option></select></label><label><span>Presentación</span><select><option>Pieza 5 kg</option><option>Pieza 500 g</option></select></label><label><span>Cantidad planificada</span><div className="input-suffix"><input defaultValue="420" /><span>kg</span></div></label><label><span>Fecha de producción</span><input type="date" defaultValue="2026-11-04" /></label><label className="full"><span>Responsable de turno</span><select><option>Maiques Rincones</option><option>Ana Suárez</option><option>José García</option></select></label></div><div className="formula-callout"><ClipboardCheck size={19} /><div><strong>Fórmula FT-JCE-03 seleccionada</strong><span>Los consumos estimados y controles de calidad se cargarán automáticamente.</span></div></div><footer><button className="secondary-button" onClick={onClose}>Cancelar</button><button className="primary-button" onClick={onCreated}>Crear orden</button></footer></div></div>;
}

export default function App() {
  const [page, setPage] = useState<Page>("resumen");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(false);
  const currentLabel = useMemo(() => navigation.find((item) => item.id === page)?.label ?? "Resumen", [page]);

  const navigate = (target: Page) => {
    setPage(target);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const createOrder = () => {
    setModalOpen(false);
    setToast(true);
    setPage("produccion");
    window.setTimeout(() => setToast(false), 3500);
  };

  return (
    <div className="app-shell">
      {sidebarOpen && <button className="mobile-overlay" aria-label="Cerrar menú" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <img src="/turza-logo.webp" alt="Embutidos Turza" />
          <span>ERP Industrial</span>
        </div>
        <div className="demo-tag"><span /> Demostración comercial</div>
        <nav>
          <p>OPERACIÓN</p>
          {navigation.map((item) => { const Icon = item.icon; return <button key={item.id} className={page === item.id ? "active" : ""} onClick={() => navigate(item.id)}><Icon size={19} /><span>{item.label}</span>{item.badge && <b>{item.badge}</b>}</button>; })}
          <p>ADMINISTRACIÓN</p>
          <button><Users size={19} /><span>Clientes</span></button>
          <button><FileText size={19} /><span>Finanzas</span></button>
          <button><Settings size={19} /><span>Configuración</span></button>
        </nav>
        <div className="sidebar-foot"><div className="avatar">MR</div><div><strong>Maiques Rincones</strong><span>Jefe de producción</span></div><ChevronDown size={16} /></div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="topbar-left"><button className="menu-button" onClick={() => setSidebarOpen(true)}><Menu size={21} /></button><span>{currentLabel}</span><ChevronRight size={14} /><strong>Planta Valencia</strong></div>
          <div className="topbar-right"><label className="global-search"><Search size={17} /><input placeholder="Buscar pedido, lote o cliente…" /><kbd>⌘ K</kbd></label><button className="plant-selector"><span className="online-dot" /> Planta Valencia <ChevronDown size={15} /></button><div className="top-avatar">MR</div></div>
        </header>
        <main>
          <div className="demo-disclaimer">Propuesta conceptual · Todos los datos mostrados son simulados para fines demostrativos.</div>
          {page === "resumen" && <Overview onNavigate={navigate} />}
          {page === "produccion" && <Production openModal={() => setModalOpen(true)} />}
          {page === "inventario" && <Inventory />}
          {page === "pedidos" && <Orders />}
          {page === "calidad" && <Quality />}
          {page === "despachos" && <Dispatches />}
        </main>
      </div>
      {modalOpen && <NewProductionModal onClose={() => setModalOpen(false)} onCreated={createOrder} />}
      {toast && <div className="toast"><CheckCircle2 size={19} /><div><strong>Orden creada</strong><span>La orden OP-1051 fue agregada al plan.</span></div><button onClick={() => setToast(false)}><X size={16} /></button></div>}
    </div>
  );
}
