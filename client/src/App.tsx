import {atom} from 'axii'

import {helper} from '../logtoHelper.js';
import {InjectHandles} from "../global";

/* @jsx createElement */
export function App({}, { createElement }: InjectHandles) {

    const activityId = atom<string>('')


    const payload = {
        to: {
            id: 'h4eqq7niohkp',
        },
        request:{
            reason: 'let use make friend'
        }
    }
    const sendRequestToUser2 = async () => {
        const res =  await helper.post({
            activity: 'createFriendRelation',
            interaction: 'sendRequest',
            payload
        })

        activityId(res.context.activityId)
    }


    const acceptRequest = async () => {
        const res = await fetch(helper.interactionAddr, {
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': 'h4eqq7niohkp',
            },
            method: 'POST',
            body: JSON.stringify({
                activityId: activityId(),
                activity: 'createFriendRelation',
                interaction: 'approve',
                payload: {
                }
            })
        })
    }

    return <div className="h-full">
        <div className="lg:ml-full-menu sm:ml-mini-menu flex flex-col h-full">
            <div>
                <div>activityId: {activityId}</div>
            </div>
            <button onclick={sendRequestToUser2}>
                send request to user 2
            </button>
            <button onclick={acceptRequest}>
                accept request
            </button>
        </div>
    </div>
}