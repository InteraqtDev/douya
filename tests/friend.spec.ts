/// <reference types="@types/pg" />

import {describe, test, expect, beforeAll} from 'vitest'
import {
    Controller,
    KlassInstance,
    MonoSystem,
    RecordMutationSideEffect,
    SQLiteDB,
    Action,
    Payload,
    PayloadItem,
    Interaction
} from "@interaqt/runtime";
import {DATABASE_ADDR} from "../config.js";
import * as appData from "../app/index.js";
import {sideEffects} from "../integration.js";
import { faker, } from "@faker-js/faker";
import {relative} from "pathe";


// only for test
const createUserInteraction = Interaction.create({
    name: 'createUser',
    action: Action.create({name: 'createUser'}),
    payload: Payload.create({
        items: [
            PayloadItem.create({
                name: 'user',
                base: appData.entities.UserEntity,
                isRef: false,
            }),
        ]
    })
})




describe('friend', () => {
    let controller!: Controller
    beforeAll(async () => {
        const db = new SQLiteDB(':memory:')
        const system = new MonoSystem(db)
        const data = appData as any
        controller = new Controller(
            system,
            Object.values(data.entities||{}),
            Object.values(data.relations|| {}),
            Object.values(data.activities||{}),
            Object.values(data.interactions||{}).concat(createUserInteraction) as KlassInstance<typeof Interaction, false>[],
            Object.values(data.states||{}),
            ([] as KlassInstance<typeof RecordMutationSideEffect, false>[]).concat(...Object.values(sideEffects))
        )
        await controller.setup(true)
    })

    test('sync friend relation to openim', async () => {
        // 1. 创建两个新用户。
        const userA = {
            id: faker.string.uuid(),
            name: faker.internet.userName(),
            mobile: faker.phone.number('###########'),
            age: faker.number.int(100)
        }
        const userB = {
            id: faker.string.uuid(),
            name: faker.internet.userName(),
            mobile: faker.phone.number('###########'),
            age: faker.number.int(100)
        }
        const args1 = {
            user: {id:'-1'},
            payload: {user: userA}
        }
        const args2 = {
            user: {id:'-1'},
            payload: {user: userB}
        }
        const res1 = await controller.callInteraction(createUserInteraction.uuid, args1)
        const res2 = await controller.callInteraction(createUserInteraction.uuid, args2)
        console.log(res1, res2)
        expect(res1.event?.payload!.user.id === args1.payload.user.id)
        expect(res1.sideEffects!.syncUser!.result.errCode === 0)
        expect(res2.sideEffects!.syncUser!.result.errCode === 0)
        // 2. 创建两个用户的好友关系。

        const res3 = await controller.callActivityInteraction(appData.activities.createFriendRelationActivity.uuid, appData.interactions.sendInteraction.uuid,  undefined,{
            user: userA,
            payload: {
                to: userB,
                message: {
                    content: 'let use make friend'
                }
            }
        })

        expect(res3.error).toBeUndefined()
        expect(res3.context!.activityId).toBeDefined()

        const res4 = await controller.callActivityInteraction(appData.activities.createFriendRelationActivity.uuid, appData.interactions.approveInteraction.uuid, res3.context!.activityId,{
            user: userB,
            payload: {
                from: userA,
                message: {
                    content: 'let use make friend'
                }
            }
        })
        expect(res4.error).toBeUndefined()
        expect(res4.sideEffects!.syncFriendRelation.result.errCode).toBe(0)

        const relation = await controller.system.storage.findOneRelationByName(appData.relations.friendRelation.name, undefined, undefined, ['*', ['source', {attributeQuery: ['*']}], ['target', {attributeQuery: ['*']}]])
        expect(relation.source.id).toBe(userA.id)
        expect(relation.target.id).toBe(userB.id)
    })
})
