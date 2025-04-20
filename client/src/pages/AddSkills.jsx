import React, { useState, useEffect } from 'react';
import useAuth from '../utils/AuthContext';
import { Plus, X, Search, Sparkles, Loader2, Star, Trophy, ChevronRight } from 'lucide-react';

function AddSkills() {
  const { id } = useAuth();
  const [skills, setSkills] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  //http://localhost:3000
  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/skills/all');
      const data = await response.json();
      setSkills(data.skills);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserSkills = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/userskills/fetch/${id}`);
      const data = await response.json();
      setUserSkills(data.skills);
    } catch (error) {
      console.error('Error fetching user skills:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUserSkills();
    }
  }, [id]);

  const handleSkill = async () => {
    if (selectedSkill && !userSkills.some(skill => skill.skill_id === parseInt(selectedSkill))) {
      setIsSubmitting(true);
      try {
        const response = await fetch('http://localhost:3000/api/userskills/assign', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: id,
            skillId: selectedSkill,
          }),
        });
        const result = await response.json();
        if (result.message === "Skill assigned to user successfully.") {
          const newSkill = skills.find(skill => skill.skill_id === parseInt(selectedSkill));
          setUserSkills(prevSkills => [...prevSkills, newSkill]);
          setSelectedSkill('');
          setShowNotification(true);
          setTimeout(() => {
            setShowNotification(false);
          }, 3000);
        }
      } catch (error) {
        console.error('Error assigning skill:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleRemoveSkill = async (skillId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/userskills/remove/${id}/${skillId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.message === "Skill removed from user successfully.") {
        setUserSkills(prevSkills => prevSkills.filter(skill => skill.skill_id !== skillId));
      }
    } catch (error) {
      console.error('Error removing skill:', error);
    }
  };

  const filteredSkills = skills
    .filter(skill => 
      !userSkills.some(userSkill => userSkill.skill_id === skill.skill_id) &&
      skill.skill_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getBadgeColor = (index) => {
    const colors = [
      'bg-purple-100 text-purple-600 border-purple-200',
      'bg-teal-100 text-teal-600 border-teal-200',
      'bg-blue-100 text-blue-600 border-blue-200',
      'bg-amber-100 text-amber-600 border-amber-200',
      'bg-sky-100 text-sky-600 border-sky-200',
      'bg-fuchsia-100 text-fuchsia-600 border-fuchsia-200',
      'bg-cyan-100 text-cyan-600 border-cyan-200'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Modern card with accent */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-3xl shadow-lg py-8 px-8 mb-8 overflow-hidden relative">
          <div className="absolute w-1 h-full bg-gradient-to-b from-purple-400 via-blue-400 to-cyan-300 left-0 top-0"></div>
          <div className="z-10 text-center md:text-left mb-6 md:mb-0">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Skill Portfolio</h1>
            <p className="text-slate-500">Build your professional profile with relevant skills</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Trophy className="w-4 h-4 text-blue-500" />
            </div>
            <span className="text-blue-600 font-medium text-sm">{userSkills.length} Skills Showcased</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Add Skills Section - Taking up less space */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-6">
              <div className="mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Plus className="w-4 h-4 text-blue-500" />
                </div>
                <h2 className="text-xl font-semibold text-slate-800">Add Expertise</h2>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Filter skills..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all duration-200 bg-slate-50 text-slate-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <select
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all duration-200 bg-slate-50 text-slate-700 appearance-none"
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  value={selectedSkill}
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
                >
                  <option value="">Select a skill</option>
                  {filteredSkills.map((skill) => (
                    <option key={skill.skill_id} value={skill.skill_id}>
                      {skill.skill_name}
                    </option>
                  ))}
                </select>

                <button
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSkill}
                  disabled={!selectedSkill || isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                  Add to Portfolio
                </button>
              </div>
            </div>
          </div>

          {/* Skills List - Taking up more space */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-purple-500" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-800">Your Expertise</h2>
                </div>
               </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full absolute border-4 border-solid border-slate-200"></div>
                    <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-solid border-blue-500 border-t-transparent"></div>
                  </div>
                </div>
              ) : userSkills.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-slate-700 font-medium mb-2">No skills in your portfolio</h3>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto">Start adding skills to showcase your expertise and stand out to potential employers.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {userSkills.map((skill, index) => (
                    <div
                      key={skill.skill_id}
                      className="flex items-center gap-3 p-4 rounded-xl border bg-white hover:shadow-md transition-all duration-200 group cursor-grab"
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getBadgeColor(index).split(' ')[0]} ${getBadgeColor(index).split(' ')[1]}`}>
                        {skill.skill_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-grow">
                        <span className="font-medium text-slate-700">{skill.skill_name}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveSkill(skill.skill_id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-full bg-slate-100 text-slate-400 hover:bg-red-100 hover:text-red-500 transition-all duration-200"
                        aria-label="Remove skill"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {userSkills.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <ChevronRight className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-blue-700">Ready to showcase your skills?</h3>
                      <p className="text-xs text-blue-600">Add them to your resume or share your profile with recruiters</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Success Notification */}
        <div
          className={`fixed bottom-4 right-4 bg-white text-slate-700 shadow-lg rounded-full px-4 py-3 flex items-center gap-2 transition-all duration-300 transform ${showNotification ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        >
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-blue-500" />
          </div>
          <span className="font-medium">Skill added to your portfolio!</span>
        </div>
      </div>
    </div>
  );
}

export default AddSkills;

// This is missing from imports
function Check(props) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}