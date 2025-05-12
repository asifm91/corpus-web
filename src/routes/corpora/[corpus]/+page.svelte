<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { fade } from "svelte/transition";
  import Fuse from "fuse.js";
  // Assuming the correct path for AudioPlayer.svelte is src/lib/AudioPlayer.svelte
  import AudioPlayer from "../../../lib/components/AudioPlayer.svelte";
  import TranscriptList from "../../../lib/components/TranscriptList.svelte";
  import CorpusMetadata from "../../../lib/components/CorpusMetadata.svelte";

  interface PageData {
    id: string;
    title: string;
    language: string;
    dialect: string;
    country: string;
    location: {
      longitude: number;
      latitude: number;
    };
    audioFormats: string[];
    genres: string[];
    speakers: Array<{ age: number; gender: string }>;
    audio_mp3: any;
    audio_wav: any;
    transcript: Array<{
      speaker: string;
      segNum: string;
      eng_phase: string;
      phonetic_phase: string;
      time: [number, number];
      individual_eng: Array<{ text: string; time: [number, number] }>;
      individual_phonetics: Array<{ text: string; time: [number, number] }>;
    }>;
  }

  export let data: PageData;
  const transcript = data?.transcript;
  console.log(data);
  const audio_mp3 = data?.audio_mp3;
  const audio_wav = data?.audio_wav;

  // Add metadata
  const metadata = {
    id: data?.id || "",
    title: data?.title || "",
    language: data?.language || "",
    dialect: data?.dialect || "",
    country: data?.country || "",
    location: {
      longitude: data?.location?.longitude || 0,
      latitude: data?.location?.latitude || 0,
    },
    audioLength: 0, // Will be updated when audio is loaded
    audioFormats: ["MP3", "WAV"],
    genres: data?.genres || [],
    speakers: data?.speakers || [],
  };

  // Update audio length when loaded
  $: if (duration) {
    metadata.audioLength = duration;
  }

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
  let filteredData = transcript;
  let showWarning = false;
  let warningMessage = "";

  // Configure Fuse.js
  const fuseOptions = {
    keys: ["laituText", "engText"],
    shouldSort: false,
    threshold: 0.4,
    ignoreLocation: true,
  };
  const fuse = new Fuse(transcript, fuseOptions);

  // Add search function
  $: {
    if (searchQuery) {
      filteredData = fuse.search(searchQuery).map((result) => result.item);
      // Check if currently playing card exists in filtered results
      if (isPlaying && activeCardIndex !== -1) {
        const currentSegment = transcript[activeCardIndex];
        const existsInFiltered = filteredData.some(
          (item: any) => item.time[0] === currentSegment.time[0]
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
      filteredData = transcript;
    }
  }

  // Add file name as a prop or variable
  // const audioFileName = "laitu003"; // This can be made into a prop if needed

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
        // MP3 not found, try WAV
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
        updateActiveCard(currentTime);
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

  function updateActiveCard(currentTime: number) {
    const previousIndex = activeCardIndex;
    const currentSegment = transcript.find(
      (item: any) => currentTime >= item.time[0] && currentTime <= item.time[1]
    );

    if (currentSegment) {
      activeCardIndex = transcript.findIndex(
        (item: any) => item.time[0] === currentSegment.time[0]
      );

      // Stop playback if we've reached the end of the current segment
      if (currentTime >= currentSegment.time[1]) {
        audioPlayer.pause();
        isPlaying = false;
      }
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

  function handlePlaySegment(
    startTime: number,
    endTime: number,
    index: number,
    shouldPlay?: boolean
  ) {
    if (audioPlayer) {
      if (searchQuery) {
        const existsInFiltered = filteredData.some(
          (item: any) =>
            transcript.findIndex((l: any) => l.time[0] === item.time[0]) ===
            index
        );

        if (!existsInFiltered) {
          showTemporaryWarning(
            "This segment is not in the current search results"
          );
          return;
        }
      }

      // If clicking the same segment that's currently playing
      if (isPlaying && activeCardIndex === index) {
        audioPlayer.pause();
        isPlaying = false;
        return;
      }

      // Update the current time
      audioPlayer.currentTime = startTime;

      // Play the audio
      audioPlayer.play();
      isPlaying = true;
      activeCardIndex = index;

      if (autoScrollEnabled) {
        scrollToActiveCard();
      }
    }
  }

  function handleAutoScrollToggle(enabled: boolean) {
    autoScrollEnabled = enabled;
    if (enabled) {
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
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Left column: Audio player and cards -->
    <div class="lg:col-span-2 space-y-6">
      <AudioPlayer
        {transcript}
        {audio_mp3}
        {audio_wav}
        bind:audioPlayer
        bind:isPlaying
        bind:activeCardIndex
        bind:autoScrollEnabled
        onPlaySegment={handlePlaySegment}
        onAutoScrollToggle={handleAutoScrollToggle}
        onTimeUpdate={updateActiveCard}
      />

      <TranscriptList
        {transcript}
        {activeCardIndex}
        {isPlaying}
        onPlaySegment={handlePlaySegment}
        {formatTime}
        onScroll={handleScroll}
      />
    </div>

    <!-- Right column: Metadata -->
    <div class="lg:col-span-1">
      <CorpusMetadata {metadata} />
    </div>
  </div>
</div>

<style>
  /* Add any additional custom styles here */
  input[type="range"] {
    @apply h-2 rounded-lg appearance-none cursor-pointer;
  }
</style>
