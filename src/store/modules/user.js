import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import Cookies from 'js-cookie'
import { getIdentity } from '../../utils/auth'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  identity: getIdentity()
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, client_id, client_secret, grant_type, scope } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, client_id:client_id, client_secret:client_secret, grant_type:grant_type, scope:scope}).then(response => {
        const data = response
        Cookies.set('type', response.token_type) //登录成功后将token存储在cookie之中
        Cookies.set('token', response.access_token) //登录成功后将token存储在cookie之中
        commit('SET_TOKEN', data.access_token)
        // setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {

        const data = response

        if (!data) {
          reject('验证失败，请重新登录.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

