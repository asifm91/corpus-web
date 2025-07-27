<script lang="ts">
  interface Speaker {
    age: number;
    gender: string;
  }

  interface Metadata {
    id: string;
    title: string;
    language: string;
    dialect: string;
    country: string;
    location: {
      longitude: number;
      latitude: number;
    };
    audioLength: number;
    audioFormats: string[];
    genres: string[];
    speakers: Speaker[];
  }

  export let metadata: Metadata = {
    id: "",
    title: "",
    language: "",
    dialect: "",
    country: "",
    location: {
      longitude: 0,
      latitude: 0,
    },
    audioLength: 0,
    audioFormats: [],
    genres: [],
    speakers: [],
  };

  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }
</script>

<div class="m-3 bg-base-100 rounded-lg shadow-lg p-6">
  <h2 class="text-xl font-bold mb-4">Corpus Metadata</h2>

  <div class="space-y-4">
    <!-- Basic Info -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <p class="text-sm opacity-70">ID</p>
        <p class="font-medium">{metadata.id}</p>
      </div>
      <div>
        <p class="text-sm opacity-70">Title</p>
        <p class="font-medium">{metadata.title}</p>
      </div>
      <div>
        <p class="text-sm opacity-70">Language</p>
        <p class="font-medium">{metadata.language}</p>
      </div>
      <div>
        <p class="text-sm opacity-70">Dialect</p>
        <p class="font-medium">{metadata.dialect}</p>
      </div>
    </div>

    <!-- Location -->
    <div>
      <p class="text-lg font-bold">Location</p>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-sm opacity-70">Country</p>
          <p class="font-medium">{metadata.country}</p>
        </div>
        <div>
          <p class="text-sm opacity-70">Coordinates</p>
          <p class="font-medium">
            {metadata.location.latitude}, {metadata.location.longitude}
          </p>
        </div>
      </div>
    </div>

    <!-- Audio Info -->
    <div>
      <p class="text-lg font-bold">Audio Information</p>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-sm opacity-70">Length</p>
          <p class="font-medium">{formatTime(metadata.audioLength)}</p>
        </div>
        <div>
          <p class="text-sm opacity-70">Formats</p>
          <p class="font-medium">{metadata.audioFormats.join(", ")}</p>
        </div>
      </div>
    </div>

    <!-- Genres -->
    <div>
      <p class="text-lg font-bold">Genres</p>
      <div class="flex flex-wrap gap-2">
        {#each metadata.genres as genre}
          <span class="badge badge-primary">{genre}</span>
        {/each}
      </div>
    </div>

    <!-- Speakers -->
    <div>
      <p class="text-lg font-bold mb-2">Speakers</p>
      <div class="space-y-2">
        {#each metadata.speakers as speaker}
          <div class="bg-base-200 rounded-lg p-3">
            <div class="grid grid-cols-2 gap-2">
              <div>
                <p class="text-sm opacity-70">Age</p>
                <p class="font-medium">{speaker.age}</p>
              </div>
              <div>
                <p class="text-sm opacity-70">Gender</p>
                <p class="font-medium">{speaker.gender}</p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
