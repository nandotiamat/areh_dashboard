<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores'; // Import the page store
  import type { Model } from '$lib/types.js'; // Updated import for Model and Section interfaces
  import FaArrowLeft from 'svelte-icons/fa/FaArrowLeft.svelte';

  export let data: { models: Model[]; email: string; admin: boolean };

  const documentID = $page.params.id;
  let models = data.models;
  let email = data.email;
  let admin = data.admin;

  let model = models.find((model) => model.documentID === documentID);

  if (!model) {
    if (typeof window !== 'undefined') {
      goto('/dashboard');
    }
  }

  function goBack() {
    goto('/dashboard');
  }

  // Create a separate state for the form data
  let formData: Partial<Model> = { ...model }; // Use Partial<Model> to allow partial updates

  function handleChange(event, key) {
    // Update the form data, not the model
    formData[key] = event.target.value;
  }

  async function saveChanges() {
    //model = { documentID: documentID, ...formData };
    console.log(formData);
  }
</script>

<div class='formContainer'>
  <button on:click={goBack} class='backButton'>
    <div class="icon-leftArrow">
      <FaArrowLeft />
    </div>
  </button>

  <form on:submit|preventDefault={saveChanges}>
    <h1>Modifica Modello</h1>
    {#each Object.entries(model || {}) as [key, value]}
      {#if key !== 'documentID' && key !== 'sections'}
        <label>
          <p class= 'above'>{key}</p>
          <textarea bind:value={formData[key]} on:input={(event) => handleChange(event, key)} rows="4" />
        </label>
      {/if}
    {/each}

    {#if model && model.sections && model.sections.length > 0}
      {#each model.sections as section}
        <h2>{section.name}</h2>
        {#each section.entries as entry}
          <label>
            <p class='above'>{entry.key}</p>
            <textarea bind:value={formData.sections} on:input={(event) => handleChange(event, entry.key)} rows="4" />
          </label>
        {/each}
      {/each}
    {/if}

    <button type='submit'>Save changes</button>
  </form>
</div>

<style>
  .formContainer {
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: top;
    flex: 1;
    padding: 10px;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 14px;
    width: 50%;
    max-width: 100%;
    margin: 0 auto;
  }

  form textarea {
    width: 100%;
    border: none;
    background: transparent;
    color: white;
    padding: 20px;
    resize: none;
  }

  form textarea:focus {
    border: none;
    outline: none;
  }

  form label {
    position: relative;
    border: 1px solid navy;
    border-radius: 20px;
  }

  form label:focus-within {
    border-color: blue;
  }

  form button {
    background: navy;
    color: white;
    border: none;
    padding: 14px 0;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    display: grid;
    place-items: center;
  }

  form button:hover {
    background: blue;
  }

  .above {
    position: absolute;
    transform: translateY(-50%);
    pointer-events: none;
    color: white;
    border-radius: 4px;
    padding: 0 6px;
    font-size: 0.8rem;
    top: 0;
    left: 24px;
    background: navy;
    border: 1px solid blue;
    font-size: 0.7rem;
  }

  .backButton {
    background: none;
    border: none;
    color: white;
    font-size: 2rem;
    padding: 10px;
    cursor: pointer;
    align-self: flex-start;
  }

  .icon-leftArrow {
    width: 36px;
    height: 36px;
  }
</style>

