<script>
    let canvas;
    import { onMount } from "svelte";
    import { draggable } from "@neodrag/svelte";
    import { Y } from "$lib/store";

    let showDebugger = false;
    let fps = 0;
    let S = 500;
    let count = 0;
    let local = 85;
    $: minDim = Math.min(w, h);
    let frameId = null;
    $: ll = local + minDim / 100 + POSSIN + HS * 30;
    let damp = 0.95;
    $: dd = damp - HS * 0.06 - 0.4 * POSSIN;
    $: HS = $Y / h;
    $: SIN = Math.sin((3.14 * $Y) / h);
    $: COS = Math.cos((3.14 * $Y) / h);
    $: POSSIN = Math.abs(SIN);
    $: POSCOS = Math.abs(COS);
    let margin = 5;
    $: push = margin + Math.max(100, minDim / 4) * Math.abs(SIN);
    let [h, w] = [0, 0];
    const [R, W, B, P, BG] = ["red", "white", "cyan", "purple", "black"];
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
                    if (d > 0 && d < ll + b.s * b.s) {
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

        let white = create(scaleX * 2.5, W, 1);
        let red = create(scaleX * 1.75, R, 2);
        let blue = create(scaleX / 1, B, 3);
        let purple = create(scaleX / 6, P, 4);
        const times = [];
        count = points.length;
        function update() {
            const now = performance.now();
            while (times.length > 0 && times[0] <= now - 1000) {
                times.shift();
            }
            times.push(now);
            fps = times.length;
            RD = {
                r: 0.1 + -1 * POSSIN + 0.05 * HS,
                b: -1 - 0.23 * HS,
                w: 0.2 - 0.09 * HS,
                p: 0.4 - 0.2 * HS,
            };
            WD = {
                r: -0.2 - 0.08 * HS,
                b: 0.04 + 0.03 * HS,
                w: 0.25 + POSSIN + 0.15 * COS,
                p: -0.02 + 0.05 * HS,
            };
            BD = {
                r: -0.2 - 0.1 * HS,
                b: 0.5 + POSSIN - 0.025 * HS,
                w: -0.07 + 0.05 * HS,
                p: -0.2,
            };
            PD = {
                r: -1 + 0.15 * HS,
                b: -0.4 + HS * 0.075,
                w: -0.1 + 0.1 * HS,
                p: 0.2 + 0.5 * HS + POSSIN,
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

            ctx.fillStyle = BG;
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
    };
    onMount(setup);

    const lim = (o) =>
        typeof o === "object" && o !== null
            ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, lim(v)]))
            : Math.round(o * 100) / 100;
    const restart = () => {
        cancelAnimationFrame(frameId);
        setup();
    };
    const reset = () => {
        S = 500;
        local = 85;
        damp = 0.95;
        margin = 5;
    };
</script>

<button
    class:fade={HS >= 0.7}
    class="setting"
    on:click={() => (showDebugger = true)}
    style={`animation-duration:${20 + HS * 5}s`}
>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-settings"
        ><circle cx="12" cy="12" r="3" /><path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
        /></svg
    >
</button>
{#if showDebugger}
    <div class="panel" use:draggable={{ handle: ".handle" }}>
        <div class="handle">
            <h3>Debugger Panel</h3>
            <button on:click={() => (showDebugger = false)}>X</button>
        </div>
        <div class="sub-panel">
            <span style="text-align: center;">
                FPS:{fps}

                sin:
                {lim(SIN)}

                cos:
                {lim(COS)}
            </span>
            <span>
                <label for="R">
                    Base Radius:
                    {lim(ll)}
                </label>
                <input
                    type="range"
                    bind:value={local}
                    min="0"
                    max="200"
                    step="1"
                    name="R"
                />
            </span>
            <span>
                <label for="N">
                    Num of particles:
                    {lim(count)}
                </label>
                <input
                    type="range"
                    bind:value={S}
                    min="100"
                    max="1000"
                    step="10"
                    name="N"
                />
            </span>
            <span>
                <label for="D">
                    Force Multiplier:
                    {lim(dd)}
                </label>
                <input
                    type="range"
                    bind:value={damp}
                    min="-1"
                    max="3"
                    step=".01"
                    name="D"
                />
            </span>
            <span>
                <label for="M">
                    Margin:
                    {lim(margin)}
                </label>
                <input
                    type="range"
                    bind:value={margin}
                    min="0"
                    max={minDim / 2.1}
                    step="1"
                    name="M"
                />
            </span>

            <span>
                r : {JSON.stringify(lim(RD))}
            </span>
            <span>
                w : {JSON.stringify(lim(WD))}
            </span>
            <span>
                b : {JSON.stringify(lim(BD))}
            </span>
            <span>
                p : {JSON.stringify(lim(PD))}
            </span>
        </div>
        <span class="btns">
            <button on:click={restart}>Restart</button>
            <button on:click={reset}>Reset</button>
        </span>
    </div>
{/if}
<!-- <svelte:window on:mousemove={handleMousemove} /> -->
<canvas bind:this={canvas} />

<style>
    .setting {
        position: fixed;
        right: 5px;
        bottom: 5px;
        z-index: 20;
        padding: 0px;
        margin: 0px;
        transition: 0.4s ease-in-out;
        opacity: 1;
        animation: rotation 20s infinite linear;
    }
    .fade {
        opacity: 0.25;
        animation: rotation 40s infinite linear;
    }
    .setting:hover {
        opacity: 1 !important;
    }
    .setting {
        background: none;
        color: white;
        stroke-width: 1.5;
        border: none;
    }
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
        border-radius: 15px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        background-color: rgba(0, 0, 0, 0.1);
        font-family: "Space Mono", monospace;
        font-size: 0.75rem;
        -webkit-backdrop-filter: blur(4px);
        backdrop-filter: blur(4px);
    }
    .sub-panel {
        padding: 5px;
        display: flex;
        flex-direction: column;
    }
    .sub-panel > span {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 5px;
    }
    .handle {
        background: rgba(255, 255, 255, 0.15);
        padding: 5px;
        min-width: 100%;
        text-align: center;
        cursor: grab;
        position: relative;
    }
    .handle:focus {
        cursor: grabbing;
    }
    .btns {
        flex-direction: row !important;
        flex-wrap: nowrap;
    }
    .handle > button {
        padding: 0px;
        height: 20px;
        width: 20px;
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translate3d(0, -10px, 0);
        margin: 0px;
        background: none;
        border: none;
        color: white;
    }
    .handle > h3 {
        font-size: 1.1rem;
    }
    input[type="range"] {
        margin-top: 6px;
    }
    @keyframes rotation {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(359deg);
        }
    }
</style>
