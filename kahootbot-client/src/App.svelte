<script lang="ts">
  import { onMount } from "svelte";
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import "./Assets/CSS/index.css";
  import { EmptyContent, PushToast } from "./lib/utils";
  import type { APIResPayload } from "./lib/interfaces/interfaces";
  import { LauchWSClient } from "./lib/ws";

  let InputGameID: HTMLInputElement;
  onMount(() => {
    InputGameID?.focus();
  });

  let ActivateLogs = false;

  let GameID = "",
    username = "";
  const ConnectToKahoot = async () => {
    if (
      EmptyContent(GameID) ||
      EmptyContent(username) ||
      isNaN(parseInt(GameID))
    )
      return PushToast("Please Fill the fields", "error", 5000);

    const req = await fetch(`https://kahootbot.xyz:80/newgame/${GameID}`, {
      body: JSON.stringify({ username }),
      method: "POST",
    });

    if (!req.ok)
      return PushToast("Error when trying to access the server", "error", 4500);

    const APIRes = (await req.json()) as APIResPayload;
    if (!APIRes || !APIRes?.succeed)
      return PushToast("Error: Invalid Inputs", "error", 5000);
    PushToast("Request Successfully Sent.", "success", 3000);
    ActivateLogs = true;

    // Connect To WS for party info
    LauchWSClient(GameID);
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
  {#if !ActivateLogs}
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
          bind:value={GameID}
          placeholder="xxx-xxxx"
          class="text-center bg-indigo-400 outline-none focus:ring-[3px] focus:ring-purple-900 transition-all rounded h-10 text-gray-900 lg:w-1/2 w-3/4 font-semibold text-xl"
        />
        <input
          type="text"
          bind:value={username}
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
  {/if}
  {#if ActivateLogs}
    <section
      id="game-logs"
      class="text-center mt-4 text-lg font-bold text-purple-600 max-h-[400px] overflow-auto"
    >
      <h1 class="text-2xl">GAME LOGS</h1>
    </section>
  {/if}
  <SvelteToast />
</main>

<style>
  input::placeholder {
    color: rgba(17, 24, 39, 0.5);
  }
</style>
