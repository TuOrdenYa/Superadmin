"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  restaurant: string;
  interest: string;
  source: string;
  message: string;
  created_at: string;
};

type Stats = {
  total: number;
  today: number;
  thisWeek: number;
  bySource: Record<string, number>;
  byInterest: Record<string, number>;
};

export default function LeadsAdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    today: 0,
    thisWeek: 0,
    bySource: {},
    byInterest: {},
  });
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [interestFilter, setInterestFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch leads
  useEffect(() => {
    fetchLeads();
  }, []);

  // Apply filters
  useEffect(() => {
    applyFilters();
  }, [leads, dateFrom, dateTo, sourceFilter, interestFilter, searchQuery]);

  async function fetchLeads() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setLeads(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  }

  function calculateStats(leadsData: Lead[]) {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const bySource: Record<string, number> = {};
    const byInterest: Record<string, number> = {};
    let today = 0;
    let thisWeek = 0;

    leadsData.forEach((lead) => {
      const createdAt = new Date(lead.created_at);
      
      // Count by time
      if (createdAt >= todayStart) today++;
      if (createdAt >= weekStart) thisWeek++;

      // Count by source
      const source = lead.source || "unknown";
      bySource[source] = (bySource[source] || 0) + 1;

      // Count by interest
      const interest = lead.interest || "unknown";
      byInterest[interest] = (byInterest[interest] || 0) + 1;
    });

    setStats({
      total: leadsData.length,
      today,
      thisWeek,
      bySource,
      byInterest,
    });
  }

  function applyFilters() {
    let filtered = [...leads];

    // Date range filter
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filtered = filtered.filter((lead) => new Date(lead.created_at) >= fromDate);
    }
    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((lead) => new Date(lead.created_at) <= toDate);
    }

    // Source filter
    if (sourceFilter !== "all") {
      filtered = filtered.filter((lead) => lead.source === sourceFilter);
    }

    // Interest filter
    if (interestFilter !== "all") {
      filtered = filtered.filter((lead) => lead.interest === interestFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(query) ||
          lead.email.toLowerCase().includes(query) ||
          lead.restaurant.toLowerCase().includes(query) ||
          lead.phone.includes(query)
      );
    }

    setFilteredLeads(filtered);
  }

  function exportToCSV() {
    const headers = ["ID", "Fecha", "Nombre", "Restaurante", "Teléfono", "Email", "Interés", "Fuente"];
    const rows = filteredLeads.map((lead) => [
      lead.id,
      new Date(lead.created_at).toLocaleString("es-CO"),
      lead.name,
      lead.restaurant,
      lead.phone,
      lead.email,
      lead.interest || "",
      lead.source || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function clearFilters() {
    setDateFrom("");
    setDateTo("");
    setSourceFilter("all");
    setInterestFilter("all");
    setSearchQuery("");
  }

  const uniqueSources = Object.keys(stats.bySource).sort();
  const uniqueInterests = Object.keys(stats.byInterest).sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#FF6F3C] border-r-transparent"></div>
          <p className="mt-4 text-slate-400">Cargando leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Panel de Leads</h1>
              <p className="text-sm text-slate-400 mt-1">TuOrdenYa - Administración</p>
            </div>
            <a
              href="/"
              className="px-4 py-2 text-sm rounded-full border border-slate-700 hover:border-[#FF6F3C] hover:text-[#FF6F3C] transition-colors"
            >
              ← Volver al sitio
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-sm text-slate-400">Total Leads</p>
            <p className="text-3xl font-bold mt-2">{stats.total}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-sm text-slate-400">Hoy</p>
            <p className="text-3xl font-bold mt-2 text-[#FF6F3C]">{stats.today}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-sm text-slate-400">Últimos 7 días</p>
            <p className="text-3xl font-bold mt-2 text-[#2ECC71]">{stats.thisWeek}</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Sources */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <h3 className="text-lg font-semibold mb-4">Top Fuentes</h3>
            <div className="space-y-3">
              {Object.entries(stats.bySource)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .map(([source, count]) => (
                  <div key={source} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-300 truncate">{source}</span>
                        <span className="text-sm font-semibold text-slate-100">{count}</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#FF6F3C] rounded-full"
                          style={{ width: `${(count / stats.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Interest Distribution */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <h3 className="text-lg font-semibold mb-4">Distribución por Interés</h3>
            <div className="space-y-3">
              {Object.entries(stats.byInterest)
                .sort(([, a], [, b]) => b - a)
                .map(([interest, count]) => {
                  const colors: Record<string, string> = {
                    light: "#F7C325",
                    plus: "#2ECC71",
                    pro: "#4A90E2",
                    unsure: "#94A3B8",
                  };
                  const color = colors[interest] || "#94A3B8";
                  
                  return (
                    <div key={interest} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-slate-300 capitalize">{interest}</span>
                          <span className="text-sm font-semibold text-slate-100">{count}</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ 
                              width: `${(count / stats.total) * 100}%`,
                              backgroundColor: color
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Filtros</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-slate-400 hover:text-[#FF6F3C] transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Date From */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">Desde</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800 border border-slate-700 focus:border-[#FF6F3C] focus:outline-none"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">Hasta</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800 border border-slate-700 focus:border-[#FF6F3C] focus:outline-none"
              />
            </div>

            {/* Source Filter */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">Fuente</label>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800 border border-slate-700 focus:border-[#FF6F3C] focus:outline-none"
              >
                <option value="all">Todas</option>
                {uniqueSources.map((source) => (
                  <option key={source} value={source}>
                    {source} ({stats.bySource[source]})
                  </option>
                ))}
              </select>
            </div>

            {/* Interest Filter */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">Interés</label>
              <select
                value={interestFilter}
                onChange={(e) => setInterestFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800 border border-slate-700 focus:border-[#FF6F3C] focus:outline-none"
              >
                <option value="all">Todos</option>
                {uniqueInterests.map((interest) => (
                  <option key={interest} value={interest}>
                    {interest} ({stats.byInterest[interest]})
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">Buscar</label>
              <input
                type="text"
                placeholder="Nombre, email, tel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800 border border-slate-700 focus:border-[#FF6F3C] focus:outline-none placeholder:text-slate-500"
              />
            </div>
          </div>
        </div>

        {/* Table Header Actions */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-400">
            Mostrando <span className="font-semibold text-slate-100">{filteredLeads.length}</span> de{" "}
            <span className="font-semibold text-slate-100">{stats.total}</span> leads
          </p>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 text-sm rounded-lg bg-[#FF6F3C] text-slate-950 font-semibold hover:bg-[#FF814F] transition-colors"
          >
            📥 Exportar CSV
          </button>
        </div>

        {/* Leads Table */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300">Restaurante</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300">Contacto</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300">Interés</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300">Fuente</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-300 whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleDateString("es-CO", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-100">{lead.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{lead.restaurant}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">
                      <div className="flex flex-col gap-1">
                        <span>{lead.phone}</span>
                        <span className="text-xs text-slate-400">{lead.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          lead.interest === "light"
                            ? "bg-[#F7C325]/20 text-[#F7C325]"
                            : lead.interest === "plus"
                            ? "bg-[#2ECC71]/20 text-[#2ECC71]"
                            : lead.interest === "pro"
                            ? "bg-[#4A90E2]/20 text-[#4A90E2]"
                            : "bg-slate-700 text-slate-300"
                        }`}
                      >
                        {lead.interest || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 font-mono">{lead.source || "direct"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLeads.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-slate-400">No se encontraron leads con los filtros aplicados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
