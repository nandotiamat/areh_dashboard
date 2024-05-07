<script lang="ts">
  import { goto, preloadData } from "$app/navigation";
  import { page } from "$app/stores"; // Import the page store
  import type { Model } from "$lib/types.js"; // Updated import for Model and Section interfaces
  import FaArrowLeft from "svelte-icons/fa/FaArrowLeft.svelte";
  import { reorderKeys } from "../../../componenets/utils/reorderKeys.js";
  import { error } from "@sveltejs/kit";
  import { fly } from "svelte/transition";
  import { Trash2, CirclePlus, TicketPlus } from "lucide-svelte";

  export let data: { models: Model[]; email: string; admin: boolean };

  const documentID = $page.params.id;
  let models = data.models;
  let email = data.email;
  let admin = data.admin;

  const MAX_FILE_SIZE_MB = 30;
  let errorImageMessage = "";
  let errorVideoMessage = "";
  let showErrorImageMessage = false;
  let showErrorVideoMessage = false;

  let model = models.find((model) => model.documentID === documentID);

  const keyOrder = [
    "name",
    "category",
    "subtitle",
    "sections",
    "bottom_text",
    "imageURL",
    "videoURL",
  ];

  const customLabels = {
    name: "Nome Modello",
    category: "Categoria",
    subtitle: "Sottotitolo",
    bottom_text: "Conclusione/Testo in fondo",
    imageURL: "Immagine (.png)",
    videoURL: "Video (.mp4)",
  };

  if (!model) {
    if (typeof window !== "undefined") {
      goto("/dashboard");
    }
  }

  model = reorderKeys(keyOrder, model);

  function goBack() {
    goto("/dashboard");
  }

  // Create a separate state for the form data
  let formData: Partial<Model> = { ...model }; // Use Partial<Model> to allow partial updates

  function handleChange(event, key) {
    formData[key] = event.target.value;
  }

  function handleChangeSectionEntries(event, i, j, field) {
    const newFormData = JSON.parse(JSON.stringify(formData));
    const section = newFormData.sections?.[i];
    const entry = section?.entries?.[j];
    if (section && entry) {
      entry[field] = event.target.value;
    }
    formData = newFormData; // Assign the modified newFormData back to formData
  }

  function handleImageFileChange(event, key) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files && fileInput.files[0];

    if (file) {
      if (file.type !== "image/png") {
        window.alert("Tipo di file non valido. Seleziona un'immagine PNG.");
        errorImageMessage =
          "Tipo di file non valido. Seleziona un'immagine PNG.";
        fileInput.value = "";
        showErrorImageMessage = true;
        setTimeout(() => {
          showErrorImageMessage = false;
        }, 5000);
        return;
      } else {
        formData[key] = file;
        errorImageMessage = "";
        showErrorImageMessage = false;
      }

      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        window.alert(
          `Il tuo file supera i ${MAX_FILE_SIZE_MB} MB. Seleziona un file con dimensioni massime di ${MAX_FILE_SIZE_MB} MB.`
        );
        errorImageMessage =
          "Il tuo file supera i 30MB, seleziona un file con dimensioni massime di 30MB.";
        fileInput.value = "";
        return;
      }
    } else {
      window.alert("Seleziona un file.");
      errorImageMessage = "Please select a file.";
      showErrorImageMessage = true;
      setTimeout(() => {
        showErrorImageMessage = false;
      }, 5000);
    }
  }

  function handleVideoFileChange(event, key) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files && fileInput.files[0];

    if (file) {
      if (file.type !== "video/mp4") {
        window.alert("Tipo di file non valido. Seleziona un video MP4.");
        errorVideoMessage = "Tipo di file non valido. Seleziona un video MP4.";
        fileInput.value = "";
        showErrorVideoMessage = true;
        setTimeout(() => {
          showErrorVideoMessage = false;
        }, 5000);
        return;
      } else {
        formData[key] = file;
        errorVideoMessage = "";
        showErrorVideoMessage = false;
      }

      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        window.alert(
          `Il tuo file supera i ${MAX_FILE_SIZE_MB} MB, seleziona un file con dimensioni massime di 30 MB.`
        );
        errorVideoMessage = `"Il tuo file supera i ${MAX_FILE_SIZE_MB}MB, seleziona un file con dimensioni massime di 30MB."`;
        fileInput.value = "";
        showErrorVideoMessage = true;
        setTimeout(() => {
          showErrorVideoMessage = false;
        }, 5000);
        return;
      }
    } else {
      window.alert("Please select a file.");
      errorVideoMessage = "Please select a file.";
      showErrorVideoMessage = true;
      setTimeout(() => {
        showErrorVideoMessage = false;
      }, 5000);
    }
  }

  function handleDeleteEntry(i, j) {
    if (formData?.sections?.[i]?.entries) {
      const newFormData = JSON.parse(JSON.stringify(formData));
      newFormData.sections[i].entries.splice(j, 1);
      formData = newFormData;
    }
    console.log(formData);
  }

  function addNewEntry(i) {
    if (formData?.sections?.[i]?.entries) {
      if (formData.sections[i].entries.length >= 15) {
        window.alert("Massimo 15 voci per sezione.");
        return;
      }
      const newEntry = { key: "", value: "" };
      const newFormData = JSON.parse(JSON.stringify(formData));
      newFormData.sections[i].entries.push(newEntry);
      formData = newFormData;
    }
  }

  function addNewSection() {
    if (formData.sections && formData.sections.length < 10) {
      const newFormData = JSON.parse(JSON.stringify(formData));
      const newSection = {
        name: `Sezione ${formData.sections.length + 1}`,
        entries: [],
      };
      newFormData.sections.push(newSection);
      formData = newFormData;
    } else {
      window.alert("Massimo 10 sezioni consentite.");
    }
  }

  function handleChangeSectionName(event, i) {
    const newFormData = JSON.parse(JSON.stringify(formData));
    if (newFormData.sections && newFormData.sections[i]) {
      newFormData.sections[i].name = event.target.value;
    }
    formData = newFormData;
  }

  function handleDeleteSection(index) {
    const newFormData = JSON.parse(JSON.stringify(formData));
    newFormData.sections.splice(index, 1);
    formData = newFormData;
  }

  async function saveChanges(event) {
    event?.preventDefault();
    console.log(formData);
  }
