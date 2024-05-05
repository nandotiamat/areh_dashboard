<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import FaArrowLeft from 'svelte-icons/fa/FaArrowLeft.svelte'
  

  export let data: { models: import("$lib/types.js").Model[]; email: string; admin: boolean };

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
  let formData = { ...model };
  function handleChange(event, key) {
    // Update the form data, not the model
    formData[key] = event.target.value;
  }
  async function saveChanges() {
    // Copy the form data back to the model
    model = { documentID: model!.documentID, ...formData };
    // Save your changes here
  }
</script>

<!-- ... -->

<div class='formContainer'>
  <button on:click={goBack} class='backButton'>
    <div class="icon-leftArrow">
      <FaArrowLeft />
    </div>
  </button>

  <form on:submit|preventDefault={saveChanges}>
    <h1>Modifica Modello</h1>
    {#each ['name', 'libraryName', 'subtitle', 'bottom_text'] as key}
      <label>
        <p class={formData[key] ? 'above' : 'center'}>{key}</p>
        <textarea bind:value={formData[key]} on:input={(event) => handleChange(event, key)} rows="4" />
      </label>
    {/each}
    <button type='submit'>Save changes</button>
  </form>
</div>

<!-- ... -->

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

  .above,
  .center {
    position: absolute;
    transform: translateY(-50%);
    pointer-events: none;
    color: white;
    border-radius: 4px;
    padding: 0 6px;
    font-size: 0.8rem;
  }

  .above {
    top: 0;
    left: 24px;
    background: navy;
    border: 1px solid blue;
    font-size: 0.7rem;
  }

  .center {
    top: 50%;
    left: 6px;
    border: 1px solid transparent;
    opacity: 0;
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