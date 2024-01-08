import {Controller, RecordMutationEvent, RecordMutationSideEffect} from "@interaqt/runtime";
import { relations, entities } from './app/index.js'

const ENDPOINT = 'http://192.168.31.150:10002';
const SECRET = 'openIM123';
const ADMIN_ID = 'openIMAdmin';


class APIClient {
    token? : string
    constructor(public endpoint: string, public secret: string, public adminId: string) {

    }
    async getAdminToken() {
        const resp = await (await fetch(ENDPOINT + '/auth/user_token', {
            method: 'POST',
            headers: {
                'operationID': Date.now().toString(),
                'Content-Type': 'application/json',
                'Authorization': this.secret
            },
            body: JSON.stringify({
                "secret": this.secret,
                "userID": this.adminId,
                "platformId": 10
            })
        })).json()
        this.token = resp.data.token
    }
    async registerUsers(users: any[]) {
        return (await fetch(ENDPOINT + '/user/user_register', {
            method: 'POST',
            headers: {
                'operationID': Date.now().toString(),
                'Content-Type': 'application/json',
                'Authorization': this.secret
            },
            body: JSON.stringify({
                "secret": SECRET,
                "users": users.map(user => (
                    {
                        "userID": user.id,
                        "nickname": user.name,
                        "faceURL": user.avatar || "https://picsum.photos/200/300",
                    }
                ))
            })
        })).json()
    }

    async addFriendRelation(sourceId:string, targetId:string) {
        if (!this.token) await this.getAdminToken()
        return (await fetch(ENDPOINT + '/friend/import_friend', {
            method: 'POST',
            headers: {
                'operationID': Date.now().toString(),
                'Content-Type': 'application/json',
                'token': this.token!
            },
            body: JSON.stringify({
                "ownerUserID": sourceId,
                "friendUserIDs": [targetId]
            })
        })).json()
    }
    async deleteFriendRelation(sourceId:string, targetId:string) {
        if (!this.token) await this.getAdminToken()
        return (await fetch(ENDPOINT + '/friend/delete_friend', {
            method: 'POST',
            headers: {
                'operationID': Date.now().toString(),
                'Content-Type': 'application/json',
                'token': this.token!
            },
            body: JSON.stringify({
                "ownerUserID": sourceId,
                "friendUserID": targetId
            })
        })).json()
    }
}


export async function install(controller:Controller) {
    // 获取所有用户
    // const client = new APIClient(ENDPOINT, SECRET, ADMIN_ID)
    // const users = await controller.system.storage.find('User', undefined, undefined, ['*'])
    // const result = await client.registerUsers(users)
    // if (result.errCode !== 0) throw new Error(result.errMsg)
}

// 1. 交友全控制
export const fullControl = {
    userSync: [
        RecordMutationSideEffect.create({
            name: 'syncUser',
            record: entities.UserEntity,
            content: async function(this: Controller, mutationEvent: RecordMutationEvent) {
                const client = new APIClient(ENDPOINT, SECRET, ADMIN_ID)
                let result
                if(mutationEvent.type === 'create') {
                    result = await client.registerUsers([mutationEvent.record])
                } else  if (mutationEvent.type ==='delete') {
                    // TODO 还没实现 user 删除的 api
                    // await client.deleteFriendRelation(mutationEvent.record!.source.id, mutationEvent.record!.target.id)
                }
                return result
            }
        })
    ],
    makeFriend : [
        RecordMutationSideEffect.create({
            name: 'syncFriendRelation',
            record: relations.friendRelation,
            content: async function(this: Controller, mutationEvent: RecordMutationEvent) {
                const client = new APIClient(ENDPOINT, SECRET, ADMIN_ID)
                let result
                if(mutationEvent.type === 'create') {
                    // TODO 这是对的吗？ record.source 上有  id 吗？
                    result = await client.addFriendRelation(mutationEvent.record!.source.id, mutationEvent.record!.target.id)
                } else  if (mutationEvent.type ==='delete') {
                    result = await client.deleteFriendRelation(mutationEvent.record!.source.id, mutationEvent.record!.target.id)
                }
                return result
            }
        })
    ]
}

export const sideEffects = [
    ...fullControl.userSync,
    ...fullControl.makeFriend
]


// TODO 2. 聊天室 全控制