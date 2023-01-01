<script>
    export let P;
    import { R } from "$lib/store";
    let imgX;
    import { onMount } from "svelte";
    let f = [];
    export let offSet = [0, 0];
    const bigger = (e) => {
        e.addEventListener("click", () => {
            e.classList.toggle("BFC");
        });
    };

    onMount(async () => {
        try {
            imgX = (await import(`$lib/projectBG/${P.img}.jpg`)).default;
        } catch {
            console.log("ERR img load");
        }
    });
</script>

<article
    use:bigger
    class:viz={$R > 1.6 && $R < 2.2}
    style={`transform: translate3d(${offSet[0]}px,${offSet[1]}px,0)`}
>
    <div class="imgContainer">
        <img src={imgX} />
        <p class="desc">

            {@html P.desc}
        </p>
    </div>
    <div class="info">
        <h4>
            {P.title}
        </h4>
        <p>
            {P.skills}
        </p>
    </div>
</article>

<style>
    img {
        height: 100%;
        width: 100%;
        object-fit: cover;
        transition: 1s ease-in-out;
        transform: scale(1.05);
        opacity: 1;
    }
    .imgContainer {
        transition: 1s ease-in-out;
        width: 100%;
        height: calc(100% - 80px);
        opacity: 0.4;
        overflow: hidden;
        position: relative;
        
    }
    .desc {
        transition: 1s ease-in-out;
        transform: translate3d(0px, 100%, 0);
        height: 100%;
        position: absolute;
        top: 0px;
        width: 100%;
        padding: 13px;
        overflow-y: scroll;
        opacity: 0;
    }

    .viz {
        opacity: 0.85;
        transform: translate3d(0px, 0px, 0) !important;
    }
    .viz:hover .imgContainer {
        opacity: 0.7 !important;
    }
    article {
        transition: 0.475s ease-in-out;
        width: max(275px, 25vw);
        height: max(320px, 25vh);
        margin: 0px;

        border-radius: 15px;
        position: relative;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.075);
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(2px);
        opacity: 0;
        cursor: pointer;
    }
    :global(.BFC) {
        width: max(325px, 30vw) !important;
        height: max(400px, 35vh) !important;
        opacity: 1 !important;
        backdrop-filter: blur(5px) !important;
        -webkit-backdrop-filter: blur(5px) !important;
    }
    :global(.BFC) .imgContainer {
        opacity: 0.9;
    }
    :global(.BFC) .desc {
        opacity: 1;
        transform: translate3d(0px, 0%, 0);
    }
    :global(.BFC) img {
        transform: translate3d(0px, -100%, 0) !important;
        opacity: 0;
    }
    .viz:hover {
        opacity: 1 !important;
        transform: translate3d(0px, 0px, 0) scale(1.05) !important;
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
    }
    h4 {
        font-size: 1.25rem;
    }
    .info {
        position: absolute;
        bottom: 0px;
        left: 0px;
        padding: 10px 15px;
        background: rgba(255, 255, 255, 0.075);
        width: 100%;
        height: 80px;
    }
</style>
