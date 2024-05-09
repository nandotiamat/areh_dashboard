<script>
  import { goto } from "$app/navigation";
  import { error } from "@sveltejs/kit";

  let email = "";
  let password = "";
  let errorMessage = "";
  let loginSuccessful = false;
  let loading = false;

  // Function to handle changes in the email input field
  function handleEmailChange(event) {
    email = event.target.value; // Update the email variable
    errorMessage = ""; // Reset the error message
  }

  // Function to handle changes in the password input field
  function handlePasswordChange(event) {
    password = event.target.value; // Update the password variable
    errorMessage = ""; // Reset the error message
  }

  async function handleAuthenticate() {
    if (!email || !password) {
      errorMessage = "Please fill in all the fields.";
      return;
    }

    loading = true; // flag to show loading spinner

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
      loginSuccessful = true;
      goto("/dashboard");
    } else if (response.status === 403) {
      // Forbidden (user doesn't have admin role)
      errorMessage =
        "You do not have permission to login as you are not an admin.";
      password = "";
    } else {
      // Other error status codes
      errorMessage = "Credentials are incorrect. Please try again.";
      password = "";
    }
    loading = false; //dispose the spinner
  }
</script>

<div class="authContainer">
  <form on:submit|preventDefault={handleAuthenticate} method="POST">
    <h1>Login</h1>
    {#if errorMessage}
      <p class="error">{errorMessage}</p>
    {:else if loginSuccessful}
      <p class="login-successful">Login andato a buon fine</p>
    {/if}
    <label>
      <p class={email ? "above" : "center"}>Email</p>
      <input
        bind:value={email}
        type="email"
        placeholder="Email"
        on:input={handleEmailChange}
      />
    </label>
    <label>
      <p class={password ? "above" : "center"}>Password</p>
      <input
        bind:value={password}
        type="password"
        placeholder="Password"
        on:input={handlePasswordChange}
      />
    </label>
    <button type="submit" class:loading>
      {#if loading}
        <!-- Display a spinner when loading is true -->
        <div class="spinner"></div>
      {:else}
        Submit
      {/if}</button
    >
  </form>
</div>

<style>
  .authContainer {
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    padding: 34px;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  form {
    width: 500px;
    max-width: 100%;
    margin: 0 auto;
  }

  form input {
    width: 100%;
    padding: 48px;
    font-size: 28px;
  }

  h1 {
    text-align: center;
    font-size: 3rem;
  }

  form label {
    position: relative;
    border: 1px solid rgb(10, 10, 189);
    border-radius: 5px;
  }

  form input {
    border: solid 1px blue;
    background: transparent;
    color: white;
    padding: 14px;
  }

  form input:focus {
    border: none;
    outline: none;
  }

  form label:focus-within {
    border-color: blue;
  }

  form button {
    background: rgb(7, 7, 216);
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
    background: rgb(14, 14, 231);
    border: 1px solid rgb(0, 47, 255);
    font-size: 0.7rem;
  }

  .center {
    top: 50%;
    left: 6px;
    border: 1px solid transparent;
    opacity: 0;
  }

  .error {
    color: coral;
    font-size: 0.9rem;
    text-align: center;
  }

  .login-successful {
    color: greenyellow;
    font-size: 0.9rem;
    text-align: center;
  }

  .options div p:last-of-type {
    color: cyan;
    cursor: pointer;
  }

  .spinner {
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-left-color: #09f;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    animation: spin 2s linear infinite;
  }

  /* Add a simple rotation animation for the spinner */
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
