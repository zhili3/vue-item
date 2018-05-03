const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  site: state => state.app.site,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  // permission_routers: state => state.permission.routers,
  // addRouters: state => state.permission.addRouters
}
export default getters
