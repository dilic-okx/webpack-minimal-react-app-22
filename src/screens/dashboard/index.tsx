import React, { useEffect, useState } from 'react'
import Button from '../../components/button'
import Layout from '../../components/layout'
import api from '../../lib/api'

import './index.css'

const Dashboard: React.FC = () => {
  const apiInstance = api.createAxiosInstance()
  const [data, setData] = useState({})
  const [entityData, setEntityData] = useState({})

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

  const handleAction = async (entitiyName, action, event) => {
    const { endpoint, method } = action
    const res = await apiInstance({
      method,
      url: endpoint,
      data: event.target.value
    })
    if (res.data) {
      console.log('---data', data)
      setEntityData({ ...entityData, [entitiyName]: res.data })
    }
  }

  return (
    <Layout label="Dashboard">
      Dashboard
      <div className="flex-col">
        <div className="flex-cell">
          <Button outlined>butt 1 example</Button>
          {Object.keys(data).map((entitiyName, index) => {
            const entity = data[entitiyName]
            return (
              <div key={'ent-' + index}>
                <div className="dashboard-entity">
                  <h3>{entitiyName}</h3>
                  <div className="flex-row">
                    <div className="flex-cell">
                      {Object.keys(entity).map((actionName, mindex) => {
                        const action = entity[actionName]
                        return ['LIST', 'SEARCH'].includes(actionName) ? (
                          <div key={'mth-' + mindex}>
                            {actionName === 'LIST' ? (
                              <Button
                                onClick={(e) =>
                                  handleAction(entitiyName, action, e)
                                }
                              >
                                {actionName}
                              </Button>
                            ) : (
                              <span>{actionName}</span>
                            )}
                          </div>
                        ) : null
                      })}
                    </div>
                    <div className="flex-cell">
                      {entityData[entitiyName] ? (
                        entityData[entitiyName].length === 0 ? (
                          <span>No items</span>
                        ) : (
                          entityData[entitiyName].map((entityItem, eindex) => {
                            const skipProps = ['id', 'createdAt', 'updatedAt']
                            return (
                              <div key={'etm-' + eindex}>
                                {Object.keys(entityItem).map(
                                  (propKey, pindex) => {
                                    return !skipProps.includes(propKey) &&
                                      ![null, undefined].includes(
                                        entityItem[propKey]
                                      ) ? (
                                      <div
                                        key={'etmp-' + eindex + '-' + pindex}
                                      >
                                        {propKey}:{' '}
                                        {typeof entityItem[propKey] ===
                                        'boolean'
                                          ? entityItem[propKey].toString()
                                          : entityItem[propKey]}
                                      </div>
                                    ) : null
                                  }
                                )}
                                <br />
                              </div>
                            )
                          })
                        )
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
