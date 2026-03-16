import React from 'react'
import { Brain, Star, TrendingUp, Users } from 'lucide-react'

interface AIAnalysisSectionProps {
  nodes: any[]
  links: any[]
}

const AIAnalysisSection: React.FC<AIAnalysisSectionProps> = ({ nodes, links }) => {
  // Simple AI Insights based on graph metrics
  const getInsights = () => {
    const influencers = nodes
      .map(n => ({ 
        ...n, 
        connections: links.filter(l => {
          const sId = typeof l.source === 'object' ? (l.source as any).id : l.source;
          const tId = typeof l.target === 'object' ? (l.target as any).id : l.target;
          return sId === n.id || tId === n.id;
        }).length 
      }))
      .sort((a, b) => b.connections - a.connections)
      .slice(0, 2)

    return [
      {
        title: "Influenceur Clé",
        desc: influencers[0] ? `${influencers[0].nom} centralise le réseau.` : "Analyse en cours...",
        icon: <Star size={14} className="text-yellow-400" />
      },
      {
        title: "Cohésion",
        desc: links.length > nodes.length ? "Réseau dense et interconnecté." : "Réseau en phase d'expansion.",
        icon: <TrendingUp size={14} className="text-green-400" />
      }
    ]
  }

  const insights = getInsights()

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        {insights.map((insight, i) => (
          <div key={i} className="p-4 rounded-xl glass-light border border-white/5 flex gap-4 items-start transition-luxury hover:bg-white/10">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
              {insight.icon}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary/80 mb-0.5">{insight.title}</p>
              <p className="text-[11px] text-foreground/60 leading-tight font-medium">{insight.desc}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full py-3 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center gap-2 text-[10px] font-bold text-primary hover:bg-primary/20 transition-luxury uppercase tracking-widest group">
        <Brain size={14} className="group-hover:rotate-12 transition-transform" />
        Générer Rapport IA
      </button>
    </div>
  )
}

export default AIAnalysisSection
