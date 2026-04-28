import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faAnglesLeft,
  faAnglesRight,
  faSearch,
  faFilter,
  faEraser,
  faDownload,
  faArrowDownAZ,
  faArrowUpZA,
  faArrowsUpDown,
  faInbox,
  faCheckCircle,
  faPlus,
  faPenToSquare,
  faTrash,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import CustomModal from "./CustomModal";
import exportFromJSON from "export-from-json";

// ─── Sort Icon ────────────────────────────────────────────────────────────────
const SortIcon = ({ active, direction }) => {
  if (!active) return <FontAwesomeIcon icon={faArrowsUpDown} className="opacity-30 text-xs ml-1" />;
  return (
    <FontAwesomeIcon
      icon={direction === "asc" ? faArrowDownAZ : faArrowUpZA}
      className="text-primary-light text-xs ml-1"
    />
  );
};

// ─── Export Modal ─────────────────────────────────────────────────────────────
const ExportModal = ({ data, fileName, onClose }) => {
  const [step, setStep] = useState(1); // 1 = pick cols, 2 = pick format
  const allHeaders = data.length > 0 ? Object.keys(data[0]) : [];
  const [selected, setSelected] = useState([]);

  const toggleHeader = (h) =>
    setSelected((prev) =>
      prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h]
    );

  const getExportData = () => {
    if (selected.length === 0) return data;
    return data.map((row) => {
      const obj = {};
      selected.forEach((h) => (obj[h] = row[h]));
      return obj;
    });
  };

  const handleExport = (formatId) => {
    const formatMap = {
      csv:  exportFromJSON.types.csv,
      json: exportFromJSON.types.json,
      xls:  exportFromJSON.types.xls,
      txt:  exportFromJSON.types.txt,
      html: exportFromJSON.types.html,
      xml:  exportFromJSON.types.xml,
    };
    const exportType = formatMap[formatId];
    if (!exportType) return;
    exportFromJSON({
      data: getExportData(),
      fileName: fileName || "export",
      exportType,
    });
    onClose();
  };

  const formats = [
    { id: "csv",  label: "CSV",   color: "#10b981", desc: "Spreadsheet" },
    { id: "xls",  label: "Excel", color: "#22c55e", desc: "Excel workbook" },
    { id: "json", label: "JSON",  color: "#6366f1", desc: "Developer" },
    { id: "html", label: "HTML",  color: "#f59e0b", desc: "Web page" },
    { id: "xml",  label: "XML",   color: "#8b5cf6", desc: "Structured" },
    { id: "txt",  label: "Text",  color: "#94a3b8", desc: "Plain text" },
  ];

  return (
    <CustomModal
      show
      onHide={onClose}
      size="md"
      title={step === 1 ? "Configure Export" : "Choose Format"}
      footer={
        step === 1 ? (
          <>
            <button
              className="px-4 py-2 text-sm rounded-lg border border-white/10 bg-white/5 text-text-muted hover:text-white hover:bg-white/10 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="btn-premium py-2 px-5 text-sm"
              onClick={() => setStep(2)}
            >
              Continue
            </button>
          </>
        ) : (
          <button
            className="px-4 py-2 text-sm rounded-lg border border-white/10 bg-white/5 text-text-muted hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setStep(1)}
          >
            ← Back
          </button>
        )
      }
    >
        {step === 1 ? (
          <>
            <p className="text-muted small mb-3">
              Select the columns to include. Leave all unchecked to export everything.
            </p>
            <div className="d-flex gap-2 mb-3">
              <button
                className="btn-small-link"
                onClick={() => setSelected(allHeaders)}
              >
                Select all
              </button>
              <span className="text-muted">|</span>
              <button className="btn-small-link" onClick={() => setSelected([])}>
                Clear
              </button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: "0.6rem",
                padding: "0.25rem",
              }}
            >
              {allHeaders.map((h) => {
                const active = selected.includes(h);
                return (
                  <div
                    key={h}
                    onClick={() => toggleHeader(h)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.5rem 0.75rem",
                      borderRadius: 10,
                      cursor: "pointer",
                      border: `1px solid ${active ? "#6366f1" : "rgba(255,255,255,0.12)"}`,
                      background: active ? "rgba(99,102,241,0.18)" : "rgba(255,255,255,0.05)",
                      color: active ? "#a5b4fc" : "rgba(255,255,255,0.75)",
                      fontWeight: active ? 700 : 500,
                      transition: "all 0.15s ease",
                      fontSize: "0.8rem",
                    }}
                  >
                    <span
                      style={{
                        /* Scrollbar */
                        width: 16,
                        height: 16,
                        borderRadius: 4,
                        border: `2px solid ${active ? "#6366f1" : "rgba(255,255,255,0.25)"}`,
                        background: active ? "#6366f1" : "rgba(255,255,255,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {active && (
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          style={{ color: "white", fontSize: 10 }}
                        />
                      )}
                    </span>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {h}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1rem",
              padding: "0.5rem 0",
            }}
          >
            {formats.map((f) => (
              <button
                key={f.id}
                onClick={() => handleExport(f.id)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "1.25rem",
                  borderRadius: 14,
                  border: `1px solid ${f.color}30`,
                  background: `${f.color}10`,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
              >
                <span
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: `${f.color}20`,
                    color: f.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.2rem",
                    fontWeight: 900,
                  }}
                >
                  {f.label}
                </span>
                <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>
                  {f.desc}
                </span>
              </button>
            ))}
          </div>
        )}
    </CustomModal>
  );
};

