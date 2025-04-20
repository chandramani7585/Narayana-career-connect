import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Register from '../pages/Register'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import MentorDashboard from '../pages/MentorDashboard'
import AdminDashboard from '../pages/AdminDashboard'
import AddSkills from '../pages/AddSkills'
import EditProfile from '../pages/EditProfile'
import ExpolreConnections from '../pages/ExpolreConnections'
import Requests from '../pages/Requests'
import MyConnections from '../pages/MyConnections'
import AddStory from '../pages/AddStory'
import Stories from '../pages/Stories'
import StoryDetails from '../pages/StoryDetails'
import ManageStories from '../pages/ManageStories'
import Jobs from '../pages/Jobs'
import Resources from '../pages/Resources'
import UserStories from '../pages/UserStories'
import CreateResource from '../pages/CreateResource'
import ManageResources from '../pages/ManageResources'
import Messages from '../pages/Messages'
import Messaging from '../pages/Messaging'
import Home from '../pages/Home'
function Routex() {
  return (
    <Routes>
            <Route path='/' element={<Home />} />

      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/mentordashboard' element={<MentorDashboard />}/>
      <Route path='/admindashboard' element={<AdminDashboard />}/>
      <Route path='/addskills/:id' element={<AddSkills />}/>
      <Route path='/editprofile/:id' element={<EditProfile />}/>
      <Route path='/connections' element={<ExpolreConnections />}/>
      <Route path='/requests' element={<Requests />}/>
      <Route path='/myconnections' element={<MyConnections />}/>


      <Route path='/addstory' element={<AddStory />}/>
      <Route path='/stories' element={<Stories />}/>      
      <Route path='/story/:story_id' element={<StoryDetails />}/>
      <Route path='/managestories' element={<ManageStories/>} />
      <Route path='/stories/:id' element={<UserStories />} />


      <Route path='/jobs' element = {<Jobs />} />


    <Route path='/resources' element = {<Resources />} />
    <Route path='/createresource' element = {<CreateResource />} />

    <Route path='/manageresources' element = {<ManageResources/>} />

    <Route path='/messages' element={<Messages />} />
    <Route path='/messages/:senderId/:receiverId' element={<Messaging />} />







    </Routes>
  )
}

export default Routex