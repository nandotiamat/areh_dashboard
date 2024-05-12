<script lang="ts">
  import { goto, preloadData } from "$app/navigation";
  import { page } from "$app/stores";
  import type { Model } from "$lib/types.js";
  import FaArrowLeft from "svelte-icons/fa/FaArrowLeft.svelte";
  import { reorderKeys } from "$lib/utils/reorderKeys.js";
  import { error } from "@sveltejs/kit";
  import { fly, fade } from "svelte/transition";
  import {
    Undo2,
    Trash,
    Trash2,
    CirclePlus,
    TicketPlus,
    RotateCcw,
  } from "lucide-svelte";
  import { MAX_FILE_SIZE_MB } from "$lib/utils/constants.js";

  export let data: { models: Model[]; email: string; admin: boolean };
  let models = data.models;
  let email = data.email;
  let admin = data.admin;

  function goBack() {
    goto("/dashboard", { replaceState: true, invalidateAll: true });
    // this refresh the /dashboard page models data
  }
  let formData: Model = {
    documentID: "",
    name: "",
    category: "",
    subtitle: "",
    bottom_text: "",
    sections: [
      {
        name: "Sezione 1",
        entries: [
          {
            key: "",
            value: "",
          },
        ],
      },
    ],
    imageURL: "",
    videoURL: "",
    glbURL: "",
    usdzURL: "",
  };

  let errorImageMessage = "";
  let errorVideoMessage = "";
  let errorGLBMessage = "";
  let errorUSDZMessage = "";
  let showErrorImageMessage = false;
  let showErrorVideoMessage = false;
  let showErrorGLBMessage = false;
  let showErrorUSDZMessage = false;

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

  const keyOrder = [
    "name",
    "category",
    "subtitle",
    "sections",
    "bottom_text",
    "imageURL",
    "videoURL",
    "glbURL",
    "usdzURL",
  ];
  formData = reorderKeys(keyOrder, formData);

  const customLabels = {
    name: "Nome Modello",
    category: "Categoria",
    subtitle: "Sottotitolo",
    bottom_text: "Conclusione/Testo in fondo",
    imageURL: "Immagine (.png)",
    videoURL: "Video (.mp4)",
    glbURL: "Modello 3D (.glb)",
    usdzURL: "Modello 3D (.usdz)",
  };

  const allowedExtensions = {
    imageURL: ".png",
    videoURL: ".mp4",
    glbURL: ".glb",
    usdzURL: ".usdz",
  };

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
        formData[key] = "";
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
      window.alert("Please select a file.");
      setErrorMessage("Please select a file.");
      setShowError(true);
      setTimeout(() => {
        setErrorMessage("");
        setShowError(false);
      }, 5000);
      formData[key] = "";
    }
  }

  function resetFileInput(key) {
    const fileInput = document.getElementById(
      `${allowedExtensions[key].split(".")[1]}-input`
    ) as HTMLInputElement | null;
    if (fileInput) {
      fileInput.value = "";
    }
    formData[key] = "";
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

      // Sort sections by name

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
    formData = {
      documentID: "",
      name: "",
      category: "",
      subtitle: "",
      bottom_text: "",
      sections: [
        {
          name: "Sezione 1",
          entries: [
            {
              key: "",
              value: "",
            },
          ],
        },
      ],
      imageURL: "",
      videoURL: "",
      glbURL: "",
      usdzURL: "",
    };
  }

  let isSubmitting = false;

  async function saveChanges() {
    console.log(formData);
    if (formData) {
      const confirmSave = confirm(
        "Sei sicuro di voler creare un modello con questi dati inseriti?"
      );
      if (confirmSave) {
        isSubmitting = true;
        try {
          const _formData = new FormData();

          console.log(typeof formData["imageURL"] === "object");

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

          const response = await fetch("/dashboard/add-model", {
            method: "POST",
            body: _formData,
          });

          if (response.ok) {
            const responseData = await response.json();
            console.log("Model added successfully:", responseData);
            goto("/dashboard", { replaceState: true, invalidateAll: true });
            alert("Modello creato con successo!");
          } else {
            if (response.status === 400) {
              alert(
                "Errore nella creazione del modello: Assicurati di aver compilato tutti i campi obbligatori."
              );
              goto("/dashboard", { replaceState: true, invalidateAll: true });
            } else if (response.status === 500) {
              console.error("Internal server error");
              alert("Internal server error. Please try again later.");
              goto("/dashboard", { replaceState: true, invalidateAll: true });
            } else {
              console.error("Unexpected status code:", response.status);
              alert("An unexpected error occurred. Please try again later.");
              goto("/dashboard", { replaceState: true, invalidateAll: true });
            }
          }
        } catch (error) {
          console.error("An error occurred:", error);
          alert("Si è verificato un errore. Riprova più tardi.");
          goto("/dashboard", { replaceState: true, invalidateAll: true });
        } finally {
          isSubmitting = false;
        }
      } else {
        alert("Nessun modello creato, ricompila il form e riprova.");
        window.scrollTo(0, 0);
      }
    } else {
      alert("Compila il form per creare un modello");
      window.scrollTo(0, 0);
    }
  }
