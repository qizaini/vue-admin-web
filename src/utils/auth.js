import Cookies from 'js-cookie'

// const TokenKey = 'vue_admin_template_token'
const TokenKey = 'token'
const FlagKey = 'identity'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function getIdentity() {
  return Cookies.set(FlagKey)
}

export function setIdentity(flag) {
  return Cookies.set(FlagKey, flag)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
