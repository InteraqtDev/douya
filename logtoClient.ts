import {Client} from '@interaqt/utility/logto/server.js'

export const MANAGEMENT_ADDR = 'https://default.logto.app/api'
export const ENDPOINT_ADDR = 'http://localhost:3001'
export const APP_ID = '63dos8p8xaiidextnxom5'
export const APP_SECRET = 'OSWmLZ9IVxXcTYcPob940SufYR2SWZUm'
export const INTERAQT_ADDR = 'http://127.0.0.1:4000'



export const client = new Client(ENDPOINT_ADDR, APP_ID, APP_SECRET, INTERAQT_ADDR)

