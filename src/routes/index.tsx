import React from 'react';
import { Switch, } from 'react-router-dom';
import Route from './Route'
import SignIn from '../page/Signin/index'
import SignUp from '../page/SignUp/index'
import Dashboard from '../page/Dashboard/index'
import ForgotPassword from '../page/ForgotPassword';
import ResetPassword from '../page/ResetPassword';
import Profile from '../page/Profile';
const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/signup" component={SignUp} />
    <Route path="/forgot-password" component={ForgotPassword} />
    <Route path="/reset-password" component={ResetPassword} />
    <Route path="/profile" component={Profile} isPrivate />
    <Route path="/dashboard" component={Dashboard} isPrivate />
  </Switch>
)

export default Routes;
