<script>
    let canvas;
    import { onMount } from "svelte";
    
    export let y = 0;
    let S = 100
    let m = { x: 0, y: 0 };
    let local = 100;
    $: ll =lim(
        Math.max(local, Math.min(w, h) / 8) +
        Math.abs(50 * Math.sin((3.14 * y) / h)) +
        (y / h) * 10)
    let damp = 0.9;
    $: dd = lim(damp - (y/h)*.05)
    const margin = 5;
    let [h, w] = [0, 0];
    function handleMousemove(event) {
        m.x = event.clientX;
        m.y = event.clientY;
    }
const lim = (num) => Math.round(num * 100) / 100
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
            g = lim(g)
            for (let i = 0; i < atoms1.length; i++) {
                let fx = 0;
                let fy = 0;
                let a = atoms1[i];
                // if(i==0){
                //     let fg = qtree.query(new Circle(a.x,a.y,local))
                //     console.log(fg)
                // }

                for (let j = 0; j < atoms2.length; j++) {
                    let b = atoms2[j];
                    let dx = a.x - b.x;
                    let dy = a.y - b.y;
                    let d = lim(Math.sqrt(dx * dx + dy * dy))
                    if (d > 0 && d < ll + b.s*5) {
                        let F = (g * 1) / d;
                        F = F * dd;
                        fx += F * dx;
                        fy += F * dy;
                    }
                }
                const scaler = Math.max(a.s * damp, 1);
                a.vx = (a.vx / scaler + fx) * 0.5;
                a.vy = (a.vy / scaler + fy) * 0.5;

                if (a.x <= 0 || a.x >= w) {
                    a.vx *= -2;
                }
                if (a.y <= 0 || a.y >= h) {
                    a.vy *= -2;
                }

                a.x += a.vx;
                a.y += a.vy;
                if (a.x < margin) {
                    a.vx = 1;
                    a.x = margin;
                }
                if (a.x > w - margin) {
                    a.vx = -1;
                    a.x = w - margin;
                }
                if (a.y < margin) {
                    a.vy = 1;
                    a.y = margin;
                }
                if (a.y > h - margin) {
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

        S = Math.min(Math.min(h, w), 800) + 200;

        let white = create(S * 2.1, "white", 1);
        let red = create(S * 1.75, "red", 2);
        let blue = create(S, "DarkTurquoise", 3);
        let purple = create(S / 4, "purple", 4);


        function update() {
            rule(
                red,
                red,
                0.04 - 0.01 * (y / h) + 2 * Math.sin(((3.14 * 2 * y) / h) * 2)
            );
            rule(white, white, 0.2 - 0.09 * (y / h));
            rule(white, blue, -0.04 + 0.03 * (y / h));
            rule(blue, white, -0.05);
            rule(blue, red, -0.2 - 0.1 * (y / h));
            rule(red, blue, -1 + 0.23 * (y / h));
            rule(
                blue,
                blue,
                0.5 + 2 * Math.sin((3.14 * 2 * y) / h) - 0.4 * (y / h)
            );
            rule(white, red, -0.2 - 0.12 * (y / h));
            rule(red, white, 0.2 - 0.09 * (y / h));
            rule(purple, white, -0.01 - 0.02 * (y / h));
            rule(white, purple, 0.02);
            rule(purple, purple, -0.1 + 0.08 * (y / h));
            rule(purple, red, -1+ 0.15 * (y / h));
            rule(purple, blue, -0.3);
            rule(blue, purple, -0.2);
            rule(red, purple, 0.4 - 0.5 * (y / h));

            ctx.fillStyle = "rgb(11,11,11)";
            ctx.fillRect(0, 0, w, h);

            for (let i = 0; i < points.length; i++) {
                const p = points[i];
                draw(p.x - p.s / 2, p.y - p.s / 2, p.c, p.s);
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
    R:
    {ll}
    S:
    {S}
    D:
    {dd}
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
</style>
