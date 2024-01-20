import {RenderContext, AsyncRxSlice} from 'axii'
import {helper} from "../logtoHelper.js";

export type Contact = {
    id: number,
    name: string,
}

type ContactsProps = {
    onOpen: (contact: Contact) => void
}

/* @jsx createElement*/
export function Contacts({onOpen}: ContactsProps, {createElement, useLayoutEffect}: RenderContext) {
    const contacts = new AsyncRxSlice<Contact>([], async (cursor?: number, length?: number,stop?:number,beforeStart?:boolean )=> {
        const attributeQuery = ['id', 'name']
            // 获取最新的
        const resp = await helper.post({
            interaction: 'getFriends',
            query: {
                attributeQuery
            }
        }, 'h4eqq7niohkp')
        return resp.data
    })

    useLayoutEffect(() => {
        contacts.fetch()
    })

    return (
        <ul role="list" class="divide-y divide-gray-100">
            {contacts.map(contact => (
                <li class="flex justify-between gap-x-6 py-5 cursor-pointer" onClick={() => onOpen(contact)}>
                    <div class="flex min-w-0 gap-x-4">
                        <img class="h-12 w-12 flex-none rounded-full bg-gray-50"
                             src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                             alt=""/>
                        <div class="min-w-0 flex-auto">
                            <p class="text-sm font-semibold leading-6 text-gray-900">{contact.name}</p>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    )
}
