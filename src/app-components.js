
import React, { PureComponent } from 'react'
import { createStore } from 'redux'
import { connect, Provider } from 'react-redux'
import userReducer, { initialState, userMapStateToProps, userDispatch } from './user'

const record = (...args) => console.log(new Date(), 'Components', ...args)

const UserEdit = connect(userMapStateToProps, userDispatch)(class UserEditComponent extends PureComponent {

    constructor (props) {
        super(props)
        this.state = {
            first_name: props.first_name,
            last_name: props.last_name,
            id: props.id
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleUpdate(name) {
        return e => this.setState({[name]: e.target.value})
    }

    handleSubmit (e) {
        e.preventDefault()
        const {id, first_name, last_name} = this.state
        this.props.editUser(id, first_name, last_name)
    }

    render () {
        const {id, first_name, last_name} = this.state
        record('UserEdit', id)
        return (
            <form onSubmit={this.handleSubmit}>
                <label htmlFor="first-name">First Name</label>
                <input value={first_name} onChange={this.handleUpdate('first_name')} id="first-name"></input>

                <label htmlFor="last-name">Last Name</label>
                <input value={last_name} onChange={this.handleUpdate('last_name')} id="last-name"></input>

                <button>Save</button>
            </form>
        )
    }
})

const UserAdd = connect(null, userDispatch)(class UserAddComponent extends PureComponent {
    constructor (props) {
        super(props)
        this.state = {
            first_name: '',
            last_name: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit (e) {
        e.preventDefault()
        const {first_name, last_name} = this.state
        this.props.addUser(first_name, last_name)
        this.setState({first_name: '', last_name: ''})
        e.preventDefault()
    }

    handleChange(name) {
        return e => this.setState({[name]: e.target.value})
    }

    render () {
        const {first_name, last_name} = this.state
        record('UserAdd')
        return (
            <form onSubmit={this.handleSubmit}>

                <label htmlFor="first-name">First Name</label>
                <input value={first_name} onChange={this.handleChange('first_name')} id="first-name"></input>

                <label htmlFor="last-name">Last Name</label>
                <input value={last_name} onChange={this.handleChange('last_name')} id="last-name"></input>

                <button>Add</button>

            </form>
        )
    }
})

const UserView = connect(userMapStateToProps, userDispatch)(class UserViewComponent extends PureComponent {

    handleRemove () {
        this.props.removeUser(this.props.id)
    }

    render () {
        const {id, first_name, last_name} = this.props
        record('UserView', id)
        return (
            <div>
                <p>
                    {id} - {first_name} - {last_name}
                    <button type="button" onClick={this.handleRemove}>Remove</button>
                </p>
            </div>
        )
    }
})

const UserList = connect(users => ({users}))(class UserListComponent extends PureComponent {
    render () {
        record('UserList')
        const {users} = this.props
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
})

const store = createStore(userReducer, initialState)

export class App extends PureComponent {
    render () {
        record('App')
        return (
            <Provider store={store}>
                <h1>Components</h1>
                {React.version}
                <UserList />
            </Provider>
        )
    }
}


