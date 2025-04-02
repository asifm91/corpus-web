<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  export let transcript: any[];
  export let audio_mp3: any;
  export let audio_wav: any;
  export let activeCardIndex: number;
  export let isPlaying: boolean;
  export let autoScrollEnabled: boolean;
  export let onPlaySegment: (
    startTime: number,
    endTime: number,
    index: number,
    wasPlaying: boolean
  ) => void;
  export let onAutoScrollToggle: (enabled: boolean) => void;
  export let onTimeUpdate: (time: number) => void;

  let isLoading = true;
  let audioError = false;
  let audioPlayer: HTMLAudioElement;
  let audioSrc: string | null = null;
  let currentTime = 0;
  let duration = 0;
  let pausedTime = 0;

  async function loadAudio() {
    isLoading = true;
    audioError = false;

    try {
      // Try MP3 first
      try {
        const audioModule = audio_mp3;
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
        // Try WAV
        try {
          const audioModule = audio_wav;
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
          throw new Error("No audio file found in either MP3 or WAV format");
        }
      }
    } catch (error) {
      console.error("Failed to load audio:", error);
      isLoading = false;
      audioError = true;
    }
  }

  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
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

  function goToNextSegment() {
    if (audioPlayer && activeCardIndex !== -1) {
      const nextIndex =
        activeCardIndex < transcript.length - 1 ? activeCardIndex + 1 : -1;
      if (nextIndex !== -1) {
        const wasPlaying = isPlaying;
        audioPlayer.currentTime = transcript[nextIndex].startTime;
        onPlaySegment(
          transcript[nextIndex].startTime,
          transcript[nextIndex].endTime,
          nextIndex,
          wasPlaying
        );
      }
    }
  }

  function goToPreviousSegment() {
    if (audioPlayer && activeCardIndex !== -1) {
      const prevIndex = activeCardIndex > 0 ? activeCardIndex - 1 : -1;
      if (prevIndex !== -1) {
        const wasPlaying = isPlaying;
        audioPlayer.currentTime = transcript[prevIndex].startTime;
        onPlaySegment(
          transcript[prevIndex].startTime,
          transcript[prevIndex].endTime,
          prevIndex,
          wasPlaying
        );
      }
    }
  }

  function handleAutoScrollToggle(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    onAutoScrollToggle(isChecked);
  }

  onMount(async () => {
    if (!audioPlayer) {
      audioPlayer = new Audio();
    }

    await loadAudio();

    if (audioPlayer) {
      audioPlayer.addEventListener("timeupdate", () => {
        currentTime = audioPlayer.currentTime;
        onTimeUpdate(currentTime);
      });

      audioPlayer.addEventListener("loadedmetadata", () => {
        duration = audioPlayer.duration;
        isLoading = false;
      });

      audioPlayer.addEventListener("ended", () => {
        isPlaying = false;
      });

      audioPlayer.addEventListener("error", (e) => {
        console.error("Audio loading error:", e);
        audioError = true;
        isLoading = false;
      });
    }
  });

  onDestroy(() => {
    if (audioPlayer) {
      URL.revokeObjectURL(audioPlayer.src);
    }
  });

  // Export the audioPlayer instance to parent
  export { audioPlayer };
</script>

<div class="bg-neutral rounded-lg shadow-lg p-6 mb-8" data-aos="fade-down">
  {#if isLoading}
    <div class="flex items-center justify-center p-8">
      <div class="loading loading-spinner loading-lg text-primary" />
      <span class="ml-4">Loading audio file...</span>
    </div>
  {:else if audioError}
    <div class="alert alert-error">
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
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>
        We're sorry, but the audio file you're trying to access is not
        available. Please try again later.
      </span>
    </div>
  {:else}
    <audio bind:this={audioPlayer} src={audioSrc} class="w-full mb-4">
      <track kind="captions" />
    </audio>

    <div class="block md:flex items-center md:gap-0 gap-5">
      <div class="flex md:flex-col items-center justify-between mr-5">
        <div class="flex items-center gap-5 justify-center">
          <!-- Previous -->
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

          <!-- Next -->
          <button
            class="btn btn-circle btn-primary btn-sm"
            on:click={goToNextSegment}
            disabled={activeCardIndex >= transcript.length - 1}
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

        <!-- Add auto-scroll toggle -->
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
              onTimeUpdate(currentTime);
            }
          }}
        />
      </div>
    </div>
  {/if}
</div>

<style>
  input[type="range"] {
    @apply h-2 rounded-lg appearance-none cursor-pointer;
  }
</style>
