/**
 * Interactive 3D Floating Icons for Ramish Portfolio Hero
 * - Magnetic Hover Reaction ("moves a little here and there")
 * - 3D Cursor Parallax
 */
(() => {
    const hero = document.querySelector('.hero');
    const items = document.querySelectorAll('.hero__orbit .float-item');
    if (!hero || !items.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // 1. Interactive Hover: icon tilts and slides towards/with mouse
    items.forEach((item) => {
        let rect = null;

        const updateRect = () => {
            rect = item.getBoundingClientRect();
        };

        item.addEventListener('mouseenter', updateRect);

        item.addEventListener('mousemove', (e) => {
            if (!rect) updateRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;

            // Interactive translation & tilt ("move a little here and there")
            const hoverX = deltaX * 0.48;
            const hoverY = deltaY * 0.48 - 6; // playful upward lift
            const hoverRot = deltaX * 0.2;

            item.style.setProperty('--hover-x', `${hoverX.toFixed(1)}px`);
            item.style.setProperty('--hover-y', `${hoverY.toFixed(1)}px`);
            item.style.setProperty('--hover-rot', `${hoverRot.toFixed(1)}deg`);
        });

        item.addEventListener('mouseleave', () => {
            item.style.setProperty('--hover-x', '0px');
            item.style.setProperty('--hover-y', '0px');
            item.style.setProperty('--hover-rot', '0deg');
            rect = null;
        });
    });

    // 2. Gentle Cursor Parallax across the Hero Stage
    let rafId = null;
    const onPointerMove = (e) => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const normX = (e.clientX - centerX) / centerX;
            const normY = (e.clientY - centerY) / centerY;

            items.forEach((item) => {
                const depth = parseFloat(item.dataset.depth || '0.05');
                const px = normX * depth * 30;
                const py = normY * depth * 30;
                item.style.setProperty('--px', `${px.toFixed(1)}px`);
                item.style.setProperty('--py', `${py.toFixed(1)}px`);
            });
        });
    };

    const resetParallax = () => {
        items.forEach((item) => {
            item.style.setProperty('--px', '0px');
            item.style.setProperty('--py', '0px');
        });
    };

    hero.addEventListener('pointermove', onPointerMove, { passive: true });
    hero.addEventListener('pointerleave', resetParallax);
    window.addEventListener('resize', resetParallax);
})();
