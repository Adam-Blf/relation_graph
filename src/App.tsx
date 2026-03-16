import { useState, useMemo } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import * as XLSX from 'xlsx'
import { Users, FileUp, FileDown, Info, Box, Image as ImageIcon, Trash2, Zap } from 'lucide-react'
import { toast } from 'sonner'
import ForceGraph3D from 'react-force-graph-3d'
import { useCallback, useRef, useEffect } from 'react'
import { findShortestPath } from './utils/pathfinding'
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
  const [nodes, setNodes] = useState<Person[]>(() => {
    const saved = localStorage.getItem('rg_nodes')
    return saved ? JSON.parse(saved) : []
  })
  const [links, setLinks] = useState<Relation[]>(() => {
    const saved = localStorage.getItem('rg_links')
    return saved ? JSON.parse(saved) : []
  })
  const [selectedNode, setSelectedNode] = useState<Person | null>(null)
  const [pathStart, setPathStart] = useState<Person | null>(null)
  const [pathResult, setPathResult] = useState<string[] | null>(null)
  const [is3D, setIs3D] = useState(false)
  const [search, setSearch] = useState('')
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const graphRef = useRef<any>()

  // Persistence
  useEffect(() => {
    localStorage.setItem('rg_nodes', JSON.stringify(nodes))
    localStorage.setItem('rg_links', JSON.stringify(links))
  }, [nodes, links])

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    )
  }

  // Calcule la donnée pour le graphe
  const graphData = useMemo((): GraphData => {
    const filteredNodes = nodes.filter(node => {
      const matchSearch = node.nom.toLowerCase().includes(search.toLowerCase())
      return matchSearch
    })

    const filteredLinks = links.filter(link => {
      const sId = typeof link.source === 'object' ? (link.source as any).id : link.source
      const tId = typeof link.target === 'object' ? (link.target as any).id : link.target
      
      const sInNodes = filteredNodes.some(n => n.id === sId)
      const tInNodes = filteredNodes.some(n => n.id === tId)
      const matchRelation = activeFilters.length === 0 || activeFilters.includes(link.type)

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
  }, [nodes, links, search, activeFilters])

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
  const importFromExcel = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.xlsx, .xls'
    input.onchange = (e: any) => handleImport(e)
    input.click()
  }

  // Export Excel
  const exportToExcel = () => {

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
    <div className="flex w-full h-full bg-black text-[#f5f5f7]">
      {/* Sidebar  */}
      <aside className="w-[320px] h-full glass border-r border-[#ffffff10] flex flex-col z-20 overflow-y-auto transition-apple">
        <div className="p-10 border-b border-[#ffffff05]">
          <h1 className="text-3xl font-bold flex items-center gap-3 tracking-tighter text-white">
            <Users size={28} strokeWidth={2.5} />
            Mapy
          </h1>
          <p className="text-[10px] text-[#86868b] mt-1.5 uppercase tracking-[0.25em] font-semibold">
            Social Visualizer • v0.6.0
          </p>
        </div>

        <div className="flex-1 p-8 space-y-10">
          {/* Section: Ajouter un individu */}
          <div className="space-y-5">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#86868b] flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3]"></span>
              Profil
            </h2>
            <AddPersonForm onAdd={(nom: string, genre: 'Garçon' | 'Fille') => {
              const id = `P${Date.now()}`
              setNodes([...nodes, { id, nom, genre }])
            }} />
          </div>

          {/* Section: Ajouter une relation */}
          <div className="space-y-5">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#86868b] flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3]"></span>
              Relation
            </h2>
            <AddRelationForm 
              nodes={nodes} 
              onAdd={(source: string, target: string, type: string) => {
                setLinks([...links, { source, target, type }])
              }} 
            />
          </div>

          {/* Section: Affichage & Outils */}
          <section className="space-y-5">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#86868b] flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3]"></span>
              Outils
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setIs3D(!is3D)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-apple group ${
                  is3D ? 'bg-[#0071e3] border-transparent text-white' : 'bg-[#ffffff05] border-[#ffffff10] hover:bg-[#ffffff10]'
                }`}
              >
                <Box size={22} className={is3D ? 'text-white' : 'text-[#86868b] group-hover:text-white transition-colors'} />
                <span className="text-[10px] mt-2 font-semibold uppercase tracking-wider">{is3D ? '2D' : '33D'}</span>
              </button>
              <button 
                onClick={() => {
                  try {
                    if (graphRef.current) {
                      const canvas = graphRef.current.getCanvasElement()
                      const img = canvas.toDataURL("image/png")
                      const link = document.createElement('a')
                      link.download = 'mapy_apple_snapshot.png'
                      link.href = img
                      link.click()
                      toast.success("Snapshot Premium enregistré ! ")
                    }
                  } catch (e) { toast.error("Erreur capture") }
                }}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#ffffff05] hover:bg-[#ffffff10] border border-[#ffffff10] group transition-apple"
              >
                <ImageIcon size={22} className="text-[#86868b] group-hover:text-white transition-colors" />
                <span className="text-[10px] mt-2 font-semibold uppercase tracking-wider">Capture</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={importFromExcel}
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#ffffff05] border border-[#ffffff10] hover:bg-[#ffffff10] text-[10px] font-bold text-white transition-apple uppercase tracking-wider"
              >
                <FileUp size={16} /> Import
              </button>
              <button 
                onClick={exportToExcel}
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#ffffff05] border border-[#ffffff10] hover:bg-[#ffffff10] text-[10px] font-bold text-white transition-apple uppercase tracking-wider"
              >
                <FileDown size={16} /> Export
              </button>
            </div>
          </section>

          {/* Stats */}
          <section className="space-y-5">
             <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#86868b] flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3]"></span> 
                Stats
             </h2>
             <div className="grid grid-cols-2 gap-3">
                <div className="glass-light p-5 rounded-2xl border border-[#ffffff05] text-center">
                  <p className="text-[9px] text-[#86868b] uppercase tracking-widest font-extrabold">Profils</p>
                  <p className="text-3xl font-bold text-white mt-1 tabular-nums">{nodes.length}</p>
                </div>
                <div className="glass-light p-5 rounded-2xl border border-[#ffffff05] text-center">
                  <p className="text-[9px] text-[#86868b] uppercase tracking-widest font-extrabold">Liens</p>
                  <p className="text-3xl font-bold text-white mt-1 tabular-nums">{links.length}</p>
                </div>
             </div>
          </section>

          {/* Social Path */}
          <section className="space-y-5">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#86868b] flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3]"></span> 
              Chemin
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3 p-4 rounded-2xl glass-light border border-[#ffffff10] text-[11px]">
                <span className="text-[#86868b] italic">Source :</span>
                <span className="font-bold text-white truncate max-w-[120px]">{pathStart?.nom || 'Sélectionner...'}</span>
                {pathStart && (
                  <button onClick={() => { setPathStart(null); setPathResult(null); }} className="text-[#ff3b30] hover:opacity-70 transition-apple"><Trash2 size={14} /></button>
                )}
              </div>
              
              <button
                onClick={() => { if(selectedNode) setPathStart(selectedNode); }}
                className="w-full py-3 bg-[#ffffff05] border border-[#ffffff10] rounded-2xl text-[11px] hover:bg-[#ffffff10] transition-apple uppercase font-bold tracking-wider text-white"
              >
                Définir {selectedNode?.nom || '...'} comme source
              </button>

              <button
                disabled={!pathStart || !selectedNode || pathStart.id === selectedNode.id}
                onClick={() => {
                  const path = findShortestPath(pathStart!.id, selectedNode!.id, nodes, links);
                  setPathResult(path);
                  if (!path) toast.error("Aucun chemin trouvé ! ❌");
                  else toast.success("Chemin optimisé calculé ! ✨");
                }}
                className="w-full py-4 bg-[#0071e3] rounded-2xl text-[11px] font-bold hover:opacity-90 disabled:opacity-30 transition-apple text-white uppercase tracking-[0.15em] shadow-[0_4px_20px_rgba(0,113,227,0.3)]"
              >
                Tracer vers {selectedNode?.nom || 'cible'}
              </button>

              {pathResult && (
                <div className="p-5 rounded-2xl bg-[#0071e310] border border-[#0071e320] animate-in fade-in slide-in-from-bottom-2 duration-700">
                  <p className="text-[11px] text-[#0071e3] leading-relaxed font-bold text-center">
                    {pathResult.map(id => nodes.find(n => n.id === id)?.nom).join(' → ')}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* AI Analyzer */}
          <div className="space-y-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 flex items-center gap-2 mb-2">
              <span className="w-4 h-[1px] bg-primary/30"></span> 
              Intelligence
            </h2>
            <AIAnalysisSection nodes={nodes} links={links} />
          </div>

          {/* Filtres */}
          <div className="space-y-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 flex items-center gap-2 mb-2">
              <span className="w-4 h-[1px] bg-primary/30"></span> 
              Filtres
            </h2>
            <FilterPanel 
              search={search} onSearch={setSearch} 
              activeFilters={activeFilters} onFilterToggle={toggleFilter} 
            />
          </div>
        </div>
        
        <div className="p-6 border-t border-white/5 bg-black/40 text-center">
            {selectedNode ? (
              <div className="animate-in fade-in zoom-in-95 duration-500 glass-light p-4 rounded-2xl border border-primary/30 bg-primary/10">
                <p className="text-[10px] text-primary/80 uppercase tracking-[0.2em] mb-1 font-bold text-center">Profil</p>
                <p className="text-xl font-serif font-bold text-white text-center mb-4 tracking-wide">{selectedNode.nom}</p>
                <div className="flex gap-4 justify-center items-center">
                  <button onClick={() => setSelectedNode(null)} className="text-[11px] text-foreground/50 hover:text-white transition-luxury font-medium">Fermer</button>
                  <div className="w-[1px] h-4 bg-white/10"></div>
                  <button 
                    onClick={() => {
                      if (window.confirm(`Supprimer ${selectedNode.nom} ?`)) {
                        setNodes(nodes.filter(n => n.id !== selectedNode.id));
                        setLinks(links.filter(l => {
                          const sId = typeof l.source === 'object' ? (l.source as any).id : l.source;
                          const tId = typeof l.target === 'object' ? (l.target as any).id : l.target;
                          return sId !== selectedNode.id && tId !== selectedNode.id;
                        }));
                        setSelectedNode(null);
                        toast.success("Individu supprimé");
                      }
                    }} 
                    className="text-[11px] text-red-500/80 hover:text-red-400 transition-luxury flex items-center gap-1.5 font-bold uppercase"
                  >
                    <Trash2 size={14} /> Supprimer
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-[10px] text-foreground/20 uppercase tracking-[0.3em] font-medium">
                Conçu par <span className="text-primary/40">Adam Beloucif</span>
              </p>
            )}
        </div>
      </aside>

      {/* Graphe */}
      <main className="flex-1 relative bg-black">
        <div className="absolute inset-0 z-0">
          {is3D ? (
            <ForceGraph3D
              ref={graphRef}
              graphData={graphData}
              nodeLabel={(node: any) => `${node.nom} (${node.genre})`}
              nodeColor={(node: any) => node.genre === 'Garçon' ? '#007aff' : '#ff2d55'}
              nodeRelSize={4}
              linkColor={(link: any) => (RELATION_TYPES as any)[link.type] || "#0071e3"}
              linkWidth={1}
              backgroundColor="#000000"
              onNodeClick={(node: any) => setSelectedNode(node)}
              nodeThreeObject={(node: any) => {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                const label = node.nom;
                canvas.width = 120;
                canvas.height = 120;
                if (context) {
                  context.font = 'Bold 24px -apple-system, BlinkMacSystemFont, "SF Pro Text"';
                  context.textAlign = 'center';
                  context.textBaseline = 'middle';
                  context.fillStyle = '#f5f5f7';
                  context.fillText(label, 60, 60);
                }
                const texture = new (window as any).THREE.CanvasTexture(canvas);
                const spriteMaterial = new (window as any).THREE.SpriteMaterial({ map: texture });
                const sprite = new (window as any).THREE.Sprite(spriteMaterial);
                sprite.scale.set(12, 12, 1);
                
                const group = new (window as any).THREE.Group();
                const geometry = new (window as any).THREE.SphereGeometry(node.val / 2);
                const material = new (window as any).THREE.MeshLambertMaterial({ 
                  color: node.genre === 'Garçon' ? '#3B82F6' : '#F43F5E',
                  transparent: true,
                  opacity: 0.9
                });
                const sphere = new (window as any).THREE.Mesh(geometry, material);
                
                 if (selectedNode && node.id === selectedNode.id) {
                    const glowGeo = new (window as any).THREE.SphereGeometry((node.val / 2) + 1.2);
                    const glowMat = new (window as any).THREE.MeshLambertMaterial({ color: '#0071e3', transparent: true, opacity: 0.35 });
                    group.add(new (window as any).THREE.Mesh(glowGeo, glowMat));
                }

                group.add(sphere);
                sprite.position.y = (node.val / 2) + 6;
                group.add(sprite);
                return group;
              }}
              nodeThreeObjectExtend={false}
            />
          ) : (
            <ForceGraph2D
              ref={graphRef}
              graphData={graphData}
              nodeLabel={(node: any) => `${node.nom} (${node.genre})`}
              nodeRelSize={4}
              linkColor={(link: any) => (RELATION_TYPES as any)[link.type] || "#0071e3"}
              linkDirectionalParticles={1}
              linkDirectionalParticleSpeed={0.003}
              linkWidth={0.8}
              nodeCanvasObject={(node: any, ctx, globalScale) => {
                   const label = node.nom;
                const fontSize = 15 / globalScale;
                ctx.font = `600 ${fontSize}px -apple-system, BlinkMacSystemFont, "SF Pro Text"`;
                
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.val, 0, 2 * Math.PI, false);
                ctx.fillStyle = node.genre === 'Garçon' ? '#007aff' : '#ff2d55';
                ctx.fill();
 
                if (selectedNode && node.id === selectedNode.id) {
                  ctx.shadowBlur = 20;
                  ctx.shadowColor = '#0071e3';
                  ctx.strokeStyle = '#0071e3';
                  ctx.lineWidth = 4 / globalScale;
                  ctx.stroke();
                  ctx.shadowBlur = 0;
                }
 
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#f5f5f7';
                // Contour renforcé pour lisibilité max (Apple style: subtil but net)
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 4 / globalScale;
                ctx.strokeText(label, node.x, node.y + node.val + 12/globalScale);
                ctx.fillText(label, node.x, node.y + node.val + 12/globalScale);
              }}
              onNodeClick={(node: any) => setSelectedNode(node)}
              backgroundColor="#000000"
            />
          )}
        </div>

        {/* Légende Dynamique Apple Style */}
        <div className="absolute top-10 right-10 p-8 glass rounded-[32px] flex flex-col gap-5 pointer-events-none max-h-[80vh] overflow-y-auto w-64 border border-[#ffffff10] shadow-2xl">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#86868b] border-b border-[#ffffff05] pb-3">Légende</h4>
          <div className="space-y-4">
            {Object.entries(RELATION_TYPES).map(([type, color]) => (
              <div key={type} className="flex items-center gap-4 text-[11px] font-semibold tracking-tight">
                <span className="w-3.5 h-3.5 rounded-full shrink-0 border border-[#ffffff10]" style={{ backgroundColor: color, boxShadow: `0 0 15px ${color}40` }} /> 
                <span className="truncate text-[#f5f5f7]/90">{type}</span>
              </div>
            ))}
          </div>
          <div className="h-[1px] bg-[#ffffff05] my-2" />
          <div className="space-y-4">
             <div className="flex items-center gap-4 text-[11px] font-semibold">
              <span className="w-3.5 h-3.5 rounded-full bg-[#007aff] shadow-[0_0_15px_rgba(0,122,255,0.3)] border border-[#ffffff10]" /> 
              <span className="text-[#f5f5f7]/90">Garçon</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-semibold">
              <span className="w-3.5 h-3.5 rounded-full bg-[#ff2d55] shadow-[0_0_15px_rgba(255,45,85,0.3)] border border-[#ffffff10]" /> 
              <span className="text-[#f5f5f7]/90">Fille</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
