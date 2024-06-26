import React from 'react';
// import ReactDOM from 'react-dom';
import ReactDOM from 'react-dom/client'; // -- react v18 권고에 따라 변경;
import { RecoilRoot } from "recoil";
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import { red } from '@mui/material/colors';
import './i18n';

import AppRouter from './approuter';

const REACT_APP_MODE = "production";

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: red[500],
//     },
//   },
// });

// import * as serviceWorker from './client/serviceWorker';

// ReactDOM.render(<AppRouter/>, document.getElementById('root')); // -- react v18 권고에 따라 변경;
const root = ReactDOM.createRoot(
  document.getElementById('root')
);

if (REACT_APP_MODE === "production") {
  root.render(
    <RecoilRoot>    
        <AppRouter/>
    </RecoilRoot>
  );
}

if (REACT_APP_MODE === "development") {
    root.render(
        <React.StrictMode>
            <RecoilRoot>
                {/* <ThemeProvider theme={theme}> */}
                    <AppRouter/>
                {/* </ThemeProvider> */}
            </RecoilRoot>
        </React.StrictMode>
    );
}

if (module.hot) { // enables hot module replacement if plugin is installed
 module.hot.accept();
}