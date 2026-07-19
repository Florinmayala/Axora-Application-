import React, { useState } from 'react';
import { Copy, Check, FileText, Sparkles, BookOpen } from 'lucide-react';

export default function AiDocumentation() {
  const [copied, setCopied] = useState(false);

  const rawPromptSpec = `# Axora App - Spec Prompt IA pour Maquette Complète
Rôle : Expert Lead Developer Android / React & UX Designer.
Objectif : Réaliser la maquette complète, interactive, responsive et bilingue d'Axora.

---

## 🎨 1. DESIGN SYSTEM & IDENTITÉ VISUELLE

L'application adopte un style "Futuriste Sombre et Lumineux" avec la possibilité de basculer instantanément de Thème Sombre à Thème Clair.

### Palette de Couleurs Directrices :
- **Mode Sombre** : Fond Noir profond (#09090B ou #000), Surfaces Bento en Gris Sombre (#18181B / #27272A), Texte principal Blanc absolu.
- **Mode Clair** : Fond Blanc brillant (#FFFFFF), Surfaces Bento en Gris clair doux (#F4F4F5 / #E4E4E7), Texte principal Noir Profond (#09090B).
- **Accents de Marque** : 
  - Rouge Flamboyant (\`#EF4444\` ou \`#FF2D55\`) : Couleur volcanique de la flamme, des highlights et des boutons d'actions forts.
  - Accent Secondaire : Blanc, Noir, et accents de gris futuristes.

---

## 🏗️ 2. STRUCTURE DES COMPOSANTS ET ÉCRANS

### 🔝 HEADER PRINCIPAL :
- **Logo :** "La Flamme" (Icône Flame de Lucide ou tracé vectoriel artistique rougeoyant).
- **Nom "axora" :** Écrit avec une typographie de grande élégance (Serif raffiné ou Sans-serif ultra-propre, lettres espacées, petite lueur rouge).
- **Compteur de Coins :** Affiche le solde des "Axo Coins" avec l'icône de pièce scintillante (\`🪙 340 Axo\`).

### 🗺️ NAVIGATION & ACTIONS :
La barre de navigation inférieure structure les 5 expériences clés :
1. **Home / Accueil :** Liste des stories éphémères + flux de publications interactives (Bento Cards, Likes, Commentaires, Partages, Sondages Vote).
2. **Reels :** Flux vidéo court plein écran avec overlay d'actions instantanées.
3. **What's Hot (Pop Session 🔥) :** Interface de matchmaking de débats en direct où l'utilisateur rejoint des groupes ou configure sa propre session via \`AxoraRegisterSessionDialog\`.
4. **Messagerie :** Les fils de discussion avec tri intelligent, menant au \`DirectChatScreen\` (avec simulateur d'appel sécurisé "AFRI-TECH").
5. **Profile :** Espace personnel conçu comme un tableau de bord Bento (tuiles asymétriques pour stats, biographie, switch de profil privé, et grille de portfolio photo).

---

## 📱 3. COMPORTEMENT ADAPTATIF (RÉPONSES ÉCRANS)
L'application doit s'adapter de manière fluide dans les contextes suivants :
- **Mobile :** Affichage optimisé avec barre de navigation en bas et header compact. Touch targets de 44px minimum.
- **Tablette :** Agencement en deux colonnes : flux principal d'un côté, et bento d'activités complémentaires ou messagerie instantanée de l'autre.
- **Desktop / Web :** Layout complet à trois colonnes avec panneau latéral gauche pour les raccourcis de navigation, flux central immersif, et volet droit pour les Pop Sessions actives de la communauté.

---

*Généré pour le projet Axora App par l'assistant IA. Copiez ce prompt pour vos futures intégrations ! 🚀*`;

  const handleCopy = () => {
    navigator.clipboard.writeText(rawPromptSpec);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="ai-doc-panel" className="bg-[#1C1C1E]/80 backdrop-blur-md rounded-2xl border border-white/5 p-6 shadow-xl text-zinc-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#FF2D55]/10 rounded-xl border border-[#FF2D55]/20 text-[#FF2D55]">
            <BookOpen className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
              Spécifications IA & Documentation Axora
            </h3>
            <p className="text-xs text-zinc-400">
              Cahier des charges optimisé pour l'agent de génération
            </p>
          </div>
        </div>

        <button
          id="btn-copy-prompt"
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 active:scale-95 transition-all text-xs font-medium text-white rounded-xl border border-zinc-700"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Copié dans le presse-papiers</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-zinc-400" />
              <span>Copier le Prompt Spécification</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-6 text-sm leading-relaxed max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
        {/* Pitch section */}
        <div className="p-4 bg-zinc-950/60 rounded-xl border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-[#FF2D55] font-semibold text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Concept de Maquette Interactive
          </div>
          <p className="text-xs text-zinc-300">
            Ce prototype vous permet de visualiser d'un seul coup d'œil l'expérience utilisateur d'Axora. Utilisez le simulateur à droite pour tester l'interface sur 4 facteurs de forme : <strong>Mobile, Tablette, Desktop, et Web</strong>, tant en mode sombre qu'en mode clair !
          </p>
        </div>

        {/* Bullet details */}
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest text-[#FF2D55] mb-2">
              🎨 1. Palette & Charte Graphique Propre :
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-400">
              <li><strong className="text-zinc-200">Rouge Volcanique :</strong> Symbole de la flamme et de l'ardeur des échanges (AxoraPink #FF2D55).</li>
              <li><strong className="text-zinc-200">Noir & Blanc & Cyan :</strong> Un contraste bimodal parfait et un bleu électrique de sécurité (AxoraCyan #00FBFF).</li>
              <li><strong className="text-zinc-200">Bento UX :</strong> L'agencement asymétrique élégant pour l'organisation de données.</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest text-[#FF2D55] mb-2">
              🛡️ 2. Fonctionnalités Phares :
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-400">
              <li><strong className="text-zinc-200">🔥 Pop Sessions :</strong> Groupes de débats ou de discussions instantanés.</li>
              <li><strong className="text-zinc-200">🪙 Axo Coins :</strong> Un système de motivation intégré au header.</li>
              <li><strong className="text-zinc-200">🔒 Afri-Tech :</strong> Mention de sécurité des sessions et du chiffrement.</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest text-[#FF2D55] mb-2">
              💻 3. Test de Réactivité Multi-Appareil :
            </h4>
            <p className="text-xs text-zinc-400">
              Cette maquette réactive gère de vrais points de rupture (breakpoints) pour simuler et valider l'agencement du layout en format Mobile vertical, Tablette moyenne, Écran d'ordinateur ou Intégration Web native globale.
            </p>
          </div>
        </div>

        {/* Expandable full Raw spec code block */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-zinc-400">Aperçu du Prompt de Génération Brute :</div>
          <pre className="p-4 bg-zinc-950 font-mono text-[11px] text-zinc-400 rounded-xl overflow-x-auto border border-zinc-800">
            {rawPromptSpec}
          </pre>
        </div>
      </div>
    </div>
  );
}
