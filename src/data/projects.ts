export interface Project {
  /** Folder-style path shown in the tree, e.g. "thesis/pelu-it-40-neutronics" */
  path: string;
  /** One line, plain language. What it is and what it does. */
  description: string;
  /** Short stack/topic tags, 3-5 max */
  tags: string[];
  year: string;
  /** Optional links. Leave undefined if not public yet. */
  repoUrl?: string;
  liveUrl?: string;
}

// ─── KUSTOMISASI ────────────────────────────────────────────────────────
// Ganti / tambah proyek di bawah ini. Urutan menentukan urutan tampil
// di tree (dari atas ke bawah). "path" ditulis gaya folder biar nyambung
// sama tema terminal di halaman ini. Semua repoUrl di bawah sudah dicek,
// beneran ada dan publik.
export const projects: Project[] = [
  {
    path: 'coursework/decision-tree',
    description:
      'scikit-learn decision tree classifier and regressor, tested on a logic-gate classification task and curve-fitting against sinusoidal data.',
    tags: ['scikit-learn', 'Python', 'Machine Learning'],
    year: '2024',
    repoUrl: 'https://github.com/RamliZhafran/DecisionTree',
  },
  {
    path: 'research/openmc-triso',
    description:
      'An OpenMC model of a TRISO fuel particle for the PeLUIt-40 pebble-bed HTGR: kernel, buffer, and PyC/SiC coating layers, randomly packed into a pebble and run through tallies for neutronics analysis.',
    tags: ['OpenMC', 'Python', 'Nuclear Physics', 'TRISO'],
    year: '2025',
    repoUrl: 'https://github.com/RamliZhafran/OpenmcPebble',
  },
  {
    path: 'dotfiles/ricing-wsl',
    description:
      'Neovim and Starship prompt configuration for a WSL2 development setup.',
    tags: ['Neovim', 'Starship', 'WSL2'],
    year: '2025',
    repoUrl: 'https://github.com/RamliZhafran/ricingWSL',
  },
];
// ─────────────────────────────────────────────────────────────────────────
