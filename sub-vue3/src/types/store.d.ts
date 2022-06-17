import { Store, StoreOptions } from 'vuex'
type AddPrefix<Prefix, Keys> = `${Prefix & string}/${Keys & string}`


type GetMutations<Module> = Module extends { mutations: infer M; } ? M : never
type GetActions<Module> = Module extends { actions: infer M; } ? M : never


type GetSubModuleMutationKeys<Module, Key> = Module extends { modules: infer SubModules; }
  ? AddPrefix<Key, GetModulesMutationKeys<SubModules>>
  : never

type GetSubModuleActionsKeys<Module, Key> = Module extends { modules: infer SubModules; }
  ? AddPrefix<Key, GetModulesActionsKeys<SubModules>>
  : never

type GetModuleMutationKeys<Module, Key> = AddPrefix<Key, keyof GetMutations<Module>> | GetSubModuleMutationKeys<Module, Key>
type GetModuleActionsKeys<Module, Key> = AddPrefix<Key, keyof GetActions<Module>> | GetSubModuleActionsKeys<Module, Key>

type GetModulesMutationKeys<Modules> = {
  [K in keyof Modules]: GetModuleMutationKeys<Modules[K], K>
}[keyof Modules]
type GetModulesActionsKeys<Modules> = {
  [K in keyof Modules]: GetModuleActionsKeys<Modules[K], K>
}[keyof Modules]

type CommitType<Mutations, Modules> = keyof Mutations | GetModulesMutationKeys<Modules>
type ActionsType<Actions, Modules> = keyof Actions | GetModulesActionsKeys<Modules>

type VuexStore<State, Mutations, Actions, Modules> = {
  commit (type: CommitType<Mutations, Modules>): void
  dispatch (type: ActionsType<Actions, Modules>): void
} & Store<State>

type VuexOptions<State, Mutations, Actions, Modules> = {
  actions?: Actions
  mutations?: Mutations
  modules: Modules
} & StoreOptions<State>


declare module 'vuex' {

  // declare function Vuex<Mutations, Modules> (options: VuexOptions<Mutations, Modules>): Store<Mutations, Modules>
  function createStore<State, Mutations, Actions, Modules> (options: VuexOptions<State, Mutations, Actions, Modules>): VuexStore<State, Mutations, Actions, Modules>
}
