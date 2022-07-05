/* eslint-disable @typescript-eslint/ban-types */

declare module '@ccprivate/admin-toolkit-plus' {
  import type { Plugin } from 'vue'
  import type { RouteMeta } from 'vue-router'
  export interface CMenuItems {
    title: string
    icon: string
    route: string
    children?: Array<CMenuItems>
  }
  interface Breadcrumb {
    name: string
    to?: { name: string; }
  }
  export type CBreadcrumbItems = Array<Breadcrumb>
  interface TagNav {
    name: string
    meta: RouteMeta
    fullPath: string
  }
  export type CTagNavInitTags = Array<TagNav>

  export type CForm = import('vue').DefineComponent<
    {
      readonly: { type: BooleanConstructor; default: false; }
      initTags: { type: ArrayConstructor; default: () => []; }
      titles: { type: ObjectConstructor; default: () => {}; }
      theme: { type: StringConstructor; default: () => ''; }
    },
    {
      // $refs: CTagNavInitTags
    },
    unknown,
    {},
    {},
    import('vue').ComponentOptionsMixin,
    import('vue').ComponentOptionsMixin,
    'navigate'[],
    'navigate',
    import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps,
    Readonly<{
      readonly: boolean
    }>,
    {
      readonly: boolean
    }>


  export type CTagNav = import('vue').DefineComponent<
    {
      defaultPath: { type: StringConstructor; default: string; }
      initTags: { type: ArrayConstructor; default: () => []; }
      titles: { type: ObjectConstructor; default: () => {}; }
      theme: { type: StringConstructor; default: () => ''; }
    },
    {
      tags: CTagNavInitTags
    },
    unknown,
    {},
    {},
    import('vue').ComponentOptionsMixin,
    import('vue').ComponentOptionsMixin,
    'navigate'[],
    'navigate',
    import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps,
    Readonly<{
      initTags: CTagNavInitTags
    } & {
      defaultPath?: string
      titles?: Record<string, any>
      theme?: string
    }>,
    {
      initTags: CTagNavInitTags
    }>

  export type CFormInputType = 'string' | 'enum'
  export interface CFormEnumOption {
    label: string
    value: string | number
    disabled: boolean
  }

  export interface CTableRender<T extends { [k: string]: any; }> {
    (renderRowData: import('element-plus/lib/el-table/src/table/defaults').RenderRowData<T>): import('vue').VNode | import('vue').VNode[] | string
  }
  export type CTableHeder<T> = {
    label: string
    prop: keyof T
  } | {
    label: string
    render: CTableRender<T>
  }
  export type CTable<T> = import('vue').DefineComponent<
    {
      props: { type: ObjectConstructor; default: () => {}; }
      data: { type: ArrayConstructor; default: () => []; }
      header: { type: ObjectConstructor; default: () => {}; }
      selectionType: { type: StringConstructor; default: () => ''; }
      selected: { type: ArrayConstructor; default: () => []; }
      selectOnRowClick: { type: BooleanConstructor; default: () => false; }
      fixSelection: { type: BooleanConstructor; default: () => true; }
      rowIndexDisableSelection: { type: ArrayConstructor; default: () => []; }
      useContextMenu: { type: BooleanConstructor; default: () => false; }
    },
    {
      hiddenColumns: Array<number>
      toggleColumn: (index: number) => void
      handleSortChange: () => void
      handleRowClick: (row: T) => void
      createEmitter: (eventName: string) => void
      $refs: { table: any; }
    },
    unknown,
    {},
    {},
    import('vue').ComponentOptionsMixin,
    import('vue').ComponentOptionsMixin,
    'navigate'[],
    'navigate',
    import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps,
    Readonly<{
      readonly: boolean
    }>,
    {
      readonly: boolean
    }>


  export type CSelectionType = 'multiple' | 'single'

  declare const _default: Plugin
  export default _default
}
