    <script>
        import { goto } from '$app/navigation';


        async function handleLogout() {
            const response = await fetch('/auth?/logout', {
                method: 'POST',
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

    <div class="navbar">
    <div>Sei loggato in AREH DASHBOARD</div>
    <button class="logout-btn" on:click={handleLogout}>Logout</button>
    </div>
