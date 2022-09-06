<script>
    export let name = "";
    export let amount;
    export let value;
    export let isDebt = false;
    export let payment = "";
</script>

<div class="row my-3">
    {#if name}
    <div class="col-1 my-auto">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-circle secondary-color" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
          </svg>
    </div>
    <div class="col-2 my-auto">
        <h4>{name}</h4>
    </div>
    {/if}
    <div class={name ? payment ? "col-6" : "col-9" : "col"}>
        <div class="row">
            <div class="col left">$0</div>
            <div class="col right">${amount}</div>
        </div>
        <div class="row">
            <div class="bar">
                <div class="progress m-auto">
                    <div class="progress-bar {isDebt ? 'bg-danger' : 'bg-success'}" role="progressbar" style="width: {value / amount * 100}%" aria-valuenow="{value}" aria-valuemin="0" aria-valuemax="{amount}"></div>
                </div>
            </div>
        </div>
    </div>
    {#if payment}
        <div class="col-3"><h4>$<span class="payment">{payment}</span></h4><span class="secondary-color">per month</span></div>
    {/if}
</div>

<style>
    h4 {
        font-size: 1.2em;
    }
    .left {
        text-align: left;
    }
    .right {
        text-align: right;
    }
    .bar {
        padding: 1em;
    }
    .progress {
        width: 100%;
    }
    .payment {
        padding-left: .5em;
        padding-right: 1em;
        border-bottom: 1px solid white;
    }
</style>