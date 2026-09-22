import { useEffect, useRef } from 'react';

/**
 * آسمان پرستاره پس‌زمینه — با canvas و رزولوشن دستگاه.
 * تعداد ستاره‌ها به مساحت صفحه وابسته است و با اسکرول، لایه‌ها با سرعت متفاوت جابه‌جا می‌شوند.
 */
export function StarField({ density = 0.00012, className = '' }: { density?: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let stars: { x: number; y: number; r: number; a: number; speed: number; hue: string }[] = [];
    let frame = 0;
    let dpr = 1;

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(240, Math.round(width * height * density));
      const palette = ['#ffffff', '#ffe9bd', '#cfd8ff', '#bff0ff'];
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.4 + 0.25,
        a: Math.random() * 0.7 + 0.2,
        speed: Math.random() * 0.014 + 0.004,
        hue: palette[Math.floor(Math.random() * palette.length)],
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      stars.forEach((s, i) => {
        const twinkle = 0.55 + 0.45 * Math.sin(frame * s.speed * 6 + i);
        ctx.globalAlpha = s.a * twinkle;
        ctx.fillStyle = s.hue;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      frame += 1;
      raf = requestAnimationFrame(draw);
    };

    let raf = 0;
    build();
    draw();

    const onResize = () => {
      cancelAnimationFrame(raf);
      build();
      draw();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [density]);

  return <canvas ref={canvasRef} aria-hidden className={`pointer-events-none fixed inset-0 -z-10 opacity-70 ${className}`} />;
}
