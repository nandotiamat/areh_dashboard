<script lang="ts">
  import { goto, preloadData } from "$app/navigation";
  import { page } from "$app/stores"; // Import the page store
  import type { Model } from "$lib/types.js"; // Updated import for Model and Section interfaces
  import FaArrowLeft from "svelte-icons/fa/FaArrowLeft.svelte";
  import { reorderKeys } from "$lib/utils/reorderKeys.js";
  import { error, redirect } from "@sveltejs/kit";
  import { fly, fade } from "svelte/transition";
  import {
    Undo2,
    Trash,
    Trash2,
    CirclePlus,
    TicketPlus,
    RotateCcw,
  } from "lucide-svelte";
  import {
    MAX_FILE_SIZE_MB,
    allowedExtensions,
    customLabels,
    keyOrder,
  } from "$lib/utils/constants.js";

  export let data: { models: Model[]; email: string; admin: boolean };

  const documentID = $page.params.id;
  let models = data.models;
  let email = data.email;
  let admin = data.admin;

  let errorImageMessage = "";
  let errorVideoMessage = "";
  let errorGLBMessage = "";
  let errorUSDZMessage = "";
  let showErrorImageMessage = false;
  let showErrorVideoMessage = false;
  let showErrorGLBMessage = false;
  let showErrorUSDZMessage = false;

  let isSubmitting = false;

  function setErrorImageMessage(message) {
    errorImageMessage = message;
    showErrorImageMessage = true;
  }

  function setErrorVideoMessage(message) {
    errorVideoMessage = message;
    showErrorVideoMessage = true;
  }

  function setErrorGLBMessage(message) {
    errorGLBMessage = message;
    showErrorGLBMessage = true;
  }

  function setErrorUSDZMessage(message) {
    errorUSDZMessage = message;
    showErrorUSDZMessage;
  }

  function setShowErrorImageMessage(value: boolean) {
    showErrorImageMessage = value;
  }

  function setShowErrorVideoMessage(value: boolean) {
    showErrorVideoMessage = value;
  }

  function setShowErrorGLBMessage(value: boolean) {
    showErrorGLBMessage = value;
  }

  function setShowErrorUSDZMessage(value: boolean) {
    showErrorUSDZMessage = value;
  }

  let model = models.find((model) => model.documentID === documentID);

  model = reorderKeys(keyOrder, model);

  if (!model) {
    if (typeof window !== "undefined") {
      goto("/dashboard");
    }
  }

  function goBack() {
    goto("/dashboard", { replaceState: true, invalidateAll: true });
    // this refresh the /dashboard page models data
  }

  // Create a separate state for the form data
  let formData: Partial<Model> = { ...model }; // Use Partial<Model> to allow partial updates

  function handleChange(event, key) {
    formData[key] = event.target.value;
  }

  function handleChangeSectionEntries(event, i, j, field) {
    if (!formData.sections) {
      return;
    }

    // Update the nested property using spread syntax
    formData.sections = formData.sections.map((section, index) => {
      if (index === i && section.entries && section.entries[j]) {
        return {
          ...section,
          entries: section.entries.map((entry, entryIndex) => {
            if (entryIndex === j) {
              return {
                ...entry,
                [field]: event.target.value,
              };
            }
            return entry;
          }),
        };
      }
      return section;
    });
  }

  function handleFileChange(
    event,
    key,
    setErrorMessage,
    setShowError,
    allowedExtension
  ) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files && fileInput.files[0];

    if (file) {
      const fileName = file.name;
      const fileExtension = fileName.slice(fileName.lastIndexOf("."));
      if (fileExtension !== allowedExtension) {
        const message = `Invalid file type. Please select a ${allowedExtension.toUpperCase()} file`;
        window.alert(message);
        setErrorMessage(message);
        setShowError(true);
        fileInput.value = "";
        setTimeout(() => {
          setErrorMessage("");
          setShowError(false);
        }, 5000);
        formData[key] = model ? model[key] : "";
        return;
      } else {
        formData[key] = file;
        setErrorMessage("");
        setShowError(false);
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        const message = `File size exceeds ${MAX_FILE_SIZE_MB} MB. Please select a file with a maximum size of ${MAX_FILE_SIZE_MB} MB.`;
        window.alert(message);
        setErrorMessage(message);
        setShowError(true);
        fileInput.value = "";
        setTimeout(() => {
          setErrorMessage("");
          setShowError(false);
        }, 5000);
        return;
      } else {
        formData[key] = file;
        setErrorMessage("");
        setShowError(false);
      }
    } else {
      window.alert("Seleziona un file se vuoi sostituire quello attuale");
      formData[key] = model ? model[key] : "";
      setErrorMessage("Please select a file.");
      setShowError(true);
      setTimeout(() => {
        setErrorMessage("");
        setShowError(false);
      }, 5000);
    }
  }

  function handleImageFileChange(event, key) {
    handleFileChange(
      event,
      key,
      setErrorImageMessage,
      setShowErrorImageMessage,
      allowedExtensions[key]
    );
  }

  function handleVideoFileChange(event, key) {
    handleFileChange(
      event,
      key,
      setErrorVideoMessage,
      setShowErrorVideoMessage,
      allowedExtensions[key]
    );
  }

  function handleGLBFileChange(event, key) {
    handleFileChange(
      event,
      key,
      setErrorGLBMessage,
      setShowErrorGLBMessage,
      allowedExtensions[key]
    );
  }

  function handleUSDZFileChange(event, key) {
    handleFileChange(
      event,
      key,
      setErrorUSDZMessage,
      setShowErrorUSDZMessage,
      allowedExtensions[key]
    );
  }

  function handleDeleteEntry(i, j) {
    if (formData?.sections?.[i]?.entries) {
      const newFormData = JSON.parse(JSON.stringify(formData));
      newFormData.sections[i].entries.splice(j, 1);
      formData.sections[i].entries = newFormData.sections[i].entries;
      console.log(formData);
    }
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
      formData.sections[i].entries = newFormData.sections[i].entries;
    }
  }

  function addNewSection() {
    if (formData.sections && formData.sections.length < 10) {
      const newFormData = JSON.parse(JSON.stringify(formData));

      // Find the next available section name
      let index = 1;
      let newSectionName = `Sezione ${index}`;
      while (
        formData.sections.some((section) => section.name === newSectionName)
      ) {
        index++;
        newSectionName = `Sezione ${index}`;
      }

      const newSection = {
        name: newSectionName,
        entries: [],
      };
      newFormData.sections.push(newSection);

      formData.sections = newFormData.sections;
    } else {
      window.alert("Massimo 10 sezioni consentite.");
    }
  }

  function handleChangeSectionName(event, i) {
    const newFormData = JSON.parse(JSON.stringify(formData));
    if (newFormData.sections && newFormData.sections[i]) {
      newFormData.sections[i].name = event.target.value;
      formData.sections = newFormData.sections;
    }
  }

  function handleDeleteSection(index) {
    const newFormData = JSON.parse(JSON.stringify(formData));
    newFormData.sections.splice(index, 1);
    formData.sections = newFormData.sections;
  }

  function restoreFormDataToModel() {
    formData = { ...model };
    window.scrollTo(0, 0);
    alert("Modifiche annullate. Ricompila il form da capo");
  }

  async function saveChanges() {
    if (model && model.documentID) {
      if (JSON.stringify(formData) !== JSON.stringify(model)) {
        const confirmSave = confirm(
          "Sei sicuro di voler salvare le modifiche?"
        );

        if (confirmSave) {
          isSubmitting = true;
          try {
            const _formData = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
              if (
                typeof value === "object" &&
                value !== null &&
                !(value instanceof File)
              ) {
                _formData.append(key, JSON.stringify(value));
              } else {
                _formData.append(key, value);
              }
            });

            console.log(_formData);

            const response = await fetch(
              `/dashboard/modify-model-${model?.documentID}`,
              {
                method: "POST",
                body: _formData,
              }
            );

            if (response.ok) {
              const responseData = await response.json();
              console.log("Form submission successful:", responseData);
              goto("/dashboard", { replaceState: true, invalidateAll: true });
              alert("Modello modificato con successo!");
            } else {
              if (response.status === 400) {
                const errorMessage = await response.text();
                console.error("Bad request:", errorMessage);
                alert("Error: Bad request. Please try again.");
              } else if (response.status === 500) {
                console.error("Internal server error");
                alert("Internal server error. Please try again later.");
              } else {
                console.error("Unexpected status code:", response.status);
                alert("An unexpected error occurred. Please try again later.");
              }
            }
          } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again later.");
          } finally {
            isSubmitting = false;
          }
        }
      } else {
        alert("Nessuna modifica apportata.");
        window.scrollTo(0, 0);
      }
    } else {
      alert("Modello non trovato. Si prega di riprovare.");
      window.scrollTo(0, 0);
    }
  }

  function resetFileInput(key) {
    const fileInput = document.getElementById(
      `${allowedExtensions[key].split(".")[1]}-input`
    ) as HTMLInputElement | null;
    console.log(fileInput);
    if (fileInput) {
      fileInput.value = "";
    }
    formData[key] = "";
  }
