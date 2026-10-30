import { useEffect, useState } from "react";
import { getStudents } from "../../services/facultyApi";

function Students() {
  const [students, setStudents] = useState([]);
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await getStudents({
          ...(semester && { semester }),
          ...(year && { year }),
        });

        const data = res.data;
        setStudents(
          Array.isArray(data) ? data : data.students || data.data || [],
        );
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load students.");
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [semester, year]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Students</h1>
        <p className="text-base-content/60 mt-1">
          View students in your department.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          className="select select-bordered w-full sm:w-52"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        >
          <option value="">All Semesters</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <option key={n} value={n}>
              Semester {n}
            </option>
          ))}
        </select>

        <select
          className="select select-bordered w-full sm:w-52"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="">All Years</option>
          {[1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>
              Year {n}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body p-0">
          <div className="flex justify-between items-center p-5">
            <h2 className="font-semibold text-lg">Student List</h2>
            <span className="badge badge-primary">
              {students.length} Students
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>College ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Semester</th>
                  <th>Year</th>
                </tr>
              </thead>

              <tbody>
                {!loading &&
                  students.map((student) => (
                    <tr key={student._id}>
                      <td>{student.collegeId}</td>
                      <td>{student.userId?.name || "—"}</td>
                      <td>{student.userId?.email || "—"}</td>
                      <td>{student.semester}</td>
                      <td>{student.year}</td>
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
              No students found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Students;
