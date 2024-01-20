import {RenderContext, atom, RxList, Atom} from 'axii'
import {ChatBox} from "./ChatBox.js";
import {ChatType, RecentChats} from "./RecentChats.js";
import {Contact, Contacts} from "./Contacts.js";
import {ContactIcon} from "./icons/contact.js";
import {MessageIcon} from "./icons/message.js";
import {RequestIcon} from "./icons/request.js";



/* @jsx createElement*/
export function Chat({}, {createElement, useLayoutEffect}: RenderContext) {
    const tab = atom<string>('contact')

    const currentChat = atom<any>(null)

    // TODO 支持群聊
    const openedItems = new RxList<Contact>([])
    const recentChats = openedItems.reduce<ChatType>((newList, contact) => {
        const findIndex = newList.data.findIndex(i => i.type === 'peer' && i.target.id === contact.id)
        if (findIndex !== -1) {
            newList.splice(findIndex, 1)
        }
        newList.push({type: 'peer', target :contact})
    })  as RxList<ChatType>


    const openNewContactChat = (contact: Contact) => {
        openedItems.push(contact)
        tab('recent')
        currentChat(recentChats.data.at(-1))
    }

    return (
        <div class="flex w-screen h-screen">
            <div class="flex flex-col w-1/4 h-full border-r border-gray-300">
                <div class="flex-grow-0">
                    <ChatTab selected={tab}/>
                </div>
                <div class="flex-grow">
                    {() => tab() === 'recent' ? <RecentChats current={currentChat} chats={recentChats}/> : <Contacts onOpen={openNewContactChat} />}
                </div>
            </div>
            <div class="flex flex-col w-3/4 h-full">
                <ChatBox current={currentChat}/>
            </div>
        </div>
    )
}

type ChatMenuProp = {
    selected: Atom<string>
}
/* @jsx createElement*/
function ChatTab({selected}: ChatMenuProp, {createElement, useLayoutEffect}: RenderContext) {

    const selectedClass = "text-sm border-indigo-500 text-indigo-600 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
    const normalClass = "text-sm cursor-pointer border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"

    return (
        <div>
            <div class="hidden sm:block">
                <div class="border-b border-gray-200 ">
                    <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                        <a
                            onClick={() => selected('recent')}
                            class={() => selected() === 'recent' ? selectedClass : normalClass}>
                            <MessageIcon/>
                        </a>
                        <a
                            onClick={() => selected('contacts')}
                            class={() => selected() === 'contacts' ? selectedClass : normalClass}>
                            <ContactIcon/>
                        </a>
                        <a
                            onClick={() => selected('requests')}
                            class={() => selected() === 'requests' ? selectedClass : normalClass}>
                            <RequestIcon/>
                        </a>
                    </nav>
                </div>
            </div>
        </div>
    )
}