import React from "react";
import ReactDOM from "react-dom/client";
import "remixicon/fonts/remixicon.css";
import "bootstrap/dist/css/bootstrap.css";
import 'boxicons/css/boxicons.min.css';


import App from "./App";
import {BrowserRouter} from "react-router-dom";
import store from "./redux/store";
import { Provider } from "react-redux";
import { ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <ToastContainer
                    theme="dark"
                    position="top-right"
                    autoClose={3000}
                    closeOnClick
                    pauseOnHover={false}
                />
                <App />
            </Provider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);



// import React from "react";
// import ReactDOM from "react-dom/client";
// import "remixicon/fonts/remixicon.css";
// import "bootstrap/dist/css/bootstrap.css";
// import "boxicons/css/boxicons.min.css";

// import App from "./App";
// import { HashRouter } from "react-router-dom";
// import store from "./redux/store";
// import { Provider } from "react-redux";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <HashRouter>
//       <Provider store={store}>
//         <ToastContainer
//           theme="dark"
//           position="top-right"
//           autoClose={3000}
//           closeOnClick
//           pauseOnHover={false}
//         />
//         <App />
//       </Provider>
//     </HashRouter>
//   </React.StrictMode>
// );
