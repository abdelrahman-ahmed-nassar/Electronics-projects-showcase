"use client"
import React from 'react'
import { useAuth } from '../_lib/context/AuthenticationContext'


const TestClient = () => {
  const {isAuthenticated} = useAuth();
  return (
    <div>{isAuthenticated ? 'You are logged in' : 'You are not logged in'}</div>
  )
}

export default TestClient;