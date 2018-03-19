interface ElementsWithId { id: string }
interface DictWithId<T extends ElementsWithId> { [id: string] : T }

interface AppState {
    
}