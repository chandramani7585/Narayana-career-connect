import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Book, Filter, Loader2, X, ExternalLink } from 'lucide-react';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [selectedResource, setSelectedResource] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resourcesRes, skillsRes] = await Promise.all([
        axios.get('http://localhost:3000/api/resources/'),
        axios.get('http://localhost:3000/api/skills/all')
      ]);
      
      setResources(resourcesRes.data.resources || []);
      setSkills(skillsRes.data.skills || []);
    } catch (error) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.resource_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.resource_description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkill = selectedSkill === 'all' || resource.suggested_skill === parseInt(selectedSkill);
    return matchesSearch && matchesSkill;
  });

  const getResourceTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'video': return '🎬';
      case 'article': return '📄';
      case 'course': return '🎓';
      case 'book': return '📚';
      default: return '📌';
    }
  };

  const getSkillColor = (skillId) => {
    // Rotating color scheme based on skill ID
    const colors = [
      'bg-indigo-100 text-indigo-800',
      'bg-emerald-100 text-emerald-800',
      'bg-amber-100 text-amber-800',
      'bg-rose-100 text-rose-800',
      'bg-sky-100 text-sky-800',
      'bg-violet-100 text-violet-800',
    ];
    
    return colors[skillId % colors.length];
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
              <p className="mt-4 text-gray-600">Loading resources...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-red-600 text-xl mb-2">⚠️ {error}</div>
            <button 
              onClick={() => fetchData()}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="mb-12 max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4 text-gray-900">Learning Resources</h1>
              <p className="text-gray-600 text-lg">Discover curated materials to enhance your skills</p>
            </div>
            
            <div className="max-w-5xl mx-auto mb-10 bg-white rounded-xl shadow-sm p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Filter className="h-5 w-5" />
                  </div>
                  <select
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="all">All Skills</option>
                    {skills.map(skill => (
                      <option key={skill.skill_id} value={skill.skill_id}>{skill.skill_name}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map(resource => {
                  const skillName = skills.find(s => s.skill_id === resource.suggested_skill)?.skill_name || 'General';
                  const skillColor = getSkillColor(resource.suggested_skill || 0);
                  
                  return (
                    <div 
                      key={resource.resource_id} 
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
                    >
                      <div className="p-6">
                        <div className="flex items-start">
                          <div className="shrink-0">
                            <div className="rounded-lg bg-indigo-100 p-3 text-indigo-600">
                              <Book className="h-6 w-6" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <h2 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-indigo-600 transition-colors">
                              {resource.resource_name}
                            </h2>
                            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                              {resource.resource_description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${skillColor}`}>
                                {skillName}
                              </span>
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                {getResourceTypeIcon(resource.type)} {resource.type || 'Resource'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="px-6 pb-6">
                        <button
                          className="w-full py-2.5 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                          onClick={() => setSelectedResource(resource)}
                        >
                          <span>View Details</span>
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center max-w-2xl mx-auto">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No resources found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedSkill('all');
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Resource Detail Modal */}
      {selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">{selectedResource.resource_name}</h2>
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => setSelectedResource(null)}
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-sm px-2.5 py-1 rounded-full ${getSkillColor(selectedResource.suggested_skill || 0)}`}>
                  {skills.find(s => s.skill_id === selectedResource.suggested_skill)?.skill_name || 'General'}
                </span>
                <span className="text-sm px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                  {getResourceTypeIcon(selectedResource.type)} {selectedResource.type || 'Resource'}
                </span>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2 text-gray-800">Description</h3>
                <p className="text-gray-600">{selectedResource.resource_description}</p>
              </div>
              
              <div className="resource-content prose max-w-none">
                {selectedResource.content ? (
                  <div dangerouslySetInnerHTML={{ __html: selectedResource.content }} />
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg text-gray-600 text-center">
                    No additional content available for this resource.
                  </div>
                )}
              </div>
              
              {selectedResource.url && (
                <div className="mt-6">
                  <a 
                    href={selectedResource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    <span>Visit Resource</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;