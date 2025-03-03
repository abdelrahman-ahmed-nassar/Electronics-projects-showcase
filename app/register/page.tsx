"use client"
import { useState } from 'react';
import Link from 'next/link';

// Interface for form data
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  department: string;
  studentId: string;
  agreeTerms: boolean;
}

// Interface for validation errors
interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  department?: string;
  studentId?: string;
  agreeTerms?: string;
}

const RegisterPage = () => {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    studentId: '',
    agreeTerms: false
  });

  // Error state
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // Department options
  const departments = [
    'Electrical Engineering',
    'Electronic Engineering',
    'Computer Engineering',
    'Biomedical Engineering',
    'Robotics',
    'Communications Engineering'
  ];

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Department validation
    if (!formData.department) {
      newErrors.department = 'Please select your department';
    }
    
    // Student ID validation
    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    }
    
    // Terms and conditions validation
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (validateForm()) {
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        console.log('Form submitted successfully:', formData);
      }, 1000);
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-sans m-0 p-0 bg-navy text-white min-h-screen flex flex-col">
      {/* Circuit Background */}
      <div 
        className="absolute inset-0 opacity-10 z-10"
        style={{
          backgroundImage: "radial-gradient(#4d94ff 1px, transparent 1px), linear-gradient(to right, #4d94ff 1px, transparent 1px), linear-gradient(to bottom, #4d94ff 1px, transparent 1px)",
          backgroundSize: "20px 20px, 40px 40px, 40px 40px",
          backgroundPosition: "0 0, 0 0, 0 0",
          backgroundBlendMode: "soft-light",
          pointerEvents: "none"
        }}
      ></div>
    
      {/* Registration Form */}
      <main className="flex-grow flex justify-center items-center p-5 relative z-20">
        <div className="bg-white/5 border border-electric-blue/30 rounded-lg p-8 w-full max-w-2xl backdrop-blur-sm">
          <h1 className="text-3xl mb-6 text-mint-green text-center">Create Your Account</h1>
          
          {submitSuccess ? (
            <div className="text-center">
              <div className="mb-6 p-4 bg-mint-green/20 border border-mint-green rounded-lg text-mint-green">
                Registration successful! Welcome to ElectroShowcase.
              </div>
              <Link href="/login" className="py-3 px-6 bg-mint-green text-navy border-none rounded font-bold cursor-pointer no-underline transition-all hover:bg-electric-blue hover:text-white hover:-translate-y-0.5 hover:shadow-lg">
                Proceed to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block mb-2 text-white/80">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full p-3 bg-navy border ${errors.firstName ? 'border-magenta' : 'border-electric-blue/50'} rounded focus:outline-none focus:border-mint-green transition-colors`}
                  />
                  {errors.firstName && <p className="mt-1 text-magenta text-sm">{errors.firstName}</p>}
                </div>
                
                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block mb-2 text-white/80">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full p-3 bg-navy border ${errors.lastName ? 'border-magenta' : 'border-electric-blue/50'} rounded focus:outline-none focus:border-mint-green transition-colors`}
                  />
                  {errors.lastName && <p className="mt-1 text-magenta text-sm">{errors.lastName}</p>}
                </div>
              </div>
              
              {/* Email */}
              <div className="mb-6">
                <label htmlFor="email" className="block mb-2 text-white/80">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-3 bg-navy border ${errors.email ? 'border-magenta' : 'border-electric-blue/50'} rounded focus:outline-none focus:border-mint-green transition-colors`}
                />
                {errors.email && <p className="mt-1 text-magenta text-sm">{errors.email}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Password */}
                <div>
                  <label htmlFor="password" className="block mb-2 text-white/80">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full p-3 bg-navy border ${errors.password ? 'border-magenta' : 'border-electric-blue/50'} rounded focus:outline-none focus:border-mint-green transition-colors`}
                  />
                  {errors.password && <p className="mt-1 text-magenta text-sm">{errors.password}</p>}
                </div>
                
                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block mb-2 text-white/80">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full p-3 bg-navy border ${errors.confirmPassword ? 'border-magenta' : 'border-electric-blue/50'} rounded focus:outline-none focus:border-mint-green transition-colors`}
                  />
                  {errors.confirmPassword && <p className="mt-1 text-magenta text-sm">{errors.confirmPassword}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Department */}
                <div>
                  <label htmlFor="department" className="block mb-2 text-white/80">Department</label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={`w-full p-3 bg-navy border ${errors.department ? 'border-magenta' : 'border-electric-blue/50'} rounded focus:outline-none focus:border-mint-green transition-colors`}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  {errors.department && <p className="mt-1 text-magenta text-sm">{errors.department}</p>}
                </div>
                
                {/* Student ID */}
                <div>
                  <label htmlFor="studentId" className="block mb-2 text-white/80">Student ID</label>
                  <input
                    type="text"
                    id="studentId"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    className={`w-full p-3 bg-navy border ${errors.studentId ? 'border-magenta' : 'border-electric-blue/50'} rounded focus:outline-none focus:border-mint-green transition-colors`}
                  />
                  {errors.studentId && <p className="mt-1 text-magenta text-sm">{errors.studentId}</p>}
                </div>
              </div>
              
              {/* Terms and Conditions */}
              <div className="mb-6">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleCheckboxChange}
                    className="mt-1"
                  />
                  <label htmlFor="agreeTerms" className="ml-2 text-white/80">
                    I agree to the <a href="#" className="text-electric-blue hover:text-mint-green no-underline">Terms and Conditions</a> and <a href="#" className="text-electric-blue hover:text-mint-green no-underline">Privacy Policy</a>
                  </label>
                </div>
                {errors.agreeTerms && <p className="mt-1 text-magenta text-sm">{errors.agreeTerms}</p>}
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 bg-mint-green text-navy border-none rounded font-bold cursor-pointer transition-all hover:bg-electric-blue hover:text-white hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      </main>
      
    </div>
  );
};

export default RegisterPage;