import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useReducedMotion } from 'framer-motion';
import { ExternalLink, ArrowUp } from 'lucide-react';
import DecryptedText from './DecryptedText';
import { projects, type Project } from '../data/projects';

// Real GitHub mark, reused from the sprite already in public/icons.svg,
// but inline here so it can inherit text color on hover.
const GitHubIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.356 1.85C5.05 1.85 1.57 5.356 1.57 9.694a7.84 7.84 0 0 0 5.324 7.44c.387.079.528-.168.528-.376 0-.182-.013-.805-.013-1.454-2.165.467-2.616-.935-2.616-.935-.349-.91-.864-1.143-.864-1.143-.71-.48.051-.48.051-.48.787.051 1.2.805 1.2.805.695 1.194 1.817.857 2.268.649.064-.507.27-.857.49-1.052-1.728-.182-3.545-.857-3.545-3.87 0-.857.31-1.558.8-2.104-.078-.195-.349-1 .077-2.078 0 0 .657-.208 2.14.805a7.5 7.5 0 0 1 1.946-.26c.657 0 1.328.092 1.946.26 1.483-1.013 2.14-.805 2.14-.805.426 1.078.155 1.883.078 2.078.502.546.799 1.247.799 2.104 0 3.013-1.818 3.675-3.558 3.87.284.247.528.714.528 1.454 0 1.052-.012 1.896-.012 2.156 0 .208.142.455.528.377a7.84 7.84 0 0 0 5.324-7.441c.013-4.338-3.48-7.844-7.773-7.844"
    />
  </svg>
);

interface ProjectCardProps {
  project: Project;
  isDimmed: boolean;
  activeTag: string | null;
  onTagClick: (tag: string) => void;
}

const ProjectCard = ({ project, isDimmed, activeTag, onTagClick }: ProjectCardProps) => {
  const prefersReducedMotion = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 5);
    rotateX.set(py * -5);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.li
      className="relative pl-8 sm:pl-10 list-none"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: 0.05, ease: 'easeOut' }}
    >
      <span
        aria-hidden="true"
        className="absolute left-[3px] top-1.5 w-2 h-2 rounded-full bg-accent ring-4 ring-neutral-950 dark:ring-neutral-950 light:ring-neutral-100"
      />

      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformPerspective: 700 }}
        animate={{ opacity: isDimmed ? 0.35 : 1, scale: isDimmed ? 0.98 : 1 }}
        transition={{ duration: 0.3 }}
        className="rounded-lg -m-2 p-2 will-change-transform"
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-mono text-sm sm:text-base flex flex-wrap items-baseline gap-x-2">
            <DecryptedText
              text={`${project.path}/`}
              animateOn="view"
              speed={35}
              maxIterations={10}
              sequential
              revealDirection="start"
              characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_/"
              className="text-white dark:text-white light:text-neutral-950 font-bold"
              encryptedClassName="text-neutral-600 dark:text-neutral-600 light:text-neutral-500"
            />
            <span className="text-neutral-500 dark:text-neutral-500 light:text-neutral-700 font-semibold">{project.year}</span>
          </h3>

          {(project.repoUrl || project.liveUrl) && (
            <div className="flex items-center gap-3 shrink-0 pt-0.5">
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.path} on GitHub`}
                  className="text-neutral-500 dark:text-neutral-500 light:text-neutral-900 hover:text-white dark:hover:text-white light:hover:text-accent transition-colors"
                >
                  <GitHubIcon />
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.path} live site`}
                  className="text-neutral-500 dark:text-neutral-500 light:text-neutral-900 hover:text-accent transition-colors"
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          )}
        </div>

        <p className="mt-2 text-sm sm:text-[15px] text-neutral-400 dark:text-neutral-400 light:text-neutral-900 leading-relaxed max-w-lg">
          {project.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => {
            const isActive = activeTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onTagClick(tag)}
                aria-pressed={isActive}
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border transition-colors ${
                  isActive
                    ? 'border-accent text-accent bg-accent/10'
                    : 'border-neutral-800 dark:border-neutral-800 light:border-slate-400 text-neutral-500 dark:text-neutral-500 light:text-neutral-900 light:bg-slate-200/60 hover:border-neutral-600 hover:text-neutral-300 dark:hover:text-neutral-300 light:hover:text-neutral-950'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </motion.div>
    </motion.li>
  );
};

