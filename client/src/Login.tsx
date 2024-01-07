import { atom } from 'data0'

import {helper} from '../logtoHelper.js';
import {InjectHandles} from "../global";
import {LOGIN_CALLBACK_ADDR} from "../constant.js";


/* @jsx createElement */
export function Login({}, { createElement }: InjectHandles) {
    const title = atom('')
    return <div className="h-full">
        <div className="lg:ml-full-menu sm:ml-mini-menu flex flex-col h-full">
            <main className="grow bg-gray-bg mr-6 border border-gray-bd1 rounded-[18px]">
                <div className="h-full relative">
                    {title}
                </div>
            </main>
            <div className='h-6 w-full shrink-0'>Hello</div>
            <button onclick={() => helper.client.signIn(LOGIN_CALLBACK_ADDR)}>
                Sign In
            </button>
            <button onclick={() => helper.client.signOut()}>
                logout
            </button>
        </div>
    </div>
}