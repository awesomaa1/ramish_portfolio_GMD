var e = {
        count: 65,
        width: 648,
        height: 720,
        front: 32,
        background: `#26100C`
    },
    t = 220,
    n = 3500,
    r = matchMedia(`(prefers-reduced-motion: reduce)`).matches,
    i = matchMedia(`(hover: hover) and (pointer: fine)`).matches,
    a = e.count - 1,
    o = [],
    s = t => t < 0 ? e.front * (1 + t) : e.front + (a - e.front) * t;

function c(n, {
    set: r,
    eyeLine: i,
    eager: c = !0,
    step: l = 1,
    headBottom: u = 1
}) {
    let d = n.getContext(`2d`),
        f = Array(e.count),
        p = e => {
            if (f[e]) return f[e];
            let t = new Image;
            t.src = `/seek/${r}/${String(e).padStart(3,`0`)}.webp`;
            f[e] = t;
            return t;
        },
        m = e => f[e] ?.complete && f[e].naturalWidth > 0,
        h = 0,
        g = !0,
        _ = -1,
        v = 0,
        y = !1,
        b = 0,
        x = !1;

    function S() {
        let t = f[e.front],
            r = t ?.naturalWidth,
            i = t ?.naturalHeight;
        r && i && (n.width !== r || n.height !== i) && (n.width = r, n.height = i, _ = -1)
    }

    function C(t = !1) {
        let r = s(v);
        if (!t && (!g || Math.abs(r - _) < .005)) return;
        let i = e.front + Math.floor((r - e.front) / l) * l;
        i = Math.max(0, Math.min(i, a));
        let o = Math.min(i + l, a),
            c = o > i ? (r - i) / (o - i) : 0;
        if (m(i) || (i = o), !m(i)) return;
        _ = r;
        let u = n.width,
            p = n.height;
        d.clearRect(0, 0, u, p);
        d.globalAlpha = 1;
        d.drawImage(f[i], 0, 0, u, p);
        if (c > .04 && o !== i && m(o)) {
            d.globalAlpha = c;
            d.drawImage(f[o], 0, 0, u, p);
            d.globalAlpha = 1;
        }
    }

    function w(e) {
        let n = b ? Math.min(e - b, 50) : 16;
        b = e, v += (h - v) * (1 - Math.exp(-n / t)), C(), Math.abs(h - v) > .001 ? requestAnimationFrame(w) : y = !1
    }

    function T(e) {
        h = Math.max(-1, Math.min(1, e)), y || (y = !0, b = 0, requestAnimationFrame(w))
    }
    let E = null,
        D = 0;
    addEventListener(`resize`, () => {
        E = null
    });

    function O(e) {
        let t = performance.now();
        if (!E || t - D > 3e3) {
            let e = n.getBoundingClientRect();
            E = e.width ? e.left + e.width / 2 : null, D = t
        }
        if (E === null) return;
        let r = E;
        T(e < r ? (e - r) / Math.max(r, 1) : (e - r) / Math.max(innerWidth - r, 1))
    }

    function k() {
        if (!x) {
            x = !0;
            for (let t = l; t <= a + l; t += l) e.front - t >= 0 && p(e.front - t), e.front + t <= a && p(e.front + t);
            p(0), p(a)
        }
    }
    let initFront = p(e.front);
    let initDraw = () => {
        S();
        C(!0);
        n.classList.add(`is-ready`);
        if (c) {
            let e = () => `requestIdleCallback` in window ? requestIdleCallback(k, {
                timeout: 1500
            }) : setTimeout(k, 300);
            document.readyState === `complete` ? e() : addEventListener(`load`, e, {
                once: !0
            })
        }
        new IntersectionObserver(([e]) => {
            let t = e.boundingClientRect,
                n = g;
            g = e.isIntersecting && t.top + t.height * u > 0, g && !n && C(!0)
        }, {
            threshold: Array.from({
                length: 21
            }, (e, t) => t / 20)
        }).observe(n)
    };
    if (initFront.complete && initFront.naturalWidth > 0) {
        initDraw();
    } else {
        initFront.onload = initDraw;
        if (initFront.decode) {
            initFront.decode().then(initDraw).catch(initDraw);
        }
    }
    let A = {
        canvas: n,
        lookAt: T,
        lookAtPoint: O,
        loadAll: k,
        eyeLine: i
    };
    return o.push(A), A
}
var l = 0;

function u(e) {
    for (let t of o) t.lookAtPoint(e);
    clearTimeout(l), l = setTimeout(() => o.forEach(e => e.lookAt(0)), n)
}

function d() {
    let e = e => u(e.clientX);
    if (i ? (addEventListener(`pointermove`, e, {
            passive: !0
        }), document.documentElement.addEventListener(`pointerleave`, () => o.forEach(e => e.lookAt(0)))) : (addEventListener(`pointerdown`, e, {
            passive: !0
        }), addEventListener(`pointermove`, e, {
            passive: !0
        })), addEventListener(`focusin`, e => {
            let t = e.target.getBoundingClientRect ?.();
            t && t.bottom > 0 && t.top < innerHeight && u(t.left + t.width / 2)
        }), !i && !r) {
        let e = [-.8, 0, .7, 0, .5, 0],
            t = 0;
        setInterval(() => {
            document.hidden || o.forEach(n => n.lookAt(e[t % e.length])), t++
        }, 2400)
    }
}
var f = document.querySelector(`.face`);
if (f) {
    let t = f.getBoundingClientRect().height * (window.devicePixelRatio || 1) > e.height * 1.1,
        n = innerWidth <= 760;
    c(f, {
        set: `hd`,
        eyeLine: .3,
        step: n ? 3 : 1,
        headBottom: .55
    })
}
var p = document.querySelector(`.buddy`);
if (p) {
    let e = c(p.querySelector(`canvas`), {
        set: `mini`,
        eyeLine: .45,
        eager: !f,
        step: 2
    });
    f ? new IntersectionObserver(([t]) => {
        let n = !t.isIntersecting;
        p.classList.toggle(`is-shown`, n), n && e.loadAll()
    }, {
        threshold: .15
    }).observe(f) : p.classList.add(`is-shown`)
}
d();