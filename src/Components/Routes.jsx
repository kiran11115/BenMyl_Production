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
import Messages from "./Messages/Messages";
import TalentPool from "./TalentPool/TalentPool";
import Analytics from "./Analytics/Analytics";
import ProfilePage from "./ProfilePage/ProfilePage";
import AccountSettings from "./AccountSettings/AccountSettings";
import PostNewPositions from "./PostNewPositions/PostNewPositions";
import FindVendor from "./FindVendor/FindVendor";
import VendorDetail from "./VendorDetail/VendorDetail";
import InviteBid from "./InviteBid/InviteBid";
import UpcomingInterview from "./UpcomingInterview/UpcomingInterview";
import ScheduleInterview from "./ScheduleInterview/ScheduleInterview";



const routes = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/">
            <Route index element={<Signin />} />
            <Route path="sign-in" element={<Signin />} />
            <Route path="sign-up" element={<Signup />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="OTP-Verification" element={<OTPVerification />} />
            <Route path="user-details" element={<FormWizard />} />
            <Route path="account-settings" element={<AccountSettings />} />

            <Route element={<ProtectedRoute />}>
                <Route path="User" element={<Header />}>
                    <Route path="user-projects" element={<Projects />} />
                    <Route path="user-dashboard" element={<Dashboard />} />
                    <Route path="user-Jobs" element={<Jobs />} />
                    <Route path="user-messages" element={<Messages />} />
                    <Route path="user-talentpool" element={<TalentPool />} />
                    <Route path="user-analytics" element={<Analytics />} />
                    <Route path="user-profile" element={<ProfilePage />} />
                    <Route path="user-post-new-positions" element={<PostNewPositions />} />
                    <Route path="user-find-vendor" element={<FindVendor />} />
                    <Route path="user-vendor-detail" element={<VendorDetail />} />
                    <Route path="user-invite-bid" element={<InviteBid />} />
                    <Route path="user-upcoming-interview" element={<UpcomingInterview />} />
                    <Route path="user-schedule-interview" element={<ScheduleInterview />} />
                </Route>
            </Route>

        </Route>
    )
);
export default routes;
