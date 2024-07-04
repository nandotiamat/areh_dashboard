<script>
  import { goto } from "$app/navigation";
  import CookieBanner from "$lib/componenets/CookieBanner.svelte";
</script>

<div class="container">
  <img src="/images/logo.png" alt="Logo" class="logo" />

  <img src="/images/uni_logo.png" alt="University Logo" class="uni-logo" />

  <div class="info-text">
    <p>Benvenuto nella Dashboard web di AREH.</p>
    <p>Se sei un admin, loggati per gestire i modelli disponibli.</p>
  </div>

  <button
    class="login-button"
    on:click={() => {
      goto("/auth");
    }}
  >
    Login
  </button>

  <CookieBanner />
</div>

<style>
  :global(body) {
    font-family: "Montserrat", sans-serif;
    margin: 0;
    padding: 0;
  }

  .info-text {
    text-align: center;
    color: #ffffff;
    font-size: 18px;
    line-height: 1.5;
  }

  .container {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-image: url("/images/splash_page_bg.png");
    background-size: cover;
    background-position: center;
  }

  .logo {
    position: absolute;
    top: 30px;
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
  }

  .uni-logo {
    position: absolute;
    top: 30px;
    left: 20px;
    height: 150px;
  }

  .login-button {
    margin-top: 60px;
    padding: 18px 30px;
    background-color: rgba(146, 177, 177, 0.178);
    color: #ffffff;
    border: none;
    border-radius: 5px;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
    transition:
      background-color 0.3s ease,
      box-shadow 0.3s ease;
  }

  .login-button:hover {
    background-color: rgba(25, 92, 92, 0.4);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
</style>
