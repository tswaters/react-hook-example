
import React, { useState, useCallback, useReducer, createContext } from 'react'
import userReducer, { userMapStateToProps, initialState, userDispatch } from './user'

const getDisplayName = WrappedComponent => WrappedComponent.displayName || WrappedComponent.name || 'Component'

const record = (...args) => console.log(new Date(), 'Hooks', ...args)

const Store = createContext()

const connect = (mapStateToProps, mapDispatchToProps) => Component => {
    const wrapped = props =>
        <Store.Consumer>
            {({state, dispatch}) =>
            (
                <Component
                    {...props}
                    {...mapStateToProps ? mapStateToProps(state, props) : {}}
                    {...mapDispatchToProps ? mapDispatchToProps(dispatch, props) : {}}
                />
            )
            }
        </Store.Consumer>
    wrapped.displayName = `connect(${getDisplayName(Component)})`
    return wrapped
}

const Provider = React.memo(({ children }) => {
    const [ state, dispatch ] = useReducer(userReducer, initialState)
    return (
        <Store.Provider value={{state, dispatch}}>
            {children}
        </Store.Provider>
    )
})

Provider.displayName = 'Provider'

export const App = React.memo(() => {
    record('App')
    return (
        <Provider>
            <h1>Hooks</h1>
            {React.version}
            <UserList />
        </Provider>
    )
})

App.displayName = 'App'

const UserEditComponent =
    ({editUser, id, first_name: initial_first_name, last_name: initial_last_name}) => {

        const [ first_name, set_first_name ] = useState(initial_first_name)
        const [ last_name, set_last_name ] = useState(initial_last_name)

        const updateFirstName = useCallback(e => set_first_name(e.target.value), [])

        const updateLastName = useCallback(e => set_last_name(e.target.value), [])

        const handleSubmit = useCallback(e => {
            e.preventDefault()
            editUser(id, first_name, last_name)
        }, [id, first_name, last_name])

        record('UserEdit', id)

        return (
            <form onSubmit={handleSubmit}>
                <label htmlFor="first-name">First Name</label>
                <input value={first_name} onChange={updateFirstName} id="first-name"></input>

                <label htmlFor="last-name">Last Name</label>
                <input value={last_name} onChange={updateLastName} id="last-name"></input>

                <button>Save</button>
            </form>
        )
    }

UserEditComponent.displayName = 'UserEditComponent'

const UserEdit = connect(userMapStateToProps, userDispatch)(React.memo(UserEditComponent))

const UserAddComponent =
    ({ addUser }) => {

        const [ first_name, set_first_name ] = useState('')
        const [ last_name, set_last_name ] = useState('')

        const updateFirstName = useCallback(e => set_first_name(e.target.value), [])

        const updateLastName = useCallback(e => set_last_name(e.target.value), [])

        const handleSubmit = useCallback(e => {
            addUser(first_name, last_name)
            set_first_name('')
            set_last_name('')
            e.preventDefault()
        }, [first_name, last_name])

        record('UserAdd')
        return (
            <form onSubmit={handleSubmit}>

                <label htmlFor="first-name">First Name</label>
                <input value={first_name} onChange={updateFirstName} id="first-name"></input>

                <label htmlFor="last-name">Last Name</label>
                <input value={last_name} onChange={updateLastName} id="last-name"></input>

                <button>Add</button>

            </form>
        )
    }

UserAddComponent.displayName = 'UserAddComponent'

const UserAdd = connect(null, userDispatch)(React.memo(UserAddComponent))

const UserViewComponent =
   ({removeUser, id, first_name, last_name}) => {

        const handleRemove = useCallback(() => removeUser(id), [id])

        record('UserView', id)
        return (
            <div>
                <p>
                    {id} - {first_name} - {last_name}
                    <button type="button" onClick={handleRemove}>Remove</button>
                </p>
            </div>
        )
    }

UserViewComponent.displayName = 'UserViewComponent'

const UserView = connect(userMapStateToProps, userDispatch)(React.memo(UserViewComponent))

const UserListComponent =
    ({users}) => {

        record('UserList')
        return (
            <>
                <h2>Users (read-only)</h2>
                <ul>
                    {users.map(user => <li key={user.id}><UserView id={user.id} /></li>)}
                </ul>
                <h2>Users (edit)</h2>
                <ul>
                    {users.map(user => <li key={user.id}><UserEdit id={user.id} /></li>)}
                </ul>
                <h2>User (add)</h2>
                <UserAdd />
            </>
        )
    }

UserListComponent.displayName = 'UserListComponent'

const UserList = connect(users => ({users}))(React.memo(UserListComponent))
