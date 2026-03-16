import React from 'react';
import { Brain, Sparkles, ExternalLink, Activity } from 'lucide-react';
import { toast } from 'sonner';

interface AIAnalysisSectionProps {
  graphData: any;
}

export default function AIAnalysisSection({ graphData }: AIAnalysisSectionProps) {
  const [analyzing, setAnalyzing] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setResult(null);
    
    // Simulation d'analyse (Adam, tu pourras brancher une clé API Gemini ici plus tard)
    setTimeout(() => {
      const nodeCount = graphData.nodes.length;
      const linkCount = graphData.links.length;
      
      const analysis = `Analyse structurelle terminée. 
- Densité du réseau : ${(linkCount / (nodeCount * (nodeCount - 1) || 1)).toFixed(2)}
- Communautés détectées : 3 groupes d'influence.
- Profil central : ${graphData.nodes[0]?.nom || 'N/A'}.

Recommandation : Étendre les connexions transversales pour briser les silos sociaux.`;
      
      setResult(analysis);
      setAnalyzing(false);
      toast.success("Analyse AI générée avec succès ! ✨");
    }, 2000);
  };

  return (
    <section className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-700 delay-100">
      <h2 className="text-[10px] font-semibold text-foreground/40 uppercase tracking-widest flex items-center gap-2">
        <Brain size={14} /> AI Analyzer & Ressources
      </h2>

      <div className="space-y-3">
        {/* Analyse Button */}
        <button
          onClick={handleAnalyze}
          disabled={analyzing || graphData.nodes.length === 0}
          className="w-full group relative overflow-hidden rounded-xl p-[1px] font-bold transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
        >
          <div className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#3B82F6_50%,#E2E8F0_100%)]" />
          <div className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm text-white backdrop-blur-3xl">
            {analyzing ? (
              <Activity className="animate-spin" size={18} />
            ) : (
              <Sparkles size={18} className="group-hover:text-primary transition-colors font-bold" />
            )}
            <span>{analyzing ? "Analyse en cours..." : "Lancer l'Analyse AI"}</span>
          </div>
        </button>

        {/* AI Result Area */}
        {result && (
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-xs text-foreground/80 leading-relaxed animate-in zoom-in-95 duration-300">
            <p className="whitespace-pre-wrap">{result}</p>
          </div>
        )}

        {/* Resources Link */}
        <a
          href="https://github.com/cheahjs/free-llm-api-resources"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
        >
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Free LLM APIs</span>
            <span className="text-[9px] text-foreground/40">Ressources & Modèles Gratuits</span>
          </div>
          <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </a>
      </div>
    </section>
  );
}
