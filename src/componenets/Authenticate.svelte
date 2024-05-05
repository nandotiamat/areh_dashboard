<script>
    import { browser } from "$app/environment"; 
    import { goto } from '$app/navigation';
    import { error } from "@sveltejs/kit";

    let email = '';
    let password = '';
    let errorMessage = '';

    // Function to handle changes in the email input field
    function handleEmailChange(event) {
        email = event.target.value; // Update the email variable
        errorMessage = ''; // Reset the error message
    }

    // Function to handle changes in the password input field
    function handlePasswordChange(event) {
        password = event.target.value; // Update the password variable
        errorMessage = ''; // Reset the error message
    }

    async function handleAuthenticate() {
    
        if (!email || !password) {
            errorMessage = 'Please fill in all the fields.'
            return;
        }

        const response = await fetch('/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                email,
                password,
            }),
        });

        if (response.ok) {
            // Authentication successful, redirect to dashboard or any other page
            goto('/dashboard'); // Redirect to dashboard page
        } else if (response.status === 403) {
            // Forbidden (user doesn't have admin role)
            errorMessage = "You do not have permission to login as you are not an admin.";
        } else {
            // Other error status codes
            errorMessage = "Credentials are incorrect. Please try again.";
        }
        password = '';
        
    }
</script>

<div class='authContainer'>
    <form on:submit|preventDefault={handleAuthenticate} method="POST">
        <h1>Login</h1>
        {#if errorMessage}
            <p class='error'>{errorMessage}</p>
        {/if}
        <label>
            <p class={email ? 'above' : 'center'}>Email</p>
            <input bind:value={email} type='email' placeholder="Email" on:input={handleEmailChange}/>
        </label>
        <label>
            <p class={password ? 'above' : 'center'}>Password</p>
            <input bind:value={password} type='password' placeholder="Password" on:input={handlePasswordChange}/>
        </label>
        <button type='submit'>Submit</button>
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
            padding: 24px;
        }

        form {
            display: flex;
            flex-direction: column;
            gap: 14px;
        }

        form
        {
            width: 400px;
            max-width: 100%;
            margin: 0 auto;
        }

        form input {
            width: 100%;
        }

        h1 {
            text-align: center;
            font-size: 3rem;
        }

        form label {
            position: relative;
            border: 1px solid navy;
            border-radius: 5px;
        }

        form input {
            border: none;
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
            background: navy;
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
            background: navy;
            border: 1px solid blue;
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

        .options div p:last-of-type {
            color: cyan;
            cursor: pointer;
        }

        @keyframes spin {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
    </style>