</script>

<div class="formContainer">
  <button on:click={goBack} class="backButton">
    <div class="icon-leftArrow">
      <FaArrowLeft />
    </div>
  </button>

  <form on:submit|preventDefault={saveChanges}>
    {#if model}
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
                  id="png-input"
                  type="file"
                  on:change={(event) => handleImageFileChange(event, key)}
                />

                {#if model[key] !== ""}
                  {#if formData[key] === model[key] && formData[key] !== ""}
                    <div style="display: flex; align-items: center;">
                      <button
                        type="button"
                        on:click={(event) => {
                          event.preventDefault();
                          formData[key] = "";
                        }}
                        class="reset-button"
                        style="border: none; margin-top: 15px;"
                      >
                        <Trash style="color: red; width: 20px; height: 20px;" />
                      </button>
                      <p style="margin-top: 20px; margin-left: 15px">
                        "model.png" è attualmente disponibile online per questo
                        modello
                      </p>
                    </div>
                  {/if}
                {/if}

                {#if formData[key] === ""}
                  <div class="file-info">
                    <p style="margin-top: 20px; color: red;">
                      Nessun file "{allowedExtensions[key]}" è attualmente
                      disponibile per questo modello
                    </p>
                  </div>
                {/if}

                {#if formData[key] !== model[key] && formData[key] !== ""}
                  <button
                    type="button"
                    on:click={(event) => {
                      event.preventDefault();
                      resetFileInput(key);
                    }}
                    class="reset-button-side"
                    style="border: none; margin-top: 15px;"
                  >
                    <Trash
                      style="color: red; width: 25px; height: 25px; margin-bottom: 10px"
                    />
                  </button>
                {/if}
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
                  id="mp4-input"
                  type="file"
                  on:change={(event) => handleVideoFileChange(event, key)}
                />
                {#if model[key] !== ""}
                  {#if formData[key] === model[key] && formData[key] !== ""}
                    <div style="display: flex; align-items: center;">
                      <button
                        type="button"
                        on:click={(event) => {
                          event.preventDefault();
                          formData[key] = "";
                        }}
                        class="reset-button"
                        style="border: none; margin-top: 15px;"
                      >
                        <Trash style="color: red; width: 20px; height: 20px;" />
                      </button>
                      <p style="margin-top: 20px; margin-left: 15px">
                        "video.mp4" è attualmente disponibile online per questo
                        modello
                      </p>
                    </div>
                  {/if}
                {/if}

                {#if formData[key] === ""}
                  <div class="file-info">
                    <p style="margin-top: 20px; color: red;">
                      Nessun file "{allowedExtensions[key]}" è attualmente
                      disponibile per questo modello
                    </p>
                  </div>
                {/if}

                {#if formData[key] !== model[key] && formData[key] !== ""}
                  <div style="display: flex; align-items: center;">
                    <button
                      type="button"
                      on:click={(event) => {
                        event.preventDefault();
                        resetFileInput(key);
                      }}
                      class="reset-button-side"
                      style="border: none; margin-top: 15px;"
                    >
                      <Trash
                        style="color: red; width: 25px; height: 25px; margin-bottom: 10px"
                      />
                    </button>
                  </div>
                {/if}
              </div>
            {:else if key === "glbURL"}
              {#if showErrorGLBMessage}
                <p
                  class="error-above-glb"
                  transition:fly={{ y: 0, duration: 2000 }}
                >
                  {errorGLBMessage}
                </p>
              {/if}
              <div class="custom-file-input">
                <input
                  id="glb-input"
                  type="file"
                  on:change={(event) => handleGLBFileChange(event, key)}
                />
                {#if model[key] !== ""}
                  {#if formData[key] === model[key] && formData[key] !== ""}
                    <div style="display: flex; align-items: center;">
                      <button
                        type="button"
                        on:click={(event) => {
                          event.preventDefault();
                          formData[key] = "";
                        }}
                        class="reset-button"
                        style="border: none; margin-top: 15px;"
                      >
                        <Trash style="color: red; width: 20px; height: 20px;" />
                      </button>
                      <p style="margin-top: 20px; margin-left: 15px">
                        "model.glb" è attualmente disponibile online per questo
                        modello
                      </p>
                    </div>
                  {/if}
                {/if}

                {#if formData[key] === ""}
                  <div class="file-info">
                    <p style="margin-top: 20px; color: red;">
                      Nessun file "{allowedExtensions[key]}" è attualmente
                      disponibile per questo modello
                    </p>
                  </div>
                {/if}

                {#if formData[key] !== model[key] && formData[key] !== ""}
                  <div style="display: flex; align-items: center;">
                    <button
                      type="button"
                      on:click={(event) => {
                        event.preventDefault();
                        resetFileInput(key);
                      }}
                      class="reset-button-side"
                      style="border: none; margin-top: 15px;"
                    >
                      <Trash
                        style="color: red; width: 25px; height: 25px; margin-bottom: 10px"
                      />
                    </button>
                  </div>
                {/if}
              </div>
            {:else if key === "usdzURL"}
              {#if showErrorUSDZMessage}
                <p
                  class="error-above-usdz"
                  transition:fly={{ y: 0, duration: 2000 }}
                >
                  {errorUSDZMessage}
                </p>
              {/if}
              <div class="custom-file-input">
                <input
                  id="usdz-input"
                  type="file"
                  on:change={(event) => handleUSDZFileChange(event, key)}
                />
                {#if model[key] !== ""}
                  {#if formData[key] === model[key] && formData[key] !== ""}
                    <div style="display: flex; align-items: center;">
                      <button
                        type="button"
                        on:click={(event) => {
                          event.preventDefault();
                          formData[key] = "";
                        }}
                        class="reset-button"
                        style="border: none; margin-top: 15px;"
                      >
                        <Trash style="color: red; width: 20px; height: 20px;" />
                      </button>
                      <p style="margin-top: 20px; margin-left: 15px">
                        "model.usdz" è attualmente disponibile online per questo
                        modello
                      </p>
                    </div>
                  {/if}
                {/if}

                {#if formData[key] === ""}
                  <div class="file-info">
                    <p style="margin-top: 20px; color: red;">
                      Nessun file "{allowedExtensions[key]}" è attualmente
                      disponibile per questo modello
                    </p>
                  </div>
                {/if}

                {#if formData[key] !== model[key] && formData[key] !== ""}
                  <button
                    type="button"
                    on:click={(event) => {
                      event.preventDefault();
                      resetFileInput(key);
                    }}
                    class="reset-button-side"
                    style="border: none; margin-top: 15px;"
                  >
                    <Trash
                      style="color: red; width: 25px; height: 25px; margin-bottom: 10px"
                    />
                  </button>
                {/if}
              </div>
            {:else}
              <textarea
                bind:value={formData[key]}
                on:input={(event) => handleChange(event, key)}
                rows="4"
                required={key === "name" || key === "category" ? true : false}
                placeholder={`...Inserisci ${customLabels[key] || key}`}
              />
            {/if}
          </label>
        {/if}
      {/each}
    {/if}

    <hr />

    {#if formData && formData.sections && formData.sections.length > 0}
      {#each formData.sections as section, i}
        <div class="section-header" transition:fade>
          <h2 style="color: black">{section.name}</h2>

          <button
            type="button"
            class="add-entry-button"
            on:click={() => addNewEntry(i)}><CirclePlus /></button
          >
          <h4 style="color: black">[...{section.entries.length} elementi]</h4>

          <button
            type="button"
            class="delete-section-button"
            on:click={() => handleDeleteSection(i)}
          >
            Delete Section
          </button>
        </div>

        <label class="section-name-label" transition:fade>
          <p class="above">
            Nome Sezione (es. Descrizione, Funzionamento, Cause)
          </p>
          <textarea
            maxlength="35"
            value={section.name}
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
                    maxlength="50"
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
                    rows="8"
                  />
                </label>
                <button
                  type="button"
                  class="above-delete-button"
                  on:click={() => handleDeleteEntry(i, j)}><Trash2 /></button
                >
                <div class="preview">
                  <h3 style="color: black">Preview:</h3>
                  <p style="color: black">
                    {#if section.entries[j].key !== "" || section.entries[j].value !== ""}
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
    <div style="display: flex; justify-content: space-between;">
      <button type="button" class="addSectionButton" on:click={addNewSection}>
        Aggiungi Nuova Sezione
        <TicketPlus
          style="width: 24px; height: 24px; color: white; margin-top: 10px"
        />
      </button>
      <button
        type="button"
        class="restore-button"
        on:click={restoreFormDataToModel}
      >
        Annulla Modifiche
        <RotateCcw
          style="width: 24px; height: 24px; color: white; margin-top: 10px"
        />
      </button>
    </div>

    {#if isSubmitting}
      <p>Invio richiesta in corso...</p>
    {:else}
      <button type="submit" disabled={isSubmitting}>Save changes</button>
    {/if}
  </form>
</div>

<style>
  @import "/src/styles/form_modifyModel.css";
</style>
