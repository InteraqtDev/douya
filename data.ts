import {Controller} from "@interaqt/runtime";
import {faker} from "@faker-js/faker";

export async function install(controller: Controller) {

    const users = await controller.system.storage.find('User')
    // h4eqq7niohkp  和  sf63ap7ljyul 是朋友
    const relationName = controller.system.storage.getRelationName('User', 'friends')
    await controller.system.storage.addRelationByNameById(relationName, 'h4eqq7niohkp', 'sf63ap7ljyul', {})

    // 20 篇 post 和 images
    for(let i = 0; i < 20; i++) {
        const image = await controller.system.storage.create('Image', {
            url: faker.image.urlLoremFlickr({ height: 300, width:400 }),
            width: 400,
            height: 300,
            mime: 'image/jpeg',
            name: faker.lorem.sentence()
        })


        const post = await controller.system.storage.create('Post', {
            owner: {id: "sf63ap7ljyul"},
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraphs(),
            images: [image]
        })
    }

    for(let i = 0; i < 20; i++) {
        const image = await controller.system.storage.create('Image', {
            url: faker.image.urlLoremFlickr({ height: 300, width:400 }),
            width: 400,
            height: 300,
            mime: 'image/jpeg',
            name: faker.lorem.sentence()
        })


        const post = await controller.system.storage.create('Post', {
            owner: {id: "h4eqq7niohkp"},
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraphs(),
            images: [image]
        })
    }



}

