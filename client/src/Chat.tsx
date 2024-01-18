import { InjectHandles, atom, reactive, incMap } from 'axii'
import { getSDK, CbEvents} from 'open-im-sdk-wasm';
import {INTERAQT_ENDPOINT} from "../constant.js";
import {Message} from "./Message.js";
import {MessageInput} from "./MessageInput.js";

const OpenIM = getSDK();

async function getUserToken(userId: string) {
    // return (await fetch(INTERAQT_ENDPOINT + '/api/getUserToken', {
    return (await fetch('http://192.168.31.150:4000' + '/api/getUserToken', {
        headers: {
            'Content-Type': 'application/json',
            'x-user-id': userId,
        },
        method: 'POST',
        body: JSON.stringify({
            platformId: 3,
        })
    })).json()
}

async function login(userId: string) {
    const result = await getUserToken(userId)

    const config = {
        userID: userId,   // IM user userID
        token: result.data.token,       // IM user token
        platformID: 3,   // Current login platform number
        apiAddr: 'http://192.168.31.150:10002',  // IM api address, generally `http://xxx:10002` or `https://xxx/api
        wsAddr: 'ws://192.168.31.150:10001'   // IM ws address, generally `ws://your-server-ip:10001`(open-im-sdk-wasm) or `ws://your-server-ip:10003`(open-im-sdk)
    }

    return OpenIM.login(config)
}


/* @jsx createElement*/
export function Chat({}, {createElement, useLayoutEffect}: InjectHandles) {

    let userId = 'h4eqq7niohkp'
    const messages = reactive([] as {text:string,  isSelf:boolean}[])
    useLayoutEffect( () => {
        (async function() {
            await login(userId)
            OpenIM.on(CbEvents.OnRecvNewMessage, (data) => {
                console.warn('OnRecvNewMessage', data)
                // messages.push({
                //     text: data.event.,
                //     isSelf: false
                // })
            })
            OpenIM.on(CbEvents.OnRecvNewMessages, (data) => {
                console.warn('OnRecvNewMessages', data)
                messages.push(...data.data.map((item:any) => ({
                    text: item.textElem.content,
                        isSelf: false,
                })))
            })


        })()
    })

    const inputValue = atom('asdfasdfa')
    const onSend = async () => {
        const text = inputValue()
        const message = (await OpenIM.createTextMessage(text)).data
        const resp = await OpenIM.sendMessage({
            // FIXME
            recvID: "sf63ap7ljyul",
            groupID: "",
            message
        })
        messages.push({
            text,
            isSelf: true
        })
    }

    return (
        <div class="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen">
            <div class="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
                <div class="relative flex items-center space-x-4">
                    <div class="relative">
            <span class="absolute text-green-500 right-0 bottom-0">
               <svg width="20" height="20">
                  <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
               </svg>
            </span>
                <img
                            src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
                            alt="" class="w-10 sm:w-16 h-10 sm:h-16 rounded-full"/>
                    </div>
                    <div class="flex flex-col leading-tight">
                        <div class="text-2xl mt-1 flex items-center">
                            <span class="text-gray-700 mr-3">Anderson Vanhron</span>
                        </div>
                        <span class="text-lg text-gray-600">Junior Developer</span>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <button type="button"
                            class="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                             class="h-6 w-6">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </button>
                    <button type="button"
                            class="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                             class="h-6 w-6">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                    </button>
                    <button type="button"
                            class="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                             class="h-6 w-6">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div id="messages"
                 class="flex flex-col flex-grow space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
                {incMap(messages,(message:any) => <Message text={message.text} isSelf={message.isSelf}/>)}
            </div>
            <MessageInput text={inputValue} onSend={onSend} />
        </div>


    )
}

// <style>
//     .scrollbar-w-2::-webkit-scrollbar {
//     width: 0.25rem;
//     height: 0.25rem;
// }
//
//     .scrollbar-track-blue-lighter::-webkit-scrollbar-track {
//     --bg - opacity: 1;
//     background-color: #f7fafc;
//     background-color: rgba(247, 250, 252, var(--bg-opacity));
// }
//
//     .scrollbar-thumb-blue::-webkit-scrollbar-thumb {
//     --bg - opacity: 1;
//     background-color: #edf2f7;
//     background-color: rgba(237, 242, 247, var(--bg-opacity));
// }
//
//     .scrollbar-thumb-rounded::-webkit-scrollbar-thumb {
//     border - radius: 0.25rem;
// }
// </style>