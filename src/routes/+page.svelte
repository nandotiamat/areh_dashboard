<!-- App.svelte -->
<script>
  import { goto } from "$app/navigation";
  import Footer from "$lib/componenets/Footer.svelte";

  function scrollToFooter() {
    const footer = document.querySelector(".footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
  }
</script>

<div class="container">
  <img src="/images/logo.png" alt="Logo" class="logo" />

  <img src="/images/uni_logo.png" alt="University Logo" class="uni-logo" />

  <div class="info-text">
    <p>Benvenuto nella Dashboard web di AREH.</p>
    <p>Se sei un admin, loggati per gestire i modelli disponibli.</p>
  </div>

  <div style="margin-top: 150px">
    <button
      class="login-button"
      on:click={() => {
        goto("/auth");
      }}
    >
      Login
    </button>
  </div>

  <button
    class="scroll-indicator"
    on:click={scrollToFooter}
    on:keydown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        scrollToFooter();
      }
    }}
    aria-label="Scroll to footer"
  >
    <span>▼</span>
  </button>
</div>

<Footer />

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
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-image: url("/images/splash_page_bg.png");
    background-size: cover;
    background-position: center;
    padding-bottom: 100px; /* Ensure there's enough space for scrolling */
    position: relative;
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

  .scroll-indicator {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    cursor: pointer;
    color: #ffffff;
    font-size: 24px;
    background: none;
    border: none;
    animation: bounce 2s infinite;
    outline: none; /* Remove default focus outline */
  }

  .scroll-indicator:focus {
    outline: none; /* Remove focus outline */
  }

  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
</style>
