import React, { useState, useEffect } from "react";
import { Plus, X, Loader2 } from "lucide-react";

function AdminDashboard() {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/skills/all");
      const data = await response.json();
      setSkills(data.skills || []);
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:3000/api/skills/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillName: newSkill.trim() }),
      });

      if (response.ok) {
        fetchSkills(); // Refresh skills list
        setNewSkill("");
      }
    } catch (error) {
      console.error("Error adding skill:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/skills/delete/${skillId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setSkills((prevSkills) =>
          prevSkills.filter((skill) => skill.skill_id !== skillId)
        );
      }
    } catch (error) {
      console.error("Error deleting skill:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Admin Skill Management
          </h1>
          <p className="text-gray-600">
            Add new skills or manage existing skills in the system.
          </p>
        </div>

        {/* Add Skills Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter new skill name"
              className="w-full pl-4 pr-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />

            <button
              className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleAddSkill}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              Add Skill
            </button>
          </div>
        </div>

        {/* Skills List */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Existing Skills
          </h2>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : skills.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">No skills available</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map((skill) => (
                <div
                  key={skill.skill_id}
                  className="flex items-center justify-between p-4 rounded-lg bg-orange-50 group hover:bg-orange-100 transition-colors duration-200"
                >
                  <span className="text-gray-700">{skill.skill_name}</span>
                  <button
                    onClick={() => handleDeleteSkill(skill.skill_id)}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
