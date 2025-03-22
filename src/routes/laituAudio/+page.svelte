<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { fade } from "svelte/transition";
  import laituData from "./Laitu_0003.json";
  import Fuse from "fuse.js";

  let isLoading = true;
  let audioError = false;
  let audioPlayer: HTMLAudioElement;
  let audioSrc: string | null = null;
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
  let searchQuery = "";
  let filteredData = laituData;
  let showWarning = false;
  let warningMessage = "";

  // Configure Fuse.js
  const fuseOptions = {
    keys: ["laituText", "engText"],
    threshold: 0.4,
    ignoreLocation: true,
  };
  const fuse = new Fuse(laituData, fuseOptions);

  // Add search function
  $: {
    if (searchQuery) {
      filteredData = fuse.search(searchQuery).map((result) => result.item);
      // Check if currently playing card exists in filtered results
      if (isPlaying && activeCardIndex !== -1) {
        const currentSegment = laituData[activeCardIndex];
        const existsInFiltered = filteredData.some(
          (item) => item.startTime === currentSegment.startTime
        );
        if (!existsInFiltered) {
          // Pause audio if current segment is not in filtered results
          if (audioPlayer) {
            audioPlayer.pause();
            isPlaying = false;
          }
        }
      }
    } else {
      filteredData = laituData;
    }
  }

  // Add file name as a prop or variable
  const audioFileName = "laitu003"; // This can be made into a prop if needed

  async function loadAudio() {
    isLoading = true;
    audioError = false;

    try {
      // Try MP3 first
      try {
        const audioModule = await import(`./${audioFileName}.mp3`);
          if (audioModule.default) {
            audioSrc = audioModule.default;
            if (audioPlayer) {
              audioPlayer.src = audioSrc || "";
              await audioPlayer.load();
              isLoading = false;
              return;
            }
          }
        throw new Error("MP3 not found");
      } catch (mp3Error) {
        // MP3 not found, try WAV
        try {
          const audioModule = await import(`./${audioFileName}.wav`);
          if (audioModule.default) {
            audioSrc = audioModule.default;
            if (audioPlayer) {
              audioPlayer.src = audioSrc || "";
              await audioPlayer.load();
              isLoading = false;
              return;
            }
          }
          throw new Error("WAV module has no default export");
        } catch (wavError) {
          // If both MP3 and WAV fail, throw a combined error
          throw new Error("No audio file found in either MP3 or WAV format");
        }
      }
    } catch (error) {
      console.error("Failed to load audio:", error);
      isLoading = false;
      audioError = true;
    }
  }

  onMount(async () => {
    if (!audioPlayer) {
      audioPlayer = new Audio();
    }

    await loadAudio();

    if (audioPlayer) {
      audioPlayer.addEventListener("timeupdate", () => {
        currentTime = audioPlayer.currentTime;
        updateActiveCard();
      });

      audioPlayer.addEventListener("loadedmetadata", () => {
        duration = audioPlayer.duration;
        isLoading = false;
      });

      audioPlayer.addEventListener("ended", () => {
        isPlaying = false;
        activeCardIndex = -1;
      });

      audioPlayer.addEventListener("error", (e) => {
        console.error("Audio loading error:", e);
        audioError = true;
        isLoading = false;
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
    // First find the current segment in the full dataset
    const currentSegment = laituData.find(
      (item) => currentTime >= item.startTime && currentTime <= item.endTime
    );

    if (currentSegment) {
      activeCardIndex = laituData.findIndex(
        (item) => item.startTime === currentSegment.startTime
      );
    } else {
      activeCardIndex = -1;
    }

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

  function showTemporaryWarning(message: string) {
    warningMessage = message;
    showWarning = true;
    setTimeout(() => {
      showWarning = false;
    }, 3000); // Hide warning after 3 seconds
  }

  function playSegment(startTime: number, endTime: number, index: number) {
    if (audioPlayer) {
      if (searchQuery) {
        // Check if the segment exists in filtered results
        const existsInFiltered = filteredData.some(
          (item) =>
            laituData.findIndex((l) => l.startTime === item.startTime) === index
        );

        if (!existsInFiltered) {
          showTemporaryWarning(
            "This segment is not in the current search results"
          );
          return;
        }
      }

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

        // Add event listener for when this segment ends
        const segmentEndHandler = () => {
          if (audioPlayer.currentTime >= endTime) {
            audioPlayer.removeEventListener("timeupdate", segmentEndHandler);

            if (searchQuery) {
              // Get the next filtered segment
              const currentFilteredIndex = filteredData.findIndex(
                (item) =>
                  laituData.findIndex((l) => l.startTime === item.startTime) ===
                  index
              );

              if (currentFilteredIndex < filteredData.length - 1) {
                const nextItem = filteredData[currentFilteredIndex + 1];
                const nextIndex = laituData.findIndex(
                  (item) => item.startTime === nextItem.startTime
                );

                // Only continue playing if next segment is sequential
                if (nextIndex === index + 1) {
                  playSegment(nextItem.startTime, nextItem.endTime, nextIndex);
                } else {
                  // Pause if next segment is not sequential
                  audioPlayer.pause();
                  isPlaying = false;
                }
              } else {
                // Pause at the end of filtered results
                audioPlayer.pause();
                isPlaying = false;
              }
            } else {
              // Normal sequential playback for unfiltered view
              if (index < laituData.length - 1) {
                playSegment(
                  laituData[index + 1].startTime,
                  laituData[index + 1].endTime,
                  index + 1
                );
              }
            }
          }
        };

        audioPlayer.addEventListener("timeupdate", segmentEndHandler);
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
    if (audioPlayer && activeCardIndex !== -1) {
      if (searchQuery) {
        const currentFilteredIndex = filteredData.findIndex(
          (item) =>
            laituData.findIndex((l) => l.startTime === item.startTime) ===
            activeCardIndex
        );

        if (currentFilteredIndex === -1) {
          showTemporaryWarning("Current segment is not in search results");
          return;
        }

        if (currentFilteredIndex >= filteredData.length - 1) {
          showTemporaryWarning("No more segments in search results");
          return;
        }

        const nextItem = filteredData[currentFilteredIndex + 1];
        const nextIndex = laituData.findIndex(
          (item) => item.startTime === nextItem.startTime
        );
        playSegment(nextItem.startTime, nextItem.endTime, nextIndex);
      } else {
        // Normal next segment behavior
        const nextIndex =
          activeCardIndex < laituData.length - 1 ? activeCardIndex + 1 : -1;
        if (nextIndex !== -1) {
          playSegment(
            laituData[nextIndex].startTime,
            laituData[nextIndex].endTime,
            nextIndex
          );
        }
      }
    }
  }

  function goToPreviousSegment() {
    if (audioPlayer && activeCardIndex !== -1) {
      if (searchQuery) {
        const currentFilteredIndex = filteredData.findIndex(
          (item) =>
            laituData.findIndex((l) => l.startTime === item.startTime) ===
            activeCardIndex
        );

        if (currentFilteredIndex === -1) {
          showTemporaryWarning("Current segment is not in search results");
          return;
        }

        if (currentFilteredIndex <= 0) {
          showTemporaryWarning("No previous segments in search results");
          return;
        }

        const prevItem = filteredData[currentFilteredIndex - 1];
        const prevIndex = laituData.findIndex(
          (item) => item.startTime === prevItem.startTime
        );
        playSegment(prevItem.startTime, prevItem.endTime, prevIndex);
      } else {
        // Normal previous segment behavior
        const prevIndex = activeCardIndex > 0 ? activeCardIndex - 1 : -1;
        if (prevIndex !== -1) {
          playSegment(
            laituData[prevIndex].startTime,
            laituData[prevIndex].endTime,
            prevIndex
          );
        }
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
    if (audioPlayer) {
      URL.revokeObjectURL(audioPlayer.src);
    }
    if (scrollTimeout) clearTimeout(scrollTimeout);
  });
</script>

<div class="container mx-auto px-4 py-8">
  <!-- Main Audio Player -->
  <div class="bg-neutral rounded-lg shadow-lg p-6 mb-8" data-aos="fade-down">
    {#if isLoading}
      <div class="flex items-center justify-center p-8">
        <div class="loading loading-spinner loading-lg text-primary"></div>
        <span class="ml-4">Loading audio file...</span>
      </div>
    {:else if audioError}
      <div class="alert alert-error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          /></svg
        >
        <span
          >We're sorry, but the audio file you're trying to access is not
          available. Please try again later.</span
        >
      </div>
    {:else}
      <audio bind:this={audioPlayer} src={audioSrc} class="w-full mb-4">
        <track kind="captions" />
      </audio>

      <div class="block md:flex items-center md:gap-0 gap-5">
        <div class="flex md:flex-col items-center justify-between mr-5">
          <div class="flex items-center gap-5 justify-center">
            <!-- Previous Segment -->
            <button
              class="btn btn-circle btn-primary btn-sm"
              on:click={goToPreviousSegment}
              disabled={searchQuery
                ? filteredData.findIndex(
                    (item) =>
                      laituData.findIndex(
                        (l) => l.startTime === item.startTime
                      ) === activeCardIndex
                  ) <= 0
                : activeCardIndex <= 0}
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
              disabled={searchQuery
                ? filteredData.findIndex(
                    (item) =>
                      laituData.findIndex(
                        (l) => l.startTime === item.startTime
                      ) === activeCardIndex
                  ) >=
                  filteredData.length - 1
                : activeCardIndex >= laituData.length - 1}
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
    {/if}
  </div>

  <!-- Search input with clear button -->
  <div class="mb-4 relative">
    <input
      type="text"
      placeholder="Search in Laitu or English text..."
      class="input input-bordered w-full pr-10"
      bind:value={searchQuery}
    />
    {#if searchQuery}
      <button
        class="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
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

  <!-- Only show transcript cards if audio is loaded successfully -->
  {#if !isLoading && !audioError}
    <!-- Transcript Cards -->
    <div
      class="flex flex-col gap-4 p-3 overflow-auto"
      bind:this={cardsContainer}
      on:scroll={handleScroll}
      data-aos="fade-up"
      style="max-height: calc(100vh - 300px);"
    >
      {#each filteredData as segment, index}
        <div
          data-index={laituData.findIndex(
            (item) => item.startTime === segment.startTime
          )}
          class="card bg-base-100 shadow-lg transition-all duration-300 hover:shadow-xl"
          class:ring-2={laituData.findIndex(
            (item) => item.startTime === segment.startTime
          ) === activeCardIndex}
          class:ring-primary={laituData.findIndex(
            (item) => item.startTime === segment.startTime
          ) === activeCardIndex}
          bind:this={activeCard}
          transition:fade
        >
          <div class="card-body">
            <div class="flex items-center gap-4">
              <!-- Update serial number with better styling -->
              <div
                class="flex items-center justify-center bg-primary/10 rounded-lg min-w-[2.5rem] h-8 px-2"
              >
                <span class="font-bold text-primary">
                  {laituData.findIndex(
                    (item) => item.startTime === segment.startTime
                  ) + 1}
                </span>
              </div>

              <button
                class="btn btn-circle btn-sm btn-primary"
                on:click={() =>
                  playSegment(
                    segment.startTime,
                    segment.endTime,
                    laituData.findIndex(
                      (item) => item.startTime === segment.startTime
                    )
                  )}
              >
                {#if isPlaying && laituData.findIndex((item) => item.startTime === segment.startTime) === activeCardIndex}
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
              <div
                class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2"
              >
                <span class="text-sm opacity-70">
                  {formatTime(segment.startTime)} - {formatTime(
                    segment.endTime
                  )}
                </span>
              </div>
            </div>

            <p class="text-lg font-medium mt-2">{segment.laituText}</p>
            <p class="text-base opacity-70">{segment.engText}</p>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <!-- Warning message -->
  {#if showWarning}
    <div
      class="alert alert-warning shadow-lg mb-4 transition-all duration-300"
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
</div>

<style>
  /* Add any additional custom styles here */
  input[type="range"] {
    @apply h-2 rounded-lg appearance-none cursor-pointer;
  }
</style>
