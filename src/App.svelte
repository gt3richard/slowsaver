<script>
  import Breakdown from './lib/Breakdown/Index.svelte';
  import Leak from './lib/Leak/Index.svelte';

  import { page } from './lib/stores';

  let expandNav = false;

</script>

<main>
  <nav class="navbar navbar-expand-lg navbar-dark">
    <a class="navbar-brand" href="/">Slow Saver</a>
    <button class="navbar-toggler" type="button" on:click={() => expandNav = !expandNav} aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class={(expandNav ? " " : "collapse ") + "navbar-collapse"} id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item active">
          <a class="nav-link" on:click={() => page.set("breakdown")} href="#">The Breakdown</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" on:click={() => page.set("leak")} href="#">The Leak</a>
        </li>
      </ul>
    </div>
  </nav>
  {#if $page === "breakdown"}
    <Breakdown />
  {:else if $page === "leak"}
    <Leak />
  {:else}
    <Breakdown />
  {/if}
  <br><br>
  <span class="footer secondary-color">Slow Saver | It'll take time but it'll be worth it</span>
</main>

<style>
  .navbar-brand {
    color: rgba(255, 255, 255, 0.87);
    font-size: 2em;
    font-weight: 700;
  }
  .nav-item {
    color: rgba(255, 255, 255, 0.87);
    font-size: 1.2em;
    padding: .5em;
    font-weight: 700;
  }
  
</style>
