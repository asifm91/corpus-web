<script lang="ts">
  import { onMount } from "svelte";
  let GENRES = [
    "Folktale",
    "Narrative",
    "Oral History",
    "Conversation",
    "Song",
  ];
  let FORMATS = ["MP3", "WAV", "FLAC"];
  const GENDERS = ["Male", "Female", "Other"];

  interface Speaker {
    age: number | null;
    gender: string;
  }
  interface WordGloss {
    word: string;
    gloss: string;
  }
  interface Subtitle {
    start: string;
    end: string;
    original: string;
    translation: string;
    wordGlosses: WordGloss[];
  }
  interface Metadata {
    id: string;
    title: string;
    language: string;
    dialect: string;
    country: string;
    location: { latitude: number | null; longitude: number | null };
    audioLength: string;
    audioFormats: string[];
    genres: string[];
    speakers: Speaker[];
    audioFiles: File[];
    subtitles: Subtitle[];
  }

  let metadata: Metadata = {
    id: "",
    title: "",
    language: "",
    dialect: "",
    country: "",
    location: { latitude: null, longitude: null },
    audioLength: "",
    audioFormats: [],
    genres: [],
    speakers: [{ age: null, gender: "" }],
    audioFiles: [],
    subtitles: [
      {
        start: "",
        end: "",
        original: "",
        translation: "",
        wordGlosses: [{ word: "", gloss: "" }],
      },
    ],
  };

  let newFormat = "";
  let newGenre = "";

  function addSpeaker() {
    metadata.speakers = [...metadata.speakers, { age: null, gender: "" }];
  }
  function removeSpeaker(idx: number) {
    if (metadata.speakers.length > 1)
      metadata.speakers = metadata.speakers.filter((_, i) => i !== idx);
  }
  function addSubtitle() {
    metadata.subtitles = [
      ...metadata.subtitles,
      {
        start: "",
        end: "",
        original: "",
        translation: "",
        wordGlosses: [{ word: "", gloss: "" }],
      },
    ];
  }
  function removeSubtitle(idx: number) {
    if (metadata.subtitles.length > 1)
      metadata.subtitles = metadata.subtitles.filter((_, i) => i !== idx);
  }
  function addWordGloss(subIdx: number) {
    metadata.subtitles[subIdx].wordGlosses = [
      ...metadata.subtitles[subIdx].wordGlosses,
      { word: "", gloss: "" },
    ];
  }
  function removeWordGloss(subIdx: number, wgIdx: number) {
    if (metadata.subtitles[subIdx].wordGlosses.length > 1)
      metadata.subtitles[subIdx].wordGlosses = metadata.subtitles[
        subIdx
      ].wordGlosses.filter((_, i) => i !== wgIdx);
  }
  function handleFiles(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      metadata.audioFiles = [
        ...metadata.audioFiles,
        ...Array.from(input.files),
      ];
    }
    // Reset input value so the same file can be added again if needed
    input.value = "";
  }
  function removeAudioFile(idx: number) {
    metadata.audioFiles = metadata.audioFiles.filter((_, i) => i !== idx);
  }
  function addFormat() {
    if (newFormat && !FORMATS.includes(newFormat)) {
      FORMATS = [...FORMATS, newFormat];
    }
    if (newFormat && !metadata.audioFormats.includes(newFormat)) {
      metadata.audioFormats = [...metadata.audioFormats, newFormat];
    }
    newFormat = "";
  }
  function addAudioFormatToMetadata(fmt: string) {
    if (!metadata.audioFormats.includes(fmt)) {
      metadata.audioFormats = [...metadata.audioFormats, fmt];
    }
  }
  function removeAudioFormat(fmt: string) {
    metadata.audioFormats = metadata.audioFormats.filter((f) => f !== fmt);
  }
  function addGenre() {
    if (newGenre && !GENRES.includes(newGenre)) {
      GENRES = [...GENRES, newGenre];
    }
    if (newGenre && !metadata.genres.includes(newGenre)) {
      metadata.genres = [...metadata.genres, newGenre];
    }
    newGenre = "";
  }
  function addGenreToMetadata(genre: string) {
    if (!metadata.genres.includes(genre)) {
      metadata.genres = [...metadata.genres, genre];
    }
  }
  function removeGenre(genre: string) {
    metadata.genres = metadata.genres.filter((g) => g !== genre);
  }
  function handleSubmit() {
    alert("Submitted! (see console)");
    console.log(metadata);
  }
</script>

