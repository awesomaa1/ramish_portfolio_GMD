var e = document.documentElement;
matchMedia(`(hover: hover) and (pointer: fine)`).matches;

function t() {
    document.querySelectorAll(`[data-copy]`).forEach(e => {
        e.addEventListener(`click`, async () => {
            try {
                await navigator.clipboard.writeText(e.dataset.copy), e.textContent = `Copied`
            } catch {
                e.textContent = e.dataset.copy
            }
            setTimeout(() => {
                e.textContent = `Copy email`
            }, 2e3)
        })
    });
    let t = document.querySelector(`.to-top`);
    if (t) {
        let n = () => t.classList.toggle(`is-shown`, scrollY > innerHeight * .8);
        addEventListener(`scroll`, n, {
            passive: !0
        }), n(), t.addEventListener(`click`, t => {
            t.preventDefault(), scrollTo({
                top: 0,
                behavior: e.classList.contains(`motion`) ? `smooth` : `auto`
            }), history.replaceState(null, ``, location.pathname)
        })
    }
    if (!e.classList.contains(`motion`)) return;
    document.querySelectorAll(`.display`).forEach(e => {
        let t = e.textContent.trim().split(/\s+/);
        e.setAttribute(`aria-label`, e.textContent.trim()), e.innerHTML = t.map((e, t) => `<span class="word" aria-hidden="true"><span style="--i:${t}">${e}</span></span>`).join(` `), e.dataset.reveal = `words`
    }), document.querySelectorAll([`.own__post`, `.own__text`, `.case__profile`, `.about__photo`, `.about__text p`, `.facts`, `.contact__email`, `.socials`, `.case__body`, `.inside__post`, `.strip`, `.chapter__text`, `.chapter__charts > *`, `.deck`, `.case__cta`, `.case__next`].join(`,`)).forEach(e => {
        e.dataset.reveal ??= `up`
    }), document.querySelectorAll([`.projects`, `.services__list`, `.case__results`, `.stats__list`, `.ceos__list`].join(`,`)).forEach(e => {
        [...e.children].forEach((e, t) => {
            e.dataset.reveal = `up`, e.style.setProperty(`--i`, String(Math.min(t, 8)))
        })
    });
    let r = e => {
        e.classList.add(`in`), e.querySelectorAll(`[data-count]`).forEach(n), e.matches(`[data-count]`) && n(e)
    },
        i = new IntersectionObserver(e => {
            for (let t of e) t.isIntersecting && (r(t.target), i.unobserve(t.target))
        }, {
            rootMargin: `0px 0px -10% 0px`,
            threshold: .1
        });
    document.querySelectorAll(`[data-reveal]`).forEach(e => {
        let t = e.getBoundingClientRect();
        t.top < innerHeight * .85 && t.bottom > 0 ? requestAnimationFrame(() => r(e)) : i.observe(e)
    })
}

function n(e) {
    if (e.dataset.counted) return;
    e.dataset.counted = `1`;
    let t = e.textContent,
        n = t.split(/(\d[\d,]*)/),
        r = n.map(e => /^\d[\d,]*$/.test(e) ? Number(e.replace(/,/g, ``)) : null);
    if (!r.some(e => e !== null)) return;
    let i = (e, t) => t.includes(`,`) || e >= 1e3 ? Math.round(e).toLocaleString(`en-US`) : String(Math.round(e)),
        a = performance.now();
    e.style.minWidth = `${e.offsetWidth}px`, (function o(s) {
        let c = Math.min(1, (s - a) / 1100),
            l = 1 - (1 - c) ** 3;
        e.textContent = n.map((e, t) => r[t] === null ? e : i(r[t] * l, e)).join(``), c < 1 ? requestAnimationFrame(o) : e.textContent = t
    })(a)
}

function r() {
    let e = [...document.querySelectorAll(`.beat`)];
    if (e.length) {
        let t = t => e.forEach((e, n) => e.classList.toggle(`is-active`, n === t));
        t(0);
        let n = new IntersectionObserver(e => {
            for (let n of e) n.isIntersecting && t(Number(n.target.dataset.beat))
        }, {
            rootMargin: `-40% 0px -40% 0px`
        });
        e.forEach(e => n.observe(e))
    }
    let t = [...document.querySelectorAll(`.process__step`)],
        n = [...document.querySelectorAll(`.phone__screen`)];
    if (!t.length) return;
    let r = e => {
        t.forEach((t, n) => t.classList.toggle(`is-active`, n === e)), n.forEach((t, n) => t.classList.toggle(`is-on`, n === e))
    };
    r(0);
    let i = new IntersectionObserver(e => {
        for (let t of e) t.isIntersecting && r(Number(t.target.dataset.step))
    }, {
        rootMargin: `-45% 0px -45% 0px`
    });
    t.forEach(e => i.observe(e))
}

