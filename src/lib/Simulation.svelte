<script>
    let canvas;
    import { onMount } from "svelte";
    export let y = 0;
    let m = { x: 0, y: 0 };
    let local = 150;
    const damp = 0.85;
    const margin = 5;
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
                // qtree.insert(new Point(group[i].x, group[i].y, c));
            }
            return group;
        };
        const rule = (atoms1, atoms2, g) => {
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
                    let d = Math.sqrt(dx * dx + dy * dy);
                    if (d > 0 && d < local) {
                        let F = (g * 1) / d;
                        fx += F * dx;
                        fy += F * dy;
                    }
                }
                a.vx = (a.vx + fx * damp) * 0.5;
                a.vy = (a.vy + fy * damp) * 0.5;

                if (a.x <= 0 || a.x >= w) {
                    a.vx *= -2;
                }
                if (a.y <= 0 || a.y >= h) {
                    a.vy *= -2;
                }

                a.x += a.vx;
                a.y += a.vy;
                if (a.x < margin) {a.vx = 1;a.x=margin}
                if (a.x > w - margin) {a.vx = -1;a.x=w-margin}
                if (a.y < margin) {a.vy = 1;a.y=margin}
                if (a.y > h- margin) {a.vy = 1;a.y=margin}
            }
        };
        canvas.style.opacity = 1;

        const draw = (x, y, c, s) => {
            ctx.fillStyle = c;
            ctx.fillRect(x - s / 2, y - s / 2, s, s);
        };
        // let yellow = create(300, "yellow");
        const S = Math.min(Math.min(h,w),800)
        local = S / 6
        let white = create((S * 2) , "white", 1);
        let red = create((S * 1.5), "red", 2);
        let blue = create(S, "cyan", 3);
        // let white = create(3, "white", 1.5);
        // let red = create(3, "red", 2);
        // let blue = create(100, "cyan", 3);
        // let green = create(20, "green");
        window.addEventListener("mousedown", () => {
            points.push(point(m.x, m.y, "green", 2));
            qtree.insert(new Point(m.x, m.y, "green"));
        });

        function update() {
            rule(red, red, 0.04 + 2 * Math.sin(((3.14 * 2 * y) / h) * 2));
            rule(white, white, 0.02);
            rule(white, blue, 0.04 + 0.03 * (y / h));
            rule(blue, white, 0.005);
            rule(blue, red, -0.2 - 0.1 * (y / h));
            rule(red, blue, -0.5);
            rule(
                blue,
                blue,
                0.1 + 2 * Math.sin((3.14 * 2 * y) / h) - 0.2 * (y / h)
            );
            rule(white, red, -0.2 - 0.2 * (y / h));
            rule(red, white, -2 + 0.7 * (y / h));

            ctx.fillStyle = "rgb(10,10,10)";
            ctx.fillRect(0, 0, w, h);
            // qtree = new QuadTree(boundary, 5, ctx);

            for (let i = 0; i < points.length; i++) {
                const p = points[i];
                draw(p.x, p.y, p.c, 2);
            }
            // evalF(points[0],rules)
            // qtree.show();
            ctx.save();
            // console.log("X::vel",points[0].vx,"pos",points[0].x);
            // console.log("Y::vel",points[0].vy,"pos",points[0].y);

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
