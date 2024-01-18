import {InjectHandles} from "axii";

const DEFAULT_AVATAR = 'https://i.pravatar.cc/100'
/* @jsx createElement*/
export function Message({ text = '', avatar = DEFAULT_AVATAR, isSelf=false }, {createElement, useLayoutEffect}: InjectHandles) {

    const chatClass = isSelf ? "flex items-end justify-end" : "flex items-end"
    const bubbleClass = isSelf ? "px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white" : "px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600"
    return (
        <div class="chat-message">
            <div class={chatClass}>
                <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                    <div><span
                        class={bubbleClass}>{text}</span>
                    </div>
                </div>
                <img
                    src={avatar}
                    alt="My profile" class="w-6 h-6 rounded-full order-1"/>
            </div>
        </div>
    )

}