function i() {
    let e = document.querySelector(`.buddy__say`);
    if (!e) return;
    let t = e.textContent,
        n = [
            [`.about`, `Just me, chilling & figuring out growth`],
            [`.services`, matchMedia(`(max-width: 760px)`).matches ? `What I can do for your brand ✨` : `Keep scrolling, the good stuff slides in`],
            [`.work`, `Curious what I’ve been cooking? 👀`],
            [`.ceos`, `Learning, testing, getting better. Repeat.`],
            [`.own`, `A little something I made myself 💅`],
            [`.process`, `Here’s how I make the magic happen`],
            [`.contact`, `Got a project? Slide into my inbox 💌`]
        ].map(([e, t]) => [document.querySelector(e), t]).filter(([e]) => e),
        r = null,
        i = 0,
        a = () => {
            let a = innerHeight / 2,
                o = n.find(([e]) => {
                    let t = e.getBoundingClientRect();
                    return t.top < a && t.bottom > a
                }),
                s = o ? o[1] : t;
            s !== r && (r = s, e.classList.remove(`is-talking`), e.offsetWidth, e.textContent = s, e.classList.toggle(`is-talking`, !!o), clearTimeout(i), o && (i = setTimeout(() => e.classList.remove(`is-talking`), 3500)))
        },
        o = new IntersectionObserver(a, {
            threshold: [0, .25, .5, .75, 1]
        });
    addEventListener(`pageshow`, e => {
        e.persisted && (r = null, a())
    }), n.forEach(([e]) => o.observe(e))
}
var a = document.documentElement,
    o = matchMedia(`(hover: hover) and (pointer: fine)`).matches,
    s = {
        x: -9999,
        y: -9999,
        active: !1
    },
    c = (e, t, n) => e + (t - e) * n,
    l = scrollY,
    u = scrollX,
    d = new Map,
    f = 0,
    p = new WeakSet;

function m(e) {
    let t = performance.now();
    t - f > 3e3 && (d.clear(), f = t);
    let n = d.get(e);
    if (!n) {
        let t = e.getBoundingClientRect(),
            r = p.has(e);
        n = {
            left: t.left,
            top: t.top + (r ? 0 : l),
            width: t.width,
            height: t.height,
            fixed: r
        }, d.set(e, n)
    }
    let r = n.fixed ? n.top : n.top - l;
    return {
        left: n.left,
        top: r,
        width: n.width,
        height: n.height,
        bottom: r + n.height
    }
}
var h = () => d.clear();
addEventListener(`resize`, h), document.fonts?.ready.then(h), document.addEventListener(`transitionend`, e => {
    e.target.closest?.(`[data-reveal]`) && h()
});
var g = (e, t, n) => Math.max(t, Math.min(n, e));

function _() {
    if (!a.classList.contains(`motion`)) return;
    addEventListener(`pointermove`, e => {
        s.x = e.clientX, s.y = e.clientY, s.active = !0
    }, {
        passive: !0
    }), document.documentElement.addEventListener(`pointerleave`, () => {
        s.active = !1
    });
    let e = performance.now(),
        t = () => {
            e = performance.now()
        };
    addEventListener(`pointermove`, t, {
        passive: !0
    }), addEventListener(`scroll`, t, {
        passive: !0
    });
    let n = [x()].filter(Boolean),
        r = [S(), C()];
    o && r.push(v(), y(), b());
    let i = r.filter(Boolean);
    (function t(r) {
        l = scrollY, u = scrollX;
        for (let e of n) e(r);
        if (r - e < 900)
            for (let e of i) e(r);
        requestAnimationFrame(t)
    })(performance.now())
}

