<script>
  import { onMount } from "svelte";
  import AOS from "aos";
  import "aos/dist/aos.css";
  import Button from "$lib/components/Button.svelte";

  onMount(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  });

  let email = "";
  let isSubmitted = false;
  let errorMessage = "";

  function handleSubmit() {
    // Basic email validation
    if (!email || !email.includes("@")) {
      errorMessage = "Please enter a valid email address";
      return;
    }

    // Here you would typically send a password reset email
    console.log("Sending reset email to:", email);
    isSubmitted = true;
  }
</script>

<svelte:head>
  <link
    href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600&display=swap"
    rel="stylesheet"
  />
  <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
  <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
</svelte:head>

<div class="min-h-screen bg-base-100 py-20">
  <div class="container mx-auto px-4">
    <div
      class="max-w-md mx-auto bg-neutral rounded-lg shadow-xl p-8"
      data-aos="fade-up"
    >
      <div class="text-center mb-8">
        <h1 class="text-3xl font-display text-primary mb-2">Reset Password</h1>
        <p class="text-base-content opacity-75">
          Enter your email address and we'll send you a link to reset your
          password
        </p>
      </div>

      {#if !isSubmitted}
        <form on:submit|preventDefault={handleSubmit} class="space-y-6">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  class="h-5 w-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </span>
              <input
                type="email"
                bind:value={email}
                placeholder="Enter your email"
                class="input input-bordered w-full pl-10"
                required
              />
            </div>
          </div>

          {#if errorMessage}
            <div class="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{errorMessage}</span>
            </div>
          {/if}

          <Button
            type="submit"
            variant="primary"
            fullWidth={true}
            dataAos="fade-up"
            dataAosDelay="200"
          >
            Send Reset Link
          </Button>

          <div class="text-center mt-4">
            <p class="text-sm">
              Remember your password?
              <a href="/login" class="text-primary hover:underline"
                >Back to login</a
              >
            </p>
          </div>
        </form>
      {:else}
        <div class="text-center space-y-6" data-aos="fade-up">
          <div class="alert alert-success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Password reset link has been sent to your email</span>
          </div>

          <p class="text-base-content">
            Please check your email for instructions on how to reset your
            password. If you don't see the email, check your spam folder.
          </p>

          <Button variant="primary" onClick={() => (isSubmitted = false)}>
            Try Another Email
          </Button>

          <div class="text-center mt-4">
            <p class="text-sm">
              <a href="/login" class="text-primary hover:underline"
                >Back to login</a
              >
            </p>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
