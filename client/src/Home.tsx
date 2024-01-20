import {InjectHandles} from 'axii'
import {Posts} from "./Posts.js";

/* @jsx createElement*/
export function Home({}, {createElement, useLayoutEffect}: InjectHandles) {
    return (
        <div>
            <h1>Home</h1>
            <Posts />
        </div>
    )
}