function v() {
    let e = [...document.querySelectorAll(`.hero__name, .display, .contact__email`)];
    if (!e.length) return null;
    let t = [];
    for (let n of e) {
        let e = getComputedStyle(n),
            r = Number(e.fontWeight) || 700,
            i = n.getAttribute(`aria-label`) || n.textContent.trim();
        n.matches(`.contact__email`) || n.setAttribute(`aria-label`, i);
        let a = document.createTreeWalker(n, NodeFilter.SHOW_TEXT),
            o = [];
        for (; a.nextNode();) a.currentNode.textContent.trim() && o.push(a.currentNode);
        for (let e of o) {
            let i = document.createDocumentFragment();
            for (let a of e.textContent) {
                if (a === ` `) {
                    i.append(` `);
                    continue
                }
                let e = document.createElement(`span`);
                e.className = `ch`, e.setAttribute(`aria-hidden`, `true`), e.textContent = a, i.append(e), t.push({
                    el: e,
                    wght: r,
                    w: r,
                    wd: 75,
                    owner: n
                })
            }
            e.replaceWith(i)
        }
        n.matches(`.contact__email`) && n.setAttribute(`aria-label`, i)
    }
    let n = -1e9,
        r = () => {
            for (let e of t) {
                let t = e.el.getBoundingClientRect();
                e.cx = t.left + t.width / 2 + u, e.cy = t.top + t.height / 2 + l, e.h = t.height
            }
        },
        i = () => {
            n = -1e9
        };
    return addEventListener(`resize`, i), document.fonts?.ready.then(i), document.addEventListener(`transitionend`, e => {
        e.target.closest?.(`[data-reveal]`) && i()
    }), e => {
        e - n > 4e3 && (r(), n = e);
        for (let e of t) {
            let t = e.cy - l;
            if (t < -e.h || t > innerHeight + e.h) continue;
            let n = {
                height: e.h
            },
                r = g(1 - (s.active ? Math.hypot(s.x - (e.cx - u), s.y - t) : 1e9) / Math.max(240, n.height * 1.3), 0, 1) ** 1.4,
                i = c(e.wght, 250, r),
                a = c(75, 100, r),
                o = c(e.w, i, .2),
                d = c(e.wd, a, .2);
            e.w = o, e.wd = d;
            let f = Math.round(o / 2) * 2,
                p = Math.round(d * 2) / 2;
            (f !== e.qw || p !== e.qd) && (e.qw = f, e.qd = p, e.el.style.fontVariationSettings = `"wght" ${f}, "wdth" ${p}`)
        }
    }
}

function y() {
    let e = [...document.querySelectorAll(`.buddy canvas, .socials a, .bar nav a`)].map(e => ({
        el: e,
        x: 0,
        y: 0
    }));
    return e.forEach(e => {
        e.el.closest(`.buddy`) && p.add(e.el)
    }), () => {
        e.forEach(e => {
            let t = m(e.el),
                n = d.get(e.el);
            n.mx === void 0 && (n.mx = e.x, n.my = e.y);
            let r = s.x - (t.left + t.width / 2 - n.mx),
                i = s.y - (t.top + t.height / 2 - n.my),
                a = Math.max(t.width, t.height) * .5 + 60,
                o = s.active && Math.hypot(r, i) < a,
                l = c(e.x, o ? r * .3 : 0, .2),
                u = c(e.y, o ? i * .3 : 0, .2);
            Math.abs(l - e.x) < .05 && Math.abs(u - e.y) < .05 || (e.x = l, e.y = u, e.el.style.translate = `${l.toFixed(1)}px ${u.toFixed(1)}px`)
        })
    }
}

function b() {
    let e = document.querySelector(`.about__photo`);
    if (!e) return null;
    let t = 0,
        n = 0;
    return () => {
        let r = m(e);
        if (r.bottom < 0 || r.top > innerHeight) return;
        let i = g((s.x - (r.left + r.width / 2)) / (r.width * 1.5), -1, 1),
            a = g((s.y - (r.top + r.height / 2)) / (r.height * 1.5), -1, 1);
        t = c(t, s.active ? -a * 8 : 0, .1), n = c(n, s.active ? i * 10 : 0, .1);
        let o = `rotateX(${t.toFixed(2)}deg) rotateY(${n.toFixed(2)}deg)`;
        o !== e.style.transform && (e.style.rotate = `none`, e.parentElement.style.perspective = `900px`, e.style.transform = o)
    }
}

function x() {
    let e = document.querySelector(`.clients__track`);
    if (!e) return null;
    e.style.animation = `none`;
    let t = 0,
        n = -1,
        r = 0,
        i = l,
        a = 0,
        o = e.scrollWidth / 2;
    return addEventListener(`resize`, () => {
        o = e.scrollWidth / 2
    }), document.fonts?.ready.then(() => {
        o = e.scrollWidth / 2
    }), s => {
        let u = a ? Math.min(s - a, 50) : 16;
        a = s;
        let d = l - i;
        i = l, d && (n = d > 0 ? -1 : 1), r = c(r, Math.min(Math.abs(d) * .6, 40), .1), t += n * (.04 * u + r), t <= -o && (t += o), t > 0 && (t -= o), e.style.transform = `translateX(${t.toFixed(1)}px) skewX(${(-n * r * .4).toFixed(2)}deg)`
    }
}

