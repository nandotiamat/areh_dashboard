<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import type { Model } from "$lib/types.js";
  import FaEdit from "svelte-icons/fa/FaEdit.svelte";
  import { Trash2, Download } from "lucide-svelte";

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

  async function downloadQr(modelId: string) {
    try {
      const model = models.find((model) => model.documentID === modelId);

      if (!model || !model.qrCodeURL) {
        alert("QR code not found.");
        return;
      }

      const response = await fetch(model.qrCodeURL);
      if (!response.ok) {
        console.error("Error downloading QR code:", response.statusText);
        alert("Failed to download QR code.");
        return;
      }

      const qrCodeBlob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(qrCodeBlob);
      link.download = `${model.name}.png`;
      link.click();
    } catch (error) {
      console.error("Error downloading QR code", error);
      alert("An error occurred while downloading the QR code.");
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
                    {#if entry.key || entry.value}
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

                <button
                  class="qr-button"
                  style="display: flex; align-items: center; margin-left: 10px;"
                  on:click={() => downloadQr(model.documentID)}
                >
                  Download QR
                  <div class="icon-download">
                    <Download />
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
  @import "/src/styles/dashboard.css";
</style>
