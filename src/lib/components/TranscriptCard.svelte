<script>
  import { fade } from "svelte/transition";
  import { highlightText } from "../utils/highlight";

  /** @type {{segNum:string, eng_phase: string, phonetic_phase: string, time: [number, number], individual_eng: Array<{ text: string, time: [number, number] }>, individual_phonetics: Array<{ text: string, time: [number, number] }> }} */
  export let segment = {
    segNum: "",
    eng_phase: "",
    phonetic_phase: "",
    time: [0, 0],
    individual_eng: [],
    individual_phonetics: [],
  };
  export let index = 0;
  export let isActive = false;
  export let isPlaying = false;
  /** @type {Fuse.FuseResult<any> | null} */
  export let searchResult = null;
  /** @type {(startTime: number, endTime: number, index: number) => void} */
  export let onPlay = (startTime, endTime, index) => {};
  /** @type {(seconds: number) => string} */
  export let formatTime = (seconds) => "";

  function handlePlay() {
    onPlay(segment.time[0], segment.time[1], index);
    isPlaying = !isPlaying;
  }

  $: highlightedPhonetic = highlightText(segment.phonetic_phase, searchResult);
  $: highlightedEng = highlightText(segment.eng_phase, searchResult);
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
          {segment.segNum}
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
          {formatTime(segment.time[0])} - {formatTime(segment.time[1])}
        </span>
      </div>
    </div>

    <!-- Text content with highlighting -->
    <p class="text-lg font-medium mt-2">
      {@html highlightedPhonetic}
    </p>
    <p class="text-base opacity-70">
      {@html highlightedEng}
    </p>

    <!-- Individual words -->
    {#if segment.individual_eng.length > 0}
      <div class="mt-2 pt-2 border-t border-base-200 overflow-x-auto">
        <div class="overflow-x-auto">
          <table class="w-fit">
            <tbody>
              <tr class="whitespace-nowrap">
                {#each segment.individual_phonetics as phoneticWord}
                  <td class="text-sm font-medium opacity-70 border px-2">
                    {phoneticWord.text}
                  </td>
                {/each}
              </tr>
              <tr class="whitespace-nowrap">
                {#each segment.individual_phonetics as phoneticWord}
                  {@const matchingEngWord = segment.individual_eng.find(
                    (eng) =>
                      eng.time[0] === phoneticWord.time[0] &&
                      eng.time[1] === phoneticWord.time[1]
                  )}
                  <td class="text-sm opacity-70 border px-2">
                    {matchingEngWord ? matchingEngWord.text : ""}
                  </td>
                {/each}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    {/if}
  </div>
</div>
