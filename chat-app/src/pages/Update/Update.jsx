import React, { useState } from 'react'
import './Update.css'
import assets from '../../assets/assets'

const Update = () => {
  const [image, setImage] = useState(null);

  return (
    <div className='profile'>
      <div className="profile-container">
        <form>
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input onChange={(e)=>setImage(e.target.files[0])} type="file" id="avatar" accept='.png, .jpeg, .jpg' hidden/>
            <img src={image ? URL.createObjectURL(image) : assets.avatar_icon} alt="" />
            Upload profile image
          </label>
          <input type="text" placeholder='Your name' required />
          <textarea placeholder='About you' required></textarea>
          <button type="submit">Save</button>
        </form>
        <img src={assets.logo_icon} alt="" />
      </div>
    </div>
  )
}

export default Update
