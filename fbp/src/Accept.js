import React from 'react'
import './internal.css'
import { Link } from 'react-router-dom'

export default function Accept() {
  return (
    <div className='center'>
      <h1>Accepted Successfully</h1>
      <button><Link to='/'>Home</Link></button>
    </div>
  )
}
