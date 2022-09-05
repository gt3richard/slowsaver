<script>
  import Input from './lib/Input.svelte';
  import Grid from './lib/Grid.svelte';

  import { loanAmount, loanTerm, mortgageAPY, prePayment, savingsAPY } from './lib/stores';
  loanAmount.set(500000);
  loanTerm.set(360);
  mortgageAPY.set(3);
  prePayment.set(100);
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
