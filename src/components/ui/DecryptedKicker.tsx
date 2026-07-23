import DecryptedText from '@/components/DecryptedText';
import usePrefersReducedMotion from '@/components/home/usePrefersReducedMotion';
import { cn } from '@/lib/utils';

interface DecryptedKickerProps {
  text: string;
  className?: string;
}

/**
 * Monochromer Sektions-Kicker im Editorial-Stil: entschlüsselt sich einmalig,
 * sobald er in den Viewport scrollt (React-Bits DecryptedText).
 * Bei prefers-reduced-motion: statischer Text ohne Scramble-Effekt.
 */
export function DecryptedKicker({ text, className }: DecryptedKickerProps) {
  const reducedMotion = usePrefersReducedMotion();
  const base = 'font-mono text-[10px] uppercase tracking-[0.25em] text-mono-500';

  if (reducedMotion) {
    return <span className={cn(base, className)}>{text}</span>;
  }

  return (
    <span className={cn(base, className)}>
      <DecryptedText
        text={text}
        animateOn="view"
        sequential
        speed={35}
        revealDirection="start"
        characters="BLESSEDSTREETS·/+x"
        className="text-mono-500"
        encryptedClassName="text-mono-700"
      />
    </span>
  );
}

export default DecryptedKicker;
