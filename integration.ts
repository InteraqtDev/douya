import {RecordMutationSideEffect, KlassInstance}  from '@interaqt/runtime'
import * as logto from './logto.js'
import * as openim from './openim.js'
import * as minio from './minio.js'

export const recover = {
    logto: logto.recover,
}

export const install = {
    openim: openim.install,
    minio: minio.install
}

export const apis = {
    ...logto.apis,
    ...minio.apis,
    ...openim.apis
}

export const sideEffects = {
    openim: openim.sideEffects
} as  { [k: string]: KlassInstance<typeof RecordMutationSideEffect, false>[]}