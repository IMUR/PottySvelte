<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from "e:/PottySnitch/PottySvelte/src/lib/supabaseClient";

  interface Potty {
    pottyName: string;
    pottyAddress: string;
    pottyRule: string;
    pottyNotes: string;
    pottyType: string;
    location: string;
  }

  let potties: Potty[] = [];

  onMount(async () => {
    const { data } = await supabase.from('PottyList').select('*');
    potties = data ?? [];
  });
</script>

<h1>Potty List</h1>

<nav>
  <a href="/">Home</a> | 
  <a href="/form">Add Potty</a>
</nav>

<ul>
  {#each potties as potty}
    <li>
      <p><strong>{potty.pottyName}</strong></p>
      <p>{potty.pottyAddress}</p>
      <p>{potty.pottyRule}</p>
      <p>{potty.pottyNotes}</p>
      <p>{potty.pottyType}</p>
    </li>
  {/each}
</ul>

<style>
  ul {
    list-style: none;
    padding: 0;
  }

  li {
    padding: 0.5rem;
    margin: 0.5rem 0;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  nav {
    margin-bottom: 1rem;
  }

  nav a {
    margin-right: 1rem;
    text-decoration: none;
    color: #007bff;
  }

  nav a:hover {
    text-decoration: underline;
  }
</style>
