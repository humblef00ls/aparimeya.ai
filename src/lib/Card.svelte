<script>
    export let P;
    import { R } from "$lib/store";
    let f = [];
    export let offSet = [0,0];
    const bigger = (e) => {
        e.addEventListener("click", () => {
            e.classList.toggle("BFC");
        });
    };
    function isOverflown(element) {
        if(element)
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}
let el
</script>

<article
bind:this={el}
    use:bigger
    class:viz={$R > 1.6 && $R < 2.2}
    style={`transform: translate3d(${2 * offSet[0]}px,${ 1.5*offSet[1]}px,0)`}
>
    <div class="info">
        <h4>
            {P.title}
        </h4>
        <p>
            {P.skills} | {offSet[0]} +  {offSet[1]} | {isOverflown(el)}
        </p>
    </div>
</article>

<style>
    .viz {
        opacity: 0.85 !important;
        transform: translate3d(0px, 0px, 0) !important;
    }
    :global(.BFC) {
        width: max(325px, 30vw) !important;
        height: max(400px, 35vh) !important;
        opacity: 1 !important;
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
    }
    article {
        transition: 0.35s ease-in-out;
        width: max(275px, 25vw);
        height: max(320px, 25vh);
        margin: 0px;
        padding: 15px;
        border-radius: 15px;
        position: relative;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.075);
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(2px);
        opacity: 0;
        cursor: pointer;
    }
    .viz:hover {
        opacity: 1 !important;
        transform: scale(1.05);
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
        padding: 10px;
        background: rgba(255, 255, 255, 0.075);
        width: 100%;
    }
</style>
