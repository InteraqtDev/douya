import {INTERAQT_ENDPOINT, APP_ID, LOGTO_ENDPOINT} from "./constant";
import { Client } from '@interaqt/utility/logto/browser.js'
export const helper = new Client(LOGTO_ENDPOINT, APP_ID, INTERAQT_ENDPOINT)