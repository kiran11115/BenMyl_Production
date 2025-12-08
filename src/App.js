
import { RouterProvider } from 'react-router-dom';
import Routes from './Components/Routes';
import './App.css';
import DatePicker, { registerLocale } from "react-datepicker";
import en from "date-fns/locale/en-US";
import "react-datepicker/dist/react-datepicker.css";

function App() {

  registerLocale("en-US", en);

  return (
    <RouterProvider router={Routes}>

    </RouterProvider>
  );
}

export default App;
