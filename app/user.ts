import {Entity, Property, PropertyTypes, } from "@interaqt/runtime";
import {USER_ENTITY} from "@interaqt/runtime";

export const UserEntity = Entity.create({ name: USER_ENTITY })
const nameProperty = Property.create({ name: 'name', type: PropertyTypes.String })
const ageProperty = Property.create({ name: 'age', type: PropertyTypes.Number })
const mobileProperty = Property.create({ name: 'mobile', type: PropertyTypes.String })
UserEntity.properties.push(nameProperty, ageProperty, mobileProperty)


