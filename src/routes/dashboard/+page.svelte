<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import type { Model } from "$lib/types.js";
  import FaEdit from "svelte-icons/fa/FaEdit.svelte";
  import { Trash2 } from "lucide-svelte";

  export let data: { models: Model[]; email: string; admin: boolean };
  let models: Model[] = [];
  let email = data.email;
  let admin = data.admin;
  let loading = true;

  function goToModifyModel(modelId) {
    goto(`/dashboard/modify-model-${modelId}`);
  }

  async function deleteModel(modelId) {
    const confirmation = confirm("Are you sure you want to delete this model?");
    if (confirmation) {
      try {
        const response = await fetch(`/dashboard/modify-model-${modelId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          window.location.reload();
          alert("Il Modello è stato cancellato correttamente!");
        } else {
          // Handle error responses
          console.error("Error deleting model:", response.statusText);
          alert("Failed to delete model.");
        }
      } catch (error) {
        console.error("Error deleting model", error);
        alert("An error occurred while deleting the model.");
      }
    }
  }

  onMount(async () => {
    models = data.models;
    loading = false;
  });
</script>

{#if loading}
  <div class="loading-spinner">
    <p style="color: white">Loading...</p>
  </div>
{:else}
  <div>
    <div class="card-container">
      {#if models && models.length > 0}
        {#each models as model}
          <div class="card">
            <div class="card-content description">
              <strong style="font-size: 25px;">Nome Modello:</strong>
              <h1>
                {model.name}
              </h1>
              <br />
              <p>
                <strong style="font-size: 25px;">Category:</strong><br />
                {model.category}
              </p>
              <br />
              <p>
                <strong style="font-size: 25px;">Subtitle:</strong><br />
                {model.subtitle}
              </p>
              <br />
              <ul>
                {#each model.sections || [] as section}
                  {#if section.name}
                    <li>
                      <strong style="font-size: 25px;">{section.name}:</strong
                      ><br />
                    </li>
                  {/if}
                  {#each section.entries as entry}
                    {#if entry.key && entry.value}
                      <li>
                        <strong style="font-size: 20px;">{entry.key}:</strong
                        ><br />
                        {entry.value}
                      </li>
                    {/if}
                  {/each}
                {/each}
              </ul>
              <br />
              <p>
                <strong style="font-size: 25px;">Bottom Text:</strong><br />
                {model?.bottom_text}
              </p>
              <br />
              <br />
              <br />

              <div class="button-container">
                <button
                  class="button"
                  style="display: flex; align-items: center;"
                  on:click={() => goToModifyModel(model.documentID)}
                >
                  Modifica
                  <div class="icon-edit">
                    <FaEdit />
                  </div>
                </button>

                <button
                  class="delete-button"
                  style="display: flex; align-items: center; margin-left: 10px;"
                  on:click={() => deleteModel(model.documentID)}
                >
                  Delete
                  <div class="icon-delete">
                    <Trash2 />
                  </div>
                </button>
              </div>
            </div>
            <img
              class="card-image"
              src={model.imageURL}
              alt="No such .png file found."
            />
          </div>
        {/each}
      {:else}
        <p>No models found.</p>
      {/if}
    </div>
  </div>
{/if}

<style>
  .button-container {
    display: flex;
    justify-content: flex-start; /* Align to the end of the container */
    margin-top: auto;
    margin-bottom: 10px;
  }

  .card-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }

  .card {
    background-color: #ffffff;
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
    width: 30%;
    height: 30%;
    border-radius: 20px 0 0 20px;
    align-self: center;
  }

  .card-content {
    padding: 20px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  p {
    font-size: 20px;
  }

  .description ul {
    list-style-type: none;
    padding: 0;
  }

  .description li {
    margin-bottom: 5px;
    color: black;
    font-size: 20px; /* Increased font size */
  }

  .description strong {
    margin-right: 5px;
    color: black;
    font-size: 20px; /* Increased font size */
  }

  .button {
    background-color: green;
    color: white;
    padding: 15px 30px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-size: 16px;
  }

  .button:hover {
    background-color: darkgreen;
  }

  .icon-edit {
    width: 24px;
    height: 24px;
    margin-left: 10px;
  }
  .delete-button {
    background-color: red;
    color: white;
    padding: 15px 30px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-size: 16px;
  }

  .delete-button:hover {
    background-color: darkred;
  }

  .icon-delete {
    width: 24px;
    height: 24px;
    margin-left: 10px;
  }

  .loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
</style>
