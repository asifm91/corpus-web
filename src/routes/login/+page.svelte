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
    email: "",
    password: "",
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
        <h1 class="text-3xl font-display text-primary mb-2">Welcome Back</h1>
        <p class="text-base-content opacity-75">
          Sign in to continue your research
        </p>
      </div>

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
              placeholder="Enter your password"
              class="input input-bordered w-full pl-10"
              required
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <label class="label cursor-pointer">
            <input type="checkbox" class="checkbox checkbox-primary" />
            <span class="label-text ml-2">Remember me</span>
          </label>
          <a
            href="/login/forgot-password"
            class="text-sm text-primary hover:underline">Forgot password?</a
          >
        </div>

        <button
          type="submit"
          class="btn w-full"
          style="background-color: #1464CC; color: white;"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Sign In
        </button>

        <div class="text-center mt-4">
          <p class="text-sm">
            Don't have an account?
            <a href="/register" class="text-primary hover:underline"
              >Create one</a
            >
          </p>
        </div>
      </form>
    </div>
  </div>
</div>
