<script>
  import Breakdown from './lib/Breakdown/Index.svelte';
</script>

<main>
  <h1 class="header">Slow Saver</h1>
  <h4 class="subheader secondary-color">It'll take time but it'll be worth it</h4>
  <Breakdown />
  <span class="footer secondary-color">Slow Saver | It'll take time but it'll be worth it</span>
</main>

<style>
  .header {
    font-weight: 700;
    padding-top: 1em;
  }
  .subheader {
    padding-bottom: 1em;
  }
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
