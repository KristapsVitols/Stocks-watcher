<template>
    <div class="container my-5">
        <div class="d-flex my-5">
            <input type="text" v-model="brokerageName" placeholder="Brokerage name...">
            <button @click="addBrokerage" class="ml-3 btn btn-primary">Add new brokerage</button>
        </div>

        <h3 class="mb-4">Overall statistics</h3>
        <div class="row mb-5">
            <div class="col-sm-3"><span class="font-weight-bold">Transfers made:</span> <span class="h1 ml-2 text-warning">{{ totalTransfers }}</span></div>
            <div class="col-sm-4"><span class="font-weight-bold">Money invested:</span> <span class="h1 ml-2 text-success">€{{ totalInvested }}</span></div>
        </div>

        <h3 class="mb-4">Brokerages</h3>
        <div class="row">
            <div v-for="brokerage in brokerages" :key="brokerage.name" class="col-sm">
                <h4 class="bg-info p-2 text-dark text-center">{{ brokerage.name }}</h4>
                <div v-for="(transfer, index) in brokerage.transfers" :key="index" class="px-2 py-1 mb-2 bg-dark text-white">
                    <p class="mb-0">€{{ transfer.amount }} on {{ transfer.date }}</p>
                </div>
                <div>
                    Total: €{{ getBrokerageTotal(brokerage.name) }}
                </div>
                <div class="text-center">
                    <b-button @click="showForm(brokerage.name)" class="btn btn-success">+</b-button>
                </div>
            </div>
        </div>

        <div>
            <b-modal v-model="isModalVisible" hide-footer body-class="p-3" header-class="bg-light align-items-center" size="sm" centered>
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
    </div>
</template>
<script>
import axios from 'axios';

export default {
    name: 'index',
    data: () => ({
        brokerages: [],
        brokerageName: '',
        isModalVisible: false,
        selectedBrokerage: '',
        transferDate: '',
        transferAmount: '',
    }),
    async created() {
        await this.getBrokerages();
    },
    methods: {
        async getBrokerages() {
            const {data: {success, brokerages}} = await axios.get('/api/brokerages');

            if (!success) {
                return alert('Something went wrong!');
            }

            this.brokerages = brokerages;
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
        showForm(selectedBrokerage) {
            this.selectedBrokerage = selectedBrokerage;
            this.isModalVisible = true;
        },
        async addNewTransfer() {
            const matchingBrokerage = this.brokerages.find(brokerage => brokerage.name === this.selectedBrokerage);

            const {data: {success}} = await axios.put('/api/brokerages', {name: this.selectedBrokerage, date: this.transferDate, amount: this.transferAmount});

            if (!success) {
                return alert('something went wrong!');
            }

            matchingBrokerage.transfers.push({date: this.transferDate, amount: this.transferAmount});

            this.transferDate = this.transferAmount = this.selectedBrokerage = '';
            this.isModalVisible = false;
        },
        getBrokerageTotal(brokerageName) {
            const brokerage = this.brokerages.find(brokerage => brokerage.name === brokerageName);

            return brokerage.transfers.reduce((acc, transfer) => Number(transfer.amount) + acc, 0);
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
    }
}
</script>
