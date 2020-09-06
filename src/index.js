import SimplePage from "./containers/SimplePage/SimplePage.svelte";

//import scss globally
import "./assets/scss/style.scss"

//end dependecies for sveltekit
let container = document.getElementById("app");

new SimplePage({target: container});
