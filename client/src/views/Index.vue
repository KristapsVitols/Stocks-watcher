<template>
    <div class="container my-5">
        <div class="d-flex my-5">
            <input type="text" v-model="brokerageName" placeholder="Brokerage name...">
            <button @click="addBrokerage" class="ml-3 btn btn-primary">Add new brokerage</button>
        </div>

        <h3 class="mb-4">Overall statistics</h3>
        <div class="row mb-5">
            <div class="col-sm-3"><span class="font-weight-bold">Transfers made:</span> <span class="h1 ml-2 text-warning">{{ totalTransfers }}</span></div>
            <div class="col-sm-4"><span class="font-weight-bold">Money invested:</span> <span class="h1 ml-2 text-dark">€{{ totalInvested }}</span></div>
        </div>
        <div class="row mb-5">
            <div class="col-sm-3"><span class="font-weight-bold">Purchases made:</span> <span class="h1 ml-2 text-info">{{ totalPurchases }}</span></div>
            <div class="col-sm-4"><span class="font-weight-bold">Holding's worth:</span> <span class="h1 ml-2 text-dark">€{{ totalWorth }}</span></div>
        </div>

        <div class="row mb-5">
            <div class="col-sm-6"><span class="font-weight-bold">Total return:</span> <span class="h1 ml-2 text-success">
                +€{{ (totalWorth - totalInvested).toFixed(2) }}
            </span></div>
        </div>

        <h3 class="mb-4">Brokerages</h3>
        <div class="row">
            <div v-for="brokerage in brokerages" :key="brokerage.name" class="col-12">
                <h4 class="bg-info p-2 text-dark text-center">{{ brokerage.name }}</h4>
                <div class="row">
                    <div class="col-sm-6">
                        <div class="row">
                            <h3>Transfers</h3>
                            <div v-for="(transfer, index) in brokerage.transfers" :key="index" class="col-sm-12 mb-2 bg-dark text-white">
                                <p class="mb-0">€{{ transfer.amount }} on {{ getFormattedDate(transfer.date) }}</p>
                            </div>
                            <div>
                                Total: €{{ getBrokerageTotal(brokerage.name) }}
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="row">
                            <h3>Holdings</h3>
                            <div v-for="(holding, index) in brokerage.holdings" :key="index" class="col-sm-12 mb-2 bg-dark text-white">
                                <p class="mb-0">{{ holding.ticker }} - {{ holding.shares }} shares</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-center">
                    <b-button @click="showTransferForm(brokerage.name)" class="btn btn-success">+</b-button>
                </div>
                <div class="text-center">
                    <b-button @click="showHoldingForm(brokerage.name)" class="btn btn-warning">+</b-button>
                </div>
            </div>
        </div>

        <div>
            <b-modal v-model="isTransferModalVisible" hide-footer body-class="p-3" header-class="bg-light align-items-center" size="sm" centered>
                <div slot="modal-title">
                    <h3 class="h4 text-dark font-weight-light m-0">Add new transfer</h3>
                </div>
                <div slot="modal-header-close">
                </div>
                <div class="d-flex flex-column mb-3">
                    <label for="transferDate">Date</label>
                    <input id="transferDate" type="text" placeholder="2020-12-01..." v-model="transferDate">
                </div>
                <div class="d-flex flex-column">
                    <label for="transferAmount">Amount</label>
                    <input id="transferAmount" type="text" placeholder="€..." v-model="transferAmount">
                </div>
                <button @click="addNewTransfer" class="btn btn-success mt-3">Add</button>
            </b-modal>
        </div>

        <div>
            <b-modal v-model="isHoldingModalVisible" hide-footer body-class="p-3" header-class="bg-light align-items-center" size="sm" centered>
                <div slot="modal-title">
                    <h3 class="h4 text-dark font-weight-light m-0">Add new holding</h3>
                </div>
                <div slot="modal-header-close">
                </div>
                <div class="d-flex flex-column mb-3">
                    <label for="ticker">Ticker</label>
                    <input id="ticker" type="text" placeholder="TSLA..." v-model="ticker">
                </div>
                <div class="d-flex flex-column mb-3">
                    <label for="companyName">Company Name</label>
                    <input id="companyName" type="text" placeholder="Tesla..." v-model="companyName">
                </div>
                <div class="d-flex flex-column">
                    <label for="shares">Shares</label>
                    <input id="shares" type="text" placeholder="5 / 5.2 / 0.5 ..." v-model="shares">
                </div>
                <button @click="addNewHolding" class="btn btn-success mt-3">Add</button>
            </b-modal>
        </div>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    name: 'index',
    data: () => ({
        brokerages: [],
        brokerageName: '',
        isTransferModalVisible: false,
        isHoldingModalVisible: false,
        selectedBrokerage: '',
        transferDate: '',
        transferAmount: '',
        ticker: '',
        companyName: '',
        shares: '',
        totalWorth: 0,
    }),
    async created() {
        await this.getBrokerages();
        await this.getTotalWorth();
    },
    methods: {
        async getBrokerages() {
            const {data: {success, brokerages}} = await axios.get('/api/brokerages');

            if (!success) {
                return alert('Something went wrong!');
            }

            this.brokerages = brokerages;
        },
        async getTotalWorth() {
            const {data: {success, total}} = await axios.get('/api/total-worth');

            if (!success) {
                return alert('Something went wrong!');
            }

            this.totalWorth = total;
        },
        async addBrokerage() {
            if (!this.brokerageName) {
                return alert('provide a name');
            }

            const {data: {success, brokerage}} = await axios.post('/api/brokerages', {name: this.brokerageName});

            if (!success) {
                return alert('Something went wrong!');
            }

            this.brokerages.push(brokerage);
            this.brokerageName = '';
        },
        showTransferForm(selectedBrokerage) {
            this.selectedBrokerage = selectedBrokerage;
            this.isTransferModalVisible = true;
        },
        showHoldingForm(selectedBrokerage) {
            this.selectedBrokerage = selectedBrokerage;
            this.isHoldingModalVisible = true;
        },
        async addNewTransfer() {
            const matchingBrokerage = this.brokerages.find(brokerage => brokerage.name === this.selectedBrokerage);

            const {data: {success}} = await axios.post(`/api/brokerages/${matchingBrokerage.id}/transfers`, {date: this.transferDate, amount: this.transferAmount});

            if (!success) {
                return alert('something went wrong!');
            }

            matchingBrokerage.transfers.push({date: this.transferDate, amount: this.transferAmount});

            this.transferDate = this.transferAmount = this.selectedBrokerage = '';
            this.isTransferModalVisible = false;
        },
        async addNewHolding() {
            const matchingBrokerage = this.brokerages.find(brokerage => brokerage.name === this.selectedBrokerage);

            const {data: {success}} = await axios.post(`/api/brokerages/${matchingBrokerage.id}/holdings`, {
                ticker: this.ticker,
                companyName: this.companyName,
                shares: this.shares
            });

            if (!success) {
                return alert('something went wrong!');
            }
            //
            // matchingBrokerage.holdings.push({date: this.transferDate, amount: this.transferAmount});

            this.ticker = this.shares = this.companyName = this.selectedBrokerage = '';
            this.isHoldingModalVisible = false;
        },
        getBrokerageTotal(brokerageName) {
            const brokerage = this.brokerages.find(brokerage => brokerage.name === brokerageName);

            return brokerage.transfers.reduce((acc, transfer) => Number(transfer.amount) + acc, 0);
        },
        getFormattedDate(date) {
            return new Intl.DateTimeFormat('en-US', {
                year:  'numeric',
                month: 'long',
                day:   'numeric',
            }).format(new Date(date));
        },
    },
    computed: {
        totalTransfers() {
            return this.brokerages.reduce((acc, brokerage) => brokerage.transfers.length + acc, 0);
        },
        totalInvested() {
            return this.brokerages.reduce((acc, brokerage) => {
                return acc + brokerage.transfers.reduce((acc2, transfer) => Number(transfer.amount) + acc2, 0);
            }, 0);
        },
        totalPurchases() {
            return this.brokerages.reduce((acc, brokerage) => brokerage.holdings.length + acc, 0);
        },
    }
}
</script>
