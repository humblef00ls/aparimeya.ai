<script>
    import { page } from "$app/stores";
    $: err = $page.error?.message;
</script>

{#if err == "Not Found"}
    <h1>404</h1>
{/if}
<h1>{err}</h1>
