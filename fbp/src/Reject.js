import React from 'react'
import './internal.css'
import { Link } from 'react-router-dom'

export default function Reject() {
  return (
    <div className='center'>
      <h1>Rejected Successfully</h1>
      <button><Link to='/'>Home</Link></button>
    </div>
  )
}
