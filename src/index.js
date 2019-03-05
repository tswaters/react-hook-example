import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import './index.css'

import {App as HooksApplication} from './app-hooks'
import {App as ComponentApplication} from './app-components'

export const Chooser = () => {
    const [choice, set_choise] = useState('hooks')

    return (
        <div>
            <div>
                <label htmlFor="choice[hooks]">Hooks</label>
                <input onChange={() => set_choise('hooks')} type="radio" name="choice" id="choice[hooks]" value="hooks" checked={choice === 'hooks'} />
            </div>

            <div>
                <label htmlFor="choice[components]">Components</label>
                <input onChange={() => set_choise('components')} type="radio" name="choice" id="choice[components]" value="components" checked={choice === 'components'} />
            </div>

            {choice === 'hooks' && <HooksApplication />}
            {choice === 'components' && <ComponentApplication />}
        </div>
    )
}

ReactDOM.render(<Chooser />, document.getElementById('root'));
