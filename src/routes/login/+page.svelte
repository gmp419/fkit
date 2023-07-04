<script lang="ts">
    import { auth, user } from "$lib/firebase";
    import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

    async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);

    const idToken = await credential.user.getIdToken();

    const res = await fetch("/api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'CSRF-Token': csrfToken  // HANDLED by sveltekit automatically
      },
      body: JSON.stringify({ idToken }),
    });
  }

  async function signOutSSR() {
    const res = await fetch("/api/signin", { method: "DELETE" });
    await signOut(auth);
  }
</script>

{#if $user}
    <h2 class="card-title">Welcome, {$user.displayName}</h2>
    <button class="btn btn-warning" on:click={signOutSSR}>Sign out</button>
    
{:else}
<button class="btn btn-primary" on:click={signInWithGoogle}>Sign In With Google</button>
{/if}

