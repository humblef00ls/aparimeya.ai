<script>
    let canvas;
    import { onMount } from "svelte";
    import { QuadTree, Rectangle, Point, Circle } from "$lib/QuadTree";
    export let y = 0;
    let m = { x: 0, y: 0 };
    const local = 100;
    const damp = 0.95;
    const margin = 5;
    const cap = 15
    function handleMousemove(event) {
        m.x = event.clientX;
        m.y = event.clientY;
    }

    onMount(() => {
        let h = window.innerHeight;
        let w = window.innerWidth;


        canvas.height = h;
        canvas.width = w;

        const ctx = canvas.getContext("2d", { alpha: false });
        const dpr = window.devicePixelRatio;
        const rect = canvas.getBoundingClientRect();
        let boundary = new Rectangle(0, 0, w, h);
        let qtree = new QuadTree(boundary, cap, ctx);

        // Set the "actual" size of the canvas
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        // Scale the context to ensure correct drawing operations
        ctx.scale(dpr, dpr);

        let points = [];
        const point = (x, y, c, s) => {
            return { x: x, y: y, vx: 0, vy: 0, c: c, s: s };
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
                qtree.insert(new Point(group[i].x, group[i].y, c));
            }
            return group;
        };

        canvas.style.opacity = 1;

        const draw = (x, y, c, s) => {
            ctx.fillStyle = c;
            ctx.fillRect(x - s / 2, y - s / 2, s, s);
        };

        const size = Math.min(w, h);
        let white = create(size * 1.5, "white", 1.5);
        let red = create(size * 1.25, "red", 2);
        let blue = create(size, "cyan", 3);
        // let white = create(3, "white", 1.5);
        // let red = create(3, "red", 2);
        // let blue = create(100, "cyan", 3);
        // let green = create(20, "green");
        window.addEventListener("mousedown", () => {
            points.push(point(m.x, m.y, "green", 2));
            qtree.insert(new Point(m.x, m.y, "green"));
        });
        let rules = {};
        const evalF = (p, rules, i) => {
            let fx = 0;
            let fy = 0;
            let fg = qtree.query(new Circle(p.x, p.y, local));
            if (i == 0) draw(p.x, p.y, "purple", 10);
            for (let ix in fg) {
                const f = fg[ix];
                if (f.x == p.x && f.y == p.y) continue;
                let dx = p.x - f.x;
                let dy = p.y - f.y;
                let d = Math.sqrt(dx * dx + dy * dy);
                let g = rules[p.c]?.[f.c] ?? 0;
                if(d>0){
                    let F = (g * 1) / d;
                fx += F * dx;
                fy += F * dy;
                }
                if (i == 0) draw(f.x, f.y, "green", 10);
            }
            p.vx = (p.vx + fx * damp) * 0.5;
            p.vy = (p.vy + fy * damp) * 0.5;
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < margin) {
                p.vx = 2;
                p.x = margin;
            }
            if (p.x > w - margin) {
                p.vx = -2;
                p.x = w - margin;
            }
            if (p.y < margin) {
                p.vy = 2;
                p.y = margin;
            }
            if (p.y > h - margin) {
                p.vy = -2;
                p.y = h - margin;
            }
        };

        function update() {
            rules["white"] = {
                white: 0.002,
                red: -0.2 - 0.2 * (y / h),
                cyan: 0.04 + 0.03 * (y / h),
            };
            rules["red"] = { 
                white: -2 + 1.7 * (y / h), 
                red: 0.01, 
                cyan: -0.25 };
            rules["cyan"] = {
                white: -0.005,
                red: -0.2 - 0.1 * (y / h),
                cyan: 0.01 + 2 * Math.sin((3.14 * 2 * y) / h) + 0.2 * (y / h),
            };

            ctx.fillStyle = "rgb(10,10,10)";
            ctx.fillRect(0, 0, w, h);
            qtree = new QuadTree(boundary, 5, ctx);

            for (let i = 0; i < points.length; i++) {
                qtree.insert(new Point(points[i].x, points[i].y, points[i].c));
            }
            for (let i = 0; i < points.length; i++) {
                evalF(points[i], rules);
            }
            qtree.show();
            ctx.save();

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
