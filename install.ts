import {Controller, MonoSystem, SQLiteDB} from "@interaqt/runtime";
import {activities, entities, interactions, relations, states} from './app/index.js'
import {DATABASE_ADDR} from "./config.js";
import {existsSync, unlinkSync} from "fs";
import chalk from "chalk";
import {program} from "commander";
import { recover, install } from "./integration.js";


type Recovers = {
    [k:string]: (controller: Controller) => Promise<void>
}

type Installs = {
    [k:string]: (controller: Controller) => Promise<void>
}

program
    .option('-f, --force', 'force install')
    .option('-r, --recover [recover...]', 'recover data from sub systems')
    .action(async (options: {force:boolean, recover:string[]}) => {
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
            const controller = new Controller(system, Object.values(entities), Object.values(relations), Object.values(activities), Object.values(interactions), Object.values(states))
            await controller.setup(true)
            if (options.recover) {
                for (let subSystem of options.recover) {
                    if (subSystem in recover) {
                        await (recover as Recovers)[subSystem as string](controller)
                    } else {
                        console.log(chalk.red(`sub system ${subSystem} not found`))
                        return
                    }
                }
            }

            // 默认都要 install
            for(let subSystem in install) {
                await (install as Installs)[subSystem as string](controller)
            }


            console.log("install successfully")
        } catch (e) {
            console.error(e)
            process.exit(1)
        }
    })


program.parse(process.argv)