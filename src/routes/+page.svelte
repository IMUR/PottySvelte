<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import L from 'leaflet';

  let address: string = '';
  let coordinates: { lat: number, lon: number } | null = null;
  let map: L.Map;
  let marker: L.Marker;

  onMount(async () => {
    const GeocoderAutocompleteModule = await import('@geoapify/geocoder-autocomplete');
    const GeocoderAutocomplete = GeocoderAutocompleteModule.default;

    const inputElement = document.getElementById("address-input") as HTMLInputElement;
    const autocomplete = new GeocoderAutocomplete(inputElement, import.meta.env.VITE_GEOAPIFY_API_KEY, {
      // Optionally customize the options here
    });

    autocomplete.on('select', (location: any) => {
      address = location.properties.formatted;
      coordinates = { lat: location.properties.lat, lon: location.properties.lon };
      updateMap(coordinates);
      console.log('Selected location:', address, coordinates);
    });

    initMap();
  });

  const initMap = () => {
    map = L.map('map').setView([0, 0], 2);

    L.tileLayer(`https://maps.geoapify.com/v1/tile/osm-liberty/{z}/{x}/{y}.png?apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    marker = L.marker([0, 0]).addTo(map);
  };

  const updateMap = (coordinates: { lat: number, lon: number }) => {
    map.setView([coordinates.lat, coordinates.lon], 13);
    marker.setLatLng([coordinates.lat, coordinates.lon]);
  };

  const geocodeAddress = async () => {
    const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
    const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${apiKey}`);
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      const [lon, lat] = data.features[0].geometry.coordinates;
      coordinates = { lat, lon };
      updateMap(coordinates);
    }
  };

  const handleSubmit = async () => {
    await geocodeAddress();
    if (coordinates) {
      console.log('Geocoded coordinates:', coordinates);
    }
  };
</script>

<main class="p-4 max-w-4xl mx-auto animate-fadeIn">
  <h1 class="text-2xl font-bold mb-4">Address Input Test</h1>
  <div class="mb-4">
    <label for="address-input" class="block text-sm font-medium text-gray-700">Address:</label>
    <input id="address-input" class="mt-1 p-2 border border-gray-300 rounded-md shadow-sm w-full" bind:value={address} />
  </div>
  <button on:click={handleSubmit} class="px-4 py-2 bg-blue-600 text-white rounded-md">Submit</button>
  {#if coordinates}
    <p class="mt-4">Coordinates: {coordinates.lat}, {coordinates.lon}</p>
  {/if}
  <div id="map" class="mt-4" style="height: 400px;"></div>
</main>
