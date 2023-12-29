import {Controller, MonoSystem, SQLiteDB} from "@interaqt/runtime";
import {entities, interactions, relations, states, activities} from './app/index.js'
import {DATABASE_ADDR} from "./config.js";
import { existsSync, unlinkSync } from "fs";
import chalk from "chalk";
import {program} from "commander";
import { client } from "./logtoClient.js";


export function mapUserEntity(userEntity: any) {
    return {
        id: userEntity.id,
        name: userEntity.username,
    }
}

export async function createInitialData(controller: Controller) {
    const system = controller.system
    await client.getToken()
    const users = await client.getUsers()
    for(let user of users) {
        await system.storage.create('User', mapUserEntity(user))
    }
}

program.option('-f, --force', 'force install')
    .action(async (options) => {
        console.log(options)
        try {
            if (existsSync(DATABASE_ADDR)) {
                if (!options.force) {
                    console.log(chalk.red(`${DATABASE_ADDR} already exist, remove it before install`))
                    return
                } else {
                    console.log(chalk.red(`force install, will delete ${DATABASE_ADDR}.`))
                    unlinkSync(DATABASE_ADDR)
                }
            }
            const db = new SQLiteDB(DATABASE_ADDR)
            const system = new MonoSystem(db)
            const controller = new Controller(system, entities, relations, activities, interactions, states)
            await controller.setup(true)
            await createInitialData(controller)

            console.log("install successfully")
        } catch (e) {
            console.error(e)
            process.exit(1)
        }
    })


program.parse(process.argv)