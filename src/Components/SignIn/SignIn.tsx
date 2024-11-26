import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from './../../assets/img/logo.png';

interface LoginProps {
  email: string;
  password: string;
}

interface LoginFormProps {
  usernameLabel: string;
  passwordLabel: string;
  usernamePlaceholder: string;
  passwordPlaceholder: string;
  submitButtonText: string;
  createAccountText: string;
  createAccountLinkText: string;
  headerText: string;
  subHeaderText: string;
  apiUrl: string;
}

function SignIn({
  usernameLabel,
  passwordLabel,
  usernamePlaceholder,
  passwordPlaceholder,
  submitButtonText,
  createAccountText,
  createAccountLinkText,
  headerText,
  subHeaderText,
  apiUrl,
}: LoginFormProps) {
  const [loginData, setLoginData] = useState<LoginProps>({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // إعادة تعيين الخطأ عند تقديم النموذج
    try {
      const response = await axios.post(apiUrl, {
        email: loginData.email,
        password: loginData.password,
      });

      // عرض الاستجابة في الـ console للتحقق
      console.log(response.data);

      if (response.data.token) {
        // تخزين الـ token
        localStorage.setItem('token', `Bearer ${response.data.token}`);
        
        // التحقق من وجود القيم وتخزينها
        const { first_name, last_name, profile_image_url } = response.data.user;
        
        localStorage.setItem('first_name', first_name || '');
        localStorage.setItem('last_name', last_name || '');
        localStorage.setItem('profile_image_url', profile_image_url || '');

        // تحقق من التخزين عبر الطباعة في الـ console
        console.log('Data saved to localStorage:');
        console.log({
          token: localStorage.getItem('token'),
          first_name: localStorage.getItem('first_name'),
          last_name: localStorage.getItem('last_name'),
          profile_image_url: localStorage.getItem('profile_image_url'),
        });

        // الانتقال إلى الصفحة الرئيسية بعد النجاح
        navigate('/');
      } else {
        setError('Invalid login credentials.'); // رسالة خطأ إذا لم يكن هناك توكن
      }
    } catch (err) {
      setError('The username or password is incorrect. Please try again.'); // رسالة خطأ في حالة حدوث خطأ
    }
  };

  const goToSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="w-screen overflow-hidden flex justify-center items-center h-screen bg-gradient-to-r from-my-yello to-my-yello-200">
      <div className="bg-white p-8 rounded-2xl shadow-md w-98 h-99 max-w-full max-h-full flex flex-col items-center justify-evenly">
        <img src={logo} className="w-37 h-10.3 max-w-full max-h-full object-contain mb-6" alt="Logo" />
        <div>
          <h2 className="text-xl font-medium mb-4 text-center uppercase">{headerText}</h2>
          <p className="text-center font-normal text-sm mb-4 text-gray-500">{subHeaderText}</p>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label className="block text-neutral-500 text-sm font-medium mb-2">{usernameLabel}</label>
            <input
              type="text"
              name="email"
              placeholder={usernamePlaceholder}
              value={loginData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded placeholder-gray-300 placeholder:text-sm placeholder:font-normal"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-zinc-500 text-sm font-medium mb-2">{passwordLabel}</label>
            <input
              type="password"
              name="password"
              placeholder={passwordPlaceholder}
              value={loginData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded placeholder-gray-300 placeholder:text-sm placeholder:font-normal"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-my-yello text-white py-2 h-11 rounded hover:bg-yellow-400 transition duration-200 uppercase"
          >
            {submitButtonText}
          </button>
          <p className="mt-4 text-center text-sm font-normal text-gray-500">
            {createAccountText}{' '}
            <span
              className="text-my-yello underline underline-offset-2 cursor-pointer"
              onClick={goToSignUp}
            >
              {createAccountLinkText}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
