<script>
    let canvas;
    import { onMount } from "svelte";
    let fps = 0;
    export let y = 0;
    let S = 100;
    let m = { x: 0, y: 0 };
    let local = 100;
    $: ll =
        Math.max(local, Math.min(w, h) / 8) +
        Math.abs(50 * Math.sin((3.14 * y) / h)) +
        HS * 10;
    let damp = 0.8;
    $: dd = damp - HS * 0.05;
    $: HS = y / h;
    const margin = 5;
    let [h, w] = [0, 0];
    function handleMousemove(event) {
        m.x = event.clientX;
        m.y = event.clientY;
    }
    let redD = {};
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

                // if (a.x <= 0 || a.x >= w) {
                //     a.vx *= -2;
                // }
                // if (a.y <= 0 || a.y >= h) {
                //     a.vy *= -2;
                // }

                a.x += a.vx;
                a.y += a.vy;
                if (a.x < margin) {
                    a.vx = 1;
                    a.x = margin;
                } else if (a.x > w - margin) {
                    a.vx = -1;
                    a.x = w - margin;
                } else if (a.y < margin) {
                    a.vy = 1;
                    a.y = margin;
                } else if (a.y > h - margin) {
                    a.vy = -1;
                    a.y = h - margin;
                }
            }
        };
        canvas.style.opacity = 1;

        const draw = (x, y, c, s) => {
            ctx.fillStyle = c;
            ctx.fillRect(x - s / 2, y - s / 2, s, s);
        };

        S = Math.min(Math.min(h, w), 800);

        let white = create(S * 2.2, "white", 1);
        let red = create(S * 1.75, "red", 2);
        let blue = create(S / 1.1, "DarkTurquoise", 3);
        let purple = create(S / 4, "purple", 4);
        const times = [];

        function update() {
            const now = performance.now();
            while (times.length > 0 && times[0] <= now - 1000) {
                times.shift();
            }
            times.push(now);
            fps = times.length;
            redD = {
                red: 0.04 - 0.004 * HS + 2 * Math.sin((3.14 * 2 * y) / h),
                blue: -1 + 0.23 * HS,
                white: 0.2 - 0.09 * HS,
            };
            rule(red, red, redD.red);
            rule(red, blue, redD.blue);
            rule(red, white, redD.white);

            rule(white, white, 0.2 - 0.04 * (HS));
            rule(white, blue, -0.04 + 0.03 * (HS));
            rule(blue, white, -0.05);
            rule(blue, red, -0.2 - 0.1 * HS);

            rule(
                blue,
                blue,
                0.5 + 2 * Math.sin((3.14 * 2 * y) / h) - 0.26 * HS
            );
            rule(white, red, -0.2 - 0.12 *HS);
            rule(purple, white, -0.01 - 0.02 * HS);
            rule(white, purple, 0.02);
            rule(purple, purple, -0.1 + 0.08 * HS);
            rule(purple, red, -1 + 0.15 *HS);
            rule(purple, blue, -0.3);
            rule(blue, purple, -0.2);
            rule(red, purple, 0.4 - 0.5 * HS);

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
</script>

<div class="panel">
    F:{fps}
    R:
    {ll}
    S:
    {S}
    D:
    {dd}
    <div class="sub-panel">
        reds : {JSON.stringify(redD)}
    </div>
</div>
<svelte:window on:mousemove={handleMousemove} />
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
        backdrop-filter: blur(3px);
        border-radius: 5px;
    }
    .sub-panel {
        padding: 5px;
        background-color: rgba(255, 255, 255, 0.05);
    }
</style>
