import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { toast } from 'sonner'

interface AddPersonFormProps {
  onAdd: (nom: string, genre: 'Garçon' | 'Fille') => void
}

export default function AddPersonForm({ onAdd }: AddPersonFormProps) {
  const [nom, setNom] = useState('')
  const [genre, setGenre] = useState<'Garçon' | 'Fille'>('Garçon')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nom.trim()) {
      toast.error('Le nom est requis')
      return
    }
    onAdd(nom.trim(), genre)
    setNom('')
    toast.success(`${nom} ajouté(e) !`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/5">
      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/40 flex items-center gap-2">
        <UserPlus size={14} /> Ajouter un individu
      </h3>
      <input
        type="text"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        placeholder="Prénom..."
        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setGenre('Garçon')}
          className={`flex-1 py-2 rounded-lg text-xs transition-all ${
            genre === 'Garçon' ? 'bg-blue-600 text-white font-bold' : 'bg-white/5 text-foreground/50 hover:bg-white/10'
          }`}
        >
          Garçon
        </button>
        <button
          type="button"
          onClick={() => setGenre('Fille')}
          className={`flex-1 py-2 rounded-lg text-xs transition-all ${
            genre === 'Fille' ? 'bg-rose-600 text-white font-bold' : 'bg-white/5 text-foreground/50 hover:bg-white/10'
          }`}
        >
          Fille
        </button>
      </div>
      <button
        type="submit"
        className="w-full py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors mt-2"
      >
        Ajouter
      </button>
    </form>
  )
}
