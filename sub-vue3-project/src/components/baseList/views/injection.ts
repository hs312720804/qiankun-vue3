
// provide('primaryKey', primaryKey)
// provide('disposalField', disposalField)
// provide('fetchMethod', fetchMethod)
// provide('handleResource', handleResource)

import { InjectionKey, Ref } from 'vue';

export const primaryKeyKey: InjectionKey<Ref<string>> = Symbol('');

export type disposalFieldKeyType = (fields: tableHeaderItemType[], useType: number) => tableHeaderItemType[]
export const disposalFieldKey: InjectionKey<disposalFieldKeyType> = Symbol('');

export const fetchMethodKey: InjectionKey<Ref<(param: promiseParamsType) => Promise<any>>> = Symbol('');

export const handleResourceKey: InjectionKey<Ref<handleResourceType>> = Symbol('');

