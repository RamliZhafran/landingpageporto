import { motion } from 'framer-motion';
import { ExternalLink, ArrowUpLeft } from 'lucide-react';
import { projects } from '../data/projects';

interface ProjectsSectionProps {
  onReturnHome: () => void;
}

const GitHubIcon = () => (
  <svg className="h-[18px] w-[18px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 2.5-.35c.85 0 1.71.12 2.5.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2" />
  </svg>
);

export const ProjectsSection = ({ onReturnHome }: ProjectsSectionProps) => {
  return (
    <motion.section
      id="projects"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 min-h-screen px-4 py-20"
    >
      <div className="mx-auto w-full max-w-5xl">
        {/* Section Header */}
        <div className="mb-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-accent">
              active stream // workspace
            </p>
          </div>
          <h2 className="font-mono text-4xl font-bold tracking-tight text-white md:text-5xl">
            projects
          </h2>
          <p className="max-w-2xl text-neutral-400 font-sans text-sm sm:text-base">
            checkout my stuff
          </p>
        </div>

        {/* Tree Path Terminal Window */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-neutral-800/80 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <span className="h-3 w-3 rounded-full bg-green-500/80" />
              <span className="ml-2 font-mono text-xs text-neutral-500">~/projects</span>
            </div>
            <span className="font-mono text-[11px] text-neutral-600">utf-8 • tree</span>
          </div>

          <div className="custom-scrollbar max-h-[68vh] overflow-y-auto p-4 sm:p-6">
            <div className="font-mono text-sm text-neutral-400">
              <div className="mb-5 text-neutral-600">ramlizhafran@space:~/projects$ tree -L 3</div>

              <ol className="space-y-6">
                {projects.map((project, index) => {
                  const isLast = index === projects.length - 1;
                  const segments = project.path.split('/');
                  const fileName = segments[segments.length - 1];
                  const folderPath = segments.slice(0, -1).join('/');

                  return (
                    <li key={project.path} className="grid grid-cols-[auto_1fr] gap-x-3">
                      <div className="select-none font-mono text-neutral-700">
                        {isLast ? '└──' : '├──'}
                      </div>

                      <article className="group relative rounded-xl border border-neutral-900 bg-neutral-900/30 p-5 transition-all duration-300 hover:border-neutral-700 hover:bg-neutral-900/60">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="break-all font-mono text-sm">
                              <span className="text-neutral-600">{folderPath}/</span>
                              <span className="font-bold text-accent">{fileName}</span>
                            </div>
                            <div className="mt-1 font-mono text-xs text-neutral-600">{project.year}</div>
                          </div>

                          {(project.repoUrl || project.liveUrl) && (
                            <div className="flex shrink-0 gap-3 text-neutral-500">
                              {project.repoUrl && (
                                <a
                                  href={project.repoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="transition-colors hover:text-white"
                                  aria-label={`${project.path} repository`}
                                >
                                  <GitHubIcon />
                                </a>
                              )}
                              {project.liveUrl && (
                                <a
                                  href={project.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="transition-colors hover:text-white"
                                  aria-label={`${project.path} live link`}
                                >
                                  <ExternalLink size={18} />
                                </a>
                              )}
                            </div>
                          )}
                        </div>

                        <p className="mt-3 font-sans text-sm leading-relaxed text-neutral-300">
                          {project.description}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md border border-neutral-800/80 bg-neutral-950/70 px-2.5 py-1 font-mono text-xs text-neutral-400 transition-colors group-hover:border-neutral-700 group-hover:text-neutral-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>

        {/* Artsy Single Return Button */}
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={onReturnHome}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-neutral-800 bg-neutral-950/80 px-6 py-3.5 font-mono text-xs text-neutral-400 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-neutral-600 hover:text-neutral-100 hover:shadow-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 active:scale-95"
            aria-label="Kembali ke menu utama"
          >
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/40 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>

            <span className="tracking-wide">
              cd <span className="text-neutral-600 group-hover:text-neutral-400">..</span> <span className="text-neutral-600">//</span> <span className="text-accent/90 group-hover:text-accent font-semibold">kembali ke menu utama</span>
            </span>

            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900/60 text-neutral-500 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:-translate-x-0.5 group-hover:border-neutral-700 group-hover:text-accent">
              <ArrowUpLeft size={14} />
            </span>
          </button>
        </div>
      </div>
    </motion.section>
  );
};
