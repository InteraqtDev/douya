/* @jsx createElement*/
import {createElement, createRoot} from "axii";
import {Chat} from "./src/Chat";
import  './index.css'

const root = createRoot(document.getElementById('root')!)
root.render(<Chat />)





