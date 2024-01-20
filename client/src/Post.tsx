import {RenderContext} from 'axii'

export type Owner = {
    id: string,
    name: string,
}
export type ImageData = {url:string, width:number, height:number}
export type PostData = {id: number, title:string, content:string, images: ImageData[], owner:Owner}


/* @jsx createElement*/
export function Post({ title, content, images, owner }: PostData, {createElement, useLayoutEffect}: RenderContext) {
    // 上面是图片, 下面是 title 和 content。boxShadow 包围整体。
    return (

        <a href="#" class="group">
            <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg sm:aspect-h-3 sm:aspect-w-2">
                <img src={images[0].url} alt="Person using a pen to cross a task off a productivity paper card." class="h-full w-full object-cover object-center group-hover:opacity-75" />
            </div>
            <div class="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
                <h3>{title}</h3>
            </div>
            <div>
                {owner.name}:{owner.id}
            </div>
            <p class="mt-1 text-sm italic text-gray-500">{content}</p>
        </a>
    )
}