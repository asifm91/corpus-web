<script>
  import { onMount } from "svelte";
  import AOS from "aos";
  import "aos/dist/aos.css";

  onMount(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  });

  let formData = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    institution: "",
    researchInterest: "",
  };

  function handleSubmit() {
    // Handle form submission here
    console.log(formData);
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
        <h1 class="text-3xl font-display text-primary mb-2">Create Account</h1>
        <p class="text-base-content opacity-75">
          Join our community of language researchers
        </p>
      </div>

      <form on:submit|preventDefault={handleSubmit} class="space-y-6">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Full Name</span>
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </span>
            <input
              type="text"
              bind:value={formData.name}
              placeholder="Enter your full name"
              class="input input-bordered w-full pl-10"
              required
            />
          </div>
        </div>

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
              bind:value={formData.email}
              placeholder="Enter your email"
              class="input input-bordered w-full pl-10"
              required
            />
          </div>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Password</span>
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </span>
            <input
              type="password"
              bind:value={formData.password}
              placeholder="Create a password"
              class="input input-bordered w-full pl-10"
              required
            />
          </div>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Confirm Password</span>
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </span>
            <input
              type="password"
              bind:value={formData.confirmPassword}
              placeholder="Confirm your password"
              class="input input-bordered w-full pl-10"
              required
            />
          </div>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Institution</span>
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </span>
            <input
              type="text"
              bind:value={formData.institution}
              placeholder="Your institution or organization"
              class="input input-bordered w-full pl-10"
              required
            />
          </div>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Research Interest</span>
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
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </span>
            <input
              type="text"
              bind:value={formData.researchInterest}
              placeholder="Your research interests"
              class="input input-bordered w-full pl-10"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          class="btn w-full"
          style="background-color: #1464CC; color: white;"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Create Account
        </button>

        <div class="text-center mt-4">
          <p class="text-sm">
            Already have an account?
            <a href="/login" class="text-primary hover:underline">Sign in</a>
          </p>
        </div>
      </form>
    </div>
  </div>
</div>