</script>

<div class="formContainer">
  <button on:click={goBack} class="backButton">
    <div class="icon-leftArrow">
      <FaArrowLeft />
    </div>
  </button>

  <form on:submit|preventDefault={saveChanges}>
    {#each Object.entries(model || {}) as [key, value]}
      {#if key !== "documentID" && key !== "sections"}
        <label>
          <p class="above">{customLabels[key] || key}</p>
          {#if key === "imageURL"}
            {#if showErrorImageMessage}
              <p
                class="error-above-img"
                transition:fly={{ y: 0, duration: 2000 }}
              >
                {errorImageMessage}
              </p>
            {/if}
            <div class="custom-file-input">
              <input
                type="file"
                accept="image/png"
                on:change={(event) => handleImageFileChange(event, key)}
              />
            </div>
          {:else if key === "videoURL"}
            {#if showErrorVideoMessage}
              <p
                class="error-above-video"
                transition:fly={{ y: 0, duration: 2000 }}
              >
                {errorVideoMessage}
              </p>
            {/if}
            <div class="custom-file-input">
              <input
                type="file"
                accept="video/mp4"
                on:change={(event) => handleVideoFileChange(event, key)}
              />
            </div>
          {:else}
            <textarea
              bind:value={formData[key]}
              on:input={(event) => handleChange(event, key)}
              rows="4"
            />
          {/if}
        </label>
      {/if}
    {/each}

    <hr />

    {#if formData && formData.sections && formData.sections.length > 0}
      {#each formData.sections as section, i}
        <div class="section-header">
          <h2>{section.name}</h2>

          <button
            type="button"
            class="add-entry-button"
            on:click={() => addNewEntry(i)}><CirclePlus /></button
          >
          <h4>[...{section.entries.length} elementi]</h4>

          <button
            type="button"
            class="delete-section-button"
            on:click={() => handleDeleteSection(i)}
          >
            Delete Section
          </button>
        </div>

        <label class="section-name-label">
          <p class="above">
            Nome Sezione (es. Descrizione, Funzionamento, Cause)
          </p>
          <textarea
            maxlength="30"
            bind:value={section.name}
            placeholder="Nome sezione"
            on:input={(event) => handleChangeSectionName(event, i)}
          />
        </label>

        {#each section.entries as entry, j}
          {#if formData.sections && formData.sections[i] && formData.sections[i].entries[j]}
            <label>
              <p class="above">{section.name}: {j}</p>
              <div class="entry-wrapper">
                <label>
                  <p class="above">Key</p>
                  <textarea
                    placeholder="...key"
                    value={formData.sections[i].entries[j].key}
                    on:input={(event) =>
                      handleChangeSectionEntries(event, i, j, "key")}
                  />
                </label>
                <label>
                  <p class="above">Value</p>
                  <textarea
                    placeholder="...value"
                    value={formData.sections[i].entries[j].value}
                    on:input={(event) =>
                      handleChangeSectionEntries(event, i, j, "value")}
                    rows="4"
                  />
                </label>
                <button
                  type="button"
                  class="above-delete-button"
                  on:click={() => handleDeleteEntry(i, j)}><Trash2 /></button
                >
                <div class="preview">
                  <h3>Preview:</h3>
                  <p>
                    {#if section.entries[j].key !== "" && section.entries[j].value !== ""}
                      <strong>{section.entries[j].key}: </strong>{section
                        .entries[j].value}
                    {:else}
                      <strong>"...key": "...value"</strong>
                    {/if}
                  </p>
                </div>
              </div>
            </label>
          {/if}
        {/each}
        <hr />
      {/each}
    {/if}
    <button type="button" class="addSectionButton" on:click={addNewSection}>
      <span style="display: flex; align-items: center;">
        Aggiungi Nuova Sezione
        <span class="add-section-icon"><TicketPlus /></span>
      </span>
    </button>
    <button type="submit">Save changes</button>
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
    gap: 28px;
    width: 60%;
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
    transform: translateY(-60%);
    pointer-events: none;
    color: white;
    border-radius: 4px;
    padding: 0 6px;
    font-size: 0.8rem;
    top: 0;
    left: 24px;
    background: navy;
    border: 1px solid blue;
    font-size: 0.8rem;
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

  .custom-file-input {
    overflow: hidden;
    cursor: pointer;
    padding: 25px 15px;
    border-radius: 20px;
    color: white;
    text-align: center;
    line-height: 1.5;
    width: 100%; /* Set width to 100% to fit the input field */
  }

  .custom-file-input:hover {
    background-color: blue;
  }
  .custom-file-input input[type="file" i] {
    width: calc(100% - 30px);
    position: relative;
    cursor: pointer;
    height: 100%;
  }

  .error-above-img,
  .error-above-video {
    position: absolute;
    transform: translateY(-60%);
    pointer-events: none;
    color: white;
    border-radius: 4px;
    padding: 0 6px;
    font-size: 0.8rem;
    top: 0;
    right: 0;
    background: red;
    border: 1px solid red;
    opacity: 1;
  }

  .above-delete-button {
    position: absolute;
    transform: translateY(-60%);
    color: white;
    border-radius: 4px;
    padding: 0 6px;
    font-size: 0.8rem;
    top: 0;
    right: 20px;
    background: red;
    border: 1px solid red;
    opacity: 1;
  }

  .above-delete-button:hover {
    background-color: darkred;
  }

  .entry-wrapper {
    display: flex;
    gap: 40px;
    flex-direction: column;
    padding: 10px;
    margin: 20px;
  }

  .preview {
    margin-top: 10px;
    padding: 10px;
    border-radius: 5px;
    max-width: 100%; /* Limit the maximum width */
    overflow-wrap: break-word; /* Allow long words to be broken and wrap onto the next line */
  }

  .preview h3 {
    margin-bottom: 5px;
    color: white;
    max-width: 100%; /* Limit the maximum width */
  }

  .preview strong {
    max-width: 100%; /* Limit the maximum width */
  }

  .preview p {
    max-width: 100%; /* Limit the maximum width */
  }

  .add-entry-button {
    background-color: green;
    color: white;
    border: none;
    border-radius: 50%;
    padding: 8px;
    cursor: pointer;
    font-size: 1.2rem;
    margin-left: 10px;
    margin-right: 10px;
  }

  .add-entry-button:hover {
    background-color: darkgreen;
  }

  .section-header {
    display: flex;
    align-items: center;
    max-width: 100%;
  }

  .addSectionButton {
    background-color: green;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 8px 16px;
    cursor: pointer;
    font-size: 0.9rem;
    margin-right: auto;
    margin-left: 10px; /* Adjust as needed */
  }

  .addSectionButton:hover {
    background-color: darkgreen;
  }

  .add-section-icon {
    width: 30px;
    height: 30px;
    margin-top: 5px;
    margin-left: 10px;
  }
  .section-name-label > p.above {
    white-space: nowrap; /* Prevent wrapping */
    overflow: hidden; /* Hide overflow text */
    text-overflow: ellipsis; /* Display ellipsis (...) for overflow text */
    max-width: calc(
      100% - 48px
    ); /* Adjust max-width to accommodate other elements */
  }

  .section-header {
    display: flex;
    align-items: center;
    max-width: 100%;
  }

  .delete-section-button {
    background-color: red;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 8px 16px;
    cursor: pointer;
    font-size: 0.9rem;
    margin-left: 20px;
  }

  .delete-section-button:hover {
    background-color: darkred;
  }
</style>
