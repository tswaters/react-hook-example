
import {v4} from 'uuid'
import {createSelector} from 'reselect'

const ADD_USER = '@@user/add-user'
const EDIT_USER = '@@user/edit-user'
const REMOVE_USER = '@@user/remove-user'

const reducers = {
    [ADD_USER]: (state, action) => [
        ...state,
        {
            first_name: action.first_name,
            last_name: action.last_name,
            id: action.id
        }
    ],
    [EDIT_USER]: (state, action) => state.map(user => user.id !== action.id ? user : {
        ...user,
        first_name: action.first_name,
        last_name: action.last_name
    }),
    [REMOVE_USER]: (state, action) => state.filter(user => user.id !== action.id)
}

export const addUser = ({first_name, last_name}) => {
    return {type: ADD_USER, first_name, last_name, id: v4()}
}

export const editUser = ({id, first_name, last_name}) => {
    return {type: EDIT_USER, id, first_name, last_name}
}

export const removeUser = (id) => {
    return {type: REMOVE_USER, id}
}

export const userSelector = createSelector(
    (state, ownProps) => state.find(user => user.id === ownProps.id),
    user => user
)

export const userMapStateToProps = (state, ownProps) => userSelector(state, ownProps)

export const userDispatch = dispatch => ({
    removeUser: id => dispatch(removeUser(id)),
    addUser: (first_name, last_name) => dispatch(addUser({first_name, last_name})),
    editUser: (id, first_name, last_name) => dispatch(editUser({id, first_name, last_name}))
})

export const initialState = [{
    id: v4(),
    first_name: 'tyler',
    last_name: 'waters'
}, {
    id: v4(),
    first_name: 'oleg',
    last_name: 'gunkin'
}]

export default (state = initialState, action) => {
    const slice = reducers[action.type]
    if (slice) return slice(state, action)
    return state
}
