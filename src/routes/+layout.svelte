<script>
  import "../app.css";
  import Navbar from "$lib/components/Navbar.svelte";
  import Footer from "$lib/components/Footer.svelte";
</script>

<svelte:head>
  <title>abʰā &mdash; Preserving Endangered Languages Through Research</title>
</svelte:head>

<Navbar />
<slot />
<Footer />
