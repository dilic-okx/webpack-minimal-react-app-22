import React, { useEffect, useState } from 'react'
import Button from '../../components/button'
import Layout from '../../components/layout'
import InfoScraper from '../../components/info-scraper'
import api from '../../lib/api'

/*import './index.css'*/

const scraps = [
  {
    url: 'https://elektrodistribucija.rs/planirana-iskljucenja-srbija/Kragujevac_Dan_1_Iskljucenja.htm',
    target: 'tr',
    label: '',
    item: {
      ts: 'i[itemprop="duration"]',
      source: '.tube a[itemprop="url"]',
      label: '',
      slider: {
        urlPattern: '{0}.{c}.jpg',
        urlParams: [
          (url) => {
            const arr = url.split('/')
            const last = arr.pop().split('.')[0]
            return [...arr, last].join('/')
          }
        ],
        pushPoster: true,
        limit: 6
      }
    }
  }
]

const Info: React.FC = () => {
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
    <Layout label="Info" compact={true}>
      <div className="flex-col">
        <div className="flex-cell">
          <InfoScraper scraps={scraps} />
        </div>
      </div>
    </Layout>
  )
}

export default Info
