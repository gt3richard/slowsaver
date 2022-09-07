<script>
    export let amount;
    export let value;

</script>

<div class="row my-3">
    <div class="col" >
        <div class="row">
            <div class="col left">$0</div>
            <div class="col right">${amount.toLocaleString()}</div>
        </div>
        <div class="row">
            <div class="bar">
                <div class="progress m-auto">
                    <div class="progress-bar bg-success" role="progressbar" style="width: {value / amount * 100}%" aria-valuenow="{value}" aria-valuemin="0" aria-valuemax="{amount}"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .row {
        display: relative;
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
</style>