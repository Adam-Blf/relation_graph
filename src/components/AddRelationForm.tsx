import { useState } from 'react'
import { Link as LinkIcon } from 'lucide-react'
import { toast } from 'sonner'

interface Person {
  id: string
  nom: string
}

interface AddRelationFormProps {
  nodes: Person[]
  onAdd: (source: string, target: string, type: string) => void
}

export default function AddRelationForm({ nodes, onAdd }: AddRelationFormProps) {
  const [source, setSource] = useState('')
  const [target, setTarget] = useState('')
  const [type, setType] = useState('Ont couché ensemble')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!source || !target) {
      toast.error('Sélectionnez deux personnes')
      return
    }
    if (source === target) {
      toast.error('Une personne ne peut pas avoir de relation avec elle-même')
      return
    }
    onAdd(source, target, type)
    setSource('')
    setTarget('')
    toast.success('Relation ajoutée !')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/5">
      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/40 flex items-center gap-2">
        <LinkIcon size={14} /> Ajouter une relation
      </h3>
      
      <select
        value={source}
        onChange={(e) => setSource(e.target.value)}
        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50 transition-colors appearance-none"
      >
        <option value="">Source...</option>
        {nodes.map(n => <option key={n.id} value={n.id}>{n.nom}</option>)}
      </select>

      <select
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50 transition-colors appearance-none"
      >
        <option value="">Cible...</option>
        {nodes.map(n => <option key={n.id} value={n.id}>{n.nom}</option>)}
      </select>

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50 transition-colors appearance-none"
      >
        <option value="Ami">Ami</option>
        <option value="Ennemi">Ennemi</option>
        <option value="Crush">Crush</option>
        <option value="Crush réciproque">Crush réciproque</option>
        <option value="Flirt">Flirt</option>
        <option value="Ex">Ex</option>
        <option value="Famille">Famille</option>
        <option value="Pro">Pro</option>
        <option value="Rivalité">Rivalité</option>
        <option value="Ont couché ensemble">Ont couché ensemble</option>
        <option value="Se sont embrassé">Se sont embrassé</option>
        <option value="Sont sortie ensemble">Sont sortie ensemble</option>
      </select>

      <button
        type="submit"
        className="w-full py-2 bg-accent text-white rounded-lg text-xs font-bold hover:bg-accent/90 transition-colors mt-2"
      >
        Créer le lien
      </button>
    </form>
  )
}
