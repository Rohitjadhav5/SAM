import { useEffect, useState } from "react";
import { getStudents, markAttendance } from "../../services/facultyApi";

function Attendance() {
  const [students, setStudents] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [lectureId, setLectureId] = useState("");
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const res = await getStudents();
        const data = res.data;
        const list = Array.isArray(data)
          ? data
          : data.students || data.data || [];

        setStudents(list);

        const initialStatuses = {};
        list.forEach((student) => {
          initialStatuses[student._id] = "Present";
        });

        setStatuses(initialStatuses);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load students.");
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const records = students.map((student) => ({
        studentId: student._id,
        status: statuses[student._id] || "Present",
      }));

      const res = await markAttendance({
        lectureId,
        className,
        subject,
        records,
      });

      setMessage(res.data.message || "Attendance submitted successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to submit attendance.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mark Attendance</h1>
        <p className="text-base-content/60 mt-1">
          Select attendance status for each student.
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="alert alert-success">
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-lg">Class Details</h2>

            <div className="grid md:grid-cols-3 gap-4">
              <label className="form-control">
                <span className="label-text mb-2">Lecture ID</span>
                <input
                  className="input input-bordered w-full"
                  placeholder="Enter unique lecture ID"
                  value={lectureId}
                  onChange={(e) => setLectureId(e.target.value)}
                  required
                />
              </label>

              <label className="form-control">
                <span className="label-text mb-2">Class Name</span>
                <input
                  className="input input-bordered w-full"
                  placeholder="Enter class name"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  required
                />
              </label>

              <label className="form-control">
                <span className="label-text mb-2">Subject</span>
                <input
                  className="input input-bordered w-full"
                  placeholder="Enter subject name"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </label>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body p-0">
            <div className="p-5">
              <h2 className="font-semibold text-lg">Student Attendance</h2>
              <p className="text-sm text-base-content/60">
                {students.length} students
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>College ID</th>
                    <th>Student Name</th>
                    <th>Attendance Status</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td>{student.collegeId}</td>
                      <td>{student.userId?.name || "—"}</td>
                      <td>
                        <select
                          className="select select-bordered select-sm w-full max-w-40"
                          value={statuses[student._id] || "Present"}
                          onChange={(e) =>
                            setStatuses((prev) => ({
                              ...prev,
                              [student._id]: e.target.value,
                            }))
                          }
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Late">Late</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {loading && (
              <div className="text-center p-8">
                <span className="loading loading-spinner loading-md text-primary"></span>
              </div>
            )}

            {!loading && students.length === 0 && (
              <p className="text-center text-base-content/60 p-8">
                No students available.
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || saving || students.length === 0}
        >
          {saving ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Submitting...
            </>
          ) : (
            "Submit Attendance"
          )}
        </button>
      </form>
    </div>
  );
}

export default Attendance;
