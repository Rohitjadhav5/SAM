import { useEffect, useState } from "react";
import { UserCircle } from "lucide-react";
import { getProfile } from "../../services/facultyApi";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getProfile();

        setProfile(res.data.profile || res.data.data || res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const user = profile?.user || {};

  const details = [
    ["Name", user.name],
    ["Email", user.email],
    ["Mobile", user.mobile],
    ["Department", profile?.department],
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-base-content/60 mt-1">
          View your faculty account details.
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      <div className="card bg-base-100 border border-base-300 shadow-sm max-w-2xl">
        <div className="card-body">
          <div className="flex items-center gap-4 pb-5 border-b border-base-300">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-16">
                <UserCircle size={38} />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold">{user.name || "Faculty"}</h2>
              <p className="text-base-content/60">
                {profile?.department || "Department not available"}
              </p>
              <div className="badge badge-success badge-outline mt-2">
                Faculty
              </div>
            </div>
          </div>

          <div className="divide-y divide-base-300">
            {details.map(([label, value]) => (
              <div
                key={label}
                className="flex flex-col sm:flex-row sm:justify-between gap-1 py-4"
              >
                <span className="text-base-content/60">{label}</span>
                <span className="font-medium">{value || "Not available"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
