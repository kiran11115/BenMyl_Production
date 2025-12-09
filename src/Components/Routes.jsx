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
import ProtectedRoute from "./ProtectedRoute";
import Header from "./Header/Header";
import Projects from "./UserProjects/Projects";
import Dashboard from "./Dashboard/Dashboard";
import Jobs from "./UserJobs/UserJobs";



const routes = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/">
            <Route index element={<Signin />} />
            <Route path="sign-in" element={<Signin />} />
            <Route path="sign-up" element={<Signup />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="OTP-Verification" element={<OTPVerification />} />
            <Route path="company-details" element={<FormWizard />} />

            <Route element={<ProtectedRoute />}>
                <Route path="User" element={<Header />}>
                    <Route path="user-projects" element={<Projects />} />
                    <Route path="user-dashboard" element={<Dashboard />} />
                    <Route path="user-Jobs" element={<Jobs />} />
                </Route>
            </Route>

        </Route>
    )
);
export default routes;
