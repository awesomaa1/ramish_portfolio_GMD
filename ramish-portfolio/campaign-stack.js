/**
 * Interactive Campaign Deck & Scroll Stacking Engine
 * Handles 1-by-1 physical card stacking as the user scrolls through the 6 campaign steps.
 */
(() => {
    const stepNames = [
        "Understand",
        "Target",
        "Build",
        "Test",
        "Learn",
        "Improve"
    ];

    const naturalTilts = [-2.2, 1.8, -1.6, 2.0, -1.2, 0];

    let currentStep = -1;
    let cards = [];
    let steps = [];
    let pills = [];
    let stepNumEl = null;
    let stepNameEl = null;

    function initCampaignStack() {
        cards = [...document.querySelectorAll('.campaign-card')];
        steps = [...document.querySelectorAll('.process__step')];
        pills = [...document.querySelectorAll('.bar-pill')];
        stepNumEl = document.getElementById('campaign-step-num');
        stepNameEl = document.getElementById('campaign-step-name');

        if (!cards.length || !steps.length) return;

        // Set initial stack state
        updateStack(0, true);

        // Setup Intersection Observer for scroll tracking
        setupObserver();

        // Setup scroll fallback for instant responsiveness
        setupScrollListener();

        // Setup click listeners on steps and progress pills
        setupInteractivity();
    }

    function updateStack(stepIndex, isInitial = false) {
        if (stepIndex === currentStep && !isInitial) return;
        currentStep = Math.max(0, Math.min(stepNames.length - 1, stepIndex));

        // 1. Update Deck Cards
        cards.forEach((card, i) => {
            if (i > currentStep) {
                // Card is upcoming (below viewport / not yet stacked)
                card.style.transform = `translate3d(0, 118%, 0) scale(0.93) rotate(${naturalTilts[i % naturalTilts.length]}deg)`;
                card.style.opacity = '0';
                card.style.filter = 'none';
                card.style.pointerEvents = 'none';
                card.style.zIndex = `${10 + i}`;
            } else if (i === currentStep) {
                // Top card of the stack
                card.style.transform = `translate3d(0, 0, 0) scale(1) rotate(0deg)`;
                card.style.opacity = '1';
                card.style.filter = 'none';
                card.style.pointerEvents = 'auto';
                card.style.zIndex = `${10 + i}`;
                card.style.boxShadow = '0 28px 60px -10px rgba(22, 10, 8, 0.48), 0 0 0 1.5px rgba(255, 255, 255, 0.16)';
            } else {
                // Card is stacked underneath!
                const depth = currentStep - i;
                const translateY = Math.max(-36, -11 * depth);
                const scale = Math.max(0.84, 1 - 0.038 * depth);
                const tilt = naturalTilts[i % naturalTilts.length];
                const brightness = Math.max(0.68, 1 - 0.07 * depth);
                const opacity = Math.max(0.72, 1 - 0.06 * depth);

                card.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale}) rotate(${tilt}deg)`;
                card.style.opacity = `${opacity}`;
                card.style.filter = `brightness(${brightness})`;
                card.style.pointerEvents = 'none';
                card.style.zIndex = `${10 + i}`;
                card.style.boxShadow = '0 16px 36px -8px rgba(22, 10, 8, 0.35)';
            }
        });

        // 2. Update Header Tracker
        if (stepNumEl) stepNumEl.textContent = String(currentStep + 1);
        if (stepNameEl) stepNameEl.textContent = stepNames[currentStep];

        // 3. Update Progress Pills
        pills.forEach((pill, i) => {
            pill.classList.toggle('is-active', i === currentStep);
            pill.classList.toggle('is-done', i < currentStep);
        });

        // 4. Update Steps Active State
        steps.forEach((step, i) => {
            step.classList.toggle('is-active', i === currentStep);
        });
    }

    function setupObserver() {
        if (!('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stepIdx = Number(entry.target.dataset.step);
                    if (!isNaN(stepIdx)) {
                        updateStack(stepIdx);
                    }
                }
            });
        }, {
            // Trigger as the step crosses the middle vertical band of the screen
            rootMargin: '-30% 0px -40% 0px',
            threshold: 0.1
        });

        steps.forEach(step => observer.observe(step));
    }

    function setupScrollListener() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    checkActiveStepByPosition();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    function checkActiveStepByPosition() {
        const viewportCenter = window.innerHeight * 0.45;
        let closestIdx = 0;
        let minDistance = Infinity;

        steps.forEach((step, idx) => {
            const rect = step.getBoundingClientRect();
            // Distance from viewport middle
            const stepCenter = rect.top + rect.height * 0.35;
            const dist = Math.abs(stepCenter - viewportCenter);

            if (rect.top <= viewportCenter + 150 && rect.bottom >= viewportCenter - 150) {
                if (dist < minDistance) {
                    minDistance = dist;
                    closestIdx = idx;
                }
            }
        });

        if (minDistance !== Infinity) {
            updateStack(closestIdx);
        }
    }

    function setupInteractivity() {
        // Clicking left step scrolls to that step
        steps.forEach((step, idx) => {
            step.addEventListener('click', () => {
                scrollToStep(idx);
            });
        });

        // Clicking progress bar pill scrolls to that step
        pills.forEach((pill, idx) => {
            pill.addEventListener('click', (e) => {
                e.stopPropagation();
                scrollToStep(idx);
            });
        });
    }

    function scrollToStep(idx) {
        if (!steps[idx]) return;
        const rect = steps[idx].getBoundingClientRect();
        const targetY = window.pageYOffset + rect.top - (window.innerHeight * 0.3);
        window.scrollTo({
            top: targetY,
            behavior: 'smooth'
        });
        updateStack(idx);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCampaignStack);
    } else {
        initCampaignStack();
    }
})();
