import {AsyncRxSlice, RenderContext} from 'axii'
import {helper} from "../logtoHelper.js";
import {BoolExp} from "@interaqt/shared";
import {Post, PostData} from "./Post.js";


/* @jsx createElement*/
export function Posts({}, {createElement, useLayoutEffect}: RenderContext) {

    const posts = new AsyncRxSlice<PostData>([], async (cursor?: number, length?: number,stop?:number,beforeStart?:boolean )=> {
        const attributeQuery = [
            'title',
            'content',
            ['images', {attributeQuery: ['url', 'width', 'height']}],
            ['owner', {attributeQuery: ['id', 'name']}],
        ]
        const orderBy = {
            id: 'desc'
        }
        if (!cursor) {
            // 获取最新的
            const resp: {data:PostData[]} = await helper.post({
                interaction: 'getPosts',
                query: {
                    modifier: {
                        orderBy,
                        limit: length
                    },
                    attributeQuery
                }
            }, 'sf63ap7ljyul')
            return resp.data.sort((a, b) => a.id - b.id)
        } else {
            const resp: {data:PostData[]} = await helper.post({
                interaction: 'getPosts',
                query: {
                    match: BoolExp.atom({key: 'id', value: [beforeStart ? '<': '>', cursor]}).toValue(),
                    modifier: {
                        orderBy,
                        limit: length
                    },
                    attributeQuery
                }
            }, 'sf63ap7ljyul')
            return resp.data.sort((a, b) => a.id - b.id)
        }
    }, (item) => item?.id)

    useLayoutEffect(() => {
        posts.fetch()
    })

    const loadMore = () =>  {
        posts.append(2)
    }

    const getNewPosts = () => {
        posts.prepend(2)
    }


    return (
        <div>
            <h1>Home</h1>
            <div>posts</div>
            <div>
                <button onclick={loadMore}>load more</button>
                <button onclick={getNewPosts}>get new posts</button>
            </div>
            <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {posts.map((post) => {
                    return <Post {...post} />
                })}
            </div>
        </div>
    )
}