<div class="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-10">
  <form class="space-y-10" on:submit|preventDefault={handleSubmit}>
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Corpus Metadata</h2>
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row gap-6">
        <label class="flex-1 font-medium text-gray-700 space-y-2">
          <span>ID</span>
          <input
            class="input input-bordered w-full"
            bind:value={metadata.id}
            required
          />
        </label>
        <label class="flex-1 font-medium text-gray-700 space-y-2">
          <span>Title</span>
          <input
            class="input input-bordered w-full"
            bind:value={metadata.title}
            required
          />
        </label>
      </div>
      <div class="flex flex-col md:flex-row gap-6">
        <label class="flex-1 font-medium text-gray-700 space-y-2">
          <span>Language</span>
          <input
            class="input input-bordered w-full"
            bind:value={metadata.language}
            required
          />
        </label>
        <label class="flex-1 font-medium text-gray-700 space-y-2">
          <span>Dialect</span>
          <input
            class="input input-bordered w-full"
            bind:value={metadata.dialect}
          />
        </label>
      </div>
      <div class="flex flex-col md:flex-row gap-6">
        <label class="flex-1 font-medium text-gray-700 space-y-2">
          <span>Country</span>
          <input
            class="input input-bordered w-full"
            bind:value={metadata.country}
          />
        </label>
        <label class="flex-1 font-medium text-gray-700 space-y-2">
          <span>Coordinates</span>
          <div class="flex gap-2">
            <input
              type="number"
              step="any"
              placeholder="Latitude"
              class="input input-bordered w-full"
              bind:value={metadata.location.latitude}
            />
            <input
              type="number"
              step="any"
              placeholder="Longitude"
              class="input input-bordered w-full"
              bind:value={metadata.location.longitude}
            />
          </div>
        </label>
      </div>
    </div>
    <div class="space-y-6">
      <h3 class="text-xl font-semibold text-gray-800">Audio Information</h3>
      <div class="flex flex-col md:flex-row gap-6">
        <label class="flex-1 font-medium text-gray-700 space-y-2">
          <span>Length (mm:ss)</span>
          <input
            class="input input-bordered w-full"
            bind:value={metadata.audioLength}
            placeholder="7:43"
          />
        </label>
        <label class="flex-1 font-medium text-gray-700 space-y-2">
          <span>Formats</span>
          <div class="flex gap-2">
            <select class="input input-bordered w-full" bind:value={newFormat}>
              <option value="">Select format</option>
              {#each FORMATS as fmt}
                <option value={fmt}>{fmt}</option>
              {/each}
            </select>
            <button
              type="button"
              class="px-3 py-2 rounded bg-[#2c3e50] text-white hover:bg-[#1a232c] transition"
              on:click={addFormat}>Add Format</button
            >
          </div>
          <div class="flex flex-wrap gap-2 mt-2">
            {#each metadata.audioFormats as fmt}
              <span
                class="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
              >
                {fmt}
                <button
                  type="button"
                  class="ml-1 text-red-500 hover:text-red-700"
                  on:click={() => removeAudioFormat(fmt)}>&times;</button
                >
              </span>
            {/each}
          </div>
        </label>
      </div>
      <label class="block font-medium text-gray-700 space-y-2">
        <span>Audio Files</span>
        <input
          type="file"
          accept="audio/*"
          class="file-input file-input-bordered w-full"
          multiple
          on:change={handleFiles}
        />
        <div class="flex flex-wrap gap-2 mt-2">
          {#each metadata.audioFiles as file, idx}
            <span
              class="inline-flex items-center bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm"
            >
              {file.name}
              <button
                type="button"
                class="ml-1 text-red-500 hover:text-red-700"
                on:click={() => removeAudioFile(idx)}>&times;</button
              >
            </span>
          {/each}
        </div>
      </label>
    </div>
    <div class="space-y-4">
      <h3 class="text-xl font-semibold text-gray-800">Genres</h3>
      <div class="flex gap-2 mb-2">
        <input
          class="input input-bordered w-full"
          placeholder="Add new genre"
          bind:value={newGenre}
        />
        <button
          type="button"
          class="px-3 py-2 rounded bg-[#2c3e50] text-white hover:bg-[#1a232c] transition"
          on:click={addGenre}>Add Genre</button
        >
      </div>
      <div class="flex flex-wrap gap-4">
        {#each GENRES as genre}
          <label class="flex items-center gap-2 font-normal text-gray-700">
            <input
              type="checkbox"
              class="checkbox checkbox-sm"
              checked={metadata.genres.includes(genre)}
              on:change={() =>
                metadata.genres.includes(genre)
                  ? removeGenre(genre)
                  : addGenreToMetadata(genre)}
            />
            {genre}
          </label>
        {/each}
      </div>
      <div class="flex flex-wrap gap-2 mt-2">
        {#each metadata.genres as genre}
          <span
            class="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
          >
            {genre}
            <button
              type="button"
              class="ml-1 text-red-500 hover:text-red-700"
              on:click={() => removeGenre(genre)}>&times;</button
            >
          </span>
        {/each}
      </div>
    </div>
    <div class="space-y-4">
      <h3 class="text-xl font-semibold text-gray-800">Speakers</h3>
      {#each metadata.speakers as speaker, idx}
        <div class="flex flex-col md:flex-row gap-4 items-center mb-2">
          <label class="flex-1 font-medium text-gray-700 space-y-2">
            <span>Age</span>
            <input
              type="number"
              min="0"
              class="input input-bordered w-full"
              bind:value={speaker.age}
            />
          </label>
          <label class="flex-1 font-medium text-gray-700 space-y-2">
            <span>Gender</span>
            <select
              class="input input-bordered w-full"
              bind:value={speaker.gender}
            >
              <option value="">Select</option>
              {#each GENDERS as g}
                <option value={g}>{g}</option>
              {/each}
            </select>
          </label>
          {#if metadata.speakers.length > 1}
            <button
              type="button"
              class="ml-2 px-3 py-2 rounded bg-[#2c3e50] text-white hover:bg-[#1a232c] transition"
              on:click={() => removeSpeaker(idx)}
              title="Remove speaker">✖</button
            >
          {/if}
        </div>
      {/each}
      <button
        type="button"
        class="px-4 py-2 rounded bg-[#2c3e50] text-white hover:bg-[#1a232c] transition"
        on:click={addSpeaker}>+ Add Speaker</button
      >
    </div>
    <div class="space-y-4">
      <h3 class="text-xl font-semibold text-gray-800">Subtitles</h3>
      <div class="flex flex-col gap-6">
        {#each metadata.subtitles as sub, idx}
          <div class="bg-gray-100 rounded-lg shadow p-5 flex flex-col gap-4">
            <div class="flex items-center gap-4 mb-1">
              <span class="text-lg font-bold text-[#2c3e50] w-8">{idx + 1}</span
              >
              <span class="flex items-center gap-2">
                <input
                  class="input input-bordered w-20"
                  placeholder="0:00"
                  bind:value={sub.start}
                />
                <span>-</span>
                <input
                  class="input input-bordered w-20"
                  placeholder="0:01"
                  bind:value={sub.end}
                />
              </span>
              {#if metadata.subtitles.length > 1}
                <button
                  type="button"
                  class="ml-auto px-3 py-2 rounded bg-[#2c3e50] text-white hover:bg-[#1a232c] transition"
                  on:click={() => removeSubtitle(idx)}
                  title="Remove subtitle">✖</button
                >
              {/if}
            </div>
            <div>
              <label class="block font-medium text-gray-700 mb-1"
                >Original</label
              >
              <textarea
                class="textarea textarea-bordered w-full"
                placeholder="Original sentence"
                bind:value={sub.original}
              ></textarea>
            </div>
            <div>
              <label class="block font-medium text-gray-700 mb-1"
                >Translation</label
              >
              <textarea
                class="textarea textarea-bordered w-full"
                placeholder="Translation"
                bind:value={sub.translation}
              ></textarea>
            </div>
            <div>
              <label class="block font-medium text-gray-700 mb-1"
                >Word-by-word Gloss</label
              >
              <div class="flex flex-col gap-2">
                {#each sub.wordGlosses as wg, wgIdx}
                  <div class="flex gap-2 items-center">
                    <input
                      class="input input-bordered w-full"
                      placeholder="Word"
                      bind:value={wg.word}
                    />
                    <input
                      class="input input-bordered w-full"
                      placeholder="Gloss"
                      bind:value={wg.gloss}
                    />
                    {#if sub.wordGlosses.length > 1}
                      <button
                        type="button"
                        class="px-2 py-1 rounded bg-[#2c3e50] text-white hover:bg-[#1a232c] transition"
                        on:click={() => removeWordGloss(idx, wgIdx)}
                        title="Remove word-gloss">✖</button
                      >
                    {/if}
                  </div>
                {/each}
                <button
                  type="button"
                  class="self-start px-3 py-1 rounded bg-[#2c3e50] text-white hover:bg-[#1a232c] transition"
                  on:click={() => addWordGloss(idx)}>+ Add Word</button
                >
              </div>
            </div>
          </div>
        {/each}
      </div>
      <button
        type="button"
        class="px-4 py-2 rounded bg-[#2c3e50] text-white hover:bg-[#1a232c] transition"
        on:click={addSubtitle}>+ Add Subtitle</button
      >
    </div>
    <div class="flex justify-end mt-8">
      <button
        type="submit"
        class="px-8 py-3 rounded bg-[#2c3e50] text-white hover:bg-[#1a232c] text-lg font-bold transition"
        >Save Corpus</button
      >
    </div>
  </form>
</div>
