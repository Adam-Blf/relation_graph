import React from 'react'
import { Search, Filter, X } from 'lucide-react'

export const RELATION_TYPES: Record<string, string> = {
  "Ex": "#EF4444",              // Rouge
  "Ont couché ensemble": "#EC4899", // Rose
  "Se sont embrassé": "#F59E0B",   // Ambre
  "Sont sortie ensemble": "#10B981" // Émeraude
};

interface FilterPanelProps {
  search: string
  onSearch: (s: string) => void
  activeFilters: string[]
  onFilterToggle: (type: string) => void
}

const FilterPanel: React.FC<FilterPanelProps> = ({ search, onSearch, activeFilters, onFilterToggle }) => {
  return (
    <div className="space-y-6">
      {/* Recherche */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-primary transition-colors" size={16} />
        <input
          type="text"
          placeholder="Rechercher un nom..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-luxury text-sm placeholder:text-foreground/20 font-medium"
        />
        {search && (
          <button onClick={() => onSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/20 hover:text-white transition-luxury">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Chips de filtrage */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-foreground/30 px-1">
          <Filter size={12} />
          Types de liens
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.keys(RELATION_TYPES).map(type => {
            const isActive = activeFilters.includes(type)
            const color = RELATION_TYPES[type]
            return (
              <button
                key={type}
                onClick={() => onFilterToggle(type)}
                style={{ 
                  borderColor: isActive ? color : 'rgba(255,255,255,0.05)',
                  backgroundColor: isActive ? `${color}15` : 'rgba(255,255,255,0.03)',
                  color: isActive ? color : 'rgba(255,255,255,0.4)'
                }}
                className="px-3 py-1.5 rounded-full text-[10px] font-bold border transition-luxury hover:scale-105 active:scale-95"
              >
                {type}
              </button>
            )
          })}
          {activeFilters.length > 0 && (
            <button
              onClick={() => onFilterToggle('CLEAR')}
              className="px-3 py-1.5 rounded-full text-[10px] font-bold border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-luxury"
            >
              Effacer ({activeFilters.length})
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default FilterPanel
