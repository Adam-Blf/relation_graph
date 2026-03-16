import { useState, useMemo } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import * as XLSX from 'xlsx'
import { Users, Download, Upload, Info } from 'lucide-react'
import { toast } from 'sonner'
import AddPersonForm from './components/AddPersonForm'
import AddRelationForm from './components/AddRelationForm'
import FilterPanel, { RELATION_TYPES } from './components/FilterPanel'
import AIAnalysisSection from './components/AIAnalysisSection'

// Types
interface Person {
  id: string
  nom: string
  genre: 'Garçon' | 'Fille'
}

interface Relation {
  source: string | object
  target: string | object
  type: string
}

interface GraphData {
  nodes: (Person & { val: number })[]
  links: Relation[]
}

export default function App() {
  const [nodes, setNodes] = useState<Person[]>([])
  const [links, setLinks] = useState<Relation[]>([])
  const [selectedNode, setSelectedNode] = useState<Person | null>(null)
  const [filters, setFilters] = useState({ search: '', genre: 'Tous', relation: 'Toutes' })

  // Calcule la donnée pour le graphe (ajoute la valeur proportionnelle au nombre de liens)
  const graphData = useMemo((): GraphData => {
    // Application des filtres
    const filteredNodes = nodes.filter(node => {
      const matchSearch = node.nom.toLowerCase().includes(filters.search.toLowerCase())
      const matchGenre = filters.genre === 'Tous' || node.genre === filters.genre
      return matchSearch && matchGenre
    })

    const filteredLinks = links.filter(link => {
      const sId = typeof link.source === 'object' ? (link.source as any).id : link.source
      const tId = typeof link.target === 'object' ? (link.target as any).id : link.target
      
      const sInNodes = filteredNodes.some(n => n.id === sId)
      const tInNodes = filteredNodes.some(n => n.id === tId)
      const matchRelation = filters.relation === 'Toutes' || link.type === filters.relation

      return sInNodes && tInNodes && matchRelation
    })

    return {
      nodes: filteredNodes.map(node => ({
        ...node,
        val: filteredLinks.filter(l => {
          const sId = typeof l.source === 'object' ? (l.source as any).id : l.source
          const tId = typeof l.target === 'object' ? (l.target as any).id : l.target
          return sId === node.id || tId === node.id
        }).length + 5
      })),
      links: filteredLinks
    }
  }, [nodes, links, filters])

  // Import Excel
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const json = XLSX.utils.sheet_to_json(sheet) as any[]

        const newNodes: Person[] = []
        const newLinks: Relation[] = []
        const nodeMap = new Map<string, Person>()

        json.forEach((row) => {
          const sId = String(row.Source_ID)
          const tId = String(row.Target_ID)

          if (!nodeMap.has(sId)) {
            const p = { id: sId, nom: row.Source_Nom, genre: row.Source_Genre } as Person
            nodeMap.set(sId, p)
            newNodes.push(p)
          }
          if (!nodeMap.has(tId)) {
            const p = { id: tId, nom: row.Target_Nom, genre: row.Target_Genre } as Person
            nodeMap.set(tId, p)
            newNodes.push(p)
          }

          newLinks.push({
            source: sId,
            target: tId,
            type: row.Type_Relation
          })
        })

        setNodes(newNodes)
        setLinks(newLinks)
        toast.success(`${newLinks.length} relations importées !`)
      } catch (err) {
        toast.error("Format Excel invalide.")
        console.error(err)
      }
    }
    reader.readAsArrayBuffer(file)
  }

  // Export Excel
  const handleExport = () => {
    if (links.length === 0) {
      toast.error("Aucune donnée.")
      return
    }

    const exportData = links.map(l => {
      const sId = typeof l.source === 'object' ? (l.source as any).id : l.source
      const tId = typeof l.target === 'object' ? (l.target as any).id : l.target
      const s = nodes.find(n => n.id === sId)
      const t = nodes.find(n => n.id === tId)
      return {
        Source_ID: s?.id,
        Source_Nom: s?.nom,
        Source_Genre: s?.genre,
        Target_ID: t?.id,
        Target_Nom: t?.nom,
        Target_Genre: t?.genre,
        Type_Relation: l.type
      }
    })

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Relations")
    XLSX.writeFile(wb, "relations_export.xlsx")
    toast.success("Export réussi !")
  }

  return (
    <div className="flex w-full h-full font-fira">
      {/* Sidebar */}
      <aside className="w-80 h-full flex flex-col glass border-r border-white/10 z-10">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-primary">
            <Users size={28} />
            Relation Graph
          </h1>
          <p className="text-xs text-foreground/50 mt-1 uppercase tracking-widest">
            Visualizer v0.1.0
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Données */}
          <section>
            <h2 className="text-xs font-semibold text-foreground/40 uppercase mb-3 flex items-center gap-2">
              <Download size={14} /> Données
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-all border border-white/5 hover:border-primary/30 group">
                <Upload size={20} className="mb-1 group-hover:text-primary transition-colors" />
                <span className="text-xs">Importer</span>
                <input type="file" accept=".xlsx" className="hidden" onChange={handleImport} />
              </label>
              <button 
                onClick={handleExport}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-all border border-white/5 hover:border-accent/30 group"
              >
                <Download size={20} className="mb-1 group-hover:text-accent transition-colors" />
                <span className="text-xs">Exporter</span>
              </button>
            </div>
          </section>

          {/* Filtres */}
          <FilterPanel onFilterChange={setFilters} />

          {/* Formulaires CRUD */}
          <section className="space-y-4">
            <AddPersonForm onAdd={(nom: string, genre: 'Garçon' | 'Fille') => {
              const id = `P${Date.now()}`
              setNodes([...nodes, { id, nom, genre }])
            }} />
            
            <AddRelationForm 
              nodes={nodes} 
              onAdd={(source: string, target: string, type: string) => {
                setLinks([...links, { source, target, type }])
              }} 
            />
          </section>

          {/* Stats */}
          <section>
             <h2 className="text-xs font-semibold text-foreground/40 uppercase mb-3">Statistiques</h2>
             <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-[10px] text-foreground/40 uppercase">Noeuds</p>
                  <p className="text-xl font-bold text-primary">{nodes.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-[10px] text-foreground/40 uppercase">Liens</p>
                  <p className="text-xl font-bold text-accent">{links.length}</p>
                </div>
             </div>
          </section>

          {/* AI Analyzer */}
          <AIAnalysisSection graphData={graphData} />
        </div>
        
        <div className="p-4 border-t border-white/10 bg-black/20 text-center">
            {selectedNode ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <p className="text-[10px] text-foreground/40 uppercase mb-1">Sélection</p>
                <p className="text-sm font-bold text-white mb-2">{selectedNode.nom} ({selectedNode.genre})</p>
                <button onClick={() => setSelectedNode(null)} className="text-[10px] text-primary hover:underline">Désélectionner</button>
              </div>
            ) : (
              <p className="text-[10px] text-foreground/30">
                Design & Build by <strong>Adam Beloucif</strong>
              </p>
            )}
        </div>
      </aside>

      {/* Graphe */}
      <main className="flex-1 relative bg-[#0f0d13]">
        <div className="absolute inset-0 z-0">
          <ForceGraph2D
            graphData={graphData}
            nodeLabel={(node: any) => `${node.nom} (${node.genre})`}
            nodeColor={(node: any) => node.genre === 'Garçon' ? '#3B82F6' : '#F43F5E'}
            nodeRelSize={4}
            linkColor={(link: any) => {
              return (RELATION_TYPES as any)[link.type] || "#4B5563"
            }}
            linkDirectionalParticles={1}
            linkDirectionalParticleSpeed={0.005}
            linkWidth={1.5}
            nodeCanvasObject={(node: any, ctx, globalScale) => {
              const label = node.nom;
              const fontSize = 12 / globalScale;
              ctx.font = `${fontSize}px Fira Sans`;
              
              // Node Circle
              ctx.beginPath();
              ctx.arc(node.x, node.y, node.val, 0, 2 * Math.PI, false);
              ctx.fillStyle = node.genre === 'Garçon' ? '#3B82F6' : '#F43F5E';
              ctx.fill();

              // Border if selected
              if (selectedNode && node.id === selectedNode.id) {
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 2 / globalScale;
                ctx.stroke();
              }

              // Text
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = '#FFFFFF';
              ctx.fillText(label, node.x, node.y + node.val + 8/globalScale);
            }}
            onNodeClick={(node: any) => setSelectedNode(node)}
            backgroundColor="#0f0d13"
          />
        </div>

        {/* Légende Dynamique */}
        <div className="absolute top-6 right-6 p-4 glass rounded-2xl flex flex-col gap-3 pointer-events-none max-h-[80vh] overflow-y-auto w-48">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Légende</h4>
          <div className="space-y-2">
            {Object.entries(RELATION_TYPES).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2 text-[10px]">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}80` }} /> 
                <span className="truncate">{type}</span>
              </div>
            ))}
          </div>
          <div className="h-[1px] bg-white/10 my-1" />
          <div className="space-y-2">
             <div className="flex items-center gap-2 text-[10px]">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" /> 
              <span>Garçon</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" /> 
              <span>Fille</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
