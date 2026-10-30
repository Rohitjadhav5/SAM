import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Building2, GraduationCap } from "lucide-react";
import { getProfile, getStudents } from "../../services/facultyApi";

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [profileRes, studentRes] = await Promise.all([
          getProfile(),
          getStudents(),
        ]);

        setProfile(
          profileRes.data.profile || profileRes.data.data || profileRes.data,
        );

        const data = studentRes.data;
        setStudents(
          Array.isArray(data) ? data : data.students || data.data || [],
        );
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const user = profile?.user || {};

  const cards = [
    {
      title: "Total Students",
      value: students.length,
      icon: Users,
      description: "Students in your department",
    },
    {
      title: "Department",
      value: profile?.department || "Not available",
      icon: Building2,
      description: "Your assigned department",
    },
    {
      title: "Faculty Name",
      value: user.name || "Not available",
      icon: GraduationCap,
      description: "Your faculty account",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-base-content/60 mt-1">
          Welcome back, {user.name || "Faculty"}!
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card bg-base-100 shadow-sm border border-base-300"
            >
              <div className="card-body">
                <div className="flex justify-between items-center">
                  <p className="text-base-content/60">{card.title}</p>
                  <div className="bg-primary/10 text-primary p-3 rounded-xl">
                    <Icon size={23} />
                  </div>
                </div>

                <h2 className="card-title text-2xl">{card.value}</h2>
                <p className="text-sm text-base-content/60">
                  {card.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
