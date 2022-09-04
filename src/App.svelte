<script>
  import Input from './lib/Input.svelte';
  import Grid from './lib/Grid.svelte';

  import { loanAmount, loanTerm, mortgageAPY, prePayment, savingsAPY } from './lib/stores';
  loanAmount.set(500000);
  loanTerm.set(360);
  mortgageAPY.set(0.03);
  prePayment.set(4000);
  savingsAPY.set(0.01);

</script>

<main>
  <h1>Slow Saver</h1>
  
  <div class="card">
    <Input />
  </div>

  <div class="card">
    <Grid />
  </div>

  <p>
    Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank">SvelteKit</a>, the official Svelte app framework powered by Vite!
  </p>

  <p class="read-the-docs">
    Click on the Vite and Svelte logos to learn more
  </p>
</main>

<style>
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
