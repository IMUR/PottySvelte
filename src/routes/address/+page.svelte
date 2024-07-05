<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import GeocoderAutocomplete from '@geoapify/geocoder-autocomplete';

  let address: string = '';
  let coordinates: { lat: number, lon: number } | null = null;

  onMount(async () => {
    const { default: { default: GeocoderA }plete } = await import('@geoapify/geocoder-autocomplete');
    const inputElement = document.getElementById("address-input") as HTMLInputElement;
    const autocomplete = new GeocoderAutoclement, import.meta.env.VITE_GEOAPIFY_API_KEY);
    
    autocomplete.on('select', (location: any) => {
      address = location.properties.formatted;
      coordinates = { lat: location.properties.lat, lon: location.properties.lon };
      console.log('Selected location:', address, coordinates);
    });
  });

  const geocodeAddress = async () => {
    const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
    const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${apiKey}`);
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      const [lon, lat] = data.features[0].geometry.coordinates;
      coordinates = { lat, lon };
    }
  };

  const handleSubmit = async () => {
    await geocodeAddress();
    if (coordinates) {
      console.log('Geocoded coordinates:', coordinates);
    }
  };
</script>

<main>
  <h1>Address Input Test</h1>
  <div>
    <label for="address-input">Address:</label>
    <input id="address-input" bind:value={address} />
  </div>
  <button on:click={handleSubmit}>Submit</button>
  {#if coordinates}
    <p>Coordinates: {coordinates.lat}, {coordinates.lon}</p>
  {/if}
</main>

<style>
  main {
    padding: 1rem;
    max-width: 800px;
    margin: auto;
  }
  div {
    margin-bottom: 1rem;
  }
  label {
    display: block;
    margin-bottom: 0.5rem;
  }
  input {
    padding: 0.5rem;
    width: 100%;
    max-width: 400px;
  }
  button {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer
  }
  button:hover {
    background-color: #0056b3
  }
</style>
