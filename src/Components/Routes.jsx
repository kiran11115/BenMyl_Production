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
import UserJobs from "./UserJobs/UserJobs";
import Messages from "./Messages/Messages";
import TalentPool from "./TalentPool/TalentPool";
import Analytics from "./Analytics/Analytics";
import ProfilePage from "./ProfilePage/ProfilePage";
import AccountSettings from "./Admin/AccountSettings/AccountSettings";
import PostNewPositions from "./PostNewPositions/PostNewPositions";
import InviteBid from "./InviteBid/InviteBid";
import UpcomingInterview from "./UpcomingInterview/UpcomingInterview";
import ScheduleInterview from "./ScheduleInterview/ScheduleInterview";
import TalentProfile from "./TalentPool/Talent Profile/TalentProfile";
import UploadTalent from "./UploadTalent/UploadTalent";
import AIScreen from "./Header/AI Screen/AIScreen";
import UploadTalentProfile from "./UploadTalent/UploadTalentProfile";
import EditTalentProfile from "./UploadTalent/EditTalentProfile";
import UploadReviewTalent from "./UploadTalent/UploadReviewTalent";
import ReviewTalent from "./UploadTalent/ReviewTalent";
import AdminHeader from "./Admin/AdminHeader/AdminHeader";
import AdminProfile from "./Admin/AdminProfile/AdminProfile";
import EditProfile from "./ProfilePage/EditProfile";
import AdminProfileEdit from "./Admin/AdminProfile/AdminProfileEdit";
import JobOverview from "./UserProjects/JobOverview";
import NotificationsPage from "./Header/NotificationsPage";
import InterviewDetails from "./UpcomingInterview/InterviewDetails";
import CreateProject from "./UserProjects/CreateProject";
import ProjectDetailsPage from "./UserProjects/ProjectDetailsPage";
import AdminControlCenter from "./Admin/AdminControlCenter/AdminControlCenter";
import ComingSoonModule from "./Admin/Modules/ComingSoon";
import Portal from "./Portal/Portal";
import PostedJobsPage from "./UserProjects/PostedJobsPage";
import ContractForm from "./Contract/contractform";
import ContractCreate from "./Contract/contractcreate";
import ContractView from "./Contract/contractview";



