<!-- CookieBanner.svelte -->
<script>
  export let message =
    "This website uses cookies. By continuing to use this site, you accept our use of cookies.";
</script>

<div class="cookie-banner">
  <p>{message} <a href="/legal/cookie-policy">Informativa Cookies</a></p>
</div>

<style>
  .cookie-banner {
    color: white;
    background-color: rgba(146, 177, 177, 0.178);
    padding: 20px 30px;
    font-size: 14px;
    border-radius: 10px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }

  .cookie-banner a {
    color: #fff;
    text-decoration: underline;
    margin-left: 10px;
  }

  .cookie-banner a:hover {
    text-decoration: none;
  }
</style>
