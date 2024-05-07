<div class="mainContainer">
  <slot />
</div>

<style>
  .mainContainer {
    min-height: 100vh;
    background: linear-gradient(to right, #000428, #040466);
    color: black;
    position: relative;
    display: flex;
    flex-direction: column;
  }
</style>
