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
  path: 'Robot-Soccer',
  description:
    'A simple Arduino-based soccer robot controlled through the Serial Monitor. The robot uses dual DC motors with PWM speed control and supports forward, backward, left, right, and stop movement commands.',
  tags: ['Arduino IDE', 'Arduino', 'C++', 'Robotics'],
  year: '2023',
  repoUrl: 'https://github.com/RamliZhafran/Robot-Soccer',
},
    {
    path: 'Temperature-IoT',
    description:
      'An IoT-based temperature and humidity monitoring system using an ESP8266/ESP32 and DHT11/DHT22 sensor. The system collects environmental data and transmits it to the Blynk platform over Wi-Fi for real-time monitoring through a mobile dashboard. Developed using Arduino C++ with Blynk and DHT sensor libraries.',
    tags: ['Arduino IDE', 'IoT', 'ESP32', 'C++'],
    year: '2023',
    repoUrl: 'https://github.com/RamliZhafran/IoT-Suhu',
  },

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
    path: 'Money-tracker',
    description:
      'SmartReceipt Tracker: A client-side personal finance web application that uses OCR to extract transaction data from receipts, automatically categorizes expenses, and stores financial records locally in the browser.',
    tags: ['React', 'JavaScript', 'Vite', 'Tailwind CSS'],
    year: '2026',
    repoUrl: 'https://github.com/RamliZhafran/Money-tracker',
    liveUrl: 'https://ezmoneytracker.vercel.app/',
  },
];
// ─────────────────────────────────────────────────────────────────────────