// ─── Main CustomTable ─────────────────────────────────────────────────────────
const CustomTable = ({
  // ── Explicit columns mode (advanced) ──
  columns,

  // ── Auto-columns mode (simple — like FinanCare Tabela) ──
  // Just pass flat data objects; headers are auto-generated from keys.
  // kaButona           — show Edit / Delete (and optionally Info) action buttons
  // mosShfaqID         — hide the "ID" column from headers (still used for callbacks)
  // funksionButonShto  — "Add New" button handler
  // funksionButonEdit  — (id) => ... edit handler
  // funksionButonFshij — (id) => ... delete handler
  // funksionShfaqDetajet — (id) => ... info/detail handler
  kaButona = false,
  mosShfaqID = false,
  funksionButonShto,
  funksionButonEdit,
  funksionButonFshij,
  funksionShfaqDetajet,

  // ── Common props ──
  data = [],
  title,
  icon,
  actions,
  itemsPerPage: defaultItemsPerPage = 10,
  searchable = true,
  sortable = true,
  exportable = true,
  dateField,
  hiddenColumns = [],
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [showExport, setShowExport] = useState(false);

  // ── Resolve columns: explicit OR auto-generated from data keys ──
  const resolvedColumns = useMemo(() => {
    if (columns && columns.length > 0) return columns;
    // Auto-mode: derive headers from first data row's keys
    if (data.length === 0) return [];
    const keys = Object.keys(data[0]);
    const filtered = mosShfaqID ? keys.filter((k) => k !== "ID") : keys;
    return filtered.map((key) => ({ header: key, accessor: key }));
  }, [columns, data, mosShfaqID]);

  // ── Sorting ──
  const handleSort = (accessor) => {
    if (!sortable) return;
    if (sortKey === accessor) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(accessor);
      setSortDir("asc");
    }
    setCurrentPage(1);
  };

  // ── Filter + Sort ──
  const filteredSortedData = useMemo(() => {
    let result = [...data];

    // Search filter — works in both modes
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some(
          (val) => val != null && String(val).toLowerCase().includes(q)
        )
      );
    }

    // Date range filter
    if (dateField && (startDate || endDate)) {
      result = result.filter((row) => {
        const raw = row[dateField];
        if (!raw) return true;
        const d = new Date(raw);
        if (startDate && d < new Date(startDate)) return false;
        if (endDate && d > new Date(endDate + "T23:59:59")) return false;
        return true;
      });
    }

    // Sort
    if (sortKey) {
      result.sort((a, b) => {
        const aVal = a[sortKey] ?? "";
        const bVal = b[sortKey] ?? "";
        const cmp =
          typeof aVal === "number" && typeof bVal === "number"
            ? aVal - bVal
            : String(aVal).localeCompare(String(bVal), undefined, { sensitivity: "base" });
        return sortDir === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [data, searchQuery, startDate, endDate, sortKey, sortDir, dateField]);

  // ── Pagination ──
  const totalPages = Math.max(1, Math.ceil(filteredSortedData.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const indexOfFirst = (safePage - 1) * itemsPerPage;
  const currentItems = filteredSortedData.slice(indexOfFirst, indexOfFirst + itemsPerPage);

  const goToPage = (p) => setCurrentPage(Math.max(1, Math.min(p, totalPages)));

  const clearFilters = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    setSortKey(null);
    setCurrentPage(1);
  };

  // ── Pagination page numbers with ellipsis ──
  const pageNumbers = useMemo(() => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - safePage) <= 1) {
        pages.push(i);
      } else if (pages.length > 0 && pages[pages.length - 1] !== "…") {
        pages.push("…");
      }
    }
    return pages;
  }, [totalPages, safePage]);

  const visibleColumns = resolvedColumns.filter(
    (col) => !hiddenColumns.includes(col.accessor)
  );

  // Total col count including optional Actions column
  const totalColCount = visibleColumns.length + (kaButona ? 1 : 0);

  return (
    <div className="w-full flex flex-col gap-4" data-aos="fade-in">

      {/* ── Table Header ── */}
      {(title || actions || funksionButonShto) && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 p-5 rounded-xl border border-white/10 shadow-sm">
          {title ? (
            <h3 className="text-xl font-bold m-0 flex items-center gap-3 text-white">
              {icon && <FontAwesomeIcon icon={icon} className="text-primary-light" />}
              {title}
            </h3>
          ) : (
            <div />
          )}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto mt-4 md:mt-0">
            {exportable && data.length > 0 && (
              <button
                onClick={() => setShowExport(true)}
                className="flex-1 md:flex-none px-4 py-2 text-sm rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faDownload} />
                Export
              </button>
            )}
            {funksionButonShto && (
              <button
                onClick={() => funksionButonShto()}
                className="flex-1 md:flex-none btn-premium py-2 px-5 text-sm flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faPlus} /> Add New
              </button>
            )}
            {actions}
          </div>
        </div>
      )}

      {/* ── Filter Bar ── */}
      {searchable && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex flex-col md:flex-row flex-wrap gap-3 items-stretch md:items-end">
            {/* Search */}
            <div className="flex flex-col gap-1 min-w-[200px] flex-1">
              <label className="text-[0.65rem] font-extrabold uppercase tracking-wider text-text-muted flex items-center gap-1">
                <FontAwesomeIcon icon={faSearch} className="text-[10px]" /> Search
              </label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xs"
                />
                <input
                  type="text"
                  className="w-full bg-black/20 border border-white/10 text-white text-sm rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:border-primary-light/50 placeholder:text-white/30 transition-colors"
                  placeholder="Filter data..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                />
              </div>
            </div>

            {/* Date Range */}
            {dateField && (
              <div className="flex flex-col gap-1">
                <label className="text-[0.65rem] font-extrabold uppercase tracking-wider text-text-muted flex items-center gap-1">
                  <FontAwesomeIcon icon={faFilter} className="text-[10px]" /> Date Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="bg-black/20 border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-primary-light/50 transition-colors"
                    value={startDate}
                    max={endDate || undefined}
                    onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                  />
                  <input
                    type="date"
                    className="bg-black/20 border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-primary-light/50 transition-colors"
                    value={endDate}
                    min={startDate || undefined}
                    onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                  />
                </div>
              </div>
            )}

            {/* Items per page */}
            <div className="flex flex-col gap-1">
              <label className="text-[0.65rem] font-extrabold uppercase tracking-wider text-text-muted">
                Rows
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="bg-black/20 border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-primary-light/50 transition-colors"
              >
                {[10, 20, 50, 100].map((n) => (
                  <option key={n} value={n} className="bg-[#1a1a2e]">
                    {n} rows
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm rounded-lg border border-white/10 bg-white/5 text-text-muted hover:text-red-400 hover:border-red-400/30 transition-colors flex items-center justify-center gap-2 self-stretch md:self-end"
            >
              <FontAwesomeIcon icon={faEraser} />
              Clear
            </button>
          </div>
        </div>
      )}

      {/* ── Table ── */}
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/20 w-full shadow-lg">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-white/5 text-text-muted text-xs border-b border-white/10 uppercase tracking-wider">
              {visibleColumns.map((col, idx) => (
                <th
                  key={idx}
                  className={`p-4 font-semibold select-none ${col.className || ""} ${sortable && col.accessor ? "cursor-pointer hover:text-white transition-colors" : ""}`}
                  onClick={() => col.accessor && handleSort(col.accessor)}
                >
                  <span className="flex items-center gap-1">
                    {col.header}
                    {sortable && col.accessor && (
                      <SortIcon active={sortKey === col.accessor} direction={sortDir} />
                    )}
                  </span>
                </th>
              ))}
              {kaButona && (
                <th className="p-4 font-semibold text-center select-none">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                    rowIndex % 2 === 0 ? "bg-transparent" : "bg-white/[0.015]"
                  }`}
                >
                  {visibleColumns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`p-4 text-sm font-medium text-white/80 ${col.tdClassName || ""}`}
                    >
                      {col.render ? col.render(item) : item[col.accessor]}
                    </td>
                  ))}
                  {kaButona && (
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        {funksionShfaqDetajet && (
                          <button
                            title="Details"
                            onClick={() => funksionShfaqDetajet(item.ID)}
                            className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400/30 transition-all"
                          >
                            <FontAwesomeIcon icon={faCircleInfo} />
                          </button>
                        )}
                        {funksionButonEdit && (
                          <button
                            title="Edit"
                            onClick={() => funksionButonEdit(item.ID)}
                            className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-amber-400 hover:bg-amber-400/10 hover:border-amber-400/30 transition-all"
                          >
                            <FontAwesomeIcon icon={faPenToSquare} />
                          </button>
                        )}
                        {funksionButonFshij && (
                          <button
                            title="Delete"
                            onClick={() => funksionButonFshij(item.ID)}
                            className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-red-400 hover:bg-red-400/10 hover:border-red-400/30 transition-all"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={totalColCount} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-text-muted">
                    <FontAwesomeIcon icon={faInbox} className="text-4xl opacity-20" />
                    <p className="text-sm font-medium">No data found</p>
                    {(searchQuery || startDate || endDate) && (
                      <button onClick={clearFilters} className="text-xs text-primary-light hover:underline">
                        Clear filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {filteredSortedData.length > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between bg-white/5 border border-white/10 p-4 rounded-xl gap-4">
          <span className="text-text-muted text-sm">
            Showing{" "}
            <span className="text-white font-medium">{indexOfFirst + 1}</span>{" "}
            to{" "}
            <span className="text-white font-medium">
              {Math.min(indexOfFirst + itemsPerPage, filteredSortedData.length)}
            </span>{" "}
            of{" "}
            <span className="text-white font-medium">
              {filteredSortedData.length}
            </span>{" "}
            {filteredSortedData.length !== data.length && (
              <span className="text-text-muted">(filtered from {data.length})</span>
            )}
          </span>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 w-full md:w-auto">
              {/* First */}
              <button
                onClick={() => goToPage(1)}
                disabled={safePage === 1}
                className={`w-9 h-9 text-sm rounded-lg border border-white/10 transition-colors flex items-center justify-center ${
                  safePage === 1
                    ? "bg-white/5 text-white/20 cursor-not-allowed"
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                <FontAwesomeIcon icon={faAnglesLeft} className="text-xs" />
              </button>

              {/* Prev */}
              <button
                onClick={() => goToPage(safePage - 1)}
                disabled={safePage === 1}
                className={`w-9 h-9 text-sm rounded-lg border border-white/10 transition-colors flex items-center justify-center ${
                  safePage === 1
                    ? "bg-white/5 text-white/20 cursor-not-allowed"
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
              </button>

              {/* Page numbers */}
              {pageNumbers.map((p, i) =>
                p === "…" ? (
                  <span
                    key={`el-${i}`}
                    className="w-9 h-9 text-sm flex items-center justify-center text-text-muted"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`w-9 h-9 text-sm rounded-lg border transition-colors flex items-center justify-center font-semibold ${
                      p === safePage
                        ? "bg-primary-light border-primary-light text-white shadow-md"
                        : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              {/* Next */}
              <button
                onClick={() => goToPage(safePage + 1)}
                disabled={safePage === totalPages}
                className={`w-9 h-9 text-sm rounded-lg border border-white/10 transition-colors flex items-center justify-center ${
                  safePage === totalPages
                    ? "bg-white/5 text-white/20 cursor-not-allowed"
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
              </button>

              {/* Last */}
              <button
                onClick={() => goToPage(totalPages)}
                disabled={safePage === totalPages}
                className={`w-9 h-9 text-sm rounded-lg border border-white/10 transition-colors flex items-center justify-center ${
                  safePage === totalPages
                    ? "bg-white/5 text-white/20 cursor-not-allowed"
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                <FontAwesomeIcon icon={faAnglesRight} className="text-xs" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Export Modal ── */}
      {showExport && (
        <ExportModal
          data={data}
          fileName={title || "export"}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
};

export default CustomTable;
