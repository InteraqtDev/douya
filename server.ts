import { IncomingHttpHeaders } from 'http';
import {
    MonoSystem,
    Controller,
    startServer,
    SQLiteDB,
    RecordMutationSideEffect,
    KlassInstance
} from "@interaqt/runtime";
import {program} from "commander";
import * as appData from './app/index.js'
import { apis, sideEffects } from "./integration.js";
import {DATABASE_ADDR, PORT} from "./config.js";
import { client } from "./logtoClient.js";
import {createDashboardAPIs} from "./dashboard.js";

program.option('-d, --dev', 'dev mode')
    .action(async function(options: {dev: boolean}){

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

        if(options.dev) {
            console.warn("running on dev mode")
        }

        startServer(controller, {
            cors: {
              origin: true
            },
            // 监听内网 Ip
            host: '0.0.0.0',
            port: PORT,
            parseUserId: async (headers: IncomingHttpHeaders) => {
                if (options.dev && headers['x-user-id']) return headers['x-user-id'] as string

                return (await client.verifyJWTForAPI(headers)).sub
            }
        }, {
            ...apis,
            ...dashboardAPIs
        })

    }).parse(process.argv)


