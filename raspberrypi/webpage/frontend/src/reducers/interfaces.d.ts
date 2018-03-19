interface ReduxState {
    app: AppState
}

// TODO: Check how to get Props type when we use withRouter
// From the doc it's should to be RouteComponentProps<T> but no success with it
// So here is one writting "by hands" with the really basic that we may needs
type RouteComponentPropsPatch<T> = {
    history: {
        goBack: () => void;
        push: (path: string) => void;
    };
    match: {params: T}
};