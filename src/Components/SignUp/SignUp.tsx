import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from './../../assets/img/logo.png';
import upload from './../../assets/img/UploadIcon.png';

function SignUp() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    profile_image: null as File | null,
  });

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({
        ...formData,
        profile_image: e.target.files[0],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Create user_name based on first_name and last_name
      const user_name = `${formData.first_name}_${formData.last_name}`.toLowerCase();

      // Create FormData to send data with the image
      const data = new FormData();
      data.append('first_name', formData.first_name);
      data.append('last_name', formData.last_name);
      data.append('user_name', user_name); // Add user_name to FormData
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('password_confirmation', formData.password_confirmation); // Add password confirmation to FormData
      if (formData.profile_image) {
        data.append('profile_image', formData.profile_image);
      }

      // Log the FormData values for debugging
      console.log([...data]);

      // Send data to the registration API
      const response = await axios.post('https://test1.focal-x.com/api/register', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // If the registration is successful
      if (response.status === 201 || response.status === 200) {
        setSuccessMessage('Registration successful!');
        navigate('/signin'); // Redirect the user to the login page after registration
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'An error occurred during registration. Please try again.');
      } else {
        setError('An error occurred. Please check your network connection.');
      }
    }
  };

  return (
    <div className="w-screen overflow-hidden flex justify-center items-center min-h-screen bg-gradient-to-r from-my-yello to-my-yello-200">
      <div className='p-5 flex max-h-full'>
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-lg h-full xl:h-111 flex flex-col items-center justify-evenly">
          <img src={logo} alt="Logo"/>
          <div>
            <h2 className="text-xl font-semibold pt-9 mb-1 text-center uppercase">Sign up</h2>
            <p className="text-center font-normal text-sm mb-4 text-gray-500">Fill in the following fields to create an account.</p>
          </div>
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            {/* First Name */}
            <div className='flex flex-col'>
              <label htmlFor="firstName">Name</label>
              <div className='flex flex-row gap-x-6'>
                <input
                  type="text"
                  id="firstName"
                  name="first_name" // Update name attribute to match state
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded placeholder-gray-300 placeholder:text-sm placeholder:font-normal"
                  required
                />
                <input
                  type="text"
                  id="lastName"
                  name="last_name" // Update name attribute to match state
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded placeholder-gray-300 placeholder:text-sm placeholder:font-normal"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded placeholder-gray-300 placeholder:text-sm placeholder:font-normal"
                required
              />
            </div>

            {/* Password */}
            <div className='flex flex-col'>
              <label htmlFor="password">Password</label>
              <div className='flex flex-row gap-x-6'>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded placeholder-gray-300 placeholder:text-sm placeholder:font-normal"
                  required
                />
                <input
                  type="password"
                  id="confirmPassword"
                  name="password_confirmation" // Update name attribute to match state
                  placeholder="Re-enter your password"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded placeholder-gray-300 placeholder:text-sm placeholder:font-normal"
                  required
                />
              </div>
            </div>

            {/* Profile Image */}
            <div className="flex flex-col">
              <label htmlFor="profileImage" className="mr-2 pb-4">Profile Image</label>
              <input
                type="file"
                id="profileImage"
                name="profile_image" // Update name attribute to match state
                accept="image/*"
                onChange={handleImageChange}
                className="hidden" // لجعل حقل الإدخال مخفيًا
              />
              <div
                onClick={() => document.getElementById('profileImage')?.click()} // لمحاكاة النقر على الإدخال
                className="cursor-pointer flex items-center justify-center w-24 h-24 border border-dashed rounded bg-my-white-200 border-gray-300"
              >
                <img src={upload} alt="Upload Icon"/>
              </div>
            </div>

            {/* Error message */}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {/* Success message */}
            {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-my-yello text-white p-2 rounded mt-2 hover:bg-yellow-400 transition"
            >
              SIGN UP
            </button>
          </form>
          <p>
            Do you have an account? 
            <span 
              onClick={() => navigate('/signin')} // Navigate to the login page
              className="text-my-yello underline underline-offset-2 cursor-pointer"
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
