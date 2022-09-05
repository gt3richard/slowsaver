<script>
    export let name = "";
    export let amount;
    export let value;
    export let isDebt = false;
    export let payment = "";
</script>

<div class="row my-3">
    {#if name}
    <div class="col-3 my-auto">
        <span>{name}</span>
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