// MODULE: Network Asset and Stock Management - this file belongs to the code for this module.
// Overview dashboard page displaying asset summary cards and report actions.

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAssetSummary } from '../../../api/networkAssets';
import { NetworkAssetsNav } from '../../../components/network-assets/NetworkAssetsNav';
import {
  Server,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  Boxes,
  FileSpreadsheet,
  Plus,
  ArrowLeft
} from 'lucide-react';

export const Overview: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAssetSummary()
      .then((data) => setSummary(data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-noc-bg text-slate-100 flex flex-col font-sans">
      {/* Top Bar Header */}
      <header className="bg-noc-panel border-b border-noc-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="p-1.5 bg-noc-surface hover:bg-noc-border border border-noc-border rounded-lg text-slate-300 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-mono font-bold tracking-wider text-slate-100 uppercase">
                  Network Asset &amp; Hardware Inventory
                </h1>
                <span className="w-2 h-2 rounded-full bg-noc-emerald radar-live" />
              </div>
              <p className="text-[11px] font-mono text-slate-400">Campus switch fabric, access points, router nodes</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/api/admin/network-assets/reports/export"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-noc-surface hover:bg-noc-border border border-noc-border text-slate-300 hover:text-white text-xs font-mono font-medium rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-noc-cyan" />
              <span>Export CSV</span>
            </a>
            <Link
              to="/admin/network-assets/new"
              className="px-3 py-1.5 bg-noc-accent hover:bg-blue-600 text-white text-xs font-mono font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-noc-glow"
            >
              <Plus className="w-4 h-4" />
              <span>Register Asset</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Sub Navigation */}
      <NetworkAssetsNav />

      {/* Main Overview Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 font-mono text-sm">Querying hardware telemetry...</div>
        ) : (
          <div className="space-y-8">
            {/* Top Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-noc-panel p-5 rounded-xl border border-noc-border shadow-noc flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Total Assets</p>
                  <p className="text-2xl font-mono font-bold text-slate-100 mt-1">{summary?.total_assets || 0}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-noc-surface border border-noc-border text-noc-cyan flex items-center justify-center">
                  <Server className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-noc-panel p-5 rounded-xl border border-noc-border shadow-noc flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Spare Available</p>
                  <p className="text-2xl font-mono font-bold text-noc-emerald mt-1">{summary?.spare_total || 0}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-noc-surface border border-noc-border text-noc-emerald flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-noc-panel p-5 rounded-xl border border-noc-border shadow-noc flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Faulty Units</p>
                  <p className="text-2xl font-mono font-bold text-noc-rose mt-1">{summary?.faulty_total || 0}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-noc-surface border border-noc-border text-noc-rose flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-noc-panel p-5 rounded-xl border border-noc-border shadow-noc flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">In Maintenance</p>
                  <p className="text-2xl font-mono font-bold text-noc-amber mt-1">{summary?.under_repair_total || 0}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-noc-surface border border-noc-border text-noc-amber flex items-center justify-center">
                  <Wrench className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-noc-panel p-5 rounded-xl border border-noc-border shadow-noc flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Low Stock SKUs</p>
                  <p className="text-2xl font-mono font-bold text-noc-cyan mt-1">{summary?.low_stock_items?.length || 0}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-noc-surface border border-noc-border text-noc-cyan flex items-center justify-center">
                  <Boxes className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Quick Actions and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Asset Class Distribution */}
              <div className="bg-noc-panel p-6 rounded-xl border border-noc-border shadow-noc">
                <h2 className="text-xs font-mono font-semibold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Server className="w-4 h-4 text-noc-cyan" />
                  Hardware Category Distribution
                </h2>
                <div className="space-y-3 font-mono text-xs">
                  {summary?.by_type && Object.keys(summary.by_type).length > 0 ? (
                    Object.entries(summary.by_type).map(([type, count]: [string, any]) => (
                      <div key={type} className="flex items-center justify-between p-2.5 rounded bg-noc-surface/50 border border-noc-border/60">
                        <span className="text-slate-300 uppercase">{type.replace(/_/g, ' ')}</span>
                        <span className="font-bold text-noc-cyan">{count} units</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-500 py-4 text-center">No hardware class records found.</div>
                  )}
                </div>
              </div>

              {/* Low Stock Alerts */}
              <div className="bg-noc-panel p-6 rounded-xl border border-noc-border shadow-noc">
                <h2 className="text-xs font-mono font-semibold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-noc-amber" />
                  Spares &amp; Consumables Buffer Status
                </h2>
                <div className="space-y-3 font-mono text-xs">
                  {summary?.low_stock_items && summary.low_stock_items.length > 0 ? (
                    summary.low_stock_items.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between p-2.5 rounded bg-noc-surface/50 border border-noc-border/60">
                        <div>
                          <p className="text-slate-200 font-medium">{item.item_name}</p>
                          <p className="text-[10px] text-slate-500">Threshold: {item.minimum_stock_threshold} units</p>
                        </div>
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-noc-amber/20 text-noc-amber border border-noc-amber/40">
                          {item.quantity_in_hand} remaining
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-500 py-4 text-center">All consumable stock levels within safe tolerances.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
