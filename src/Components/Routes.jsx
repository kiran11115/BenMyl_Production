import {
    createBrowserRouter,
    createRoutesFromElements,
} from "react-router-dom";
import { Route } from "react-router-dom";
import Signin from "./Auth/Signin";
import Signup from "./Auth/Signup";
import ForgotPassword from "./Auth/ForgotPassword";
import OTPVerification from "./Auth/OTPVerification";
import FormWizard from "./Auth/FormWizard/FormWizard";



const routes = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/">
            <Route index element={<Signin />} />
            <Route path="sign-in" element={<Signin />} />
            <Route path="sign-up" element={<Signup />} />
            <Route path="forgot-paasword" element={<ForgotPassword />} />
            <Route path="OTP-Verification" element={<OTPVerification />} />
            <Route path="company-details" element={<FormWizard />} />



        </Route>
    )
);
export default routes;
