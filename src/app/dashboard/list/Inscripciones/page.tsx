"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useInscripciones, Persona, Inscripcion } from '@/features/inscriptions/useInscripciones';
import InscripcionesTable from '@/features/inscriptions/components/InscripcionesTable';
import AvatarFoto from '@/features/inscriptions/components/AvatarFoto';
import { Inscripcion as InscripcionType } from '@/features/inscriptions/types';
import InscripcionModal from '@/features/inscriptions/components/InscripcionModal';

/* =========================
 *  Utilidades
 * ========================= */
const DEFAULT_AVATAR = "/avatars/avatar-generico.png";

function nombreCompleto(p: Persona) {
  return `${p.nombre ?? ""} ${p.apellidoPaterno ?? ""} ${p.apellidoMaterno ?? ""}`
    .replace(/\s+/g, " ")
    .trim();
}
function formatDate(d?: string | null) {
  if (!d) return "—";
  const dd = new Date(d);
  if (isNaN(dd.getTime())) return "—";
  return dd.toLocaleDateString("es-MX");
}
function isSameLocalDay(iso?: string | null) {
  if (!iso) return false;
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}
function badgeClassesByStatus(s?: string | null) {
  const v = (s ?? "").toLowerCase();
  if (v.includes("pend")) return "bg-amber-50 text-amber-700 ring-amber-600/20";
  if (v.includes("cancel")) return "bg-rose-50 text-rose-700 ring-rose-600/20";
  if (v.includes("conclu") || v.includes("regist")) return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
  return "bg-gray-50 text-gray-700 ring-gray-600/20";
}

// AvatarFoto ahora está en features/inscriptions/components/AvatarFoto.tsx

// useInscripciones ahora está centralizado en features/inscriptions/useInscripciones

/* =========================
 *  Página
 * ========================= */
export default function Page() {
  const router = useRouter();
  const {
    q, setQ,
    status, setStatus,
    periodo, setPeriodo,
    soloHoy, setSoloHoy,
    page, pageSize, setPageSize,
    data, itemsFiltrados, loading, error,
    next, prev,
  } = useInscripciones();

  /* ==== Selección por checkboxes ==== */
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  const isSelected = (id: string) => selectedIds.has(id);

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const allVisibleIds = React.useMemo(
    () => (itemsFiltrados ?? []).map((i) => i.id),
    [itemsFiltrados]
  );

  const allSelectedOnPage = allVisibleIds.length > 0 && allVisibleIds.every((id) => selectedIds.has(id));

  const toggleAllVisible = () => {
    setSelectedIds((prev) => {
      const n = new Set(prev);
      if (allSelectedOnPage) {
        // deselecciona visibles
        allVisibleIds.forEach((id) => n.delete(id));
      } else {
        // selecciona visibles
        allVisibleIds.forEach((id) => n.add(id));
      }
      return n;
    });
  };

  const selectedCount = selectedIds.size;

  const handleBulkEnroll = () => {
    if (selectedCount === 0) return;
    const ids = Array.from(selectedIds).join(",");
    // Ajusta a tu ruta real de alta masiva:
    router.push(`/dashboard/list/Inscripciones/nueva?ids=${encodeURIComponent(ids)}`);
  };

  // Modal de inscripción
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalInitial, setModalInitial] = React.useState<any | undefined>(undefined);

  const openInscripcionModal = (idEstudiante?: string) => {
    setModalInitial({ idEstudiante: idEstudiante ? Number(idEstudiante) : 0 });
    setIsModalOpen(true);
  };

  return (
    <div className="w-auto px-6 py-6">
      {/* Cabecera */}
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Inscripciones</h1>
          <p className="text-sm text-gray-500">
            Registros <strong>pendientes</strong> de <strong>hoy</strong> por defecto.
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-2">
          {/* Botón masivo: Inscribir seleccionados */}
          <button
            onClick={handleBulkEnroll}
            disabled={selectedCount === 0}
            className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
              selectedCount === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
            title={selectedCount === 0 ? "Selecciona al menos uno" : `Inscribir ${selectedCount} seleccionados`}
          >
            Inscribir seleccionados{selectedCount > 0 ? ` (${selectedCount})` : ""}
          </button>

          {/* (Opcional) acceso rápido a Admisiones */}
          <button
            onClick={() => openInscripcionModal()}
            className="inline-flex items-center rounded-lg bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-900"
          >
            + Inscribir aspirantes
          </button>
        </div>
      </header>

      {/* Filtros */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative sm:w-80">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nombre, programa, plan…"
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-gray-400"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">Todos los estatus</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Registrada">Registrada</option>
            <option value="Cancelada">Cancelada</option>
            <option value="Concluida">Concluida</option>
          </select>

          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">Todos los períodos</option>
            <option value="2025-1">2025-1</option>
            <option value="2025-2">2025-2</option>
            <option value="2026-1">2026-1</option>
          </select>

          <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              type="button"
              onClick={() => setSoloHoy(true)}
              className={`px-3 py-2 text-sm ${soloHoy ? "bg-black text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
            >
              Hoy
            </button>
            <button
              type="button"
              onClick={() => setSoloHoy(false)}
              className={`px-3 py-2 text-sm ${!soloHoy ? "bg-black text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
            >
              Todos
            </button>
          </div>
        </div>

        {/* Paginación: tamaño */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Por página</label>
          <select
            value={pageSize}
            onChange={(e) => { const n = Number(e.target.value); if (!Number.isNaN(n)) setPageSize(n); }}
            className="rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm"
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="w-full min-w-0 rounded-2xl border border-gray-200/60 bg-white shadow-sm p-4 overflow-visible">
        {loading && <p className="px-3 py-4 text-sm text-gray-500">Cargando…</p>}
        <InscripcionesTable
          items={itemsFiltrados ?? []}
          isSelected={isSelected}
          toggleOne={toggleOne}
          toggleAllVisible={toggleAllVisible}
          allSelectedOnPage={allSelectedOnPage}
          formatDate={formatDate}
          nombreCompleto={nombreCompleto}
          badgeClassesByStatus={badgeClassesByStatus}
          onInscribir={(id: string) => openInscripcionModal(id)}
        />

        <InscripcionModal open={isModalOpen} onClose={() => setIsModalOpen(false)} initial={modalInitial} />

        {/* Paginación */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Página <strong>{data?.pageNumber ?? 1}</strong> de{" "}
            <strong>{data?.totalPages ?? 1}</strong> · {data ? data.totalItems : 0} registros
          </div>
          <div className="flex gap-2">
            <button
              onClick={prev}
              disabled={!data || (data.pageNumber ?? 1) <= 1}
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              « Anterior
            </button>
            <button
              onClick={next}
              disabled={!data || (data.pageNumber ?? 1) >= (data.totalPages ?? 1)}
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              Siguiente »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
