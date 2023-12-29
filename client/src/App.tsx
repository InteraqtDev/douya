import {atom} from 'axii'

import {helper} from '../logtoHelper.js';
import {InjectHandles} from "../global";

/* @jsx createElement */
export function App({}, { createElement }: InjectHandles) {

    const activityId = atom<string>('')


    const payload = {
        to: {
            id: 'sdjy4ayjqzdb',
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


    return <div className="h-full">
        <div className="lg:ml-full-menu sm:ml-mini-menu flex flex-col h-full">
            <div>
                <div>activityId: {activityId}</div>
            </div>
            <button onclick={sendRequestToUser2}>
                send request to user 2
            </button>
        </div>
    </div>
}