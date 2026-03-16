import { useState } from 'react'
import { UserPlus, User, Users } from 'lucide-react'

interface AddPersonFormProps {
  onAdd: (nom: string, genre: 'Garçon' | 'Fille') => void
}

export default function AddPersonForm({ onAdd }: AddPersonFormProps) {
  const [nom, setNom] = useState('')
  const [genre, setGenre] = useState<'Garçon' | 'Fille'>('Garçon')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (nom.trim()) {
      onAdd(nom.trim(), genre)
      setNom('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-[11px] font-semibold text-apple-text-secondary uppercase tracking-wider ml-1">
          Nom de l'individu
        </label>
        <div className="relative group">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-text-secondary/40 group-focus-within:text-apple-accent transition-apple" size={16} />
          <input
            type="text"
            placeholder="Ex: Adam Beloucif"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-apple-accent/50 focus:bg-white/10 transition-apple text-sm placeholder:text-apple-text-secondary/30"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-[11px] font-semibold text-apple-text-secondary uppercase tracking-wider ml-1">
          Genre
        </label>
        <div className="flex gap-2 p-1 bg-white/5 border border-white/5 rounded-xl">
          <button
            type="button"
            onClick={() => setGenre('Garçon')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-apple ${
              genre === 'Garçon' ? 'bg-apple-accent text-white shadow-lg' : 'text-apple-text-secondary hover:text-apple-text'
            }`}
          >
            Masculin
          </button>
          <button
            type="button"
            onClick={() => setGenre('Fille')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-apple ${
              genre === 'Fille' ? 'bg-apple-accent text-white shadow-lg' : 'text-apple-text-secondary hover:text-apple-text'
            }`}
          >
            Féminin
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={!nom.trim()}
        className="w-full py-3.5 bg-apple-accent text-white rounded-xl font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-apple disabled:opacity-20 flex items-center justify-center gap-2 shadow-xl shadow-apple-accent/20"
      >
        <UserPlus size={18} />
        Ajouter au Réseau
      </button>
    </form>
  )
}
