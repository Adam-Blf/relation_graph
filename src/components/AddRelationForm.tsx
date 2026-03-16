import { useState } from 'react'
import { Link2, ChevronDown } from 'lucide-react'
import { RELATION_TYPES } from './FilterPanel'

interface AddRelationFormProps {
  nodes: any[]
  onAdd: (source: string, target: string, type: string) => void
}

export default function AddRelationForm({ nodes, onAdd }: AddRelationFormProps) {
  const [source, setSource] = useState('')
  const [target, setTarget] = useState('')
  const [type, setType] = useState('Ami')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (source && target && source !== target) {
      onAdd(source, target, type)
      setSource('')
      setTarget('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-apple-text-secondary uppercase tracking-wider ml-1">
            Source
          </label>
          <div className="relative">
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-apple-accent/50 text-xs font-medium text-apple-text/80 cursor-pointer transition-apple"
            >
              <option value="" disabled className="bg-[#1c1c1e]">Choisir...</option>
              {nodes.map(n => <option key={n.id} value={n.id} className="bg-[#1c1c1e] text-white">{n.nom}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-apple-text-secondary/40 pointer-events-none" size={14} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-apple-text-secondary uppercase tracking-wider ml-1">
            Cible
          </label>
          <div className="relative">
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-apple-accent/50 text-xs font-medium text-apple-text/80 cursor-pointer transition-apple"
            >
              <option value="" disabled className="bg-[#1c1c1e]">Choisir...</option>
              {nodes.map(n => <option key={n.id} value={n.id} className="bg-[#1c1c1e] text-white">{n.nom}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-apple-text-secondary/40 pointer-events-none" size={14} />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[11px] font-semibold text-apple-text-secondary uppercase tracking-wider ml-1">
          Type de Relation
        </label>
        <div className="relative">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full appearance-none pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-apple-accent/50 text-xs font-medium text-apple-text/80 cursor-pointer transition-apple"
          >
            {Object.keys(RELATION_TYPES).map(t => <option key={t} value={t} className="bg-[#1c1c1e] text-white">{t}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-apple-text-secondary/40 pointer-events-none" size={14} />
        </div>
      </div>

      <button
        type="submit"
        disabled={!source || !target || source === target}
        className="w-full py-3.5 bg-white/5 border border-white/10 rounded-xl font-semibold text-sm hover:bg-white/10 hover:border-apple-accent/30 text-apple-accent transition-apple disabled:opacity-20 flex items-center justify-center gap-2"
      >
        <Link2 size={18} />
        Créer la Connexion
      </button>
    </form>
  )
}
