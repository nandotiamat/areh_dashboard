<script>
  import { goto } from "$app/navigation";
  import { error } from "@sveltejs/kit";
  import { Mail, LockKeyhole } from "lucide-svelte";

  let email = "";
  let password = "";
  let errorMessage = "";
  let loginSuccessful = false;
  let loading = false;

  // Function to handle changes in the email input field
  function handleEmailChange(event) {
    email = event.target.value;
    errorMessage = "";
  }

  // Function to handle changes in the password input field
  function handlePasswordChange(event) {
    password = event.target.value;
    errorMessage = "";
  }

  async function handleAuthenticate() {
    if (!email || !password) {
      errorMessage = "Please fill in all the fields.";
      return;
    }

    loading = true;

    const response = await fetch("/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        email,
        password,
      }),
    });

    if (response.ok) {
      goto("/dashboard");
      loginSuccessful = true;
    } else if (response.status === 403) {
      // Forbidden (user doesn't have admin role)
      errorMessage =
        "You do not have permission to login as you are not an admin.";
      password = "";
    } else {
      errorMessage = "Credentials are incorrect. Please try again.";
      password = "";
    }
    loading = false;
  }
</script>

<div class="authContainer">
  <form on:submit|preventDefault={handleAuthenticate} method="POST">
    <h1 style="color: black">Login</h1>
    {#if errorMessage}
      <p class="error">{errorMessage}</p>
    {:else if loginSuccessful}
      <p class="login-successful">Login andato a buon fine</p>
    {/if}
    <label>
      <Mail class="form-icon" />
      <p class={email ? "above" : "center"}>Email</p>
      <input
        bind:value={email}
        type="email"
        placeholder="Email"
        on:input={handleEmailChange}
        required
      />
    </label>
    <label>
      <LockKeyhole />

      <p class={password ? "above" : "center"}>Password</p>
      <input
        bind:value={password}
        type="password"
        placeholder="Password"
        on:input={handlePasswordChange}
        required
      />
    </label>
    <button type="submit" class:loading>
      {#if loading}
        <div class="spinner"></div>
      {:else}
        Submit
      {/if}</button
    >
  </form>
</div>

<style>
  @import "/src/styles/auth_form.css";
</style>
