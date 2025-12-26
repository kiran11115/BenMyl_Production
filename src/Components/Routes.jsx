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
import InviteBid from "./InviteBid/InviteBid";
import UpcomingInterview from "./UpcomingInterview/UpcomingInterview";
import ScheduleInterview from "./ScheduleInterview/ScheduleInterview";
import ContractManagement from "./ContractManagement/ContractManagement";
import ContractView from "./ContractView/ContractView";
import CreateNewContract from "./NewContract/CreateNewContract";
import TalentProfile from "./TalentPool/Talent Profile/TalentProfile";
import UploadTalent from "./UploadTalent/UploadTalent";
import AIScreen from "./Header/AI Screen/AIScreen";
import UploadTalentProfile from "./UploadTalent/UploadTalentProfile";
import ReviewTalent from "./UploadTalent/ReviewTalent";



const routes = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/">
            <Route index element={<Signin />} />
            <Route path="sign-in" element={<Signin />} />
            <Route path="sign-up" element={<Signup />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="OTP-Verification" element={<OTPVerification />} />
            <Route path="user-details" element={<FormWizard />} />


            <Route element={<ProtectedRoute />}>
                <Route path="User" element={<Header />}>
                    <Route path="AI-screen" element={<AIScreen />} />
                    <Route path="account-settings" element={<AccountSettings />} />
                    <Route path="user-projects" element={<Projects />} />
                    <Route path="user-dashboard" element={<Dashboard />} />
                    <Route path="user-upload-talent" element={<UploadTalent />} />
                    <Route path="user-Jobs" element={<Jobs />} />
                    <Route path="user-messages" element={<Messages />} />
                    <Route path="user-talentpool" element={<TalentPool />} />
                    <Route path="user-talent-profile" element={<TalentProfile />} />
                    <Route path="talent-profile" element={<UploadTalentProfile />} />
                    <Route path="user-analytics" element={<Analytics />} />
                    <Route path="user-profile" element={<ProfilePage />} />
                    <Route path="user-post-new-positions" element={<PostNewPositions />} />
                    <Route path="user-invite-bid" element={<InviteBid />} />
                    <Route path="user-upcoming-interview" element={<UpcomingInterview />} />
                    <Route path="user-schedule-interview" element={<ScheduleInterview />} />
                    <Route path="user-contract-management" element={<ContractManagement />} />
                    <Route path="user-contract-view" element={<ContractView />} />
                    <Route path="create-new-contract" element={<CreateNewContract />} />
                    <Route path="review-talent" element={<ReviewTalent />} />
                </Route>
            </Route>

        </Route>
    )
);
export default routes;
