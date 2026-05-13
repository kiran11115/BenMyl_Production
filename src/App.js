
import { RouterProvider } from 'react-router-dom';
import Routes from './Components/Routes';
import './App.css';
import DatePicker, { registerLocale } from "react-datepicker";
import en from "date-fns/locale/en-US";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ContractProvider } from './Components/Contract/ContractContext';

function App() {

  registerLocale("en-US", en);

  return (
    <>
    <ContractProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <RouterProvider router={Routes} />
    </ContractProvider>
    </>
  );
}

export default App;
