<template>
    <div class="container mt-5">
        <h3 class="mb-4">JSON to API generator</h3>
        <div class="mb-4">
            <!-- Styled -->
            <b-form-file
                v-model="resource"
                :state="Boolean(resource)"
                accept=".json"
                placeholder="Choose a JSON file or drop it here..."
                drop-placeholder="Drop JSON file here..."
            ></b-form-file>
            <div class="mt-3">Selected file: {{ resource ? resource.name : '' }}</div>
        </div>
        <button class="btn btn-success" type="button" @click="generate">
            Generate API
        </button>

        <p v-if="endpoint">
            {{ endpoint }}
        </p>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    name: 'index',
    data: () => ({
        resource: null,
        endpoint: '',
    }),
    methods: {
        async generate() {
            if (!this.resource) {
                return;
            }

            try {
                const formData = new FormData();
                formData.append('resource', this.resource);

                const re = await axios.post('/api/generate-endpoints', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                });

                console.log(re);
            } catch (err) {
                console.error(err);
            }
        },
    },
}
</script>
