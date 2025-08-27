import { CandidateRegistration as CandidateRegistrationComponent } from "@/components/Exam/CandidateRegistration";
import { Sidebar } from "@/components/Navigation/Sidebar";

const CandidateRegistration = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <CandidateRegistrationComponent />
        </main>
      </div>
    </div>
  );
};

export default CandidateRegistration;
