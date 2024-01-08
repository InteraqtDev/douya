import {
    Controller,
    DataAPIContext,
    KlassInstance,
    Interaction, createDataAPI
} from "@interaqt/runtime"
// @ts-ignore
import { Client } from "minio"
import { interactions} from './app/index.js'
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


function createPreCheckAPI(interaction: KlassInstance<typeof Interaction, any>, sign?: any) {
    return createDataAPI(async function(this: Controller, context: DataAPIContext, filemeta: FileMeta) {
        const interactionCall = this.interactionCallsByName.get(interaction.name)
        let error:any
        let signedUrl
        try {
            await interactionCall?.checkCondition({user: context.user, payload: {image: filemeta}})
            if (sign) {
                signedUrl = await sign.call(this, context,  filemeta)
            }
        } catch (e) {
            error = e
        }
        return {
            signedUrl,
            error
        }
    }, { useNamedParams: true })
}

// TODO  需要考虑初始化的时候让用户自己可以选择创建几个 bucket
const signImage = function(this: Controller, context: DataAPIContext, filemeta: FileMeta) {
    return minioClient.presignedPutObject(filemeta.bucket, filemeta.name, 24 * 60 * 60)
}

export const apis = {
    signImage: createPreCheckAPI(interactions.uploadImageInteraction, signImage)
}
