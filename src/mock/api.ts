/**
 * Mock API 服务
 */

import { mockUsers, getMenusByRoles } from './data'
import type { UserInfo } from '@/stores/modules/user'

/**
 * 模拟网络延迟
 */
const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * 生成随机 Token
 */
const generateToken = (username: string) => {
  return `mock_token_${username}_${Date.now()}_${Math.random().toString(36).substring(2)}`
}

/**
 * Token 存储（模拟服务端存储）
 */
const tokenStore = new Map<
  string,
  {
    username: string
    accessToken: string
    refreshToken: string
    expiresAt: number
  }
>()

/**
 * Mock 登录接口
 */
export async function mockLogin(username: string, password: string) {
  await delay(800)

  // 查找用户
  const user = mockUsers.find((u) => u.username === username && u.password === password)

  if (!user) {
    throw new Error('用户名或密码错误')
  }

  // 生成 Token
  const accessToken = generateToken(username)
  const refreshToken = generateToken(`${username}_refresh`)

  // 存储 Token（模拟服务端）
  tokenStore.set(accessToken, {
    username,
    accessToken,
    refreshToken,
    expiresAt: Date.now() + 2 * 60 * 60 * 1000 // 2小时后过期
  })

  return {
    code: 200,
    message: '登录成功',
    success: true,
    data: {
      accessToken,
      refreshToken,
      expiresIn: 7200 // 2小时（秒）
    }
  }
}

/**
 * Mock 获取用户信息接口
 */
export async function mockGetUserInfo(token: string): Promise<{
  code: number
  message: string
  success: boolean
  data: UserInfo
}> {
  await delay(300)

  // 验证 Token
  const tokenData = tokenStore.get(token)
  if (!tokenData) {
    throw new Error('Token 无效或已过期')
  }

  // 检查是否过期
  if (Date.now() > tokenData.expiresAt) {
    tokenStore.delete(token)
    throw new Error('Token 已过期')
  }

  // 查找用户信息
  const user = mockUsers.find((u) => u.username === tokenData.username)
  if (!user) {
    throw new Error('用户不存在')
  }

  return {
    code: 200,
    message: '获取成功',
    success: true,
    data: user.userInfo
  }
}

/**
 * Mock 获取用户菜单接口
 */
export async function mockGetUserMenus(token: string): Promise<{
  code: number
  message: string
  success: boolean
  data: unknown[]
}> {
  await delay(400)

  // 验证 Token
  const tokenData = tokenStore.get(token)
  if (!tokenData) {
    throw new Error('Token 无效或已过期')
  }

  // 查找用户信息
  const user = mockUsers.find((u) => u.username === tokenData.username)
  if (!user) {
    throw new Error('用户不存在')
  }

  // 根据角色获取菜单
  const menus = getMenusByRoles(user.userInfo.roles)
  console.log('menus-------------------', menus)
  return {
    code: 200,
    message: '获取成功',
    success: true,
    data: menus
  }
}

/**
 * Mock 刷新 Token 接口
 */
export async function mockRefreshToken(refreshToken: string) {
  await delay(300)

  // 查找对应的 Token
  let username = ''
  for (const [, value] of tokenStore.entries()) {
    if (value.refreshToken === refreshToken) {
      username = value.username
      break
    }
  }

  if (!username) {
    throw new Error('Refresh Token 无效')
  }

  // 生成新的 Token
  const newAccessToken = generateToken(username)
  const newRefreshToken = generateToken(`${username}_refresh`)

  // 更新存储
  tokenStore.set(newAccessToken, {
    username,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    expiresAt: Date.now() + 2 * 60 * 60 * 1000
  })

  return {
    code: 200,
    message: '刷新成功',
    success: true,
    data: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: 7200
    }
  }
}

/**
 * Mock 登出接口
 */
export async function mockLogout(token: string) {
  await delay(200)

  // 删除 Token
  tokenStore.delete(token)

  return {
    code: 200,
    message: '登出成功',
    success: true,
    data: null
  }
}
