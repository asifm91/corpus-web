<script>
  import { onMount } from "svelte";
  import AOS from "aos";
  import "aos/dist/aos.css";
  import Button from "$lib/components/Button.svelte";
  import Navbar from "$lib/components/Navbar.svelte";
  import Footer from "$lib/components/Footer.svelte";

  onMount(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      once: true,
    });
  });

  // Updated language data for the grid
  const languages = [
    { name: "India", speakers: "447 languages" },
    { name: "Nepal", speakers: "123 languages" },
    { name: "Bangladesh", speakers: "41 languages" },
    { name: "Thailand", speakers: "71 languages" },
    { name: "Myanmar", speakers: "117 languages" },
    { name: "Vietnam", speakers: "110 languages" },
    { name: "Laos", speakers: "84 languages" },
    { name: "Cambodia", speakers: "23 languages" },
  ];
</script>

<svelte:head>
  <!-- Google Fonts -->
  <link
    href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600&display=swap"
    rel="stylesheet"
  />
  <!-- AOS Animation Library -->
  <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
  <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>

  <style>
    html {
      scroll-behavior: smooth;
    }
  </style>
</svelte:head>

<Navbar />

<!-- Hero Section -->
<div id="home" class="hero min-h-[80vh] bg-neutral">
  <div class="hero-content text-center">
    <div class="max-w-3xl">
      <h1
        class="text-5xl font-bold font-display text-primary mb-8"
        data-aos="fade-up"
      >
        Preserving Endangered Languages Through Research
      </h1>
      <p class="py-6 text-lg" data-aos="fade-up" data-aos-delay="200">
        Help us document and preserve endangered languages before they
        disappear. Our platform hosts and archives linguistic data, cultural
        context, and native speaker recordings of indigenous languages of South
        and Southeast Asia and searchable annotated corpora.
      </p>
      <Button
        variant="primary"
        size="lg"
        onClick={() => (window.location.href = "/register")}
        dataAos="fade-up"
        dataAosDelay="400"
      >
        Start Contributing
      </Button>
    </div>
  </div>
</div>

<!-- Recent Corpuses Section -->
<section id="corpuses" class="bg-base-100 py-16">
  <div class="container mx-auto px-4">
    <h2
      class="text-4xl font-display text-primary text-center mb-12"
      data-aos="fade-up"
    >
      Recent Corpora
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Corpus Card 1 -->
      <div></div>
      <div
        class="card bg-neutral shadow-xl"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <div class="card-body">
          <h3 class="card-title font-display">Laitu Language</h3>
          <p>1 Speaker</p>
          <div class="card-actions justify-end">
            <Button
              variant="primary"
              onClick={() => (window.location.href = "/corpora/laitu/")}
            >
              View
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Popular Section -->
<section id="endangered" class="bg-primary text-base-100 py-16">
  <div class="container mx-auto px-4">
    <h2 class="text-4xl font-display text-center mb-12" data-aos="fade-up">
      Most Endangered Languages of South and Southeast Asia
    </h2>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-8">
      <!-- Language 1 -->
      <div class="text-center" data-aos="zoom-in" data-aos-delay="100">
        <div
          class="rounded-full bg-base-100 w-24 h-24 mx-auto mb-4 flex items-center justify-center"
        >
          <span class="text-primary text-4xl font-bold">Rm</span>
        </div>
        <h3 class="font-display text-xl">Rangmitca</h3>
        <p>Critically endangered</p>
      </div>
      <!-- Language 2 -->
      <div class="text-center" data-aos="zoom-in" data-aos-delay="200">
        <div
          class="rounded-full bg-base-100 w-24 h-24 mx-auto mb-4 flex items-center justify-center"
        >
          <span class="text-primary text-4xl font-bold">Kh</span>
        </div>
        <h3 class="font-display text-xl">Kharia</h3>
        <p>Severely endangered</p>
      </div>
      <!-- Language 3 -->
      <div class="text-center" data-aos="zoom-in" data-aos-delay="300">
        <div
          class="rounded-full bg-base-100 w-24 h-24 mx-auto mb-4 flex items-center justify-center"
        >
          <span class="text-primary text-4xl font-bold">Kl</span>
        </div>
        <h3 class="font-display text-xl">Kol</h3>
        <p>Critically endangered</p>
      </div>
    </div>
  </div>
</section>

<!-- Languages Grid Section -->
<section class="py-16 bg-base-100">
  <div class="container mx-auto px-4">
    <h2 class="text-4xl font-display text-center mb-12" data-aos="fade-up">
      Indigenous languages of South and Southeast Asia
    </h2>

    <!-- Languages Grid -->
    <div
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
    >
      {#each languages as language, i}
        <div
          class="card bg-base-200 hover:shadow-lg transition-shadow"
          data-aos="fade-up"
          data-aos-delay={100 + i * 50}
        >
          <div class="card-body p-4 text-center">
            <h3 class="font-display text-lg">{language.name}</h3>
            <p class="text-sm opacity-75">{language.speakers}</p>
          </div>
        </div>
      {/each}
    </div>

    <!-- View All Button -->
    <div class="text-center mt-8">
      <Button
        variant="primary"
        onClick={() => (window.location.href = "/corpora")}
        dataAos="fade-up"
      >
        View All Endangered Languages
      </Button>
    </div>
  </div>
</section>

<!-- Statistics Section -->
<section class="bg-neutral py-16">
  <div class="container mx-auto px-4 overflow-hidden">
    <div
      class="stats stats-vertical lg:stats-horizontal shadow w-full overflow-hidden"
    >
      <div class="stat" data-aos="fade-right">
        <div class="stat-title">Documented Languages</div>
        <div class="stat-value text-primary">573</div>
        <div class="stat-desc">Critically endangered</div>
      </div>
      <div class="stat" data-aos="fade-up">
        <div class="stat-title">Active Contributors</div>
        <div class="stat-value text-secondary">1,200</div>
        <div class="stat-desc">↗︎ 300 (33%)</div>
      </div>
      <div class="stat" data-aos="fade-left">
        <div class="stat-title">Recorded Hours</div>
        <div class="stat-value text-accent">10K+</div>
        <div class="stat-desc">Of native speakers</div>
      </div>
    </div>
  </div>
</section>

<Footer />

<style>
  :global(html) {
    scroll-behavior: smooth;
  }
</style>
