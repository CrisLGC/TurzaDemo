import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  CreditCard,
  Database,
  DollarSign,
  Factory,
  FileText,
  Gauge,
  LayoutDashboard,
  LockKeyhole,
  Mail,
  MapPin,
  Menu,
  MoreHorizontal,
  PackageCheck,
  PackageOpen,
  Phone,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  ThermometerSnowflake,
  Truck,
  UserPlus,
  Users,
  WalletCards,
  Warehouse,
  X,
} from "lucide-react";

type Page =
  | "resumen"
  | "produccion"
  | "inventario"
  | "pedidos"
  | "calidad"
  | "despachos"
  | "clientes"
  | "finanzas"
  | "configuracion";

type NavItem = {
  id: Page;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string;
};

type DialogConfig = {
  eyebrow?: string;
  title: string;
  description?: string;
  content: ReactNode;
  primaryLabel?: string;
  onConfirm?: () => void;
  wide?: boolean;
};

type ToastMessage = { title: string; detail: string };

type DemoActions = {
  openDialog: (dialog: DialogConfig) => void;
  closeDialog: () => void;
  notify: (title: string, detail: string) => void;
};

const DemoActionsContext = createContext<DemoActions | null>(null);

function useDemoActions() {
  const context = useContext(DemoActionsContext);
  if (!context) throw new Error("DemoActionsContext no disponible");
  return context;
}

const navigation: NavItem[] = [
  { id: "resumen", label: "Resumen", icon: LayoutDashboard },
  { id: "produccion", label: "Producción", icon: Factory, badge: "4" },
  { id: "inventario", label: "Inventario y lotes", icon: Boxes },
  { id: "pedidos", label: "Pedidos", icon: ShoppingCart, badge: "12" },
  { id: "calidad", label: "Control de calidad", icon: ShieldCheck },
  { id: "despachos", label: "Despachos", icon: Truck, badge: "3" },
];

const administration: NavItem[] = [
  { id: "clientes", label: "Clientes", icon: Users },
  { id: "finanzas", label: "Finanzas", icon: FileText },
  { id: "configuracion", label: "Configuración", icon: Settings },
];

const allNavigation = [...navigation, ...administration];

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

function DemoDialog({ dialog, onClose }: { dialog: DialogConfig; onClose: () => void }) {
  const confirm = () => {
    dialog.onConfirm?.();
    onClose();
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className={`modal demo-modal ${dialog.wide ? "modal-wide" : ""}`} onMouseDown={(event) => event.stopPropagation()}>
        <header>
          <div><p className="eyebrow">{dialog.eyebrow ?? "DEMOSTRACIÓN INTERACTIVA"}</p><h2>{dialog.title}</h2>{dialog.description && <p className="modal-description">{dialog.description}</p>}</div>
          <button className="icon-button" onClick={onClose} aria-label="Cerrar"><X size={20} /></button>
        </header>
        <div className="demo-modal-content">{dialog.content}</div>
        <footer><button className="secondary-button" onClick={onClose}>Cerrar</button>{dialog.primaryLabel && <button className="primary-button" onClick={confirm}>{dialog.primaryLabel}</button>}</footer>
      </section>
    </div>
  );
}

function FormField({ label, children, full = false }: { label: string; children: ReactNode; full?: boolean }) {
  return <label className={full ? "full" : ""}><span>{label}</span>{children}</label>;
}

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
  const { openDialog } = useDemoActions();
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
          <div className="panel-heading"><div><p className="eyebrow">NOVIEMBRE</p><h2>Meta de producción</h2></div><button className="icon-button" aria-label="Detalle de meta" onClick={() => openDialog({ eyebrow: "PLAN MENSUAL", title: "Meta de producción", description: "Seguimiento simulado del plan de noviembre.", content: <div className="detail-list"><div><span>Meta mensual</span><strong>27.000 kg</strong></div><div><span>Producido</span><strong>18.420 kg</strong></div><div><span>Proyección</span><strong className="positive">28.160 kg</strong></div><div><span>Días productivos restantes</span><strong>9 días</strong></div></div> })}><MoreHorizontal size={19} /></button></div>
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
  const [tab, setTab] = useState("En proceso");
  const { openDialog } = useDemoActions();
  const displayedOrders = productionOrders.map((order) => tab === "Programadas" ? { ...order, progress: 0, stage: "Programada", time: "Próximo turno" } : tab === "Finalizadas" ? { ...order, progress: 100, stage: "Finalizada", time: "Lote liberado" } : order).slice(0, tab === "En proceso" ? 3 : 2);
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
        <div className="panel-heading"><div><p className="eyebrow">TURNO A · 7:00 AM — 3:00 PM</p><h2>{tab === "En proceso" ? "Órdenes activas" : `Órdenes ${tab.toLowerCase()}`}</h2></div><div className="segmented">{["En proceso", "Programadas", "Finalizadas"].map((item) => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}</button>)}</div></div>
        <div className="order-cards">
          {displayedOrders.map((order, index) => (
            <div className="order-card" key={order.id}>
              <div className="order-card-head"><div className={`product-mark product-mark-${order.color}`}><Factory size={21} /></div><div><span>{order.id}</span><h3>{order.product}</h3></div><Badge tone={index === 0 ? "green" : index === 1 ? "blue" : "neutral"}>{order.stage}</Badge></div>
              <div className="order-data"><div><span>Lote</span><strong>{order.batch}</strong></div><div><span>Meta</span><strong>{order.target}</strong></div><div><span>Responsable</span><strong>{["Usuario Prueba", "A. Suárez", "J. García"][index]}</strong></div></div>
              <div className="row-top"><span>Avance del lote</span><strong>{order.progress}%</strong></div>
              <div className="progress large"><i style={{ width: `${order.progress}%` }} /></div>
              <div className="timeline"><span className="done"><Check size={12} /> Pesaje</span><i /><span className={index < 2 ? "done" : "active"}><Check size={12} /> Mezcla</span><i /><span className={index === 0 ? "active" : ""}>Proceso</span><i /><span>Empaque</span></div>
              <button className="secondary-button" onClick={() => openDialog({ eyebrow: order.id, title: order.product, description: `Lote ${order.batch} · ${order.stage}`, content: <><div className="detail-list"><div><span>Meta de producción</span><strong>{order.target}</strong></div><div><span>Avance</span><strong>{order.progress}%</strong></div><div><span>Responsable</span><strong>{["Usuario Prueba", "A. Suárez", "J. García"][index]}</strong></div><div><span>Estado</span><Badge tone={order.progress === 100 ? "green" : "blue"}>{order.stage}</Badge></div></div><div className="dialog-note"><ClipboardCheck size={18} /><span>Fórmula, consumos y controles asociados al lote disponibles para revisión.</span></div></> })}>Abrir orden <ArrowRight size={15} /></button>
            </div>
          ))}
        </div>
      </article>
    </>
  );
}

