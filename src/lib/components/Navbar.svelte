<script lang="ts">
  import { onMount } from "svelte";
  import AOS from "aos";
  import "aos/dist/aos.css";
  import Button from "./Button.svelte";

  onMount(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  });
</script>

<nav
  class="navbar fixed top-0 left-0 right-0 z-50 bg-base-100 shadow-lg px-4 md:px-8"
>
  <div class="navbar-start">
    <div class="dropdown">
      <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
        <svg
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h8m-8 6h16"
          />
        </svg>
      </div>
      <ul
        tabindex="0"
        class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
      >
        <li><a href="/">Home</a></li>
        <li><a href="/corpora/laitu">Corpora</a></li>
        <li>
          <a href="/#endangered"
            >Endangered Languages of South and Southeast Asia</a
          >
        </li>
        <li><a href="/#about">About</a></li>
        <li><a href="/register">Register</a></li>
      </ul>
    </div>
    <a href="/" class="font-display text-xl text-primary" data-aos="fade-right"
      >abʰā</a
    >
  </div>
  <div class="navbar-center hidden lg:flex">
    <ul class="menu menu-horizontal px-1">
      <li>
        <a href="/" data-aos="fade-down" data-aos-delay="100">Home</a>
      </li>
      <li>
        <a href="/corpora/laitu" data-aos="fade-down" data-aos-delay="200"
          >Corpora</a
        >
      </li>
      <li>
        <a href="/#endangered" data-aos="fade-down" data-aos-delay="300">
          Endangered Languages of South and Southeast Asia
        </a>
      </li>
      <li>
        <a href="/#about" data-aos="fade-down" data-aos-delay="400">About</a>
      </li>
    </ul>
  </div>
  <div class="navbar-end">
    <Button
      variant="primary"
      onClick={() => (window.location.href = "/register")}
      dataAos="fade-left"
    >
      Register
    </Button>
  </div>
</nav>

<!-- Add padding to account for fixed navbar -->
<div class="h-16"></div>
