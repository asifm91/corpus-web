<script lang="ts">
  import { fade } from "svelte/transition";
  import Fuse from "fuse.js";
  import TranscriptCard from "./TranscriptCard.svelte";

  export let transcript: any[];
  export let activeCardIndex: number;
  export let isPlaying: boolean;
  export let onPlaySegment: (
    startTime: number,
    endTime: number,
    index: number
  ) => void;
  export let formatTime: (seconds: number) => string;
  export let onScroll: () => void;

  let searchQuery = "";
  let searchResults: any[] = [];
  let showWarning = false;
  let warningMessage = "";

  // Configure Fuse.js with improved options for partial matching
  const fuseOptions = {
    keys: ["laituText", "engText"],
    shouldSort: true,
    threshold: 0.3,
    ignoreLocation: true,
    minMatchCharLength: 1,
    findAllMatches: true,
    includeMatches: true, // Enable match information
    useExtendedSearch: true, // Enable extended search
  };
  const fuse = new Fuse(transcript, fuseOptions);

  // Search functionality with full result objects
  $: {
    if (searchQuery) {
      searchResults = fuse.search(searchQuery);
    } else {
      searchResults = [];
    }
  }

  // Helper function to check if an item is in search results
  function isInSearchResults(segment: any): any {
    if (!searchQuery) return { item: segment }; // Return all items when no search
    return searchResults.find(
      (result) => result.item.startTime === segment.startTime
    );
  }

  function showTemporaryWarning(message: string) {
    warningMessage = message;
    showWarning = true;
    setTimeout(() => {
      showWarning = false;
    }, 3000);
  }

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

  {#if searchQuery}
    <div class="text-sm text-base-content/70 mt-2">
      Found {searchResults.length} matching segments
    </div>
  {/if}
</div>

<!-- Transcript Cards -->
<div
  class="flex flex-col gap-4 p-3 overflow-auto scroll-smooth"
  on:scroll={onScroll}
  data-aos="fade-up"
  style="max-height: calc(100vh - 300px);"
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
</style>
