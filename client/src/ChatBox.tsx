import {atom, incMap, RenderContext, Atom, reactive} from 'axii'
import {CbEvents, getSDK} from 'open-im-sdk-wasm';
import {Message} from "./Message.js";
import {MessageInput} from "./MessageInput.js";
import {ChatType} from "./RecentChats.js";

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

export type ChatBoxProps = {
    current: Atom<ChatType|null>
}

/* @jsx createElement*/
export function ChatBox({current}: ChatBoxProps, {createElement, useLayoutEffect}: RenderContext) {
    // FIXME
    let userId = 'h4eqq7niohkp'
    const messages = reactive([] as {text:string,  isSelf:boolean}[])
    useLayoutEffect( () => {
        (async function() {
            await login(userId)
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
        await OpenIM.sendMessage({
            recvID: current()?.target.id.toString()!,
            groupID: current()?.type === 'group' ? current()?.target.id.toString()! : "",
            message
        })
        messages.push({
            text,
            isSelf: true
        })
    }

    return (
        <div class="flex-1 justify-between flex flex-col h-screen">
            <div class="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
                <div class="relative flex items-center space-x-4 px-2">
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
                            <span class="text-gray-700 mr-3">{() => current()?.target.name}</span>
                        </div>
                    </div>
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