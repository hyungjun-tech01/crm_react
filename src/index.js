import React from 'react';
// import ReactDOM from 'react-dom';
import ReactDOM from 'react-dom/client'; // -- react v18 권고에 따라 변경;
import { RecoilRoot } from "recoil";

import AppRouter from './approuter';
// import * as serviceWorker from './client/serviceWorker';

// ReactDOM.render(<AppRouter/>, document.getElementById('root')); // -- react v18 권고에 따라 변경;
const rootNode = document.getElementById('root');
ReactDOM.createRoot(rootNode).render(
    <React.StrictMode>
        <RecoilRoot>
            <AppRouter/>
        </RecoilRoot>
    </React.StrictMode>
);

if (module.hot) { // enables hot module replacement if plugin is installed
 module.hot.accept();
}