import React, { useEffect, useState } from 'react'
import Button from '../../components/button'
import Layout from '../../components/layout'
import Scraper from '../../components/scraper'
import api from '../../lib/api'

import './index.css'

const scraps = []

const Search: React.FC = () => {
  const apiInstance = api.createAxiosInstance()
  const [data, setData] = useState({})

  useEffect(() => {
    let mounted = true
    const getData = async () => {
      const res = await apiInstance({
        method: 'get',
        url: '/get-api-config'
      })
      if (mounted) {
        setData(res.data)
      }
    }
    getData()
    return () => (mounted = false)
  }, [])

  return (
    <Layout label="Search" compact={true}>
      <div className="flex-col">
        <div className="flex-cell">
          <Scraper scraps={scraps} />
        </div>
      </div>
    </Layout>
  )
}

export default Search
