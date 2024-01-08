import { atom } from 'axii'
import {InjectHandles} from "../global";
// import { UploadIcon } from "./icons/upload.js";

const API_ENDPOINT = 'http://127.0.0.1:4000/api'
const USER_ID = 'sf63ap7ljyul'

/* @jsx createElement */
export function Upload({}, { createElement }: InjectHandles) {

    let file: File|undefined
    const anyError = atom('')
    const uploadURL = atom('')
    const success = atom<boolean>(null)

    const onSelectFile = (e: InputEvent) => {
        file = (e.target! as HTMLInputElement).files?.[0]
    }

    async function retrieveNewURL(file: File) {
        const resp  = await fetch(`${API_ENDPOINT}/signImage`, {
            headers: {
                'x-user-id': USER_ID,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                name: file.name,
                mime: file.type,
                size: file.size,
                bucket: 'images'
            })
        })

        const { signedUrl, error } = await resp.json()
        uploadURL(signedUrl||'')
        anyError(JSON.stringify(error)||'')
    }

    const upload = async () => {
        await retrieveNewURL(file!)
        try {
            const url = uploadURL()
            await fetch(url, {
                method: 'PUT',
                body: file
            })
            anyError('')
            success(true)
            // 模拟执行 uploadImageInteraction


        } catch (e) {
            anyError(e)
            success(false)
        }
    }

    return <div className="h-full">

        <div class="flex items-center justify-center w-full">
            <label for="dropzone-file"
                   class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span
                        class="font-semibold">Click to upload</span> or drag and drop</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">SVG(MAX. 800x400px)</p>
                </div>
                <input id="dropzone-file" type="file" class="hidden" onChange={onSelectFile}/>
            </label>
        </div>

        <div className="w-full">
            <button type="button"
                    onClick={upload}
                    class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                Upload
            </button>
        </div>

        <div >
            <div>
                <div>uploadURL: {uploadURL}</div>
                <div>anyError: {anyError}</div>
                <div>success: {success}</div>
            </div>
        </div>


    </div>
}