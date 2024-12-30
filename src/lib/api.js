import axios from 'axios'
import asyncStorage from './async-storage'
import { isDefined } from './utils'
//import appConfig from '../.app-config'

let axiosInstance
//const baseURL = appConfig.api.baseURL

const endpoints = {
  //natural person
  register: '/login/natural/register',
  login: '/login/natural/login',
  userList: 'login/natural/list',
  //chats
  chatRoom: '/chat/room',
  chatPeer: '/chat/peer',
  //contacts
  contactsList: '/contacts/contact/list',
  //file-manager
  fileManagerList: '/storage/storage/list',
  fileManagerCreateDir: '/storage/storage/create-dir',
  fileManagerUpload: '/storage/storage/upload',
  fileManagerRemove: '/storage/storage/remove',
  fileManagerMove: '/storage/storage/move',
  fileManagerCopy: '/storage/storage/copy',
  //config
  configAppVersion: '/config/app/version'
}

const baseApiURL = (() => {
  try {
    return 'https://' + window.location.hostname + ':4433'
  } catch (e) {
    console.log('ReferenceError catched when running tests')
  }
})()

const createAxiosInstance = (token) => {
  const authHeader = token
    ? {
        Authorization: 'Bearer ' + token
      }
    : {}
  return axios.create({
    headers: {
      ...authHeader
    },
    timeout: 15000,
    responseType: 'json',
    baseURL: 'https://localhost:9000/'
  })
}

;(async () => {
  const existingToken = await asyncStorage.getItem('token')
  axiosInstance = createAxiosInstance(existingToken)
})()

export const isFieldValid = (fieldName, errors = {}) =>
  !isDefined(errors[fieldName])

export const getErrorMessage = (fieldName, errors = {}) =>
  !isFieldValid(fieldName, errors) ? errors[fieldName] : ''

const api = {
  login: (username, password, cb) => {
    return axiosInstance
      .post(baseApiURL + endpoints.login, {
        username,
        password
      })
      .then((response) => {
        axiosInstance = createAxiosInstance(response.data.token)
        if (cb) {
          cb(response.data)
        }
        return response
      })
  },
  register: (data, cb) => {
    return axiosInstance.post(baseApiURL + endpoints.register, {
      ...data
    })
  },
  logout: (data, cb) => {
    console.log('logout')
  },
  userList: (params) => {
    return axiosInstance
      .post(baseApiURL + endpoints.userList, params)
      .then((response) => {
        return response
      })
  },
  contactsList: () => {
    return axiosInstance
      .post(baseApiURL + endpoints.contactsList)
      .then((response) => {
        return response.data
      })
  },
  fileManagerList: () => {
    return axiosInstance
      .post(baseApiURL + endpoints.fileManagerList)
      .then((response) => {
        return response
      })
  },
  fileManagerCreateDir: (path, name) => {
    return axiosInstance
      .post(baseApiURL + endpoints.fileManagerCreateDir, { path, name })
      .then((response) => {
        return response
      })
  },
  fileManagerUpload: (files, onProgress) => {
    const config = {
      onUploadProgress: onProgress,
      timeout: 99999,
      headers: {
        'Content-Type': 'multipart/form-data'
      } /*,
			requestId: key*/
    }
    //axiosInstance.defaults.data = files
    return axiosInstance
      .post(baseApiURL + endpoints.fileManagerUpload, files, config)
      .then((response) => {
        return response
      })
      .catch((err) => {
        console.log('upload error', err)
      })
  },
  fileManagerRemove: (path) => {
    return axiosInstance
      .delete(
        baseApiURL +
          endpoints.fileManagerRemove +
          '/' +
          encodeURIComponent(path)
      )
      .then((response) => {
        return response
      })
  },
  fileManagerMove: (path, target) => {
    return axiosInstance
      .post(baseApiURL + endpoints.fileManagerMove, { path, target })
      .then((response) => {
        return response
      })
      .catch((err) => {
        console.log('move error', err)
      })
  },
  fileManagerCopy: (path, target) => {
    return axiosInstance
      .post(baseApiURL + endpoints.fileManagerCopy, { path, target })
      .then((response) => {
        return response
      })
      .catch((err) => {
        console.log('copy error', err)
      })
  },
  configAppVersion: () => {
    return '0.0.1'
  }
}

export default { ...api, createAxiosInstance }
