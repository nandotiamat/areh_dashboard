<script lang="ts">
    import { goto } from '$app/navigation';
    import type {Model} from '$lib/types.js';

    export let data: { models: Model[]; email: string; admin: boolean };
    let models = data.models;
    let email = data.email;
    let admin = data.admin;


    async function handleLogout() {
        const response = await fetch('/auth', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // Specify the content type
            },
            body: new URLSearchParams(),
        });
        
        if (response.ok) {
            // Redirect to the login page after successful logout
            goto('/auth');
        } else {
            // Handle logout failure
            console.error('Logout failed');
        }
    }

    console.log(data);
</script>

<style>
.navbar {
    background-color: #333;
    color: white;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logout-btn {
    background-color: red;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
}

.logout-btn:hover {
    background-color: darkred;
}
</style>

<div>
    <div class="navbar">
        <div>
            <h2>AREH DASHBOARD</h2>
            <p>Utente: {email}</p>
            {#if admin}
                <p>Ruolo: Admin</p>
            {/if}
        </div>
        <button class="logout-btn" on:click={handleLogout}>Logout</button>
    </div>

    <div>
            {#if models && models.length > 0}
        <ul>
            {#each models as model}
                <li>{model.name}</li>
                <li>{model.libraryName}</li>
                <li>{model.subtitle}</li>
                <li>{model.bottom_text}</li>

                <br>    
            {/each}
            
        </ul>
    {:else}
        <p>No models found.</p>
    {/if}
        </div>
</div>