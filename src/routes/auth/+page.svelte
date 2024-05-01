

<script>
  import Authenticate from '../../componenets/Authenticate.svelte';
  import {goto} from '$app/navigation';
  import {onMount} from 'svelte';


</script>





<Authenticate />

<!-- <h1>Auth</h1>
<div>
  <form method="POST">
    <input name="email" type="text" placeholder="email" />
    <input name="password" type="password" placeholder="password" />
    <button>Login</button>
  </form>
</div>

{#each data.users as user}
  <p>{user}</p>
{/each} -->
