import {Controller, DataAPIContext} from "@interaqt/runtime"
import {createInteractionPreCheckAPI, createWebhookCallbackAPI} from '@interaqt/utility/pattern/server.js'
// @ts-ignore
import {Client} from "minio"
import {interactions} from './app/index.js'
import {uploadImageInteraction} from "./app/post.js";


export const ACCESS_KEY="37v5xX7TGXZFotbG2o1u"
export const SECRET_KEY="3a9BM1vFDZ7U07aunGJXDapzJAo0RGtmyjHeRwEO"


const minioClient = new Client({
    endPoint: '127.0.0.1',
    port: 9000,
    useSSL: false,
    accessKey: ACCESS_KEY,
    secretKey: SECRET_KEY,
})

type FileMeta = {
    name: string
    size: number
    mime: string,
    height?: number
    width?: number
    bucket: string
}

export async function install(controller: Controller) {
    const result = await minioClient.presignedPutObject('images', 'test.svg', 24 * 60 * 60)
    console.log(result)
}


const USER_BUCKET = 'user'
const signInteractionPayload = function(this: Controller, context: DataAPIContext, filemeta: FileMeta) {
    const fileNameWithUserId= `${context.user.id}/${filemeta.name}`
    return minioClient.presignedPutObject(USER_BUCKET, fileNameWithUserId, 24 * 60 * 60)
}

type S3Event = {
    Key: string,
    Records: {
        eventName: string,
        s3: {
            bucket: {
                name: string
            }
            object: {
                key: string,
                size:number,
                contentType: string
            }
        }
    }[]
}

const payloadUploadEventToArgs = function(event: S3Event) {
    // TODO 暂时只支持一个
    const record = event.Records[0]
    const [bucket, userId, fileName] = event.Key.split('/')
    return {
        user: {id: userId},
        // TODO width/height 之类的信息要怎么存，mime 不需要了，有 fileName extension 就可以了
        //  放到 fileName 里面？
        payload: {image: {name: fileName, size: record.s3.object.size, mime: record.s3.object.contentType}}
    }
}

export const apis = {
    signUploadImage: createInteractionPreCheckAPI(interactions.uploadImageInteraction, signInteractionPayload),
    uploadImageCallback: createWebhookCallbackAPI(uploadImageInteraction, payloadUploadEventToArgs)
}