// Admin Module Imports
import RoleConfiguration from "./Admin/Modules/RoleConfiguration/RoleConfiguration";
import WorkflowConfig from "./Admin/Modules/WorkflowConfig/WorkflowConfig";
import ApprovalPanel from "./Admin/Modules/ApprovalPanel/ApprovalPanel";
import MasterData from "./Admin/Modules/MasterData/MasterData";
import ComplianceAudit from "./Admin/Modules/ComplianceAudit/ComplianceAudit";
import AutomationPanel from "./Admin/Modules/AutomationPanel/AutomationPanel";
import NotificationPolicy from "./Admin/Modules/NotificationPolicy/NotificationPolicy";
import BillingControl from "./Admin/Modules/BillingControl/BillingControl";
import AdminDashboard from "./Admin/Modules/AdminDashboard/AdminDashboard";
import ActiveRoutines from "./Admin/Modules/AdminDashboard/ActiveRoutines";
import ModuleProtectedRoute from "./Admin/Modules/RoleConfiguration/ModuleProtectedRoute";

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
        <Route path="Admin" element={<AdminHeader />}>
          <Route path="admin-profile" element={<AdminProfile />} />
          <Route path="account-settings" element={<AccountSettings />} />
          <Route path="edit-profile" element={<AdminProfileEdit />} />
          <Route path="admin-analytics" element={<Analytics />} />
          <Route path="notifications-page" element={<NotificationsPage />} />

          {/* New Admin Modules */}
          <Route path="control-center" element={<AdminControlCenter />} />
          <Route path="overview-dashboard" element={<AdminDashboard />} />
          <Route path="active-routines" element={<ActiveRoutines />} />
          <Route path="role-configuration" element={<RoleConfiguration />} />
          <Route path="workflow-configuration" element={<WorkflowConfig />} />
          <Route path="approval-control" element={<ApprovalPanel />} />
          <Route path="master-data" element={<MasterData />} />
          <Route path="compliance-audit" element={<ComplianceAudit />} />
          <Route path="automation-panel" element={<AutomationPanel />} />
          <Route path="notification-policy" element={<NotificationPolicy />} />
          <Route path="billing-control" element={<BillingControl />} />
          <Route path="portal" element={<Portal />} />
          <Route path="admin-talentpool" element={<TalentPool />} />
          <Route path="admin-projects" element={<Projects />} />
          <Route path="admin-posted-jobs" element={<PostedJobsPage />} />
          <Route path="admin-jobs" element={<UserJobs />} />
          <Route path="admin-upload-talent" element={<UploadTalent />} />
          <Route path="upload-review-talent" element={<UploadReviewTalent />} />

          <Route path="user-talent-profile" element={<TalentProfile />} />
          <Route path="talent-profile" element={<UploadTalentProfile />} />
          <Route path="edit-talent-profile" element={<EditTalentProfile />} />
          <Route path="review-talent" element={<ReviewTalent />} />
          <Route path="project-details/:id" element={<ProjectDetailsPage />} />
          <Route path="job-overview" element={<JobOverview />} />
          <Route path="create-project" element={<CreateProject />} />
          <Route path="user-post-new-positions" element={<PostNewPositions />} />
          <Route path="user-schedule-interview" element={<ScheduleInterview />} />
          <Route path="admin-upcoming-interview" element={<UpcomingInterview />} />
          <Route path="admin-interview-details" element={<InterviewDetails />} />
          <Route path="admin-messages" element={<Messages />} />
          <Route path="contract-listing" element={<ContractForm />} />
          <Route path="contract-create" element={<ContractCreate />} />
          <Route path="contract-view/:id" element={<ContractView />} />


        </Route>

        <Route path="User" element={<Header />}>
          <Route path="notifications-page" element={<NotificationsPage />} />
          <Route path="AI-screen" element={<AIScreen />} />

          <Route element={<ModuleProtectedRoute module="Main Dashboard" />}>
            <Route path="user-dashboard" element={<Dashboard />} />
          </Route>

          <Route element={<ModuleProtectedRoute module="Talent Pool" />}>
            <Route path="user-talentpool" element={<TalentPool />} />
            <Route path="user-talent-profile" element={<TalentProfile />} />
            <Route path="talent-profile" element={<UploadTalentProfile />} />
            <Route path="edit-talent-profile" element={<EditTalentProfile />} />
            <Route path="user-upload-talent" element={<UploadTalent />} />
            <Route path="upload-review-talent" element={<UploadReviewTalent />} />
            <Route path="review-talent" element={<ReviewTalent />} />
          </Route>

          <Route element={<ModuleProtectedRoute module="Projects" />}>
            <Route path="user-projects" element={<Projects />} />
            <Route path="user-posted-jobs" element={<PostedJobsPage />} />
            <Route element={<ModuleProtectedRoute module="Projects" action="edit" />}>
              <Route path="user-post-new-positions" element={<PostNewPositions />} />

            </Route>
            <Route path="project-details/:id" element={<ProjectDetailsPage />} />
          </Route>

          <Route element={<ModuleProtectedRoute module="Job Management" />}>
            <Route path="user-Jobs" element={<UserJobs />} />
            <Route path="job-overview" element={<JobOverview />} />
            <Route element={<ModuleProtectedRoute module="Job Management" action="edit" />}>
              <Route path="create-project" element={<CreateProject />} />
            </Route>
          </Route>

          <Route element={<ModuleProtectedRoute module="Analytics" />}>
            <Route path="user-analytics" element={<Analytics />} />
          </Route>


          <Route path="user-messages" element={<Messages />} />
          <Route path="user-profile" element={<ProfilePage />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="user-invite-bid" element={<InviteBid />} />
          <Route path="user-upcoming-interview" element={<UpcomingInterview />} />
          <Route path="user-schedule-interview" element={<ScheduleInterview />} />
          <Route path="user-interview-details" element={<InterviewDetails />} />
          <Route path="contract-listing" element={<ContractForm />} />
          <Route path="contract-create" element={<ContractCreate />} />
          <Route path="contract-view/:id" element={<ContractView />} />

        </Route>
      </Route>
    </Route>,
  ),
);
export default routes;
