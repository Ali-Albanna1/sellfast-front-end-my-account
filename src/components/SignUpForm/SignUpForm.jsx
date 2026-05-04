// SignUpForm.jsx

import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import * as authService from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';

import styles from './SignUpForm.module.css';

const SignUpForm = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email:'',
    password: '',
    passwordConf: '',
  });
  const { setUser } = useContext(UserContext);

  const { username, email, password, passwordConf } = formData;

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const user = await authService.signUp(formData)
    setUser(user); // this line will print the form data to the console
    navigate('/')
  };

  const isFormInvalid = () => {
    return !(username && email && password && password === passwordConf);
  };

  return (
    <main className={styles.signup}>
      <section className={styles.signupWrapper}>
        <h1>Sign Up</h1>
        <p className={styles.message}>{message}</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="name"
              value={username}
              name="username"
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              id="email"
              value={email}
              name="email"
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              name="password"
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="confirm">Confirm Password:</label>
            <input
              type="password"
              id="confirm"
              value={passwordConf}
              name="passwordConf"
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.actions}>
            <button disabled={isFormInvalid()}>Sign Up</button>
            <button type="button" onClick={() => navigate('/')}>
              Cancel
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default SignUpForm;
