    <script>
    import { goto } from '$app/navigation';

    let email = '';
    let password = '';
    let error = false;

    async function handleAuthenticate() {
        if (!email || !password) {
        error = true;
        return;
        }

        const response = await fetch('?/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            email,
            password,
        }),
        });

        //console.log(response);
        if (response.ok) {
        // Authentication successful, redirect to dashboard or any other page
        goto('/dashboard'); // Redirect to dashboard page
        } else {
        // Authentication failed, display error message
        error = true;
        }
    }
    </script>

    <div class='authContainer'>
    <form on:submit|preventDefault={handleAuthenticate} method="POST">
        <h1>Login</h1>
        {#if error}
        <p class='error'>Le credenziali inserite non sono corrette</p>
        {/if}
        <label>
        <p class={email ? 'above' : 'center'}>Email</p>
        <input bind:value={email} type='email' placeholder="Email"/>
        </label>
        <label>
        <p class={password ? 'above' : 'center'}>Password</p>
        <input bind:value={password} type='password' placeholder="Password"/>
        </label>
        <button type='submit'>Submit</button>
    </form>
    </div>




    <style>
        .authContainer {
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

        .loadingSpinner {
            animation: spin 1s linear infinite;
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