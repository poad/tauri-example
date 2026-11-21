import App from './App.jsx';
/* @refresh reload */
import './index.css';

import { createRouter } from '@solidjs/router';
import { render } from '@solidjs/web';

const Router = createRouter({
  routes: [{ path: '/', component: App }],
});
const root = document.getElementById('root');
if (root) {
  render(() => <Router>{(props) => props.children}</Router>, root);
}
