import React, { Suspense } from 'react';
import usePrefersReducedMotion from './usePrefersReducedMotion';

// WebGL (three.js) nur lazy laden — einzige WebGL-Instanz der Startseite.
const GridScan = React.lazy(() =>
  import('@/components/GridScan').then(m => ({ default: m.GridScan }))
);

/**
 * Monochromer GridScan-Hintergrund für die Newsletter-Sektion.
 * Bei prefers-reduced-motion: statischer schwarzer Fallback mit
 * dezentem Grauverlauf statt WebGL.
 */
const GridScanBackdrop = () => {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return (
      <div className="absolute inset-0 bg-black" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent_65%)]" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Suspense fallback={<div className="absolute inset-0 bg-black" />}>
        <GridScan
          linesColor="#1f1f1f"
          scanColor="#ffffff"
          scanOpacity={0.22}
          gridScale={0.12}
          lineThickness={1}
          lineJitter={0}
          enablePost={false}
          scanGlow={0.35}
          scanSoftness={2}
          scanDuration={2.5}
          scanDelay={6}
          sensitivity={0.35}
          enableGyro={false}
          className="absolute inset-0"
        />
      </Suspense>
      {/* Scrim für Lesbarkeit des Newsletter-Inhalts */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80" />
    </div>
  );
};

export default GridScanBackdrop;
