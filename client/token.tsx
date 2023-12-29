import LogtoClient from '@logto/browser';

import {helper} from './logtoHelper.js';


try {
    await helper.client.handleSignInCallback(window.location.href);
    console.log(await helper.client.isAuthenticated()); // true
    window.location.href = 'index.html'
} catch {
    // Handle error
}