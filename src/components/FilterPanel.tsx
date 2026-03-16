import React from 'react';
import { Search, Filter, X } from 'lucide-react';

export const RELATION_TYPES = {
  "Ami": "#10B981",
  "Ennemi": "#6B7280",
  "Crush": "#F472B6",
  "Crush réciproque": "#EC4899",
  "Flirt": "#FBBF24",
  "Ex": "#EF4444",
  "Famille": "#3B82F6",
  "Pro": "#8B5CF6",
  "Rivalité": "#F97316",
  "Ont couché ensemble": "#B91C1C",
  "Se sont embrassé": "#DB2777",
  "Sont sortie ensemble": "#7C3AED"
};

interface FilterPanelProps {
  onFilterChange: (filters: { search: string; genre: string; relation: string }) => void;
}

export default function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const [search, setSearch] = React.useState('');
  const [genre, setGenre] = React.useState('Tous');
  const [relation, setRelation] = React.useState('Toutes');

  const handleChange = (s: string, g: string, r: string) => {
    onFilterChange({ search: s, genre: g, relation: r });
  };

  return (
    <section className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-500">
      <h2 className="text-[10px] font-semibold text-foreground/40 uppercase tracking-widest flex items-center gap-2">
        <Filter size={14} /> Filtres Avancés
      </h2>
      
      <div className="space-y-3">
        {/* Recherche */}
        <div className="relative group">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Rechercher un nom..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              handleChange(e.target.value, genre, relation);
            }}
            className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all shadow-inner"
          />
          {search && (
            <button 
              onClick={() => { setSearch(''); handleChange('', genre, relation); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Genre */}
        <div className="grid grid-cols-3 gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
          {['Tous', 'Garçon', 'Fille'].map((g) => (
            <button
              key={g}
              onClick={() => { setGenre(g); handleChange(search, g, relation); }}
              className={`py-1.5 text-[10px] rounded-lg transition-all ${
                genre === g ? 'bg-primary text-white shadow-lg' : 'text-foreground/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Relation */}
        <select 
          value={relation}
          onChange={(e) => {
            setRelation(e.target.value);
            handleChange(search, genre, e.target.value);
          }}
          className="w-full bg-white/5 border border-white/5 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
        >
          <option value="Toutes">Toutes les relations</option>
          {Object.keys(RELATION_TYPES).map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
    </section>
  );
}
