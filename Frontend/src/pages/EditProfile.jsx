import LoadingAnimation from "../components/common/LoadingAnimation";
import { useEditProfile } from "../hooks/useEditProfile";
import EditProfileHeader from "../components/profile/EditProfileHeader";
import EditProfileForm from "../components/profile/EditProfileForm";

function EditProfile() {
  const profileProps = useEditProfile();

  if (profileProps.loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-3 sm:px-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      <EditProfileHeader dashboardPath={profileProps.dashboardPath} />
      <EditProfileForm {...profileProps} />
    </div>
  );
}

export default EditProfile;
