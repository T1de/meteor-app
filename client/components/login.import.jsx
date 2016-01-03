/* jshint esnext:true */
/* global Meteor, React, Accounts */
"use strict";

import { _, Router, ReactBootstrap } from 'app-deps';

var { Alert, Input, Button, Grid, Row, Col, Glyphicon } = ReactBootstrap;
var { Link } = Router;

// React components for login flows

export var LandingPage = React.createClass({
    displayName: 'LandingPage',
    mixins: [React.addons.LinkedStateMixin, Router.Navigation],

    render: function() {
        return (

            <Grid className='login-page'>
                <Row>
                    <h1>Welcome</h1>
                    <h1>to</h1>
                    <h1>T1de</h1>
                </Row>
                <div className="login-buttons">
                    <Link to="login">
                        <button className="login">Sign In</button>
                    </Link>
                    <Link to="login">
                        <button className="login">New Account</button>
                    </Link>
                </div>
            </Grid>
        );
    },
});

export var Login = React.createClass({
    displayName: 'Login',
    mixins: [React.addons.LinkedStateMixin, Router.Navigation],

    getInitialState: function() {
        return {
            username: "",
            password: "",
            invalid: false,
            error: false,
            emailRequired: false,
            sent: false
        };
    },
    handleClick: function() {
        console.log('Blah');
    },
    render: function() {
        return (
            <div>
                <Grid>
                    <Row>
                        <Col xs={8} xsOffset={2}>
                            <h2 className="form-signin-heading center-text">Log in</h2>
                        </Col>
                    </Row>

                </Grid>
                <div className="login-buttons signup">
                    <form className="form-signin tide-input" onSubmit={this.onSubmit}>

                        {this.state.sent? <Alert bsStyle="info">Please check your email</Alert> : ""}
                        {this.state.invalid? <Alert bsStyle="danger">Please enter email and password</Alert> : ""}
                        {this.state.emailRequired? <Alert bsStyle="danger">Please enter your email address first.</Alert> : ""}
                        {this.state.error? <Alert bsStyle="danger">Login unsuccessful. Please try again.</Alert> : ""}

                        <div className='tide-row'>
                            <Glyphicon glyph="user"/>
                            <Input type="text" required autofocus placeholder="Username" valueLink={this.linkState('email')} style={{display: 'inline-block', paddingLeft: '25px'}}/>
                        </div>
                        <div className='form-row tide-row'>
                            <div className="form-col-8">
                                <Glyphicon glyph="lock"/>
                                <Input type="password" required placeholder="Password" valueLink={this.linkState('password')} style={{display: 'inline-block', paddingLeft: '25px'}}/>
                            </div>
                            <div className="form-col-4 right-text">
                                <a onClick={this.forgotPassword}>Forgot Password</a>
                            </div>
                        </div>
                    </form>
                    <Link to="readings">
                        <button className="login" onClick={this.onSubmit}>Log In</button>
                    </Link>
                    <button className="login login-facebook" onClick={this.loginFacebook}>Log In with Facebook</button>

                    <p>Don't have an account? <Link to="readings">Sign Up</Link></p>
                </div>
            </div>
        );
    },

    loginFacebook: function() {
        Meteor.loginWithFacebook({requestPermissions: ['public_profile', 'email']}, err => {
            if (err) {
                this.setState({invalid: false, emailRequired: false, error: true, sent: false});
            } else {
                this.transitionTo("home");
            }
        });
    },

    forgotPassword: function(e) {
        e.preventDefault();

        if(!this.state.email) {
            this.setState({invalid: false, emailRequired: true, error: false, sent: false});
            return;
        }

        Accounts.forgotPassword({email: this.state.email}, err => {
            if(err) {
                this.setState({invalid: false, emailRequired: false, error: true, sent: false});
            }

            this.setState({invalid: false, emailRequired: false, error: false, sent: true});
        });

    },

    onSubmit: function(e) {
        e.preventDefault();

        if(!this.state.email || !this.state.password) {
            this.setState({invalid: true, emailRequired: false, error: false, sent: false});
            return;
        } else {
            this.setState({invalid: false, emailRequired: false, error: false, sent: false});
        }

        Meteor.loginWithPassword(this.state.email, this.state.password, err => {
            if(err) {
                this.setState({invalid: false, emailRequired: false, error: true, sent: false});
            } else {
                this.transitionTo("home");
            }
        });
    }

});