function Inventory() {
  const [filter, setFilter] = useState("");
  const { openDialog, notify } = useDemoActions();
  const filtered = products.filter((item) => item.name.toLowerCase().includes(filter.toLowerCase()));
  const exportReport = () => {
    const rows = [["Producto", "Presentación", "Stock", "Unidad", "Estado"], ...products.map((item) => [item.name, item.presentation, item.stock, item.unit, item.status])];
    const blob = new Blob([rows.map((row) => row.join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "inventario-turza-demo.csv";
    link.click();
    URL.revokeObjectURL(url);
    notify("Reporte exportado", "El inventario fue descargado en formato CSV.");
  };
  return (
    <>
      <PageHeader eyebrow="TRAZABILIDAD FEFO" title="Inventario y lotes" description="Existencias disponibles, ubicaciones y vencimientos bajo control." action={<button className="secondary-button" onClick={exportReport}><FileText size={17} /> Exportar reporte</button>} />
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
        <div className="panel-heading"><div><p className="eyebrow">PRÓXIMAS SALIDAS FEFO</p><h2>Lotes y vencimientos</h2></div><button className="text-button" onClick={() => openDialog({ eyebrow: "TRAZABILIDAD FEFO", title: "Ruta del lote PEA-241104", description: "Resumen demostrativo desde la recepción hasta el despacho.", content: <div className="trace-steps"><div className="done"><Check size={15} /><span><strong>Recepción de materia prima</strong><small>Avícola Central · 01 nov, 7:42 AM</small></span></div><div className="done"><Check size={15} /><span><strong>Producción y ahumado</strong><small>Orden OP-1046 · 02 nov</small></span></div><div className="done"><Check size={15} /><span><strong>Liberación de calidad</strong><small>Registro LP-0844 · Conforme</small></span></div><div><Truck size={15} /><span><strong>Próxima salida sugerida</strong><small>Ruta R-016 · Aplicación FEFO</small></span></div></div> })}>Ver trazabilidad <ChevronRight size={16} /></button></div>
        <div className="table-wrap"><table><thead><tr><th>Lote</th><th>Producto</th><th>Disponible</th><th>Vencimiento</th><th>Estado</th></tr></thead><tbody>{batches.map((batch) => <tr key={batch.code}><td><strong>{batch.code}</strong></td><td>{batch.product}</td><td>{batch.qty}</td><td>{batch.expiry}</td><td><Badge tone={batch.tone}>{batch.status}</Badge></td></tr>)}</tbody></table></div>
      </article>
    </>
  );
}

function Orders() {
  const [visibleOrders, setVisibleOrders] = useState(orders);
  const { openDialog, notify } = useDemoActions();
  const groups = ["Por preparar", "En picking", "Verificado", "Facturado"];
  const openNewOrder = (status = "Por preparar") => openDialog({
    eyebrow: "VENTA MAYORISTA", title: "Nuevo pedido", description: `El pedido se agregará a la columna ${status}.`, wide: true,
    content: <div className="dialog-form"><FormField label="Cliente"><select><option>Distribuidora Centro Norte</option><option>Charcutería La Estancia</option><option>Mercado San Diego</option></select></FormField><FormField label="Fecha de entrega"><input type="date" defaultValue="2026-11-06" /></FormField><FormField label="Producto"><select><option>Jamón cocido estándar</option><option>Salchicha de pollo</option><option>Pechuga ahumada</option></select></FormField><FormField label="Cantidad"><input defaultValue="12 bultos" /></FormField><FormField label="Observaciones" full><textarea defaultValue="Entrega en horario de la mañana." /></FormField></div>,
    primaryLabel: "Crear pedido",
    onConfirm: () => { setVisibleOrders((current) => [{ id: "PV-2842", client: "Distribuidora Centro Norte", value: "$3.240", items: "12 bultos", status, when: "Entrega mañana" }, ...current]); notify("Pedido creado", "PV-2842 fue agregado al tablero comercial."); },
  });
  const openOrder = (order: typeof orders[number]) => openDialog({ eyebrow: order.id, title: order.client, description: `${order.items} · ${order.when}`, content: <div className="detail-list"><div><span>Estado actual</span><Badge tone="blue">{order.status}</Badge></div><div><span>Total del pedido</span><strong>{order.value}</strong></div><div><span>Condición de pago</span><strong>Crédito 15 días</strong></div><div><span>Ruta sugerida</span><strong>Valencia Norte</strong></div></div>, primaryLabel: "Marcar revisado", onConfirm: () => notify("Pedido revisado", `${order.id} quedó listo para continuar.`) });
  return (
    <>
      <PageHeader eyebrow="VENTAS AL MAYOR" title="Pedidos" description="Del pedido comercial a la carga, con precios y presentaciones por cliente." action={<button className="primary-button" onClick={() => openNewOrder()}><Plus size={17} /> Nuevo pedido</button>} />
      <section className="metric-grid compact">
        <Metric label="Venta abierta" value="$18.950" note="12 pedidos" icon={ShoppingCart} />
        <Metric label="Para entregar hoy" value="5" note="$11.320 facturados" icon={Truck} tone="blue" />
        <Metric label="Crédito utilizado" value="42%" note="$36.800 disponible" icon={Gauge} tone="gold" />
        <Metric label="Ticket promedio" value="$2.840" note="12,5% este mes" trend="up" icon={ArrowUpRight} tone="rose" />
      </section>
      <div className="kanban">
        {groups.map((group) => {
          const groupOrders = visibleOrders.filter((order) => order.status === group);
          return <div className="kanban-column" key={group}><div className="kanban-head"><span><i className={`dot dot-${group.replace(" ", "-").toLowerCase()}`} />{group}</span><Badge>{groupOrders.length}</Badge></div>{groupOrders.map((order) => <article className="kanban-card" key={order.id}><div><Badge tone="neutral">{order.id}</Badge><button aria-label={`Opciones de ${order.id}`} onClick={() => openOrder(order)}><MoreHorizontal size={17} /></button></div><h3>{order.client}</h3><p>{order.items} · {order.when}</p><footer><strong>{order.value}</strong><button className="card-link" onClick={() => openOrder(order)}>Ver detalle <ChevronRight size={14} /></button></footer></article>)}<button className="add-card" onClick={() => openNewOrder(group)}><Plus size={15} /> Agregar pedido</button></div>;
        })}
      </div>
    </>
  );
}

function Quality() {
  const [filter, setFilter] = useState("Todos");
  const { openDialog, notify } = useDemoActions();
  const checks = [
    { title: "Recepción de materia prima", detail: "Pollo · Proveedor Avícola Central", code: "RC-2481", checks: "12/12", status: "Aprobado" },
    { title: "Control de cocción", detail: "Jamón estándar · Lote JCE-241104", code: "CC-1938", checks: "8/8", status: "Conforme" },
    { title: "Liberación de producto", detail: "Mortadela 900 g · Lote MOR-241103", code: "LP-0847", checks: "9/10", status: "Pendiente" },
  ];
  return (
    <>
      <PageHeader eyebrow="INOCUIDAD Y CUMPLIMIENTO" title="Control de calidad" description="Evidencia cada control y libera únicamente los lotes conformes." action={<button className="primary-button" onClick={() => openDialog({ eyebrow: "CONTROL DE CALIDAD", title: "Nueva inspección", description: "Registra un control asociado a un lote de producción.", content: <div className="dialog-form"><FormField label="Tipo de control"><select><option>Control de cocción</option><option>Recepción de materia prima</option><option>Liberación de producto</option></select></FormField><FormField label="Lote"><select><option>JCE-241104</option><option>SAL-241104</option><option>PEA-241104</option></select></FormField><FormField label="Temperatura"><input defaultValue="72 °C" /></FormField><FormField label="Responsable"><input defaultValue="Usuario Prueba" /></FormField></div>, primaryLabel: "Registrar inspección", onConfirm: () => notify("Inspección registrada", "El control CC-1939 fue añadido al historial.") })}><Plus size={17} /> Nueva inspección</button>} />
      <div className="quality-hero">
        <div><span className="quality-seal"><ShieldCheck size={31} /></span><div><p className="eyebrow">ÍNDICE DE CALIDAD · NOVIEMBRE</p><h2>98,6%</h2><p>Todos los lotes liberados mantienen su trazabilidad completa.</p></div></div>
        <div className="quality-mini"><div><strong>42</strong><span>Inspecciones</span></div><div><strong>0</strong><span>Lotes rechazados</span></div><div><strong>1</strong><span>Acción abierta</span></div></div>
      </div>
      <article className="panel page-panel">
        <div className="panel-heading"><div><p className="eyebrow">HOY</p><h2>Controles recientes</h2></div><div className="segmented">{["Todos", "Pendientes", "Cerrados"].map((item) => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div></div>
        <div className="check-list">{checks.filter((check) => filter === "Todos" || (filter === "Pendientes" ? check.status === "Pendiente" : check.status !== "Pendiente")).map((check) => <div className="check-row" key={check.code}><span className={`check-icon ${check.status === "Pendiente" ? "pending" : ""}`}>{check.status === "Pendiente" ? <Clock3 size={20} /> : <CheckCircle2 size={20} />}</span><div className="check-main"><strong>{check.title}</strong><span>{check.detail}</span></div><div><span>Registro</span><strong>{check.code}</strong></div><div><span>Verificaciones</span><strong>{check.checks}</strong></div><Badge tone={check.status === "Pendiente" ? "amber" : "green"}>{check.status}</Badge><button className="icon-button" onClick={() => openDialog({ eyebrow: check.code, title: check.title, description: check.detail, content: <div className="detail-list"><div><span>Verificaciones completadas</span><strong>{check.checks}</strong></div><div><span>Resultado</span><Badge tone={check.status === "Pendiente" ? "amber" : "green"}>{check.status}</Badge></div><div><span>Inspector</span><strong>Usuario Prueba</strong></div><div><span>Evidencia</span><strong>3 registros adjuntos</strong></div></div>, primaryLabel: check.status === "Pendiente" ? "Completar control" : undefined, onConfirm: () => notify("Control completado", `${check.code} fue marcado como conforme.`) })}><ChevronRight size={18} /></button></div>)}</div>
      </article>
      <div className="quality-grid"><article className="panel"><div className="panel-heading"><div><p className="eyebrow">TEMPERATURA</p><h2>Cámaras frías</h2></div><ThermometerSnowflake size={22} /></div><div className="temperature-list"><div><span>Cámara 01 · Producto terminado</span><strong>2,4 °C</strong><Badge tone="green">Normal</Badge></div><div><span>Cámara 02 · Materia prima</span><strong>1,8 °C</strong><Badge tone="green">Normal</Badge></div><div><span>Congelación</span><strong>-18,2 °C</strong><Badge tone="green">Normal</Badge></div></div></article><article className="panel"><div className="panel-heading"><div><p className="eyebrow">DOCUMENTACIÓN</p><h2>Próximos vencimientos</h2></div><ClipboardCheck size={22} /></div><div className="document-list"><div><span>Calibración · Balanza B-04</span><strong>12 nov</strong></div><div><span>Certificado sanitario · Planta</span><strong>28 nov</strong></div><div><span>Mantenimiento · Termógrafo 02</span><strong>02 dic</strong></div></div></article></div>
    </>
  );
}

function Dispatches() {
  const { openDialog, notify } = useDemoActions();
  const openRoute = (route: typeof routes[number]) => openDialog({ eyebrow: route.id, title: route.name, description: `${route.vehicle} · ${route.driver}`, wide: true, content: <><div className="detail-list"><div><span>Estado</span><Badge tone={route.status === "En ruta" ? "green" : "blue"}>{route.status}</Badge></div><div><span>Carga asignada</span><strong>{route.load}</strong></div><div><span>Entregas completadas</span><strong>{route.delivered} de {route.stops}</strong></div><div><span>Temperatura de salida</span><strong>2,1 °C</strong></div></div><div className="route-stops"><span className="done"><Check size={14} /> Planta Turza</span><i /><span className={route.delivered > 0 ? "done" : ""}>Valencia Centro</span><i /><span>Destino final</span></div></>, primaryLabel: "Confirmar hoja", onConfirm: () => notify("Hoja de ruta confirmada", `${route.id} quedó verificada para despacho.`) });
  return (
    <>
      <PageHeader eyebrow="LOGÍSTICA Y CADENA DE FRÍO" title="Despachos" description="Planifica cargas, recorridos y entregas desde un solo lugar." action={<button className="primary-button" onClick={() => openDialog({ eyebrow: "PLANIFICACIÓN LOGÍSTICA", title: "Planificar nueva ruta", description: "Asigna vehículo, conductor y pedidos para la próxima salida.", wide: true, content: <div className="dialog-form"><FormField label="Nombre de ruta"><input defaultValue="Valencia Sur" /></FormField><FormField label="Fecha y hora"><input type="datetime-local" defaultValue="2026-11-06T08:00" /></FormField><FormField label="Vehículo"><select><option>Furgón 05</option><option>Furgón 07</option><option>Furgón 11</option></select></FormField><FormField label="Conductor"><select><option>Carlos Mendoza</option><option>Luis Herrera</option><option>José Perdomo</option></select></FormField><FormField label="Pedidos asignados" full><input defaultValue="PV-2841, PV-2840, PV-2838" /></FormField></div>, primaryLabel: "Crear ruta", onConfirm: () => notify("Ruta planificada", "R-017 fue agregada al plan de mañana.") })}><Plus size={17} /> Planificar ruta</button>} />
      <div className="dispatch-banner"><div><Truck size={27} /><div><strong>3 rutas programadas para hoy</strong><span>17 de 23 entregas aún están en curso.</span></div></div><div><strong>5.220 kg</strong><span>Carga total despachada</span></div></div>
      <div className="route-grid">
        {routes.map((route, index) => <article className="route-card" key={route.id}><header><div><Badge tone={index === 0 ? "green" : index === 1 ? "blue" : "neutral"}>{route.status}</Badge><h2>{route.name}</h2><p>{route.id} · {route.vehicle}</p></div><button className="icon-button" onClick={() => openRoute(route)}><MoreHorizontal size={18} /></button></header><div className="route-progress"><div className="row-top"><span>Progreso de entregas</span><strong>{route.delivered}/{route.stops}</strong></div><div className="progress large"><i style={{ width: `${(route.delivered / route.stops) * 100}%` }} /></div></div><div className="route-info"><div><Users size={17} /><span>Conductor</span><strong>{route.driver}</strong></div><div><Boxes size={17} /><span>Carga</span><strong>{route.load}</strong></div><div><PackageCheck size={17} /><span>Paradas</span><strong>{route.stops}</strong></div></div><button className="secondary-button" onClick={() => openRoute(route)}>Ver hoja de ruta <ArrowRight size={15} /></button></article>)}
      </div>
      <article className="panel page-panel"><div className="panel-heading"><div><p className="eyebrow">ÚLTIMAS ENTREGAS</p><h2>Actividad de ruta</h2></div><button className="text-button" onClick={() => openDialog({ eyebrow: "HISTORIAL LOGÍSTICO", title: "Entregas recientes", description: "Resumen de cumplimiento de las rutas.", content: <div className="detail-list"><div><span>Entregadas hoy</span><strong>6 paradas</strong></div><div><span>Entregadas ayer</span><strong>19 paradas</strong></div><div><span>Incidencias abiertas</span><strong>0</strong></div><div><span>Cumplimiento</span><strong className="positive">96,4%</strong></div></div> })}>Historial <ChevronRight size={16} /></button></div><div className="activity-list"><div><span className="activity-icon"><Check size={16} /></span><div><strong>Pedido PV-2835 entregado</strong><span>Bodegón El Portal · Recibido por M. Salazar</span></div><time>10:42 AM</time></div><div><span className="activity-icon"><Check size={16} /></span><div><strong>Pedido PV-2832 entregado</strong><span>Charcutería La Montaña · Sin novedades</span></div><time>10:18 AM</time></div><div><span className="activity-icon blue"><Truck size={16} /></span><div><strong>Ruta R-015 inició proceso de carga</strong><span>Andén 02 · Temperatura 2,1 °C</span></div><time>9:55 AM</time></div></div></article>
    </>
  );
}

function Clients() {
  const [search, setSearch] = useState("");
  const { openDialog, notify } = useDemoActions();
  const clients = [
    { initials: "DC", name: "Distribuidora Centro Norte", rif: "J-40128563-7", contact: "Andrea Salazar", zone: "Valencia Norte", balance: "$3.420", sales: "$18.760", status: "Activo" },
    { initials: "CE", name: "Charcutería La Estancia", rif: "J-30984512-4", contact: "Miguel Pérez", zone: "Naguanagua", balance: "$1.180", sales: "$12.340", status: "Activo" },
    { initials: "MS", name: "Mercado San Diego", rif: "J-50192834-2", contact: "Laura Gómez", zone: "San Diego", balance: "$0", sales: "$9.860", status: "Al día" },
    { initials: "SV", name: "Suministros Valencia", rif: "J-29876140-9", contact: "Carlos Ruiz", zone: "Valencia Centro", balance: "$5.760", sales: "$16.420", status: "Por cobrar" },
    { initials: "BP", name: "Bodegón El Portal", rif: "J-41290756-1", contact: "María Salazar", zone: "Guacara", balance: "$740", sales: "$7.980", status: "Activo" },
  ];
  const filteredClients = clients.filter((client) => `${client.name} ${client.rif} ${client.zone}`.toLowerCase().includes(search.toLowerCase()));
  const openClient = (client: typeof clients[number]) => openDialog({ eyebrow: client.rif, title: client.name, description: `${client.zone} · Contacto: ${client.contact}`, content: <div className="detail-list"><div><span>Venta mensual</span><strong>{client.sales}</strong></div><div><span>Saldo pendiente</span><strong>{client.balance}</strong></div><div><span>Condición comercial</span><strong>Crédito 15 días</strong></div><div><span>Estado</span><Badge tone={client.status === "Por cobrar" ? "amber" : "green"}>{client.status}</Badge></div></div>, primaryLabel: "Registrar seguimiento", onConfirm: () => notify("Seguimiento registrado", `Se añadió una actividad para ${client.name}.`) });

  return (
    <>
      <PageHeader eyebrow="GESTIÓN COMERCIAL" title="Clientes" description="Centraliza condiciones comerciales, crédito, contactos y comportamiento de compra." action={<button className="primary-button" onClick={() => openDialog({ eyebrow: "CARTERA COMERCIAL", title: "Nuevo cliente", description: "Añade un prospecto o cliente mayorista al directorio.", wide: true, content: <div className="dialog-form"><FormField label="Nombre comercial"><input defaultValue="Abastos La Pradera" /></FormField><FormField label="RIF"><input defaultValue="J-41234567-8" /></FormField><FormField label="Persona de contacto"><input defaultValue="María Fernández" /></FormField><FormField label="Teléfono"><input defaultValue="+58 412-0000000" /></FormField><FormField label="Zona"><select><option>Valencia Norte</option><option>San Diego</option><option>Guacara</option></select></FormField><FormField label="Límite de crédito"><input defaultValue="$2.500" /></FormField></div>, primaryLabel: "Guardar cliente", onConfirm: () => notify("Cliente creado", "Abastos La Pradera fue añadido al directorio.") })}><UserPlus size={17} /> Nuevo cliente</button>} />
      <section className="metric-grid compact">
        <Metric label="Clientes activos" value="86" note="7 nuevos este mes" trend="up" icon={Users} />
        <Metric label="Ventas recurrentes" value="74%" note="Sobre venta mensual" icon={ShoppingCart} tone="gold" />
        <Metric label="Crédito otorgado" value="$64.500" note="42% utilizado" icon={CreditCard} tone="blue" />
        <Metric label="Cartera por cobrar" value="$11.100" note="3 facturas vencidas" icon={WalletCards} tone="rose" />
      </section>
      <article className="panel page-panel">
        <div className="panel-heading customer-tools">
          <div><p className="eyebrow">CARTERA COMERCIAL</p><h2>Directorio de clientes</h2></div>
          <div className="toolbar"><label className="inline-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar cliente o RIF" /></label><button className="secondary-button" onClick={() => openDialog({ eyebrow: "FILTROS", title: "Filtrar directorio", content: <div className="dialog-form"><FormField label="Zona"><select><option>Todas</option><option>Valencia Norte</option><option>San Diego</option><option>Guacara</option></select></FormField><FormField label="Estado"><select><option>Todos</option><option>Activos</option><option>Por cobrar</option></select></FormField></div>, primaryLabel: "Aplicar filtros", onConfirm: () => notify("Filtros aplicados", "El directorio fue actualizado con los criterios seleccionados.") })}><SlidersHorizontal size={15} /> Filtros</button></div>
        </div>
        <div className="table-wrap customer-table"><table><thead><tr><th>Cliente</th><th>Contacto</th><th>Zona</th><th>Venta mensual</th><th>Saldo</th><th>Estado</th><th /></tr></thead><tbody>{filteredClients.map((client) => <tr key={client.rif}><td><div className="client-cell"><span className="client-avatar">{client.initials}</span><div><strong>{client.name}</strong><small>{client.rif}</small></div></div></td><td><strong>{client.contact}</strong><small>Compras</small></td><td>{client.zone}</td><td><strong>{client.sales}</strong></td><td><strong>{client.balance}</strong></td><td><Badge tone={client.status === "Por cobrar" ? "amber" : "green"}>{client.status}</Badge></td><td><button className="icon-button" onClick={() => openClient(client)}><ChevronRight size={17} /></button></td></tr>)}</tbody></table></div>
      </article>
      <div className="client-bottom-grid">
        <article className="panel"><div className="panel-heading"><div><p className="eyebrow">SEGMENTACIÓN</p><h2>Clientes por canal</h2></div><Users size={20} /></div><div className="channel-list"><div><span>Distribuidores</span><strong>24</strong><i><b style={{ width: "82%" }} /></i></div><div><span>Charcuterías</span><strong>38</strong><i><b style={{ width: "66%" }} /></i></div><div><span>Restaurantes</span><strong>16</strong><i><b style={{ width: "43%" }} /></i></div><div><span>Víveres y bodegones</span><strong>8</strong><i><b style={{ width: "28%" }} /></i></div></div></article>
        <article className="panel"><div className="panel-heading"><div><p className="eyebrow">OPORTUNIDADES</p><h2>Seguimiento comercial</h2></div><button className="text-button" onClick={() => openDialog({ eyebrow: "AGENDA COMERCIAL", title: "Próximas actividades", description: "Compromisos del equipo de ventas.", content: <div className="detail-list"><div><span>Hoy · 2:00 PM</span><strong>Renovar lista de precios</strong></div><div><span>Mañana · 9:00 AM</span><strong>Enviar propuesta mayorista</strong></div><div><span>Viernes · 10:30 AM</span><strong>Visita a Abastos del Este</strong></div></div>, primaryLabel: "Agendar actividad", onConfirm: () => notify("Actividad agendada", "La nueva actividad fue añadida al seguimiento comercial.") })}>Ver agenda <ChevronRight size={16} /></button></div><div className="followup-list"><div><span className="activity-icon"><Phone size={15} /></span><div><strong>Renovación de lista de precios</strong><span>Distribuidora Centro Norte · Hoy, 2:00 PM</span></div></div><div><span className="activity-icon blue"><Mail size={15} /></span><div><strong>Enviar propuesta mayorista</strong><span>Supermercado La Colina · Mañana</span></div></div><div><span className="activity-icon gold"><MapPin size={15} /></span><div><strong>Visita comercial programada</strong><span>Abastos del Este · Viernes, 10:30 AM</span></div></div></div></article>
      </div>
    </>
  );
}

function Finance() {
  const { openDialog, notify } = useDemoActions();
  const movements = [
    { ref: "FAC-4821", detail: "Distribuidora Centro Norte", type: "Cobro de factura", date: "Hoy · 10:42 AM", amount: "+$4.860", tone: "income" },
    { ref: "PAG-1934", detail: "Avícola Central, C.A.", type: "Pago a proveedor", date: "Hoy · 9:18 AM", amount: "-$2.740", tone: "expense" },
    { ref: "FAC-4819", detail: "Mercado San Diego", type: "Venta de contado", date: "Ayer · 4:36 PM", amount: "+$6.120", tone: "income" },
    { ref: "PAG-1931", detail: "Empaques del Centro", type: "Material de empaque", date: "Ayer · 2:15 PM", amount: "-$1.280", tone: "expense" },
  ];
  const bars = [54, 68, 46, 78, 63, 86, 72, 91, 76, 88, 67, 82];

  return (
    <>
      <PageHeader eyebrow="CONTROL FINANCIERO" title="Finanzas" description="Visibilidad sobre caja, cobranza, compromisos y rentabilidad operativa." action={<button className="primary-button" onClick={() => openDialog({ eyebrow: "TESORERÍA", title: "Registrar movimiento", description: "Carga un ingreso o egreso en una cuenta operativa.", wide: true, content: <div className="dialog-form"><FormField label="Tipo"><select><option>Ingreso</option><option>Egreso</option></select></FormField><FormField label="Cuenta"><select><option>Banco Nacional · 0842</option><option>Cuenta USD</option><option>Caja principal</option></select></FormField><FormField label="Concepto"><input defaultValue="Cobro de factura" /></FormField><FormField label="Monto"><input defaultValue="$4.860" /></FormField><FormField label="Referencia" full><input defaultValue="FAC-4822" /></FormField></div>, primaryLabel: "Registrar movimiento", onConfirm: () => notify("Movimiento registrado", "FAC-4822 fue incorporado al libro financiero.") })}><Plus size={17} /> Registrar movimiento</button>} />
      <section className="metric-grid compact">
        <Metric label="Saldo disponible" value="$46.820" note="3 cuentas operativas" icon={WalletCards} />
        <Metric label="Ingresos del mes" value="$84.620" note="12,8% vs. octubre" trend="up" icon={ArrowUpRight} tone="gold" />
        <Metric label="Cuentas por cobrar" value="$11.100" note="$2.340 vencidos" icon={CreditCard} tone="blue" />
        <Metric label="Margen bruto" value="31,4%" note="1,9% sobre la meta" trend="up" icon={Gauge} tone="rose" />
      </section>
      <div className="finance-grid">
        <article className="panel cashflow-panel">
          <div className="panel-heading"><div><p className="eyebrow">ÚLTIMOS 12 MESES</p><h2>Flujo de ingresos y egresos</h2></div><select className="period-select"><option>Este año</option><option>Últimos 6 meses</option></select></div>
          <div className="chart-summary"><div><span>Ingresos</span><strong>$486.240</strong></div><div><span>Egresos</span><strong>$331.870</strong></div><div><span>Resultado</span><strong className="positive">+$154.370</strong></div></div>
          <div className="bar-chart">{bars.map((height, index) => <div className="bar-column" key={index}><div><i style={{ height: `${height}%` }} /><b style={{ height: `${Math.max(24, height - 28)}%` }} /></div><span>{["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"][index]}</span></div>)}</div>
          <div className="chart-legend"><span><i className="legend-income" /> Ingresos</span><span><i className="legend-expense" /> Egresos</span></div>
        </article>
        <article className="panel accounts-panel">
          <div className="panel-heading"><div><p className="eyebrow">DISPONIBILIDAD</p><h2>Cuentas y cajas</h2></div><button className="icon-button" onClick={() => openDialog({ eyebrow: "CUENTAS OPERATIVAS", title: "Resumen de disponibilidad", content: <div className="detail-list"><div><span>Saldo consolidado</span><strong>$46.820</strong></div><div><span>Fondos conciliados</span><strong>$44.740</strong></div><div><span>Pendiente por conciliar</span><strong>$2.080</strong></div><div><span>Última actualización</span><strong>Hoy · 10:45 AM</strong></div></div> })}><MoreHorizontal size={18} /></button></div>
          <div className="account-list"><div><span className="account-icon"><Building2 size={18} /></span><div><strong>Banco Nacional</strong><span>Cuenta corriente · 0842</span></div><b>$28.460</b></div><div><span className="account-icon gold"><DollarSign size={18} /></span><div><strong>Cuenta USD</strong><span>Operaciones comerciales</span></div><b>$16.280</b></div><div><span className="account-icon neutral"><WalletCards size={18} /></span><div><strong>Caja principal</strong><span>Planta Valencia</span></div><b>$2.080</b></div></div>
          <button className="secondary-button full-button" onClick={() => openDialog({ eyebrow: "CONCILIACIÓN", title: "Conciliar cuentas", description: "Compara los saldos del ERP con los registros bancarios.", content: <div className="detail-list"><div><span>Movimientos encontrados</span><strong>28</strong></div><div><span>Coincidencias automáticas</span><strong className="positive">26</strong></div><div><span>Por revisar</span><strong>2</strong></div></div>, primaryLabel: "Confirmar conciliación", onConfirm: () => notify("Conciliación completada", "26 movimientos fueron conciliados correctamente.") })}>Conciliar cuentas</button>
        </article>
      </div>
      <article className="panel page-panel"><div className="panel-heading"><div><p className="eyebrow">ACTIVIDAD RECIENTE</p><h2>Últimos movimientos</h2></div><button className="text-button" onClick={() => openDialog({ eyebrow: "LIBRO FINANCIERO", title: "Movimientos de noviembre", description: "Consolidado demostrativo de ingresos y egresos.", content: <div className="detail-list"><div><span>Movimientos registrados</span><strong>148</strong></div><div><span>Total ingresos</span><strong className="positive">$84.620</strong></div><div><span>Total egresos</span><strong>$57.940</strong></div><div><span>Resultado del mes</span><strong className="positive">+$26.680</strong></div></div> })}>Ver libro completo <ChevronRight size={16} /></button></div><div className="movement-list">{movements.map((movement) => <div key={movement.ref}><span className={`movement-icon ${movement.tone}`}><DollarSign size={16} /></span><div><strong>{movement.detail}</strong><span>{movement.type} · {movement.ref}</span></div><time>{movement.date}</time><b className={movement.tone}>{movement.amount}</b></div>)}</div></article>
    </>
  );
}

function Configuration() {
  const [section, setSection] = useState("Empresa");
  const [preferences, setPreferences] = useState([true, true, true, false]);
  const { notify } = useDemoActions();
  const sections = [
    { label: "Empresa", icon: Building2 }, { label: "Usuarios y roles", icon: Users }, { label: "Operación", icon: SlidersHorizontal },
    { label: "Monedas y pagos", icon: CreditCard }, { label: "Seguridad", icon: LockKeyhole }, { label: "Datos y respaldo", icon: Database },
  ];
  const sectionCopy: Record<string, { title: string; description: string; options: string[] }> = {
    "Usuarios y roles": { title: "Usuarios y permisos", description: "Define quién puede consultar, aprobar y modificar información.", options: ["Acceso de vendedores", "Aprobación de supervisores", "Registro de actividad"] },
    "Operación": { title: "Parámetros de operación", description: "Reglas utilizadas en producción, inventario y despachos.", options: ["Control de lotes", "Despacho por FEFO", "Alertas de inventario"] },
    "Monedas y pagos": { title: "Monedas y condiciones de pago", description: "Preferencias financieras para ventas y cobranza.", options: ["Mostrar equivalente en USD", "Crédito comercial", "Redondeo automático"] },
    "Seguridad": { title: "Seguridad de la cuenta", description: "Protege el acceso a la información de la empresa.", options: ["Inicio de sesión seguro", "Bloqueo por inactividad", "Alertas de acceso"] },
    "Datos y respaldo": { title: "Datos y respaldo", description: "Controla copias de seguridad y exportaciones.", options: ["Respaldo diario", "Exportación de reportes", "Historial de cambios"] },
  };
  const togglePreference = (index: number) => setPreferences((current) => current.map((value, itemIndex) => itemIndex === index ? !value : value));
  return (
    <>
      <PageHeader eyebrow="ADMINISTRACIÓN DEL SISTEMA" title="Configuración" description="Personaliza los datos de empresa, preferencias operativas y accesos." action={<button className="primary-button" onClick={() => notify("Cambios guardados", `La sección ${section} fue actualizada correctamente.`)}><Check size={17} /> Guardar cambios</button>} />
      <div className="settings-layout">
        <aside className="settings-nav panel">{sections.map((item) => { const Icon = item.icon; return <button key={item.label} className={section === item.label ? "active" : ""} onClick={() => setSection(item.label)}><Icon size={17} /><span>{item.label}</span><ChevronRight size={15} /></button>; })}</aside>
        <div className="settings-content">
          {section === "Empresa" ? <>
            <article className="panel settings-section"><div className="settings-title"><span className="settings-icon"><Building2 size={20} /></span><div><h2>Información de la empresa</h2><p>Datos visibles en documentos, reportes y comunicaciones.</p></div></div><div className="settings-form"><label className="full"><span>Nombre comercial</span><input defaultValue="Embutidos Turza" /></label><label><span>Razón social</span><input defaultValue="Alimentos Turza, C.A." /></label><label><span>RIF</span><input defaultValue="J-00000000-0" /></label><label><span>Teléfono</span><input defaultValue="+58 412-8278888" /></label><label><span>Correo comercial</span><input defaultValue="ventas@embutidosturza.com" /></label><label className="full"><span>Dirección fiscal</span><input defaultValue="Valencia, estado Carabobo, Venezuela" /></label></div></article>
            <article className="panel settings-section"><div className="settings-title"><span className="settings-icon gold"><SlidersHorizontal size={20} /></span><div><h2>Preferencias operativas</h2><p>Parámetros generales utilizados en toda la demo.</p></div></div><div className="preference-list">{["Control de lotes obligatorio", "Despacho por FEFO", "Alertas de inventario", "Aprobación doble de ajustes"].map((label, index) => <div key={label}><div><strong>{label}</strong><span>{index === 3 ? "Solicitar autorización para ajustes mayores a $500." : "Preferencia activa en los módulos relacionados."}</span></div><button className={`switch ${preferences[index] ? "active" : ""}`} onClick={() => togglePreference(index)} aria-label={`${label}: ${preferences[index] ? "activo" : "inactivo"}`}><i /></button></div>)}</div></article>
          </> : <article className="panel settings-section settings-focus"><div className="settings-title"><span className="settings-icon"><Settings size={20} /></span><div><h2>{sectionCopy[section].title}</h2><p>{sectionCopy[section].description}</p></div></div><div className="preference-list">{sectionCopy[section].options.map((label, index) => <div key={label}><div><strong>{label}</strong><span>Configuración demostrativa disponible para la empresa.</span></div><button className={`switch ${index !== 2 ? "active" : ""}`} onClick={(event) => event.currentTarget.classList.toggle("active")} aria-label={label}><i /></button></div>)}</div></article>}
        </div>
      </div>
    </>
  );
}

function NewProductionModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(event) => event.stopPropagation()}>
        <header><div><p className="eyebrow">PLAN DE PLANTA</p><h2>Nueva orden de producción</h2></div><button className="icon-button" onClick={onClose}><X size={20} /></button></header>
        <div className="form-grid">
          <label><span>Producto</span><select defaultValue="Jamón cocido estándar"><option>Jamón cocido estándar</option><option>Salchicha de pollo</option><option>Pechuga ahumada</option><option>Mortadela de pollo</option></select></label>
          <label><span>Presentación</span><select><option>Pieza 5 kg</option><option>Pieza 500 g</option></select></label>
          <label><span>Cantidad planificada</span><div className="input-suffix"><input defaultValue="420" /><span>kg</span></div></label>
          <label><span>Fecha de producción</span><input type="date" defaultValue="2026-11-05" /></label>
          <label className="full"><span>Responsable de turno</span><select><option>Usuario Prueba</option><option>Ana Suárez</option><option>José García</option></select></label>
        </div>
        <div className="formula-callout"><ClipboardCheck size={19} /><div><strong>Fórmula FT-JCE-03 seleccionada</strong><span>Los consumos estimados y controles de calidad se cargarán automáticamente.</span></div></div>
        <footer><button className="secondary-button" onClick={onClose}>Cancelar</button><button className="primary-button" onClick={onCreated}>Crear orden</button></footer>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>(() => {
    const hashPage = window.location.hash.replace("#", "") as Page;
    return allNavigation.some((item) => item.id === hashPage) ? hashPage : "resumen";
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [dialog, setDialog] = useState<DialogConfig | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [globalSearch, setGlobalSearch] = useState("");
  const currentLabel = useMemo(() => allNavigation.find((item) => item.id === page)?.label ?? "Resumen", [page]);

  const notify = (title: string, detail: string) => {
    setToast({ title, detail });
    window.setTimeout(() => setToast(null), 3500);
  };

  const navigate = (target: Page) => {
    setPage(target);
    window.history.replaceState(null, "", `#${target}`);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const createOrder = () => {
    setModalOpen(false);
    notify("Orden creada", "La orden OP-1051 fue agregada al plan.");
    setPage("produccion");
  };

  const runSearch = () => {
    if (!globalSearch.trim()) return;
    setDialog({ eyebrow: "BÚSQUEDA GLOBAL", title: `Resultados para “${globalSearch}”`, description: "Coincidencias encontradas en toda la demo.", content: <div className="search-results"><button onClick={() => { navigate("pedidos"); setDialog(null); }}><ShoppingCart size={18} /><span><strong>Pedido PV-2841</strong><small>Distribuidora Centro Norte · Entrega hoy</small></span><ChevronRight size={16} /></button><button onClick={() => { navigate("inventario"); setDialog(null); }}><Boxes size={18} /><span><strong>Lote PEA-241104</strong><small>Pechuga ahumada · Vence en 8 días</small></span><ChevronRight size={16} /></button><button onClick={() => { navigate("clientes"); setDialog(null); }}><Users size={18} /><span><strong>Distribuidora Centro Norte</strong><small>Cliente activo · Valencia Norte</small></span><ChevronRight size={16} /></button></div> });
  };

  return (
    <DemoActionsContext.Provider value={{ openDialog: setDialog, closeDialog: () => setDialog(null), notify }}>
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
          {administration.map((item) => { const Icon = item.icon; return <button key={item.id} className={page === item.id ? "active" : ""} onClick={() => navigate(item.id)}><Icon size={19} /><span>{item.label}</span></button>; })}
        </nav>
        <div className="sidebar-foot"><div className="avatar">UP</div><div><strong>Usuario Prueba</strong><span>Administrador demo</span></div><ChevronDown size={16} /></div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="topbar-left"><button className="menu-button" onClick={() => setSidebarOpen(true)}><Menu size={21} /></button><span>{currentLabel}</span><ChevronRight size={14} /><strong>Planta Valencia</strong></div>
          <div className="topbar-right"><label className="global-search"><Search size={17} /><input value={globalSearch} onChange={(event) => setGlobalSearch(event.target.value)} onKeyDown={(event) => event.key === "Enter" && runSearch()} placeholder="Buscar pedido, lote o cliente…" /><kbd>Enter</kbd></label><button className="plant-selector" onClick={() => setDialog({ eyebrow: "SEDE ACTIVA", title: "Planta Valencia", description: "Todos los indicadores pertenecen a esta operación.", content: <div className="detail-list"><div><span>Estado de planta</span><Badge tone="green">En línea</Badge></div><div><span>Turno actual</span><strong>Turno A</strong></div><div><span>Responsable</span><strong>Usuario Prueba</strong></div></div> })}><span className="online-dot" /> Planta Valencia <ChevronDown size={15} /></button><button className="top-avatar" onClick={() => setDialog({ eyebrow: "SESIÓN DEMO", title: "Usuario Prueba", description: "Administrador de la demostración comercial.", content: <div className="detail-list"><div><span>Rol</span><strong>Administrador demo</strong></div><div><span>Planta</span><strong>Valencia</strong></div><div><span>Último acceso</span><strong>Hoy · 8:02 AM</strong></div></div> })}>UP</button></div>
        </header>
        <main>
          <div className="demo-disclaimer">Propuesta conceptual · Todos los datos mostrados son simulados para fines demostrativos.</div>
          {page === "resumen" && <Overview onNavigate={navigate} />}
          {page === "produccion" && <Production openModal={() => setModalOpen(true)} />}
          {page === "inventario" && <Inventory />}
          {page === "pedidos" && <Orders />}
          {page === "calidad" && <Quality />}
          {page === "despachos" && <Dispatches />}
          {page === "clientes" && <Clients />}
          {page === "finanzas" && <Finance />}
          {page === "configuracion" && <Configuration />}
        </main>
      </div>
      {modalOpen && <NewProductionModal onClose={() => setModalOpen(false)} onCreated={createOrder} />}
      {dialog && <DemoDialog dialog={dialog} onClose={() => setDialog(null)} />}
      {toast && <div className="toast"><CheckCircle2 size={19} /><div><strong>{toast.title}</strong><span>{toast.detail}</span></div><button onClick={() => setToast(null)}><X size={16} /></button></div>}
    </div>
    </DemoActionsContext.Provider>
  );
}
