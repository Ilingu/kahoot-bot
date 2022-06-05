<script lang="ts">
  import { onMount } from "svelte";
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import "./Assets/CSS/index.css";
  import { PushToast } from "./lib/utils";

  let InputGameID: HTMLInputElement;
  onMount(() => {
    InputGameID?.focus();
  });

  const ConnectToKahoot = async () => {
    // PushToast("Works", "error", 10000);
  };
</script>

<main class="flex justify-center items-center flex-col w-screen h-screen">
  <header class="flex justify-center items-center gap-x-4">
    <img
      src="/IMG/logo-kahootbot-128.webp"
      alt="Website Logo"
      class="rounded-md w-16"
    />
    <h1
      class="text-purple-500 text-5xl font-bold hover:text-purple-400 transition-all"
    >
      Kahoot BOT
    </h1>
  </header>

  <section class="w-full mt-16">
    <h3 class="text-center mb-3 text-purple-300 font-semibold">
      Enter The Game PIN and your username ✨
    </h3>
    <form
      on:submit|preventDefault={ConnectToKahoot}
      class="flex flex-col justify-center items-center gap-y-5"
    >
      <input
        type="tel"
        bind:this={InputGameID}
        placeholder="xxx-xxxx"
        class="text-center bg-indigo-400 outline-none focus:ring-[3px] focus:ring-purple-900 transition-all rounded h-10 text-gray-900 lg:w-1/2 w-3/4 font-semibold text-xl"
      />
      <input
        type="text"
        placeholder="Ilingu"
        class="text-center bg-indigo-400 outline-none focus:ring-[3px] focus:ring-purple-900 transition-all rounded h-10 text-gray-900 lg:w-1/2 w-3/4 font-semibold text-xl"
      />
      <button
        type="submit"
        class="bg-indigo-800 outline-none focus:ring-1 focus:ring-purple-300 px-8 py-[0.375rem] text-lg text-white font-semibold rounded-md hover:scale-105 hover:bg-indigo-700 transition-all"
        >Connect 🪄</button
      >
    </form>
  </section>
  <SvelteToast />
</main>

<style>
  input::placeholder {
    color: rgb(17 24 39);
  }
</style>