</script>

<div class="formContainer">
  <button on:click={goBack} class="backButton">
    <div class="icon-leftArrow">
      <FaArrowLeft />
    </div>
  </button>

  <form on:submit|preventDefault={saveChanges}>
    {#each Object.entries(formData || {}) as [key, value]}
      {#if key !== "documentID" && key !== "sections"}
        <label>
          <p class="above">{customLabels[key] || key}</p>
          {#if key === "imageURL"}
            {#if showErrorImageMessage}
              <p
                class="error-above-img"
                transition:fly={{ y: 0, duration: 1000 }}
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
              {#if formData[key] !== ""}
                <button
                  type="button"
                  on:click={(event) => {
                    event.preventDefault();
                    resetFileInput(key);
                  }}
                  class="reset-button"
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
                transition:fly={{ y: 0, duration: 1000 }}
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
              {#if formData[key] !== ""}
                <button
                  type="button"
                  on:click={(event) => {
                    event.preventDefault();
                    resetFileInput(key);
                  }}
                  class="reset-button"
                  style="border: none; margin-top: 15px;"
                >
                  <Trash
                    style="color: red; width: 25px; height: 25px; margin-bottom: 10px"
                  />
                </button>
              {/if}
            </div>
          {:else if key === "glbURL"}
            {#if showErrorGLBMessage}
              <p
                class="error-above-glb"
                transition:fly={{ y: 0, duration: 1000 }}
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
              {#if formData[key] !== ""}
                <button
                  type="button"
                  on:click={(event) => {
                    event.preventDefault();
                    resetFileInput(key);
                  }}
                  class="reset-button"
                  style="border: none; margin-top: 15px;"
                >
                  <Trash
                    style="color: red; width: 25px; height: 25px; margin-bottom: 10px"
                  />
                </button>
              {/if}
            </div>
          {:else if key === "usdzURL"}
            {#if showErrorUSDZMessage}
              <p
                class="error-above-usdz"
                transition:fly={{ y: 0, duration: 1000 }}
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
              {#if formData[key] !== ""}
                <button
                  type="button"
                  on:click={(event) => {
                    event.preventDefault();
                    resetFileInput(key);
                  }}
                  class="reset-button"
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
              placeholder="...Inserisci {customLabels[key] || key}"
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
        <div class="section-header" transition:fade>
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

        <label class="section-name-label" transition:fade>
          <p class="above">
            Nome Sezione (es. Descrizione, Funzionamento, Cause)
          </p>
          <textarea
            maxlength="35"
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
                  <h3>Preview:</h3>
                  <p>
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
  @import "/src/styles/form_addModel.css";
</style>
