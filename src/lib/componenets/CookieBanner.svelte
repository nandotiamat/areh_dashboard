<!-- CookieBanner.svelte -->
<script>
  export let message =
    "This website uses cookies. By continuing to use this site, you accept our use of cookies.";
</script>

<div class="cookie-Banner">
  <p>{message}</p>
</div>

<style>
  .cookie-Banner {
    position: absolute;
    color: white;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    background-color: rgba(146, 177, 177, 0.178);
    padding: 20px 30px;
    font-size: 14px;
    border-radius: 10px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  }
</style>
