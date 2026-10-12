(function() {
    function e(e) {
        let t = /* @__PURE__ */ new Uint8Array(512),
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

    function t(t) {
        let n = t.getContext(`2d`),
            r = e(1337),
            i = 0,
            a = 0,
            o = 0,
            s = 0,
            c = /* @__PURE__ */ new Float32Array,
            l = {
                x: -1e4,
                y: -1e4,
                tx: -1e4,
                ty: -1e4,
                h: 0,
                th: 0
            };

        function u(e, n) {
            i = e, a = n, t.width = i, t.height = a, o = i / 80, s = Math.ceil(a / o) + 1, c = new Float32Array(81 * (s + 1))
        }

        function d(e) {
            let t = e * 4e-5;
            for (let e = 0; e <= s; e++)
                for (let n = 0; n <= 80; n++) {
                    let i = r(n * .045 + t, e * .045 - t * .6);
                    if (l.h > .001) {
                        let t = n * o - l.x,
                            r = e * o - l.y;
                        i += l.h * Math.exp(-(t * t + r * r) / 48400)
                    }
                    c[e * 81 + n] = i * 11
                }
        }

        function f(e) {
            for (let t = 0; t < s; t++)
                for (let r = 0; r < 80; r++) {
                    let i = c[t * 81 + r],
                        a = c[t * 81 + r + 1],
                        s = c[(t + 1) * 81 + r + 1],
                        l = c[(t + 1) * 81 + r],
                        u = i > e | (a > e) << 1 | (s > e) << 2 | (l > e) << 3;
                    if (u === 0 || u === 15) continue;
                    let d = r * o,
                        f = t * o,
                        p = d + o * (e - i) / (a - i),
                        m = f,
                        h = d + o,
                        g = f + o * (e - a) / (s - a),
                        _ = d + o * (e - l) / (s - l),
                        v = f + o,
                        y = d,
                        b = f + o * (e - i) / (l - i);
                    switch (u) {
                        case 1:
                        case 14:
                            n.moveTo(y, b), n.lineTo(p, m);
                            break;
                        case 2:
                        case 13:
                            n.moveTo(p, m), n.lineTo(h, g);
                            break;
                        case 3:
                        case 12:
                            n.moveTo(y, b), n.lineTo(h, g);
                            break;
                        case 4:
                        case 11:
                            n.moveTo(h, g), n.lineTo(_, v);
                            break;
                        case 6:
                        case 9:
                            n.moveTo(p, m), n.lineTo(_, v);
                            break;
                        case 7:
                        case 8:
                            n.moveTo(y, b), n.lineTo(_, v);
                            break;
                        case 5:
                            n.moveTo(y, b), n.lineTo(p, m), n.moveTo(h, g), n.lineTo(_, v);
                            break;
                        case 10:
                            n.moveTo(p, m), n.lineTo(h, g), n.moveTo(_, v), n.lineTo(y, b)
                    }
                }
        }

        function p(e) {
            d(e), n.clearRect(0, 0, i, a);
            let t = 1 / 0,
                r = -1 / 0;
            for (let e of c) e < t && (t = e), e > r && (r = e);
            for (let e = 0; e < 2; e++) {
                n.beginPath();
                for (let n = Math.ceil(t); n <= r; n++) n % 4 == 0 == !!e && f(n);
                n.strokeStyle = e ? `rgba(90, 99, 48, 0.34)` : `rgba(90, 99, 48, 0.17)`, n.lineWidth = e ? 1.4 : 1, n.stroke()
            }
        }

        function m(e, t) {
            l.tx = e, l.ty = t, l.th = .55
        }

        function h() {
            l.th = 0
        }
        let g = 0;

        function _(e, t = !1) {
            let n = Math.abs(l.tx - l.x) + Math.abs(l.ty - l.y) > .5 || Math.abs(l.th - l.h) > .005;
            t || e - g < (n ? 33 : 160) || (g = e, l.x < -9e3 && (l.x = l.tx, l.y = l.ty), l.x += (l.tx - l.x) * .15, l.y += (l.ty - l.y) * .15, l.h += (l.th - l.h) * .08, p(e))
        }
        return {
            resize: u,
            draw: p,
            pointer: m,
            leave: h,
            step: _
        }
    }
    let n = null,
        r = !0,
        i = !1,
        a = e => {
            n.step(e, i), requestAnimationFrame(a)
        };
    self.onmessage = ({
        data: e
    }) => {
        if (e.type === `init`) n = t(e.canvas), r = e.animate, n.resize(e.w, e.h), n.draw(performance.now()), r && requestAnimationFrame(a);
        else if (n) e.type === `resize` ? (n.resize(e.w, e.h), n.draw(performance.now())) : e.type === `pointer` ? n.pointer(e.x, e.y) : e.type === `leave` ? n.leave() : e.type === `visibility` && (i = e.hidden);
        else return
    }
})();