<script lang="ts">
import { supabase } from "e:/PottySnitch/PottySvelte/src/lib/supabaseClient";
  import { onMount } from 'svelte';
  
  

  interface PottyRule {
    pottyRule: string;
  }

  interface PottyType {
    pottyType: string;
  }

  interface Location {
    lat: number;
    lon: number;
  }

  let pottyName: string = '';
  let pottyAddress: string = '';
  let pottyRule: string = '';
  let pottyNotes: string = '';
  let pottyType: string = '';
  let pottyRules: PottyRule[] = [];
  let pottyTypes: PottyType[] = [];
  let location: Location | null = null;

  onMount(async () => {
    const { data: rules } = await supabase.from('PottyRules').select('pottyRule');
    if (rules) {
      pottyRules = rules.map(rule => ({ pottyRule: rule.pottyRule }));
    }

    const { data: types } = await supabase.from('PottyTypes').select('pottyType');
    if (types) {
      pottyTypes = types.map(type => ({ pottyType: type.pottyType }));
    }

    const { GeocoderAutocomplete } = await import('@geoapify/geocoder-autocomplete');

    const inputElement = document.getElementById("pottyAddress") as HTMLInputElement;
    const autocomplete = new GeocoderAutocomplete(inputElement, 'YOUR_GEOAPIFY_API_KEY');
    autocomplete.on('select', (location: any) => {
      pottyAddress = location.properties.formatted;
      location = {
        lat: location.properties.lat,
        lon: location.properties.lon
      };
    });
  });

  const geocodeAddress = async (address: string): Promise<Location | null> => {
    const apiKey = 'YOUR_GEOAPIFY_API_KEY';
    try {
      const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${apiKey}`);
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const [lon, lat] = data.features[0].geometry.coordinates;
        return { lat, lon };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching geocoding data:', error);
      return null;
    }
  };

  const submitForm = async (): Promise<void> => {
    location = await geocodeAddress(pottyAddress);

    if (location) {
      const { data, error } = await supabase.from('PottyList').insert([{
        pottyName,
        pottyAddress,
        pottyRule,
        pottyNotes,
        pottyType,
        location: `POINT(${location.lon} ${location.lat})`
      }]);

      if (error) {
        console.error('Error inserting data:', error);
      } else {
        pottyName = '';
        pottyAddress = '';
        pottyRule = '';
        pottyNotes = '';
        pottyType = '';
        location = null;
      }
    } else {
      console.error('Geocoding failed');
    }
  };
</script>

<form on:submit|preventDefault={submitForm}>
  <div>
    <label for="pottyName">Potty Name</label>
    <input id="pottyName" bind:value={pottyName} required>
  </div>

  <div>
    <label for="pottyAddress">Potty Address</label>
    <input id="pottyAddress" bind:value={pottyAddress} required>
  </div>

  <div>
    <label for="pottyRule">Potty Rule</label>
    <select id="pottyRule" bind:value={pottyRule} required>
      <option value="" disabled>Select a rule</option>
      {#each pottyRules as rule}
        <option value={rule.pottyRule}>{rule.pottyRule}</option>
      {/each}
    </select>
  </div>

  <div>
    <label for="pottyNotes">Potty Notes</label>
    <textarea id="pottyNotes" bind:value={pottyNotes}></textarea>
  </div>

  <div>
    <label for="pottyType">Potty Type</label>
    <select id="pottyType" bind:value={pottyType} required>
      <option value="" disabled>Select a type</option>
      {#each pottyTypes as type}
        <option value={type.pottyType}>{type.pottyType}</option>
      {/each}
    </select>
  </div>

  <button type="submit">Submit</button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  div {
    display: flex;
    flex-direction: column;
  }

  label {
    font-weight: bold;
  }

  button {
    margin-top: 1rem;
    padding: 0.5rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }
</style>
