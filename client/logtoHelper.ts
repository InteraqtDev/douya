import {API_ADDR, APP_ID, ENDPOINT_ADDR} from "./constant";
import { Client } from '@interaqt/utility/logto/browser.js'
// import LogtoClient from '@logto/browser';
// export class Client {
//     token?: string
//     public client: LogtoClient
//     constructor(public endpoint: string, public appId: string, public api_addr: string) {
//         this.client =  new LogtoClient({
//             endpoint: this.endpoint,
//             appId: this.appId,
//             resources:[this.api_addr]
//         })
//     }
//     async getToken() {
//         this.token =  await this.client.getAccessToken(this.api_addr)
//     }
//     post = async (data:any) => {
//         if (!this.token) await this.getToken()
//
//         return (await fetch(`${this.api_addr}`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${this.token}`
//             },
//             body: JSON.stringify(data)
//         })).json()
//     }
// }
export const helper = new Client(ENDPOINT_ADDR, APP_ID, API_ADDR)