import {Controller, createDataAPI, DataAPIContext} from "@interaqt/runtime";
import {client} from "./logtoClient.js";

export function mapUserEntity(userEntity: any) {
    return {
        id: userEntity.id,
        name: userEntity.username,
    }
}

export async function recover(controller: Controller) {
    const system = controller.system
    await client.getToken()
    const users = await client.getUsers()
    for (let user of users) {
        await system.storage.create('User', mapUserEntity(user))
    }
}

export const apis = {
    syncUser: createDataAPI(function syncUser(this: Controller, context: DataAPIContext, body: any) {
        return this.system.storage.create('User', mapUserEntity(body.user))
    }, {allowAnonymous:true, useNamedParams: true})
}