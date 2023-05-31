import React, { Fragment } from 'react'
import Sidebar from './Admin-dashboard/Sidebar'
import AdminHeader from './Admin-dashboard/AdminHeader'
import Dashboard from './Admin-dashboard/Dashboard'


function AdminIndex() {
  return (
    <Fragment>
      <section>
        <div className='w-full h-auto bg-stone-100'>
          <Sidebar />
          <AdminHeader />
          <Dashboard/>
        </div>
      </section>
    </Fragment>
  )
}

export default AdminIndex