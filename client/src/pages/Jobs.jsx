import React, { useState, useEffect } from 'react';
import { MapPin, Building2, Briefcase, ExternalLink, Info, Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';
import useAuth from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';

const formatText = (text) => {
  if (!text) return '';
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
  return text;
};

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  const {token} = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if(!token){
      navigate('/')
    }
  },[token, navigate]);

  useEffect(() => {
    fetchJobs();
    
    // Set up periodic refresh every 5 minutes
    const refreshInterval = setInterval(() => {
      if (Date.now() - lastFetchTime > 1000 * 60 * 5) { // 5 minutes
        fetchJobs();
      }
    }, 1000 * 60); // Check every minute

    return () => clearInterval(refreshInterval);
  }, [lastFetchTime]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/jobs/user/${Cookies.get("id")}`);
      const data = await response.json();
      
      if (data?.jobs) {
        setJobs(data.jobs);
        setLastFetchTime(Date.now());
      } else {
        setError('No jobs found');
      }
    } catch (error) {
      setError('Failed to fetch jobs');
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !jobs.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error && !jobs.length) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Available Positions</h1>
        {loading && jobs.length > 0 && (
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Refreshing...</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div key={job.jobId} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <img 
                  src={job.companyLogo || "/api/placeholder/48/48"}
                  alt={job.company}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <h2 className="text-xl font-semibold truncate">{job.title}</h2>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <Building2 size={16} />
                    <span className="text-sm">{job.company}</span>
                  </div>
                </div>
              </div>

              <div 
                className="text-gray-600 line-clamp-3 mb-4"
                dangerouslySetInnerHTML={{ __html: formatText(job.description) }}
              />

              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin size={16} />
                  <span className="text-sm">{job.location}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Briefcase size={16} />
                  <span className="text-sm">{job.employmentType}</span>
                </div>
              </div>
            </div>

            <div className="border-t p-4 flex gap-3">
              <button 
                onClick={() => setSelectedJob(job)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
              >
                <Info size={16} />
                More Details
              </button>
              <a 
                href={job.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <ExternalLink size={16} />
                Apply Now
              </a>
            </div>
          </div>
        ))}
      </div>

      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl max-h-[80vh] overflow-y-auto w-full">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <img 
                    src={selectedJob.companyLogo || "/api/placeholder/48/48"}
                    alt={selectedJob.company}
                    className="w-12 h-12 rounded-lg"
                  />
                  <div>
                    <h2 className="text-xl font-semibold">{selectedJob.title}</h2>
                    <p className="text-gray-600">{selectedJob.company}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} />
                  <span>{selectedJob.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Briefcase size={16} />
                  <span>{selectedJob.employmentType}</span>
                </div>
                {selectedJob.postedAt && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Info size={16} />
                    <span>Posted: {selectedJob.postedAt}</span>
                  </div>
                )}
                {selectedJob.searchedSkill && (
                  <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    <span className="text-sm">{selectedJob.searchedSkill}</span>
                  </div>
                )}
              </div>

              <div className="prose max-w-none mb-6">
                <h3 className="text-lg font-semibold mb-2">Job Description</h3>
                <div 
                  className="whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: formatText(selectedJob.description) }}
                />
              </div>

              <div className="flex justify-end">
                <a 
                  href={selectedJob.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink size={16} />
                  Apply Now
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;