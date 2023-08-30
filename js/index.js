import WorldService from './WorldService.js';
import App from './App.js';

const service = new WorldService();
const app = new App(service);
app.intitialize();
