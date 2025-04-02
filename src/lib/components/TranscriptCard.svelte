<script lang="ts">
  import { fade } from "svelte/transition";
  import { highlightText } from "../utils/highlight";

  export let segment: any;
  export let index: number;
  export let isActive: boolean;
  export let isPlaying: boolean;
  export let searchResult: any = null;
  export let onPlay: (
    startTime: number,
    endTime: number,
    index: number
  ) => void;
  export let formatTime: (seconds: number) => string;

  function handlePlay() {
    onPlay(segment.startTime, segment.endTime, index);
  }

  $: highlightedLaitu = highlightText(segment.laituText, searchResult);
  $: highlightedEng = highlightText(segment.engText, searchResult);
</script>

<div
  data-index={index}
  class="card bg-base-100 shadow-lg transition-all duration-300 hover:shadow-xl"
  class:ring-2={isActive}
  class:ring-primary={isActive}
  transition:fade
>
  <div class="card-body">
    <div class="flex items-center gap-4">
      <!-- Serial number -->
      <div
        class="flex items-center justify-center bg-primary/10 rounded-lg min-w-[2.5rem] h-8 px-2"
      >
        <span class="font-bold text-primary">
          {index + 1}
        </span>
      </div>

      <!-- Play/Pause button -->
      <button class="btn btn-circle btn-sm btn-primary" on:click={handlePlay}>
        {#if isPlaying && isActive}
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
              d="M10 9v6m4-6v6"
            />
          </svg>
        {:else}
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
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
          </svg>
        {/if}
      </button>

      <!-- Timestamp -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
        <span class="text-sm opacity-70">
          {formatTime(segment.startTime)} - {formatTime(segment.endTime)}
        </span>
      </div>
    </div>

    <!-- Text content with highlighting -->
    <p class="text-lg font-medium mt-2">
      {@html highlightedLaitu}
    </p>
    <p class="text-base opacity-70">
      {@html highlightedEng}
    </p>
  </div>
</div>
