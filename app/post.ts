import {
    Action,
    BoolExp,
    boolExpToConditions,
    Condition,
    Controller,
    Entity,
    Interaction,
    InteractionEventArgs,
    MapInteraction,
    MapInteractionItem,
    Payload,
    PayloadItem,
    Property,
    PropertyTypes,
    Relation,
    GetAction
} from "@interaqt/runtime";
import {UserEntity} from "./user.js";


// @ts-ignore
export const imageEntity = Entity.create({
    name: 'Image',
    properties: [
        Property.create({ name: 'url', type: PropertyTypes.String }),
        Property.create({ name: 'width', type: PropertyTypes.Number }),
        Property.create({ name: 'height', type: PropertyTypes.Number }),
        Property.create({ name: 'size', type: PropertyTypes.Number }),
        Property.create({ name: 'mime', type: PropertyTypes.String }),
        Property.create({ name: 'name', type: PropertyTypes.String }),
    ]
})

const imageTypeCondition = Condition.create({
    name: 'ImageTypeCondition',
    content: async function (this: Controller, event: InteractionEventArgs) {
        // only svg
        return event.payload?.image?.mime === 'image/svg+xml'
    }
})

const imageSizeCondition = Condition.create({
    name: 'ImageSizeCondition',
    content: async function (this: Controller, event: InteractionEventArgs) {
        return event.payload?.image?.size < 100000
    }
})

export const uploadImageInteraction = Interaction.create({
    conditions: boolExpToConditions(BoolExp.and(imageTypeCondition, imageSizeCondition)),
    name: 'uploadImage',
    action: Action.create({name: 'upload'}),
    payload: Payload.create({
        items: [
            PayloadItem.create({
                name: 'image',
                base: imageEntity,
            }),
        ]
    })
})


export const postEntity = Entity.create({
    name: 'Post',
})


export const createPostInteraction = Interaction.create({
    name: 'createPost',
    action: Action.create({name: 'create'}),
    payload: Payload.create({
        items: [
            PayloadItem.create({
                name: 'post',
                base: postEntity,
            }),
            PayloadItem.create({
                name: 'images',
                base: imageEntity,
                isRef: true,
                isCollection: true
            }),
        ]
    })
})


export const updatePostInteraction = Interaction.create({
    name: 'updatePost',
    action: Action.create({name: 'update'}),
    payload: Payload.create({
        items: [
            PayloadItem.create({
                name: 'post',
                base: postEntity,
                isRef: true
            }),
        ]
    })
})


postEntity.properties.push(
    Property.create({
        name: 'title', type: PropertyTypes.String,
        computedData: MapInteraction.create({
            items: [
                MapInteractionItem.create({
                    interaction: createPostInteraction,
                    map: (event) => { return event.payload.post.title },
                    computeTarget: async function (this: Controller, event) {
                        return event.payload.post.id
                    }
                }),
            ]
        })
    }),
    Property.create({
        name: 'content',
        type: PropertyTypes.String,
        computedData: MapInteraction.create({
            items: [
                MapInteractionItem.create({
                    interaction: updatePostInteraction,
                    map: (event) => { return event.payload.post.content },
                    computeTarget: async function (this: Controller, event) {
                        return event.payload.post.id
                    }
                }),
            ]
        })
    }),
)


export const postImageRelation = Relation.create({
    source: postEntity,
    sourceProperty: 'images',
    target: imageEntity,
    targetProperty: 'post',
    relType: '1:n',
    properties: [],
    computedData: MapInteraction.create({
        items: [
            MapInteractionItem.create({
                interaction: createPostInteraction,
                map: (event) => {
                    return event.payload.images?.map((image: any) => ({
                        source: { id: event.payload.post.id },
                        target: { id: image.id }
                    }))
                },
            }),
        ]
    })
})


export const postOwnerRelation = Relation.create({
    source: UserEntity,
    sourceProperty: 'posts',
    target: postEntity,
    targetProperty: 'owner',
    relType: '1:n',
    computedData: MapInteraction.create({
        items: [
            MapInteractionItem.create({
                interaction: createPostInteraction,
                map: (event) => {
                    return {
                        source: { id: event.user.id },
                        target: { id: event.payload.post.id }
                    }
                },
            }),
        ]
    }),
})

export const getPostsInteraction = Interaction.create({
    name: 'getPosts',
    action: GetAction,
    data: postEntity
})

// revision 的实现
// export const postRevisionEntity = Entity.create({
//     name: 'PostRevision',
//     properties: [
//         // 这里测试 title 不可更新，所以 revision 里面不记录。
//         Property.create({ name: 'content', type: PropertyTypes.String })
//     ],
//     computedData: MapRecordMutation.create({
//       map: async function (this: Controller, event:RecordMutationEvent, events: RecordMutationEvent[]) {
//           if (event.type === 'update' && event.recordName === 'Post') {
//               return {
//                   content: event.oldRecord!.content,
//                   current: {
//                       id: event.oldRecord!.id
//                   }
//               }
//           }
//       }
//     })
// })
//
// export const postRevisionRelation = Relation.create({
//     source: postEntity,
//     sourceProperty: 'revisions',
//     target: postRevisionEntity,
//     targetProperty: 'current',
//     relType: '1:n',
// })