/* @jsx createElement*/
import {createElement, createRoot} from "axii";
import {App} from "./src/App";

import {helper} from './logtoHelper';
if (await helper.client.isAuthenticated()) {
    const root = createRoot(document.getElementById('root')!)
    root.render(<App />)
} else {
    window.location.href = '/login.html'
}