export var ResetPassword = React.createClass({
    displayName: 'ResetPassword',
    mixins: [React.addons.LinkedStateMixin, Router.State, Router.Navigation],

    getInitialState: function() {
        return {
            password: "",
            confirmPassword: "",
            invalid: false,
            error: false
        };
    },

    render: function() {
        return (
            <div className="container">
                <form className="form-signin" onSubmit={this.onSubmit}>
                    <h2 className="form-signin-heading">Reset password</h2>

                    {this.state.invalid? <Alert bsStyle="danger">Please enter and confirm your new password</Alert> : ""}
                    {this.state.error? <Alert bsStyle="danger">An error ocurred. Please try again.</Alert> : ""}

                    <Input type="password" labelClassName="sr-only" label="Password" required placeholder="Password" valueLink={this.linkState('password')} />
                    <Input type="password" labelClassName="sr-only" label="Confirm Password" required placeholder="Confirm Password" valueLink={this.linkState('confirmPassword')} />

                    <Button bsStyle="primary" block type="submit">Reset</Button>
                </form>
            </div>
        );
    },

    onSubmit: function(e) {
        e.preventDefault();

        if(!this.state.password || !this.state.password || this.state.password !== this.state.confirmPassword) {
            this.setState({invalid: true, error: false});
            return;
        } else {
            this.setState({invalid: false, error: false});
        }

        Accounts.resetPassword(this.getParams().token, this.state.password, err => {
            if(err) {
                this.setState({invalid: false, error: true});
            } else {
                this.transitionTo("home");
            }
        });
    }

});

export var EnrollAccount = React.createClass({
    displayName: 'ResetPassword',
    mixins: [React.addons.LinkedStateMixin, Router.State, Router.Navigation],

    getInitialState: function() {
        return {
            password: "",
            confirmPassword: "",
            invalid: false,
            error: false
        };
    },

    render: function() {
        return (
            <div className="container">
                <form className="form-signin" onSubmit={this.onSubmit}>
                    <h2 className="form-signin-heading">Activate account</h2>

                    {this.state.invalid? <Alert bsStyle="danger">Please enter and confirm your password</Alert> : ""}
                    {this.state.error? <Alert bsStyle="danger">An error ocurred. Please try again.</Alert> : ""}

                    <Input type="password" labelClassName="sr-only" label="Password" required placeholder="Password" valueLink={this.linkState('password')} />
                    <Input type="password" labelClassName="sr-only" label="Confirm Password" required placeholder="Confirm Password" valueLink={this.linkState('confirmPassword')} />

                    <Button bsStyle="primary" block type="submit">Reset</Button>
                </form>
            </div>
        );
    },

    onSubmit: function(e) {
        e.preventDefault();

        if(!this.state.password || !this.state.password || this.state.password !== this.state.confirmPassword) {
            this.setState({invalid: true, error: false});
            return;
        } else {
            this.setState({invalid: false, error: false});
        }

        Accounts.resetPassword(this.getParams().token, this.state.password, err => {
            if(err) {
                this.setState({invalid: false, error: true});
            } else {
                this.transitionTo("home");
            }
        });
    }

});

export var ChangePassword = React.createClass({
    displayName: 'ChangePassword',
    mixins: [React.addons.LinkedStateMixin, Router.Navigation],

    getInitialState: function() {
        return {
            password: "",
            newPassword: "",
            confirmPassword: "",
            invalid: false,
            error: false
        };
    },

    render: function() {
        return (
            <form className="form-signin" onSubmit={this.onSubmit}>
                <h2 className="form-signin-heading">Change password</h2>

                {this.state.invalid? <Alert bsStyle="danger">Please enter both email and password</Alert> : ""}
                {this.state.error? <Alert bsStyle="danger">Invalid old password. Please try again.</Alert> : ""}

                <Input type="password" labelClassName="sr-only" label="Current password" required placeholder="Current password" valueLink={this.linkState('password')} />
                <Input type="password" labelClassName="sr-only" label="New password" required placeholder="New password" valueLink={this.linkState('newPassword')} />
                <Input type="password" labelClassName="sr-only" label="Confirm password" required placeholder="Confirm password" valueLink={this.linkState('confirmPassword')} />

                <Button bsStyle="primary" block type="submit">Change password</Button>
                <div className="form-group">
                    <Link to="home">Cancel</Link>
                </div>
            </form>
        );
    },

    onSubmit: function(e) {
        e.preventDefault();

        if(!this.state.password || !this.state.newPassword || !this.state.confirmPassword || this.state.newPassword !== this.state.confirmPassword) {
            this.setState({invalid: true, error: false});
            return;
        } else {
            this.setState({invalid: false, error: false});
        }

        Accounts.changePassword(this.state.password, this.state.newPassword, err => {
            if(err) {
                this.setState({invalid: false, error: true});
            } else {
                this.transitionTo("home");
            }
        });
    }

});