function S() {
    let e = document.querySelector(`.services`),
        t = e?.querySelector(`.services__list`);
    if (!e || !t || innerWidth < 760) return null;
    e.classList.add(`is-pinned`);
    let n = 0,
        r = () => {
            n = Math.max(t.scrollWidth - innerWidth, 0), e.style.height = `${innerHeight + n}px`, h()
        };
    r(), addEventListener(`resize`, r), addEventListener(`wheel`, t => {
        if (Math.abs(t.deltaX) <= Math.abs(t.deltaY)) return;
        let n = e.getBoundingClientRect(),
            r = n.top <= 1 && n.bottom >= innerHeight - 1,
            i = -n.top / Math.max(n.height - innerHeight, 1);
        !r || t.deltaX < 0 && i <= 0 || t.deltaX > 0 && i >= 1 || (t.preventDefault(), scrollBy(0, t.deltaX))
    }, {
        passive: !1
    });
    let i = e.querySelector(`.services__bg`);
    document.fonts?.ready.then(r);
    let a = -1;
    return () => {
        let r = m(e),
            o = g(-r.top / Math.max(r.height - innerHeight, 1), 0, 1);
        Math.abs(o - a) < 5e-4 || (a = o, t.style.transform = `translateX(${(-o * n).toFixed(1)}px)`, e.style.setProperty(`--p`, o.toFixed(3)), i && (i.style.transform = `translateX(${(o * 30 - 5).toFixed(2)}%)`))
    }
}

function C() {
    let e = document.querySelector(`.about`);
    if (!e) return null;
    let t = -1;
    return () => {
        let n = m(e),
            r = g((innerHeight - n.top) / (innerHeight * .7), 0, 1);
        if (Math.abs(r - t) < .001) return;
        t = r;
        let i = (1 - r) * 4;
        e.style.clipPath = `inset(0 ${i.toFixed(2)}% round ${((1 - r) * 48).toFixed(1)}px)`
    }
}
var w = 80,
    T = 11,
    E = 4,
    D = .55,
    O = 4e-5;

function k(e) {
    let t = new Uint8Array(512),
        n = e,
        r = () => (n = n * 1664525 + 1013904223 >>> 0) / 4294967296,
        i = [...Array(256).keys()].sort(() => r() - .5);
    for (let e = 0; e < 512; e++) t[e] = i[e & 255];
    let a = Float32Array.from({
        length: 256
    }, r),
        o = e => e * e * (3 - 2 * e),
        s = (e, n) => a[t[(e & 255) + t[n & 255]]],
        c = (e, t) => {
            let n = Math.floor(e),
                r = Math.floor(t),
                i = o(e - n),
                a = o(t - r),
                c = s(n, r),
                l = s(n + 1, r),
                u = s(n, r + 1),
                d = s(n + 1, r + 1);
            return c + (l - c) * i + (u - c) * a + (c - l - u + d) * i * a
        };
    return (e, t) => c(e, t) * .7 + c(e * 2.1 + 17, t * 2.1 + 31) * .3
}

