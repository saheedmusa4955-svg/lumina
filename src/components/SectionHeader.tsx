import { FadeIn } from '@/components/animations/FadeIn';

interface SectionHeaderProps {
  eyebrow: string;
  heading: string;
  description?: string;
  align?: 'left' | 'center';
}

export function SectionHeader({ eyebrow, heading, description, align = 'center' }: SectionHeaderProps) {
  return (
    <div className={`mb-16 ${align === 'center' ? 'text-center' : 'text-left'}`}>
      <FadeIn>
        <span className="text-xs font-medium text-lumina-accent uppercase tracking-[0.1em]">
          {eyebrow}
        </span>
      </FadeIn>
      <FadeIn delay={0.1}>
        <h2 className="text-3xl md:text-4xl font-normal text-white mt-4 leading-tight">
          {heading}
        </h2>
      </FadeIn>
      {description && (
        <FadeIn delay={0.2}>
          <p className={`text-base text-lumina-text-secondary mt-4 leading-relaxed ${align === 'center' ? 'max-w-lg mx-auto' : 'max-w-lg'}`}>
            {description}
          </p>
        </FadeIn>
      )}
    </div>
  );
}
