import {RenderContext, Atom, RxList} from 'axii'
import {Contact} from "./Contacts.js";

type RecentChatsProps = {
    chats: RxList<ChatType>,
    current: Atom<ChatType|null>
}

type Group = {
    id: number,
    name: string,
}

export type ChatType = {
    type: 'peer'|'group',
    target: Contact | Group
}

/* @jsx createElement*/
export function RecentChats({chats}: RecentChatsProps, {createElement}: RenderContext) {
    return (
        <div>
            {chats.map(({type, target}) => (
                <div>
                    {type === 'peer' ? <PeerChat target={target}/> : <GroupChat target={target}/>}
                </div>
            ))}
        </div>
    )
}

function PeerChat({target}: {target:Contact}, {createElement}: RenderContext) {
    console.log(target)
    return (
        <div class="flex min-w-0 gap-x-4 mt-6">
            <img class="h-12 w-12 flex-none rounded-full bg-gray-50"
                 src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                 alt=""/>
            <div class="min-w-0 flex-auto">
                <p class="text-sm font-semibold leading-6 text-gray-900">{target.name}</p>
            </div>
        </div>
    )
}

type GroupChatProps = {
    target: Group
}

function GroupChat({target}: GroupChatProps, {createElement}: RenderContext) {
    return (
        <div>
            <div>
                <div>
                    <div>{target.name}</div>
                    <div>last message</div>
                </div>
            </div>
        </div>
    )
}