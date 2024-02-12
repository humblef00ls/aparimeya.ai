<script>
    let canvas;
    import { onMount } from "svelte";
    import { draggable } from "@neodrag/svelte";
    import { Y, V } from "$lib/store";
    let paused = false;
    let showDebugger = false;
    let fps = 0;
    let S = 350;
    let Sd = S;
    let count = 0;
    let scaler = 2;
    let local = 90;
    $: minDim = Math.min(w, h);
    let frameId = null;
    $: ll = local + minDim / 100 + POSSIN + HS * 4;
    let damp = 0.95;
    $: dd = damp - HS * 0.05 + 0.4 * POSSIN;
    $: HS = $Y / h;
    $: SIN = Math.sin((3.14 * $Y) / h);
    $: COS = Math.cos((3.14 * $Y) / h);
    $: POSSIN = Math.abs(SIN);
    $: POSCOS = Math.abs(COS);
    let margin = 5;
    let scaleX;
    $: push = margin + Math.max(100, minDim / 4) * Math.abs(SIN);
    let [h, w] = [0, 0];
    const [R, W, B, P, BG] = ["red", "white", "cyan", "purple", "black"];
    let _RD = {};
    let _WD = {};
    let _BD = {};
    let _PD = {};
    $: if (Math.abs(S - Sd) > 0) {
        Sd = S;
        cancelAnimationFrame(frameId);
        setup();
    }
    let points = [];
    let [white, red, blue, purple] = [[], [], [], []];

    let editable = {
        R: JSON.stringify({
            r: "0.3 + 0.5 * COS",
            b: "-1 - 0.23 * HS + 5 * SIN",
            w: "0.2 - 0.07 * HS",
            p: "-0.64 - 0.09 * HS",
        }),
        W: JSON.stringify({
            r: "0.03 + 0.5 * COS",
            b: "0.12 - 0.09 * HS",
            w: "0.25 + POSSIN + 0.15 * COS",
            p: "-0.2 + 0.5 * HS",
        }),
        B: JSON.stringify({
            r: "-0.2 - 0.1 * HS",
            b: "0.15 + 0.33 * POSCOS + 0.02 * HS",
            w: "-0.07 + 0.05 * HS",
            p: "-0.6",
        }),
        P: JSON.stringify({
            r: "-1 + 0.15 * HS",
            b: "-0.4 + HS * 0.075",
            w: "-0.1 + 0.1 * HS",
            p: "1 + 1.25 * HS + 4 * POSSIN",
        }),
    };

    const setup = (keepPos = false) => {
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

        const point = (x, y, c, s) => {
            return {
                x: x,
                y: y,
                vx: 100 * Math.random() - 50,
                vy: 100 * Math.random() - 50,
                c: c,
                s: s,
            };
        };
        const create = (n, c, s = 3.5) => {
            let group = [];
            for (let i = 0; i < n; i++) {
                group.push(
                    point(
                        Math.random() * (w - w / 3) + w / 6,
                        Math.random() * (h - h / 3) + h / 6,
                        c,
                        Math.random() * 0.5 + s,
                    ),
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

                a.vx = (a.vx / (scaler + a.s) + fx) * 0.5;
                a.vy = (a.vy / (scaler + a.s) + fy) * 0.5;

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

        const draw = (x, y, c, s) => {
            ctx.fillStyle = c;
            ctx.fillRect(x - s / 2, y - s / 2, s, s);
        };

        const evaluateExpression = (expression, variables) => {
            try {
                const cos = COS;
                const sin = SIN;
                const hs = HS;
                const poscos = POSCOS;
                const possin = POSSIN;
                return eval(expression.toLowerCase());
            } catch (e) {
                console.error("Error evaluating expression:", e, variables);
                return 0.0;
            }
        };

        scaleX = S;

        if (!keepPos || white.length == 0) {
            points = [];
            white = create(scaleX * 1.5, W, 1.5);
            red = create(scaleX * 1.2, R, 2.5);
            blue = create(scaleX/1.2, B, 3.25);
            purple = create(scaleX / 1.75 / 7, P, 5);
        }

        const times = [];
        count = points.length;

        function update() {
            const now = performance.now();
            while (times.length > 0 && times[0] <= now - 1000) {
                times.shift();
            }
            times.push(now);
            fps = times.length;
            let RR,
                RB,
                RW,
                RP,
                BR,
                BB,
                BW,
                BP,
                WR,
                WB,
                WW,
                WP,
                PR,
                PB,
                PW,
                PP = 0.0;

            try {
                const variables = {
                    COS: COS, // Assuming COS is defined somewhere in your code
                    HS: HS, // Assuming HS is defined somewhere in your code
                    SIN: SIN,
                };

                const R_JSON = JSON.parse(editable.R);
                RR = evaluateExpression(R_JSON.r, variables);
                RB = evaluateExpression(R_JSON.b, variables);
                RW = evaluateExpression(R_JSON.w, variables);
                RP = evaluateExpression(R_JSON.p, variables);
                const B_JSON = JSON.parse(editable.B);
                BR = evaluateExpression(B_JSON.r, variables);
                BB = evaluateExpression(B_JSON.b, variables);
                BW = evaluateExpression(B_JSON.w, variables);
                BP = evaluateExpression(B_JSON.p, variables);
                const W_JSON = JSON.parse(editable.W);
                WR = evaluateExpression(W_JSON.r, variables);
                WB = evaluateExpression(W_JSON.b, variables);
                WW = evaluateExpression(W_JSON.w, variables);
                WP = evaluateExpression(W_JSON.p, variables);
                const P_JSON = JSON.parse(editable.R);
                PR = evaluateExpression(P_JSON.r, variables);
                PB = evaluateExpression(P_JSON.b, variables);
                PW = evaluateExpression(P_JSON.w, variables);
                PP = evaluateExpression(P_JSON.p, variables);
            } catch (e) {
                console.log(e);
            }

            _RD = {
                r: RR,
                b: RB,
                w: RW,
                p: RP,
            };
            _WD = {
                r: WR,
                b: WB,
                w: WW,
                p: WP,
            };
            _BD = {
                r: BR,
                b: BB,
                w: BW,
                p: BP,
            };
            _PD = {
                r: PR,
                b: PB,
                w: PW,
                p: PP,
            };
            if (!paused) {
                rule(red, red, _RD.r);
                rule(red, blue, _RD.b);
                rule(red, white, _RD.w);
                rule(red, purple, _RD.p);
                rule(white, red, _WD.r);
                rule(white, blue, _WD.b);
                rule(white, white, _WD.w);
                rule(white, purple, _WD.p);
                rule(blue, white, _BD.w);
                rule(blue, red, _BD.r);
                rule(blue, blue, _BD.b);
                rule(blue, purple, _BD.p);
                rule(purple, white, _PD.w);
                rule(purple, purple, _PD.p);
                rule(purple, red, _PD.r);
                rule(purple, blue, _PD.b);
            }
            ctx.fillStyle = BG;
            ctx.fillRect(0, 0, w, h);

            for (let i = 0; i < points.length; i++) {
                const p = points[i];
                draw(p.x, p.y, p.c, p.s);
            }

            ctx.save();
            setTimeout(() => (frameId = requestAnimationFrame(update)), 0);
        }
        setTimeout(() => (canvas.style.opacity = 1), 500);
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
        S = 400;
        local = 70;
        damp = 0.95;
        margin = 5;
    };
    const pause = () => {
        paused = !paused;
    };

    const rezierX = () => {
        cancelAnimationFrame(frameId);
        setup(true);
    };
    $: RD = lim(_RD);
    $: WD = lim(_WD);
    $: BD = lim(_BD);
    $: PD = lim(_PD);

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

                min:
                {minDim / 25}
            </span>
            <span>
                <label for="R">
                    <t> Base Radius: </t>
                    <v>
                        {lim(ll)}
                    </v>
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
                    <t> Num of particles: </t>
                    <v>
                        {lim(count)}
                    </v>
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
                    <t> Force Multiplier: </t>
                    <v>
                        {lim(dd)}
                    </v>
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
                    <t> Margin: </t>
                    <v>
                        {lim(margin)}
                    </v>
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
                r: [r: {RD.r}, w: {RD.w}, b: {RD.b}, p: {RD.p}]
                <textarea bind:value={editable.R} />
            </span>
            <span>
                w: [r: {WD.r}, w: {WD.w}, b: {WD.b}, p: {WD.p}]
                <textarea bind:value={editable.W} />
            </span>
            <span>
                b: [r: {BD.r}, w: {BD.w}, b: {BD.b}, p: {BD.p}]
                <textarea bind:value={editable.B} />
            </span>
            <span>
                p: [r: {PD.r}, w: {PD.w}, b: {PD.b}, p: {PD.p}]
                <textarea bind:value={editable.P} />
            </span>
        </div>
        <span class="btns">
            <button on:click={restart}>Restart</button>
            <button on:click={pause}>
                {#if paused}
                    Resume
                {:else}Pause{/if}</button
            >
        </span>
        <span class="btns">
            <button on:click={() => ($V = !$V)}>
                {#if $V}
                    Hide
                {:else}Show{/if}</button
            >
            <button on:click={reset}>Reset</button>
        </span>
    </div>
{/if}
<svelte:window on:resize={rezierX} />
<canvas bind:this={canvas} />

<style>
    .setting {
        position: fixed;
        left: 15px;
        bottom: 15px;
        z-index: 20;
        padding: 0px;
        margin: 0px;
        transition: 0.4s ease-in-out;
        opacity: 1;
        animation: rotation 20s infinite linear;
    }
    .btns {
        display: flex;
        &:last-of-type {
            margin-bottom: 30px;
        }
    }
    .btns button {
        min-width: 90px;
        font-weight: normal;
        color: white;
        border-radius: 5px;

        border: 2px solid white;
        background-color: rgba(255, 255, 255, 0.25);
    }
    .btns button:hover {
        transform: scale(1.1);
    }
    .fade {
        opacity: 0.25;
        left: 5px;
        bottom: 5px;
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
        transition: opacity 1s cubic-bezier(0.37, 1.1, 0.46, 0.89);
    }
    .panel {
        color: white;
        position: fixed;
        bottom: 5px;
        left: 5px;
        z-index: 27;
        opacity: 1;
        border-radius: 15px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        background-color: rgba(0, 0, 0, 0.2);
        font-family: "Space Mono", monospace;
        font-size: 0.75rem;
        -webkit-backdrop-filter: blur(5px);
        backdrop-filter: blur(5px);
        width: 100vw;
        max-width: 420px;
        min-width: 200px;
    }
    .panel * {
        font-family: "Space Mono", monospace;
        font-weight: bold;
    }
    .sub-panel {
        padding: 25px;
        padding-bottom: 10px;
        display: flex;
        flex-direction: column;
        width: 100%;
    }
    .sub-panel textarea {
        width: 100%;
        font-weight: normal;
        padding: 5px;
        margin-top: 5px;
        color: white;
        border-radius: 5px;

        border: 2px solid white;
        background-color: rgba(255, 255, 255, 0.25);
        & :focus {
            outline: none;
        }
    }
    t,
    v {
        margin: 0px;
        display: inline-block;
        font-weight: bold;
    }
    .sub-panel label {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

    textarea {
        border: none;
        overflow: auto;
        outline: none;

        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;


        resize: none; /*remove the resize handle on the bottom right*/
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
        cursor: move;
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
