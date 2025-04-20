import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie'
function ManageStories() {
    const [stories, setStories] = useState([]);

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/stories/user/${Cookies.get("id")}`);
            setStories(response.data.stories);
        } catch (e) {
            console.log(e);
        }
    };

    const handleDelete = async(id) => {
        try{
            const response = await axios.delete(`http://localhost:3000/api/stories/${id}`);
            if (response.status == 200){
                alert("Successfully deleted");
                setStories((prevStories) => prevStories.filter((story) => story.story_id !== id))
            }
            else{
                alert(e.response?.data?.message || "An error occurred. Please try again.");
            console.error("Error deleting story:", e);
            }
        }
        catch(e){
            alert(e)
        }
     };

    return (
        <div className="min-h-screen flex flex-col items-center">
            <div className="flex flex-col mx-auto w-4/5 mt-3 mb-6">
                {stories.length > 0 ? (
                    stories.map((item) => (
                        <div key={item.story_id} className="flex  flex-col md:flex-row items-start justify-around md:items-center  gap-3 border border-slate-500 p-6">
                            <p className='p-3'>{item.story_name}</p>
                            <button
                                className="button p-3 border border-slate-500"
                                onClick={() => handleDelete(item.story_id)}
                            >
                                Delete
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center">
                        <p>No stories found</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageStories;
