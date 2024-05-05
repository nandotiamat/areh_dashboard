<script lang="ts">
    import FaPlusCircle from 'svelte-icons/fa/FaPlusCircle.svelte';
    import FaUserSlash from 'svelte-icons/fa/FaUserSlash.svelte';
    import FaUserShield from 'svelte-icons/fa/FaUserShield.svelte';
    import { goto } from '$app/navigation';
    import type { Model } from '$lib/types.js';
    import { page } from '$app/stores';


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

    function goToAddNewModel() {
        goto(' /dashboard/add-model');
    }

</script>

    <div class="navbar">
        <div>
            <h2 style="font-size: 24px;">AREH DASHBOARD</h2> 
            <p style="font-size: 18px; margin-top:10px">Utente: {email}</p>
            {#if admin}
                <div style="display: flex; align-items: center;">
                    <p style="font-size: 18px; margin-top:12px">Ruolo: Admin</p>
                    <div class="icon-admin"><FaUserShield/></div>
                </div>
            {/if}
        </div>

        {#if $page.url.pathname === '/dashboard/add-model'}
            <div>
                <h2>AGGIUNGI UN NUOVO MODELLO!!</h2>
            </div>
        {:else if $page.url.pathname === `/dashboard/modify-model-${$page.params.id}`}
            <div>
                <h2>MODIFICA IL MODELLO!!</h2>
            </div>
        {/if}

        <div class="button-container">
            <div>
                <button class="add-model-btn" on:click={goToAddNewModel}>
                    Aggiungi un Modello
                    <div class='icon-add'>
                        <FaPlusCircle />
                    </div>
                </button>
            </div>
            <button class="logout-btn" on:click={handleLogout}>
                Logout
                <div class='icon-logout'>
                        <FaUserSlash />
                    </div>
            </button>
        </div>
    </div>
<slot />



<style>
/* Navbar Styles */
.navbar {
    background-color: #87CEEB; /* Sky blue color */
    color: black;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.button-container {
    display: flex;
    align-items: center;
}

.add-model-btn {
    background-color: green;
    color: white;
    border: none;
    padding: 15px 20px; /* Increased button size */
    border-radius: 8px; /* Increased button border radius */
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-right: 40px;
     /* Add margin between buttons */
    
}

.logout-btn {
    background-color: red;
    color: white;
    border: none;
    padding: 15px 20px; /* Increased button size */
    border-radius: 8px; /* Increased button border radius */
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-size: 16px; /* Increased font size */
}

.add-model-btn:hover {
    background-color: darkgreen;
}

.logout-btn:hover {
    background-color: darkred;
}

.icon-add {
    width: 24px;
    height: 24px;
    margin-left: 50px;
    margin-top: 10px;
}

.icon-logout {
    width: 24px;
    height: 24px;
    margin-left: 15px;
    margin-top: 10px;
}

.icon-admin {
    width: 24px;
    height: 24px;
    margin-top: 10px;
}
.icon-admin {
    width: 24px;
    height: 24px;
    margin-left: 15px;
    margin-top: 10px;
}



</style>