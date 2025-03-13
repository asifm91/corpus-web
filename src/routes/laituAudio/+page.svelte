<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { fade } from "svelte/transition";
  import laituData from "./Laitu_0003.json";
  import audiofile from "./laitu003.wav";

  let audioPlayer: HTMLAudioElement;
  let currentTime = 0;
  let isPlaying = false;
  let duration = 0;
  let activeCardIndex = -1;
  let pausedTime = 0;
  let cardsContainer: HTMLDivElement;
  let activeCard: HTMLDivElement;
  let isUserScrolling = false;
  let scrollTimeout: number;
  let autoScrollEnabled = true;

  onMount(() => {
    if (audioPlayer) {
      audioPlayer.addEventListener("timeupdate", () => {
        currentTime = audioPlayer.currentTime;
        updateActiveCard();
      });

      audioPlayer.addEventListener("loadedmetadata", () => {
        duration = audioPlayer.duration;
      });

      audioPlayer.addEventListener("ended", () => {
        isPlaying = false;
        activeCardIndex = -1;
      });
    }
  });

  function handleScroll() {
    isUserScrolling = true;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isUserScrolling = false;
    }, 2000);
  }

  function scrollToActiveCard() {
    if (activeCardIndex !== -1) {
      const activeCard = document.querySelector(
        `[data-index="${activeCardIndex}"]`
      );
      if (activeCard) {
        activeCard.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }

  function updateActiveCard() {
    const previousIndex = activeCardIndex;
    activeCardIndex = laituData.findIndex(
      (item) => currentTime >= item.startTime && currentTime <= item.endTime
    );

    if (
      activeCardIndex !== -1 &&
      autoScrollEnabled &&
      previousIndex !== activeCardIndex
    ) {
      scrollToActiveCard();
    }
  }

  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  function playSegment(startTime: number, endTime: number, index: number) {
    if (audioPlayer) {
      if (isPlaying && activeCardIndex === index) {
        pausedTime = audioPlayer.currentTime;
        audioPlayer.pause();
        isPlaying = false;
      } else {
        if (
          activeCardIndex === index &&
          pausedTime >= startTime &&
          pausedTime <= endTime
        ) {
          audioPlayer.currentTime = pausedTime;
        } else {
          audioPlayer.currentTime = startTime;
        }
        audioPlayer.play();
        isPlaying = true;
        activeCardIndex = index;

        if (autoScrollEnabled) {
          scrollToActiveCard();
        }
      }
    }
  }

  function togglePlay() {
    if (audioPlayer) {
      if (isPlaying) {
        audioPlayer.pause();
      } else {
        audioPlayer.play();
      }
      isPlaying = !isPlaying;
    }
  }

  function skipTime(seconds: number) {
    if (audioPlayer) {
      const newTime = Math.min(
        Math.max(audioPlayer.currentTime + seconds, 0),
        duration
      );
      audioPlayer.currentTime = newTime;
    }
  }

  function goToNextSegment() {
    if (audioPlayer && activeCardIndex < laituData.length - 1) {
      const nextIndex = activeCardIndex + 1;
      playSegment(
        laituData[nextIndex].startTime,
        laituData[nextIndex].endTime,
        nextIndex
      );
      if (autoScrollEnabled) {
        scrollToActiveCard();
      }
    }
  }

  function goToPreviousSegment() {
    if (audioPlayer && activeCardIndex > 0) {
      const prevIndex = activeCardIndex - 1;
      playSegment(
        laituData[prevIndex].startTime,
        laituData[prevIndex].endTime,
        prevIndex
      );
      if (autoScrollEnabled) {
        scrollToActiveCard();
      }
    }
  }

  function handleAutoScrollToggle(event: Event) {
    autoScrollEnabled = (event.target as HTMLInputElement).checked;
    if (autoScrollEnabled) {
      scrollToActiveCard();
    }
  }

  onDestroy(() => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
  });
</script>

<div class="container mx-auto px-4 py-8">
  <!-- Main Audio Player -->
  <div class="bg-neutral rounded-lg shadow-lg p-6 mb-8" data-aos="fade-down">
    <audio bind:this={audioPlayer} src={audiofile} class="w-full mb-4">
      <track kind="captions" />
    </audio>

    <div class="block md:flex items-center md:gap-0 gap-5">
      <div class="flex md:flex-col items-center justify-between mr-5">
        <div class="flex items-center gap-5 justify-center">
          <!-- Previous Segment -->
          <button
            class="btn btn-circle btn-primary btn-sm"
            on:click={goToPreviousSegment}
            disabled={activeCardIndex <= 0}
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
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>

          <!-- Play/Pause -->
          <button class="btn btn-circle btn-primary" on:click={togglePlay}>
            {#if isPlaying}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M10 9v6m4-6v6"
                />
              </svg>
            {:else}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
              </svg>
            {/if}
          </button>

          <!-- Next Segment -->
          <button
            class="btn btn-circle btn-primary btn-sm"
            on:click={goToNextSegment}
            disabled={activeCardIndex >= laituData.length - 1}
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
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
        <div class="w-fit">
          <label class="label cursor-pointer">
            <span class="label-text mr-2">Auto-scroll</span>
            <input
              type="checkbox"
              class="toggle toggle-primary"
              bind:checked={autoScrollEnabled}
              on:change={handleAutoScrollToggle}
            />
          </label>
        </div>
      </div>
      <div class="flex-1">
        <div class="text-sm font-medium mb-1 flex justify-between">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <input
          type="range"
          min="0"
          max={duration}
          step="0.1"
          bind:value={currentTime}
          class="range range-primary range-sm"
          on:input={() => {
            if (audioPlayer) {
              audioPlayer.currentTime = currentTime;
              updateActiveCard();
              if (autoScrollEnabled) {
                scrollToActiveCard();
              }
            }
          }}
          on:change={() => {
            if (audioPlayer) {
              audioPlayer.currentTime = currentTime;
              updateActiveCard();
              if (autoScrollEnabled) {
                scrollToActiveCard();
              }
            }
          }}
        />
      </div>
    </div>
  </div>

  <!-- Transcript Cards -->
  <div
    class="grid gap-4 h-[65vh] p-3 overflow-auto scroll-smooth"
    bind:this={cardsContainer}
    on:scroll={handleScroll}
    data-aos="fade-up"
  >
    {#each laituData as segment, index}
      <div
        data-index={index}
        class="card bg-base-100 shadow-lg transition-all duration-300 hover:shadow-xl"
        class:ring-2={index === activeCardIndex}
        class:ring-primary={index === activeCardIndex}
        bind:this={activeCard}
        transition:fade
      >
        <div class="card-body">
          <div class="flex items-center gap-4">
            <button
              class="btn btn-circle btn-sm btn-primary"
              on:click={() =>
                playSegment(segment.startTime, segment.endTime, index)}
            >
              {#if isPlaying && index === activeCardIndex}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
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
                  class="h-4 w-4"
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
            <span class="text-sm opacity-70">
              {formatTime(segment.startTime)} - {formatTime(segment.endTime)}
            </span>
          </div>

          <p class="text-lg font-medium mt-2">{segment.laituText}</p>
          <p class="text-base opacity-70">{segment.engText}</p>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  /* Add any additional custom styles here */
  input[type="range"] {
    @apply h-2 rounded-lg appearance-none cursor-pointer;
  }
</style>
