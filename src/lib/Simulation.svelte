<script>
    let canvas;
    import { onMount } from "svelte";
    let fps = 0;
    export let y = 0;
    let S = 700;
    let m = { x: 0, y: 0 };
    let local = 90;
    $: ll =
        Math.max(local, Math.min(w, h) / 8) +
        Math.abs(50 * Math.sin((3.14 * y) / h)) +
        HS * 15;
    let damp = 0.8;
    $: dd = damp - HS * 0.05;
    $: HS = y / h;
    $: SIN = Math.sin(3.14*y/h)
    const margin = 5;
    let [h, w] = [0, 0];
    // function handleMousemove(event) {
    //     m.x = event.clientX;
    //     m.y = event.clientY;
    // }
    let RD = {};
    let WD = {};
    let BD = {};
    let PD = {};
    onMount(() => {
        h = window.innerHeight;
        w = window.innerWidth;

        canvas.height = h;
        canvas.width = w;

        const ctx = canvas.getContext("2d", { alpha: false });
        const dpr = window.devicePixelRatio;
        const rect = canvas.getBoundingClientRect();

        // Set the "actual" size of the canvas
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        // Scale the context to ensure correct drawing operations
        ctx.scale(dpr, dpr);

        let points = [];
        const point = (x, y, c, s) => {
            return {
                x: x,
                y: y,
                vx: 20 * Math.random() - 10,
                vy: 20 * Math.random() - 10,
                c: c,
                s: s,
            };
        };
        const create = (n, c, s = 3.5) => {
            let group = [];
            for (let i = 0; i < n; i++) {
                group.push(
                    point(
                        Math.random() * (w - 100) + 50,
                        Math.random() * (h - 100) + 50,
                        c,
                        Math.random() * 0.5 + s
                    )
                );
                points.push(group[i]);
                // qtree.insert(new Point(group[i].x, group[i].y, c));
            }
            return group;
        };
        const rule = (atoms1, atoms2, g) => {
            for (let i = 0; i < atoms1.length; i++) {
                let fx = 0;
                let fy = 0;
                let a = atoms1[i];
                for (let j = 0; j < atoms2.length; j++) {
                    let b = atoms2[j];
                    let dx = a.x - b.x;
                    let dy = a.y - b.y;
                    let d = Math.sqrt(dx * dx + dy * dy);
                    if (d > 0 && d < ll + b.s * 5) {
                        let F = (g * 1) / d;
                        F = F * dd;
                        fx += F * dx;
                        fy += F * dy;
                    }
                }
                const scaler = Math.max(a.s * damp, 1);
                a.vx = (a.vx / scaler + fx) * 0.5;
                a.vy = (a.vy / scaler + fy) * 0.5;


                a.x += a.vx;
                a.y += a.vy;
                if (a.x < margin) {
                    a.vx = a.vx + 20;
                    a.x = margin;
                } else if (a.x > w - margin) {
                    a.vx = a.vx - 20;
                    a.x = w - margin;
                } else if (a.y < margin) {
                    a.vy = a.vy + 20;
                    a.y = margin;
                } else if (a.y > h - margin) {
                    a.vy = a.vy - 20;
                    a.y = h - margin;
                }
            }
        };
        canvas.style.opacity = 1;

        const draw = (x, y, c, s) => {
            ctx.fillStyle = c;
            ctx.fillRect(x - s / 2, y - s / 2, s, s);
        };

        const scaleX = Math.min(Math.min(h, w), S);

        let white = create(scaleX * 2.4, "white", 1);
        let red = create(scaleX * 1.8, "red", 2);
        let blue = create(scaleX / 1.1, "DarkTurquoise", 3);
        let purple = create(scaleX / 5, "purple", 4);
        const times = [];

        function update() {
            const now = performance.now();
            while (times.length > 0 && times[0] <= now - 1000) {
                times.shift();
            }
            times.push(now);
            fps = times.length;
            RD = {
                r: 0.04 - 0.004 * HS + 2 * SIN,
                b: -1 + 0.23 * HS,
                w: 0.2 - 0.09 * HS,
                p: 0.4 - 0.5 * HS,
            };
            WD = {
                r: -0.2 - 0.12 * HS,
                b: -0.04 + 0.03 * HS,
                w: 0.2 - 0.04 * HS,
                p: 0.02,
            };
            BD = {
                r: -0.2 - 0.1 * HS,
                b: 0.5 + 2 * SIN - 0.26 * HS,
                w: -0.05,
                p: -0.2,
            };
            PD = {
                r:-1 + 0.15 * HS,
                b:-0.3,
                w:-0.01 - 0.02 * HS,
                p:-0.1 + 0.08 * HS
            }
            rule(red, red, RD.r);
            rule(red, blue, RD.b);
            rule(red, white, RD.w);
            rule(red, purple, RD.p);
            rule(white, red, WD.r);
            rule(white, blue, WD.b);
            rule(white, white, WD.w);
            rule(white, purple, WD.p);
            rule(blue, white, BD.w);
            rule(blue, red, BD.r);
            rule(blue, blue, BD.b);
            rule(blue, purple, BD.p);

            rule(purple, white, PD.w );
            rule(purple, purple,PD.p );
            rule(purple, red,PD.r );
            rule(purple, blue, PD.b);

            ctx.fillStyle = "rgb(11,11,11)";
            ctx.fillRect(0, 0, w, h);

            for (let i = 0; i < points.length; i++) {
                const p = points[i];
                draw(p.x, p.y, p.c, p.s);
            }

            ctx.save();
            frameId = requestAnimationFrame(update);
        }

        let frameId = requestAnimationFrame(update);

        return () => {
            cancelAnimationFrame(frameId);
        };
    });

    const lim = (o) =>
        typeof o === "object" && o !== null
            ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, lim(v)]))
            : Math.round(o * 100) / 100;
</script>

<div class="panel">
    F:{fps}
    R:
    {lim(ll)}
    S:
    {lim(S)}
    D:
    {lim(dd)}
    Sin:
    {lim(SIN)}
    <div class="sub-panel">
        <span>
        red : {JSON.stringify(lim(RD))}
    </span>
    <span>
        white : {JSON.stringify(lim(WD))}
    </span>
    <span>
        
        blue : {JSON.stringify(lim(BD))}

    </span>
    <span>
        purple : {JSON.stringify(lim(PD))}
    </span>
    </div>
</div>
<!-- <svelte:window on:mousemove={handleMousemove} /> -->
<canvas bind:this={canvas} />

<style>
    canvas {
        position: absolute;
        top: 0px;
        width: 100%;
        height: 100%;
        z-index: 0;
        opacity: 0;
        transition: 0.3s ease-in;
    }
    .panel {
        color: white;
        position: fixed;
        bottom: 5px;
        right: 5px;
        z-index: 7;
        opacity: 1;
        padding: 10px;
        border-radius: 5px;
    }
    .sub-panel {
        padding: 5px;
        background-color: rgba(255, 255, 255, 0.05);
        display:flex;
        flex-direction: column;
    }
    .sub-panel > span{

    }
</style>
