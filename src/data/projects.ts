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
// sama tema terminal di halaman ini.
export const projects: Project[] = [
  {
    path: 'thesis/HTR-Code-Package-PeLUIt-40',
    description:
      'Neutronics simulation of the PeLUIt-40 pebble-bed HTGR using the HTR Code Package and OpenMC. Compares OTTO and MEDUL fuel management across three power levels and extends the flux analysis out to the reactor pressure vessel.',
    tags: ['OpenMC', 'HTR Code Package', 'Python', 'Nuclear Physics'],
    year: '2025',
    repoUrl: 'https://github.com/RamliZhafran/HTR-Code-Package-PeLUIt-40',
  },
  {
    path: 'nuclear/Openmc_KP',
    description:
      'OpenMC Monte Carlo simulations for nuclear reactor physics. Jupyter notebooks with geometry, material definitions, and criticality calculations for HTGR analysis.',
    tags: ['OpenMC', 'Jupyter Notebook', 'Python', 'Nuclear Physics'],
    year: '2025',
    repoUrl: 'https://github.com/RamliZhafran/Openmc_KP',
  },
  {
    path: 'dotfiles/ricingWSL',
    description:
      'A Catppuccin Mocha desktop built around komorebi tiling WM, YASB status bar, and whkd keybindings, tuned for a keyboard-first workflow on WSL2/Windows.',
    tags: ['komorebi', 'YASB', 'whkd', 'Lua', 'Windows'],
    year: '2026',
    repoUrl: 'https://github.com/RamliZhafran/ricingWSL',
  },
  {
    path: 'web/landingpageporto',
    description:
      'This site. An OS-window desktop portfolio with draggable windows, starfield background, and live Discord presence pulled from Lanyard.',
    tags: ['React', 'TypeScript', 'Vite', 'Framer Motion', 'Tailwind'],
    year: '2026',
    repoUrl: 'https://github.com/RamliZhafran/landingpageporto',
    liveUrl: 'https://ramlispace.vercel.app',
  },
];
// ──────────────────────────────────────────────────────────────────────