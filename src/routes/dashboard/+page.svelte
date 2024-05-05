<script lang="ts">
    import { goto } from '$app/navigation';
    import type { Model } from '$lib/types.js';
    import FaEdit from 'svelte-icons/fa/FaEdit.svelte';

    export let data: { models: Model[]; email: string; admin: boolean };
    let models = data.models;
    let email = data.email;
    let admin = data.admin;

    function goToModifyModel(modelId) {
        goto(`/dashboard/modify-model-${modelId}`);
    }

</script>

<style>

.button-container {
    display: flex;
    align-items: center;
}

.card-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
}

.card {
    background-color: #FFFFFF;
    border-radius: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: row;
    overflow: hidden;
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
}

.card-image {
    width: 300px;
    height: auto;
    border-radius: 20px 0 0 20px;
    object-fit: cover;
}

.card-content {
    padding: 20px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}

.card-content h3 {
    margin-top: 0;
    margin-bottom: 10px;
    color: #333;
    font-size: 20px; /* Increased font size */
}

.description ul {
    list-style-type: none;
    padding: 0;
}

.description li {
    margin-bottom: 5px;
    color: #666;
    font-size: 16px; /* Increased font size */
}

.description strong {
    margin-right: 5px;
    color: #333;
    font-size: 18px; /* Increased font size */
}

.button-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: right;
}

.button {
    background-color: green;
    color: white;
    padding: 15px 30px; /* Increased button size */
    border: none;
    border-radius: 8px; /* Increased button border radius */
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-size: 16px; /* Increased font size */
}

.button:hover {
    background-color: darkgreen;
}

.icon-edit {
    width: 24px;
    height: 24px;
    margin-left: 10px;
}

</style>

<div>
    <div class="card-container">
        {#if models && models.length > 0}
            {#each models as model}
                <div class="card">
                    <div class="card-content description">
                        <h3>{model.name}</h3>
                        <p><strong>Library Name:</strong> {model.libraryName}</p>
                        <p><strong>Subtitle:</strong> {model.subtitle}</p>
                        <ul>
                            {#each model.description || [] as desc}
                                <li><strong>{desc.key}:</strong> {desc.value}</li>
                            {/each}
                        </ul>
                        <p><strong>Bottom Text:</strong> {model.bottom_text}</p>
                        <div class="button-container">
                            <button class="button" style="display: flex; align-items: center;" on:click={() => goToModifyModel(model.documentID)}>
                                Modifica
                                <div class="icon-edit">
                                    <FaEdit />
                                </div>
                            </button>
                        </div>
                    </div>
                    <img class="card-image" src={model.imageURL} alt="Model Poster">
                </div>
            {/each}
        {:else}
            <p>No models found.</p>
        {/if}
    </div>
</div>
