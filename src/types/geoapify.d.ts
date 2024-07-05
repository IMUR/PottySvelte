declare module "@geoapify/geocoder-autocomplete" {
  interface GeocoderAutocompleteOptions {
    /* Define any options you want to support */
  }

  class GeocoderAutocomplete {
    constructor(
      inputElement: HTMLInputElement,
      apiKey: string,
      options?: GeocoderAutocompleteOptions
    );
    on(event: string, callback: (location: any) => void): void;
  }

  export default GeocoderAutocomplete;
}
