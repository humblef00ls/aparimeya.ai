<script>
    let canvas;
    import { onMount } from "svelte";
    export let y = 0;
    let m = { x: 0, y: 0 };
    const local = 80;
    const damp = 0.8;
    const margin = 1;
    function handleMousemove(event) {
        m.x = event.clientX;
        m.y = event.clientY;
    }

    onMount(() => {
        let h = window.innerHeight;
        let w = window.innerWidth;
        console.log(w, h);
        canvas.height = h;
        canvas.width = w;
        const ctx = canvas.getContext("2d");
        const dpr = window.devicePixelRatio;
        const rect = canvas.getBoundingClientRect();

        // Set the "actual" size of the canvas
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        // Scale the context to ensure correct drawing operations
        ctx.scale(dpr, dpr);

        let points = [];
        const point = (x, y, c, s) => {
            return { x: x, y: y, vx: 1, vy: 0, c: c, s: s };
        };
        const create = (n, c, s = 3.5) => {
            let group = [];
            for (let i = 0; i < n; i++) {
                group.push(
                    point(
                        Math.random() * (w - 100) + 50,
                        Math.random() * (h - 200) + 100,
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
                    if (d > 0 && d < local) {
                        let F = (g * 1) / d;
                        fx += F * dx;
                        fy += F * dy;
                    }
                }
                a.vx = (a.vx + fx * damp ) * 0.5;
                a.vy = (a.vy + fy * damp ) * 0.5;

                if (a.x <= 0 || a.x >= w) {
                    a.vx *= -1;
                }
                if (a.y <= 0 || a.y >= h) {
                    a.vy *= -1;
                }

                // if (a.vx > 1) a.vx = 1;
                // if (a.vy > 1) a.vy = 1;
                a.x += a.vx;
                a.y += a.vy;
            }
        };
        canvas.style.opacity = 1;

        const draw = (x, y, c, s) => {
            ctx.fillStyle = c;
            ctx.fillRect(x, y, s, s);
        };
        // let yellow = create(300, "yellow");
        let yellow = create(2000, "white",1.5);
        let red = create(2000, "red",2);
        // let green = create(20, "green");
        function update() {
            // rule(green, green, -0.32 + y / h);
            // rule(green, red, -0.17);
            // rule(green, yellow, 0.34 - 0.5 * (y / h));
            rule(red, red, .01);
            // rule(red, green, -0.34 + 0.3 * (y / h));
            rule(yellow, yellow, .2);
            rule(yellow, red, -.1 - .2*   (y / h));
            rule(red, yellow, -2+   (y / h));
            // rule(yellow, green, -0.2);
            ctx.clearRect(0, 0, w, h);
            ctx.save();
            // console.log("X::vel",points[0].vx,"pos",points[0].x);
            // console.log("Y::vel",points[0].vy,"pos",points[0].y);
            for (let i = 0; i < points.length; i++) {
                draw(points[i].x, points[i].y, points[i].c, points[i].s);
            }
            requestAnimationFrame(update);
        }
        // update();
        requestAnimationFrame(update);

        // return () => {
        //     cancelAnimationFrame(frameId);
        // };
    });
</script>

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
</style>
