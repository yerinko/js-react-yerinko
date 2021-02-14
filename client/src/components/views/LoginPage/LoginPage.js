import React, {useState} from 'react'
import Axios from "axios";
import {useDispatch} from "react-redux";
import { loginUser } from '../../../_actions/User_action';

function LoginPage(props) {
    const dispatch = useDispatch();

    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");

    const onEmailHandler = (event) => {

        setEmail(event.currentTarget.value);
    };
    const onPasswordHandler = (event) => {

        setPassword(event.currentTarget.value);
    };

    const onSubmitHandler = (event) => {
        event.preventDefault() //refresh 막기

        let body = {
            email: Email,
            password: Password
        };

        dispatch(loginUser(body))
            .then(response => {
                if(response.playload.loginSuccess) {
                    props.history.push('/')
                } else {
                    alert('Error')
                }
            })



    };

    return (
        <div style={{
            display:'flex', justifyContent: 'center', alignItems:'center',
            width: '100%', height:'100vh'
        }}>
            <form style={{ display: 'flex', flexDirection:'column'}}
                onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />

                <br/>
                <button type="subbmit">
                    Login
                </button>
            </form>
        </div>
    )
}

export default LoginPage