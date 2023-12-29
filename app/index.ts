import {UserEntity} from "./user.js";
import {
    cancelInteraction,
    createFriendRelationActivity,
    deleteInteraction,
    friendRelation,
    rejectInteraction,
    sendInteraction
} from "./createFriendRelationActivity.js";
import {messageToRequestRelation, receivedRequestRelation, requestEntity, sendRequestRelation} from "./requestEntity.js";
import {messageEntity} from "./messageEntity.js";




// CAUTION 不能直接用 instance ，上面还有系统声明的
export const entities = [
    UserEntity,
    messageEntity,
    requestEntity,
]
export const relations = [
    friendRelation,
    sendRequestRelation,
    receivedRequestRelation,
    messageToRequestRelation,
]
export const activities = [
    createFriendRelationActivity
]
// CAUTION 这里也要带上所有 activity 的 interactions
export const interactions = [
    sendInteraction,
    rejectInteraction,
    cancelInteraction,
    deleteInteraction
]

export { states } from './states.js'
