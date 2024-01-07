import { IncomingHttpHeaders } from 'http';
import {
    MonoSystem,
    Controller,
    startServer,
    SQLiteDB,
    RecordMutationSideEffect,
    KlassInstance
} from "@interaqt/runtime";
import * as appData from './app/index.js'
import { apis, sideEffects } from "./integration.js";
import {DATABASE_ADDR, PORT} from "./config.js";
import { client } from "./logtoClient.js";
import {createDashboardAPIs} from "./dashboard.js";

const db = new SQLiteDB(DATABASE_ADDR)
const system = new MonoSystem(db)
const data = appData as any
const controller = new Controller(
    system,
    Object.values(data.entities||{}),
    Object.values(data.relations|| {}),
    Object.values(data.activities||{}),
    Object.values(data.interactions||{}),
    Object.values(data.states||{}),
    ([] as KlassInstance<typeof RecordMutationSideEffect, false>[]).concat(...Object.values(sideEffects))
)
await controller.setup()


const dashboardAPIs = createDashboardAPIs(apis)

startServer(controller, {
    port: PORT,
    parseUserId: async (headers: IncomingHttpHeaders) => {
        return (await client.verifyJWTForAPI(headers)).sub
    }
}, {
    ...apis,
    ...dashboardAPIs
})
