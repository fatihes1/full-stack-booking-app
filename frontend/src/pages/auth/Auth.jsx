import './Auth.css'
import { useContext, useRef, useState } from 'react'
import AuthContext from '../../context/auth-context.jsx'
export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const emailEl = useRef()
  const passwordEl = useRef()
  const authContext = useContext(AuthContext)

  const submitHandler = (event) => {
    event.preventDefault()
    const email = emailEl.current.value
    const password = passwordEl.current.value

    if (email.trim().length === 0 || password.trim().length === 0) {
      return
    }

    let requestBody = {
      query: `
                query {
                  login(email: "${email}", password: "${password}") {
                    userId
                    token
                    tokenExpiration
                  }
                }
              `,
    }

    if (!isLogin) {
      requestBody = {
        query: `
                  mutation {
                    createUser(userInput: {email: "${email}", password: "${password}"}) {
                      _id
                      email
                    }
                  }
                `,
      }
    }

    fetch('http://localhost:3003/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!')
        }
        return res.json()
      })
      .then((resData) => {
        if (resData.data.login) {
          const token = resData.data.login.token
          const tokenExpiration = resData.data.login.tokenExpiration
          const userId = resData.data.login.userId
          authContext.login(token, userId, tokenExpiration)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const switchModeHandler = () => {
    setIsLogin((prevState) => !prevState)
  }

  return (
    <form className={'auth-form'} onSubmit={submitHandler}>
      <div className={'form-control'}>
        <label htmlFor={'email'}>E-Mail</label>
        <input type={'email'} id={'email'} ref={emailEl} required />
      </div>
      <div className={'form-control'}>
        <label htmlFor={'password'}>Password</label>
        <input type={'password'} id={'password'} ref={passwordEl} required />
      </div>
      <div className={'form-actions'}>
        <button type={'submit'}>Submit</button>
        <button type={'button'} onClick={switchModeHandler}>
          Switch to {isLogin ? 'SignUp' : 'Login'}
        </button>
      </div>
    </form>
  )
}