export const ProjectsSection = ({ onReset }: { onReset?: () => void }) => {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const treeRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: treeRef,
    offset: ['start center', 'end center'],
  });
  const markerTop = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const toggleTag = (tag: string) => setActiveTag((prev) => (prev === tag ? null : tag));

  return (
    <section id="projects" className="relative z-10 px-4 sm:px-6 py-24 sm:py-32">
      <div className="max-w-2xl mx-auto">
        {/* Section heading, terminal-command style to match the hero */}
        <div className="mb-14 sm:mb-20">
          <p className="font-mono text-xs sm:text-sm text-neutral-600 dark:text-neutral-600 light:text-neutral-800 mb-2">~/ramlizhafran $</p>
          <h2 className="font-mono text-3xl sm:text-4xl text-white dark:text-white light:text-neutral-950 font-bold tracking-tight">
            <DecryptedText
              text="ls ./projects"
              animateOn="view"
              speed={70}
              maxIterations={12}
              sequential
              revealDirection="start"
              characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890./_"
              className="text-white dark:text-white light:text-neutral-950"
              encryptedClassName="text-neutral-600 dark:text-neutral-600 light:text-neutral-500"
            />
          </h2>
          <p className="text-neutral-500 dark:text-neutral-500 light:text-neutral-800 mt-3 text-sm sm:text-base max-w-md">
            checkout my stuff.
            {activeTag && (
              <>
                {' '}filtered by{' '}
                <button
                  type="button"
                  onClick={() => setActiveTag(null)}
                  className="text-accent hover:underline underline-offset-2"
                >
                  {activeTag} ×
                </button>
              </>
            )}
          </p>
        </div>

        {/* Tree path */}
        <div ref={treeRef} className="relative">
          <div
            aria-hidden="true"
            className="absolute left-[7px] top-1 bottom-1 w-px bg-gradient-to-b from-accent-2/50 via-accent/30 to-transparent"
          />

          {/* "You are here" marker, travels down the spine as you scroll */}
          <motion.div
            aria-hidden="true"
            className="absolute left-[3px] w-2 h-2 -translate-y-1/2 rounded-full bg-white dark:bg-white light:bg-neutral-900 shadow-[0_0_8px_2px_rgba(255,255,255,0.35)]"
            style={{ top: markerTop }}
          />

          <ul className="space-y-12 sm:space-y-14">
            {projects.map((project) => (
              <ProjectCard
                key={project.path}
                project={project}
                activeTag={activeTag}
                onTagClick={toggleTag}
                isDimmed={activeTag !== null && !project.tags.includes(activeTag)}
              />
            ))}
          </ul>

          <p className="relative pl-8 sm:pl-10 mt-10 font-mono text-xs text-neutral-700 dark:text-neutral-700 light:text-neutral-800 font-semibold">
            └── stay tuned for more...
            <span className="inline-block w-1.5 h-3 bg-neutral-700 dark:bg-neutral-700 light:bg-neutral-900 ml-1 align-middle animate-blink" />
          </p>

          {/* Back to top button */}
          <div className="relative pl-8 sm:pl-10 mt-6">
            <button
              type="button"
              onClick={() => onReset?.()}
              className="group flex items-center gap-2 font-mono text-xs text-neutral-600 dark:text-neutral-600 light:text-neutral-900 hover:text-accent transition-colors"
            >
              <span className="p-1.5 rounded-md border border-neutral-800 dark:border-neutral-800 light:border-slate-400 group-hover:border-accent/50 group-hover:bg-accent/10 transition-colors">
                <ArrowUp size={14} />
              </span>
              <span>cd ~</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
