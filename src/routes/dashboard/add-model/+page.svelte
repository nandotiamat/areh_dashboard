<script lang="ts">
  import { goto } from "$app/navigation";
  import FaArrowLeft from "svelte-icons/fa/FaArrowLeft.svelte";
  import type { Model } from "$lib/types.js";

  export let data: { models: Model[]; email: string; admin: boolean };
  let models = data.models;
  let email = data.email;
  let admin = data.admin;

  function goBack() {
    goto("/dashboard");
  }

  // Create a separate state for the form data
  let formData: Model = {
    documentID: "123",
    name: "",
    category: "",
    subtitle: "",
    bottom_text: "",
  };

  function handleChange(event, key) {
    // Update the form data
    formData[key] = event.target.value;
  }
  async function saveChanges() {
    // Save your changes here
    // You might want to add the new model to your models array
    models.push(formData);
  }
</script>

<div class="formContainer">
  <button on:click={goBack} class="backButton">
    <div class="icon-leftArrow">
      <FaArrowLeft />
    </div>
  </button>

  <form on:submit|preventDefault={saveChanges}>
    <h1>Nuovo Modello:</h1>
    {#each ["name", "libraryName", "subtitle", "bottom_text"] as key}
      <label>
        <p class={formData[key] ? "above" : "center"}>{key}</p>
        <textarea
          placeholder="...{key}"
          bind:value={formData[key]}
          on:input={(event) => handleChange(event, key)}
          rows="4"
        />
      </label>
    {/each}
    <button type="submit">Add Model</button>
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

  form textarea::placeholder {
    color: white; /* Adjust the color of the placeholder text */
    font-size: 0.8rem; /* Adjust the font size of the placeholder text */
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