function A(e) {
    let t = e.getContext(`2d`),
        n = k(1337),
        r = 0,
        i = 0,
        a = 0,
        o = 0,
        s = new Float32Array,
        c = {
            x: -1e4,
            y: -1e4,
            tx: -1e4,
            ty: -1e4,
            h: 0,
            th: 0
        };

    function l(t, n) {
        r = t, i = n, e.width = r, e.height = i, a = r / w, o = Math.ceil(i / a) + 1, s = new Float32Array(81 * (o + 1))
    }

    function u(e) {
        let t = e * O;
        for (let e = 0; e <= o; e++)
            for (let r = 0; r <= w; r++) {
                let i = n(r * .045 + t, e * .045 - t * .6);
                if (c.h > .001) {
                    let t = r * a - c.x,
                        n = e * a - c.y;
                    i += c.h * Math.exp(-(t * t + n * n) / 48400)
                }
                s[e * 81 + r] = i * T
            }
    }

    function d(e) {
        for (let n = 0; n < o; n++)
            for (let r = 0; r < w; r++) {
                let i = s[n * 81 + r],
                    o = s[n * 81 + r + 1],
                    c = s[(n + 1) * 81 + r + 1],
                    l = s[(n + 1) * 81 + r],
                    u = i > e | (o > e) << 1 | (c > e) << 2 | (l > e) << 3;
                if (u === 0 || u === 15) continue;
                let d = r * a,
                    f = n * a,
                    p = d + a * (e - i) / (o - i),
                    m = f,
                    h = d + a,
                    g = f + a * (e - o) / (c - o),
                    _ = d + a * (e - l) / (c - l),
                    v = f + a,
                    y = d,
                    b = f + a * (e - i) / (l - i);
                switch (u) {
                    case 1:
                    case 14:
                        t.moveTo(y, b), t.lineTo(p, m);
                        break;
                    case 2:
                    case 13:
                        t.moveTo(p, m), t.lineTo(h, g);
                        break;
                    case 3:
                    case 12:
                        t.moveTo(y, b), t.lineTo(h, g);
                        break;
                    case 4:
                    case 11:
                        t.moveTo(h, g), t.lineTo(_, v);
                        break;
                    case 6:
                    case 9:
                        t.moveTo(p, m), t.lineTo(_, v);
                        break;
                    case 7:
                    case 8:
                        t.moveTo(y, b), t.lineTo(_, v);
                        break;
                    case 5:
                        t.moveTo(y, b), t.lineTo(p, m), t.moveTo(h, g), t.lineTo(_, v);
                        break;
                    case 10:
                        t.moveTo(p, m), t.lineTo(h, g), t.moveTo(_, v), t.lineTo(y, b)
                }
            }
    }

    function f(e) {
        u(e), t.clearRect(0, 0, r, i);
        let n = 1 / 0,
            a = -1 / 0;
        for (let e of s) e < n && (n = e), e > a && (a = e);
        for (let e = 0; e < 2; e++) {
            t.beginPath();
            for (let t = Math.ceil(n); t <= a; t++) t % E === 0 == !!e && d(t);
            t.strokeStyle = e ? `rgba(90, 99, 48, 0.34)` : `rgba(90, 99, 48, 0.17)`, t.lineWidth = e ? 1.4 : 1, t.stroke()
        }
    }

    function p(e, t) {
        c.tx = e, c.ty = t, c.th = D
    }

    function m() {
        c.th = 0
    }
    let h = 0;

    function g(e, t = !1) {
        let n = Math.abs(c.tx - c.x) + Math.abs(c.ty - c.y) > .5 || Math.abs(c.th - c.h) > .005;
        t || e - h < (n ? 33 : 160) || (h = e, c.x < -9e3 && (c.x = c.tx, c.y = c.ty), c.x += (c.tx - c.x) * .15, c.y += (c.ty - c.y) * .15, c.h += (c.th - c.h) * .08, f(e))
    }
    return {
        resize: l,
        draw: f,
        pointer: p,
        leave: m,
        step: g
    }
}

function j() {
    let e = document.createElement(`canvas`);
    e.className = `topo`, e.setAttribute(`aria-hidden`, `true`), document.body.prepend(e);
    let t = document.documentElement.classList.contains(`motion`),
        n = matchMedia(`(hover: hover) and (pointer: fine)`).matches,
        r = () => ({
            w: innerWidth,
            h: innerHeight
        }),
        i;
    if (`transferControlToOffscreen` in e && typeof Worker < `u`) {
        let n = new Worker(new URL(`/_astro/topo.worker-B2pDw1bE.js`, `` +
            import.meta.url), {
            type: `module`
        }),
            a = e.transferControlToOffscreen();
        n.postMessage({
            type: `init`,
            canvas: a,
            animate: t,
            ...r()
        }, [a]), i = e => n.postMessage(e)
    } else {
        let n = A(e),
            {
                w: a,
                h: o
            } = r();
        n.resize(a, o), n.draw(performance.now()), i = e => {
            e.type === `resize` ? (n.resize(e.w, e.h), n.draw(performance.now())) : e.type === `pointer` ? n.pointer(e.x, e.y) : e.type === `leave` && n.leave()
        }, t && (function e(t) {
            n.step(t, document.hidden), requestAnimationFrame(e)
        })(0)
    }
    addEventListener(`resize`, () => i({
        type: `resize`,
        ...r()
    })), document.addEventListener(`visibilitychange`, () => i({
        type: `visibility`,
        hidden: document.hidden
    })), n && t && (addEventListener(`pointermove`, e => i({
        type: `pointer`,
        x: e.clientX,
        y: e.clientY
    }), {
        passive: !0
    }), document.documentElement.addEventListener(`pointerleave`, () => i({
        type: `leave`
    })))
}
j(), t(), _(), r(), i();