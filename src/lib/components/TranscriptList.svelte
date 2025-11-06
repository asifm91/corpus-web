<script lang="ts">
  import { fade } from "svelte/transition";
  import Fuse from "fuse.js";
  import type { FuseResult } from "fuse.js";
  import TranscriptCard from "./TranscriptCard.svelte";
  import { onMount, onDestroy } from "svelte";

  interface TranscriptSegment {
    speaker: string;
    segNum: string;
    eng_phase: string;
    phonetic_phase: string;
    time: [number, number];
    individual_eng: Array<{ text: string; time: [number, number] }>;
    individual_phonetics: Array<{ text: string; time: [number, number] }>;
  }

  /** @type {Array<TranscriptSegment>} */
  export let transcript: TranscriptSegment[] = [];
  export let activeCardIndex = 0;
  export let isPlaying = true;
  /** @type {(startTime: number, endTime: number, index: number) => void} */
  export let onPlaySegment = (
    startTime: number,
    endTime: number,
    index: number
  ) => {};
  /** @type {(seconds: number) => string} */
  export let formatTime = (seconds: number): string => "";
  export let onScroll = () => {};

  let searchQuery = "";
  /** @type {Array<Fuse.FuseResult<TranscriptSegment>>} */
  let searchResults: FuseResult<TranscriptSegment>[] = [];
  let showWarning = false;
  let warningMessage = "";
  let showScrollTop = false;
  let transcriptListDiv: HTMLDivElement | null = null;

  // Configure Fuse.js with improved options for partial matching
  const fuseOptions = {
    keys: [
      "eng_phase",
      "phonetic_phase",
      "individual_eng.text",
      "individual_phonetics.text",
    ],
    shouldSort: true,
    threshold: 0.3,
    ignoreLocation: true,
    minMatchCharLength: 3, // updated from 1 to 3
    findAllMatches: true,
    includeMatches: true,
    useExtendedSearch: true,
  };
  const fuse = new Fuse(transcript, fuseOptions);

  // Search functionality with full result objects
  $: {
    if (searchQuery && searchQuery.length >= 3) {
      searchResults = fuse.search(searchQuery);
    } else {
      searchResults = [];
    }
  }

  /** @type {(segment: TranscriptSegment) => Fuse.FuseResult<TranscriptSegment> | { item: TranscriptSegment }} */
  function isInSearchResults(segment: TranscriptSegment) {
    if (!searchQuery) return { item: segment };
    return searchResults.find(
      (result) => result.item.time[0] === segment.time[0]
    );
  }

  /** @type {(message: string) => void} */
  function showTemporaryWarning(message: string) {
    warningMessage = message;
    showWarning = true;
    setTimeout(() => {
      showWarning = false;
    }, 3000);
  }

  /** @type {(startTime: number, endTime: number, index: number) => void} */
  function handlePlaySegment(
    startTime: number,
    endTime: number,
    index: number
  ) {
    if (searchQuery) {
      const matchResult = isInSearchResults(transcript[index]);
      if (!matchResult) {
        showTemporaryWarning(
          "This segment is not in the current search results"
        );
        return;
      }
    }
    onPlaySegment(startTime, endTime, index);
  }

  function handleScroll(e: Event) {
    const target = e.target as HTMLElement;
    // showScrollTop = target.scrollTop > 50; // This line is removed
    onScroll();
  }

  function scrollToTop() {
    // Try scrolling both documentElement and body for cross-browser compatibility
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
    document.body.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleWindowScroll() {
    showScrollTop = window.scrollY > 50;
  }

  onMount(() => {
    window.addEventListener("scroll", handleWindowScroll);
    handleWindowScroll();
  });

  onDestroy(() => {
    window.removeEventListener("scroll", handleWindowScroll);
  });
</script>

<!-- Search input with better styling -->
<div class="mb-4 relative">
  <div class="relative">
    <input
      type="text"
      placeholder="Search in Laitu or English text..."
      class="input input-bordered w-full pr-10 focus:ring-2 focus:ring-primary/20"
      bind:value={searchQuery}
    />
    {#if searchQuery}
      <button
        class="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle hover:bg-primary/10"
        on:click={() => (searchQuery = "")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    {/if}
  </div>

  {#if searchQuery && searchQuery.length >= 3}
    <div class="text-sm text-base-content/70 mt-2">
      Found {searchResults.length} matching segments
    </div>
  {:else if searchQuery && searchQuery.length < 3}
    <div class="text-sm text-base-content/70 mt-2">
      Please enter at least 3 characters to search.
    </div>
  {/if}
</div>

<!-- Transcript Cards -->
<div
  class="flex flex-col gap-4 p-3 overflow-auto scroll-smooth"
  on:scroll={handleScroll}
  data-aos="fade-up"
  bind:this={transcriptListDiv}
>
  {#each transcript as segment, index}
    {@const searchResult = isInSearchResults(segment)}
    {#if !searchQuery || searchResult}
      <div
        transition:fade
        class:opacity-100={!searchQuery || searchResult}
        class:hidden={searchQuery && !searchResult}
      >
        <TranscriptCard
          {segment}
          {index}
          isActive={index === activeCardIndex}
          {isPlaying}
          {searchResult}
          onPlay={handlePlaySegment}
          {formatTime}
        />
      </div>
    {/if}
  {/each}
</div>

<!-- Move the floating button OUTSIDE the scrollable div -->
{#if showScrollTop}
  <button
    class="fixed bottom-8 right-8 z-50 btn btn-primary btn-circle shadow-lg animate-fade-in"
    on:click={scrollToTop}
    aria-label="Scroll to top"
    style="transition: opacity 0.3s;"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M5 15l7-7 7 7"
      />
    </svg>
  </button>
{/if}

<!-- Warning message with improved styling -->
{#if showWarning}
  <div
    class="alert alert-warning shadow-lg mb-4 transition-all duration-300 fixed bottom-4 right-4 max-w-md"
    transition:fade
  >
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
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
    <span>{warningMessage}</span>
  </div>
{/if}

<style>
  /* Improve scrollbar styling */
  div::-webkit-scrollbar {
    width: 8px;
  }

  div::-webkit-scrollbar-track {
    @apply bg-base-200 rounded-full;
  }

  div::-webkit-scrollbar-thumb {
    @apply bg-primary/30 rounded-full hover:bg-primary/50 transition-colors;
  }

  .animate-fade-in {
    animation: fadeIn 0.3s;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
