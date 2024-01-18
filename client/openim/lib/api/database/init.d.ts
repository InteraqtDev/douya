import { Database } from '@jlongster/sql.js';
export declare function setSqlWasmPath(wasmPath: string): void;
export declare function init(userId: string, dir: string): Promise<string>;
export declare function close(): Promise<any>;
export declare function alterTable(db: Database): void;
