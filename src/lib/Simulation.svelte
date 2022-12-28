<script>
    let canvas;
    import { onMount } from "svelte";
    import { draggable } from "@neodrag/svelte";
    let handle;
    let fps = 0;
    export let y = 0;
    let S = 450;
    let count;
    let local = 90;

    $: minDim =  Math.min(w, h) 
    let frameId
    $: ll =
        Math.max(local, minDim/ 10) +
        Math.abs(50 * Math.sin((3.14 * y) / h)) +
        HS * 33;
    let damp = 1;
    $: dd = damp - HS * 0.075;
    $: HS = y / h;
    $: SIN = Math.sin((3.14 * y) / h);
    $: COS = Math.cos((3.14 * y) / h);
    $: POSSIN = Math.abs(SIN)  
    $: POSCOS = Math.abs(COS)  
    const  margin = 5 ;
    $: push = margin + Math.min(100, minDim / 4)*Math.abs(SIN)
    let [h, w] = [0, 0];

    let RD = {};
    let WD = {};
    let BD = {};
    let PD = {};
    const setup = () => {
        h = window.innerHeight;
        w = window.innerWidth;

        canvas.height = h;
        canvas.width = w;

        const ctx = canvas.getContext("2d", { alpha: false });
        const dpr = window.devicePixelRatio;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
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
                    if (d > 0 && d < ll + b.s * (1+b.s)) {
                        let F = (g * 1) / d;
                        F = F * dd;
                        fx += F * dx;
                        fy += F * dy;
                    }
                }
                const scaler = Math.max(a.s * damp, 1);
                a.vx = (a.vx / scaler + fx) * .5;
                a.vy = (a.vy / scaler + fy) * .5;

                a.x += a.vx;
                a.y += a.vy;
                if (a.x < margin) {
                    a.vx = a.vx + push;
                    a.x = margin;
                } else if (a.x > w - margin) {
                    a.vx = a.vx - push;
                    a.x = w - margin;
                } else if (a.y < margin) {
                    a.vy = a.vy + push;
                    a.y = margin;
                } else if (a.y > h - margin) {
                    a.vy = a.vy - push;
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

        let white = create(scaleX * 2.65, "white", 1);
        let red = create(scaleX * 1.85, "red", 2);
        let blue = create(scaleX / 1.1, "DarkTurquoise", 3);
        let purple = create(scaleX / 6, "purple", 4);
        const times = [];
        count = points.length
        function update() {
            const now = performance.now();
            while (times.length > 0 && times[0] <= now - 1000) {
                times.shift();
            }
            times.push(now);
            fps = times.length;
            RD = {
                r: 0.04  + POSSIN + 0.1 * HS,
                b: -1 - 0.23 * HS,
                w: 0.2 - 0.09 * HS,
                p: 0.4 - 0.2 * HS,
            };
            WD = {
                r: -0.2 - 0.12 * HS,
                b: 0.04 - 0.03 * HS,
                w: 0.25 + POSSIN+.15*COS,
                p: -0.02+.05*HS,
            };
            BD = {
                r: -0.2 - 0.1 * HS,
                b: 0.5 + POSSIN - 0.05 * HS,
                w: -0.05+0.03*HS,
                p: -0.2,
            };
            PD = {
                r: -1 + 0.15 * HS,
                b: -0.3,
                w: -0.01 - 0.02 * HS,
                p: 0.2 + 2* HS +  POSSIN,
            };
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
            rule(purple, white, PD.w);
            rule(purple, purple, PD.p);
            rule(purple, red, PD.r);
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

         frameId = requestAnimationFrame(update);

        return () => {
            cancelAnimationFrame(frameId);
        };
    }
    onMount(setup);

    const lim = (o) =>
        typeof o === "object" && o !== null
            ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, lim(v)]))
            : Math.round(o * 100) / 100;
</script>

<div class="panel" use:draggable={{ handle }}>
    <div bind:this={handle} >here</div>
    <span>
    <button on:click={()=>{  cancelAnimationFrame(frameId); setup()}}>redo</button>
</span>
<span>
    FPS:{fps}
</span>
<span>
    R:
    {lim(ll)}
    <input type=range bind:value={local} min=0 max=200 step=1>
</span>
<span>
    S:
    {lim(count)}
    <input type=range bind:value={S} min=100 max=1000 step=10>
</span>
<span>
    D:
    {lim(dd)}
    <input type=range bind:value={damp} min=-1 max=1 step=".025">
</span>
<span>
    sin:
    {lim(SIN)}
</span>

<span>
    cos:
    {lim(COS)}
</span>
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
        display: flex;
        flex-direction: column;

    }
    .sub-panel {
        padding: 5px;
        background-color: rgba(255, 255, 255, 0.05);
        display: flex;
        flex-direction: column;
    }
    .sub-panel > span {
    }
</style>
